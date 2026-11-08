---
id: FD-05
type: frontend-delivery
module: identity
feature: auth
status: done
scope: feature
deployedTo: []
screens: [s01, s02, s06, s08, s68, s75]
owner: "Omar Fostok"
depends: ["BI-02 Auth & Sign-up Backend Integration"]
affects: []
related: ["FR-02 Auth & Sign-up Frontend Requirements", "S-02 Auth & Sign-up Story", "F-32 Code Delivery", "S-78 Code Delivery Story", "S-87 Error Contract Story", "S-14 Profiles & Pin Name Story", "S-94 Linked Accounts (OAuth) Story", "S-82 Devices & NFC Story", "FD-04 Account Frontend Delivery", "B-05 Expired onboarding token answers 401, not the documented 400"]
pending: []
created: 2026-11-05
updated: 2026-11-05
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Auth & Sign-up · Frontend Delivery

**Feature:** [[F-02 Auth & Sign-up]] · **Status:** Done · **Built from:** [[BI-02 Auth & Sign-up Backend Integration]] · **Against:** [[S-02 Auth & Sign-up Story]] · **Requirements:** [[FR-02 Auth & Sign-up Frontend Requirements]] · **QA:** [[QF-05 Auth & Sign-up QA Frontend]]

What the client shipped for sign-up, sign-in and the session. The flow is on `social_pin` `main` @ `839e74f` (the real API in `68085f3`, passwordless from one Welcome screen in `4231492`, Maestro flows in `157d303`); the registration-error fix, the retired `PASSWORD_RESET` and pre-filling the code in production are on `rings/F-11/honest-rings` @ `76e5f6b` (2026-11-05), not on `main` yet. The QA checklist is PL-01…PL-22 in the client's `.maestro/auth/`. Checked against [[BI-02 Auth & Sign-up Backend Integration#Checklist]] in the client's `docs/BI-02 Auth gap review.md` (2026-11-05).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s01\|s01]] Welcome | ✅ | One field with an Email / Phone switch (phone in E.164 from the country picker), one button *Send me a code*. Sign-up first; an address that already has an account (409 `E_AUTH_01`) quietly asks for a sign-in code. "Continue with LinkedIn" is shown and says Coming soon. |
| [[Screen Index#s02\|s02]] Verify | ✅ | One screen for both codes: six boxes, auto-advance, resend after 60 s with the right `purpose`, expiry from `expiresAt`. Sign-up shows the step bar; sign-in has none, with a back arrow. "Use a different email" goes back to Welcome. |
| [[Screen Index#s06\|s06]] Claim your Pin | ✅ | `!` as a prefix, 3–30 letters, digits, `.` and `_` checked first, availability asked 400 ms after typing stops, suggestions as chips from the person's own name. Continue creates the account. |
| [[Screen Index#s08\|s08]] First Ring | ✅ | "Your Pin is live", then the offer to create a first Ring ([[F-11 Rings]]). The steps before s06 can no longer be gone back to. |
| [[Screen Index#s68\|s68]] Me · Sign out | ✅ | The button under the groups; the copy says signing in again takes a code. |
| [[Screen Index#s75\|s75]] My devices · Sign out everywhere | ✅ | The only session control; the device list itself waits ([[S-82 Devices & NFC Story\|Devices & NFC · S6]]). |

The steps between Verify and Claim your Pin (Start from, the imports, *Profile basics*) and after it (Interests, Create first Ring, View as) are shipped in the client but belong to [[F-05 Onboarding Imports]], [[F-07 Profiles & Pin Name]], [[F-37 Interests]] and [[F-11 Rings]], as [[FR-02 Auth & Sign-up Frontend Requirements#The sign-up flow in the client]] splits them.

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `POST /auth/sign-up` | s01 | Exactly one of `email` / `phone`. 201 → s02 with the challenge; 409 `E_AUTH_01` → `POST /auth/login` with the same identifier, no tap. Also asked on s06 to tell a bare 409 apart (below). |
| `POST /auth/login` | s01 | Same challenge shape; no `devCode` for an unknown identifier, and the screen is the same. |
| `POST /auth/verify-code` | s02, sign-up | `purpose: "SIGN_UP"` → the onboarding token, kept in memory only. |
| `POST /auth/login/verify` | s02, sign-in | `{ identifier, code }`, the identifier byte-identical to `login`'s → the session pair. |
| `POST /auth/request-code` | s02, resend | `SIGN_UP` or `LOGIN`; the new code replaces the old one. |
| `GET /profiles/pin-name/:pinName/availability` | s06 | Debounced 400 ms; never says who holds a name. |
| `POST /auth/complete-registration` | s06, Continue | `{ onboardingToken, pinName, fullName? }`, `fullName` from *Profile basics*, at most 120 characters. 201 → the session pair, the onboarding token dropped. |
| `GET /rings` | s08 | The default Ring created with the account. |
| `POST /auth/refresh` | network layer | One refresh at a time; every request that got a 401 waits for it and is retried once. A refused refresh ends the session. |
| `POST /auth/logout` | s68 | The refresh token; then everything kept for the person is cleared. |
| `POST /auth/logout-everywhere` | s75 | The access token; then the same local clear. |

## State kept on the client

- The session pair, per device, in secure storage, replaced together on every refresh and registration.
- The onboarding token: memory only, dropped once `complete-registration` answers.
- `devCode`: fills the boxes, then is dropped from memory; never logged, never stored. Request logging is on in debug builds only.
- Errors branch on `ErrorCode` first and fall back to the status while the body carries none ([[S-87 Error Contract Story|Error Contract · S4–S8]]).

## Deviations from the story or the integration note

- **`devCode` pre-fills in production builds too** (`76e5f6b`), not only in debug and staging as [[FR-02 Auth & Sign-up Frontend Requirements]] says: with no code delivered, a production build could sign nobody in or up. Decided 2026-11-05 by Omar Fostok in the client; one switch, `DevCode.untilCodeDelivery`, goes to `false` when [[S-78 Code Delivery Story|Code Delivery · S8]] ships. The risk [[BI-02 Auth & Sign-up Backend Integration]] names applies to production now: anyone who knows an account's email or phone can sign in as it.
- **Registration errors without an `ErrorCode`** (`76e5f6b`): a 400 from `complete-registration` (the onboarding token expired, [[B-05 Expired onboarding token answers 401, not the documented 400]]) sends a new code and returns to Verify; a bare 409 asks `POST /auth/sign-up` with the same address: 409 → sign-up was finished, switch to sign-in; 201 → the Pin name went meanwhile, "taken" on s06; no answer (offline) → the error toast, Continue can be tapped again. The old guess that an expired token answers 401 is gone. When [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, the `E_AUTH_05` / `E_AUTH_08` / `E_PROFILE_02` branches take over with no change.
- **`PASSWORD_RESET` removed from the client** (`76e5f6b`). The client's copy of the OpenAPI spec (2026-11-01) still lists it in `VERIFICATION_PURPOSE`; the client test allows for that one retired value.
- **"Continue with LinkedIn" is on s01 and says Coming soon**; the flow is built and switched off until [[S-94 Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]].
- **The sign-up is longer than S-02's screens**: Start from, *Profile basics* and Interests sit between them (see *Screens shipped*).

## Not done yet

- The code delivered by email or SMS, and `devCode` gone → [[S-78 Code Delivery Story|Code Delivery · S6–S8]]; then `DevCode.untilCodeDelivery` goes to `false`.
- "You can change it once a year." is copy only → [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S12–S13]].
- A suspended account mid-session reads "Your session has expired" until `E_AUTH_03` is on the wire, and a 404 `E_USER_01` ends the session only on `GET /users/me` → [[S-87 Error Contract Story|Error Contract · S4–S8]] ([[FD-04 Account Frontend Delivery]]).
- Registering the device on sign-in → [[S-82 Devices & NFC Story|Devices & NFC · S6]]; LinkedIn → [[S-94 Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]].

## Log

- 2026-10-18 · `main` @ `4231492` (social_pin) · s01, s02, s06, s08: passwordless sign-up and sign-in from one Welcome screen; Maestro flows in `157d303` · flagged nothing
- 2026-11-05 · `rings/F-11/honest-rings` @ `76e5f6b` (social_pin, not on `main` yet) · s06 registration errors without a code; `PASSWORD_RESET` removed; `devCode` pre-filled in production until Code Delivery · S8 · flagged F-32
- 2026-11-05 · flagged [[F-32 Code Delivery]]: the client pre-fills devCode in production builds too, decided 2026-11-05 by Omar Fostok: no code is delivered yet, so a production build could sign nobody in. Anyone who knows an account's email or phone can sign in as it until Code Delivery · S8; DevCode.untilCodeDelivery goes to false then. /owner records the decision here
