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
pending: ["[[S-02 Auth & Sign-up Story]]: S2 layout, Resend and Start sign-up again pinned at the bottom with Verify (they still scroll with the content)"]
created: 2026-11-05
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Auth & Sign-up · Frontend Delivery

> ⚠ Affected by [[S-02 Auth & Sign-up Story]] (2026-11-09): S2 the Verify screen's buttons are pinned at the bottom while the content scrolls, the fix B-18 asks for

**Feature:** [[F-02 Auth & Sign-up]] · **Status:** Done · **Built from:** [[BI-02 Auth & Sign-up Backend Integration]] · **Against:** [[S-02 Auth & Sign-up Story]] · **Requirements:** [[FR-02 Auth & Sign-up Frontend Requirements]] · **QA:** [[QF-05 Auth & Sign-up QA Frontend]]

What the client shipped for sign-up, sign-in and the session. The flow is on `social_pin` `main` @ `839e74f` (the real API in `68085f3`, passwordless from one Welcome screen in `4231492`, Maestro flows in `157d303`); the registration-error fix, the retired `PASSWORD_RESET` and pre-filling the code in production are on `rings/F-11/honest-rings` @ `76e5f6b` (2026-11-05), not on `main` yet. The QA checklist is PL-01…PL-22 in the client's `.maestro/auth/`. Checked against [[BI-02 Auth & Sign-up Backend Integration#Checklist]] in the client's `docs/BI-02 Auth gap review.md` (2026-11-05).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s01\|s01]] Welcome | ✅ | One field with an Email / Phone switch (phone in E.164 from the country picker), one button *Send me a code*. Sign-up first; an address that already has an account (409 `E_AUTH_01`) quietly asks for a sign-in code. "Continue with LinkedIn" is shown and says Coming soon. |
| [[Screen Index#s02\|s02]] Verify | ✅ | One screen for both codes: six boxes, auto-advance, resend after 60 s with the right `purpose`, expiry from `expiresAt` counted on the server's clock (the `Date` header of the last answer, `f801aaa`, B-22). The boxes and their digits stay left to right in Arabic too, the screen around them right to left (`f9c19e3`, B-20). A failed resend (a server error, offline) shows the error and leaves the countdown and the boxes as they were; the countdown restarts only when a new code was sent (`f9c19e3`, B-21). *Verify and continue* and "Use a different …" are pinned at the bottom while the rest scrolls, so the not-active message and *Start sign-up again* no longer overflow (`f9c19e3`, B-18); Resend and *Start sign-up again* still sit in the scrolling part (see *Deviations*). Sign-up shows the step bar; sign-in has none, with a back arrow. "Use a different email" goes back to Welcome. |
| [[Screen Index#s06\|s06]] Claim your Pin | ✅ | `!` as a prefix (`f9c19e3`, B-19; it read `@` before), 3–30 letters, digits, `.` and `_` checked first, availability asked 300 ms after typing stops (`f9c19e3`), suggestions as chips from the person's own name, each asked about first with the same availability call, so only the free ones show (`f9c19e3`). The dashed Gemma chip and the "code ready" card are gone (`dde0533`). Continue creates the account. |
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
| `POST /auth/request-code` | s02, resend | `SIGN_UP` or `LOGIN`; the new code replaces the old one and empties the boxes. One request at a time; the countdown restarts only on a 2xx (B-21). |
| `GET /profiles/pin-name/:pinName/availability` | s06 | Debounced 300 ms; never says who holds a name. Also asked once per suggestion when s06 opens, all at once; a suggestion that is taken or could not be checked is not shown. |
| `POST /auth/complete-registration` | s06, Continue | `{ onboardingToken, pinName, fullName? }`, `fullName` from *Profile basics*, at most 120 characters. 201 → the session pair, the onboarding token dropped. |
| `GET /rings` | s08 | The default Ring created with the account. |
| `POST /auth/refresh` | network layer | One refresh at a time; every request that got a 401 waits for it and is retried once. A refused refresh ends the session. |
| `POST /auth/logout` | s68 | The refresh token; then everything kept for the person is cleared. |
| `POST /auth/logout-everywhere` | s75 | The access token; then the same local clear. |

## State kept on the client

- The session pair, per device, in secure storage, replaced together on every refresh and registration.
- The onboarding token: memory only, dropped once `complete-registration` answers.
- The sign-up / sign-in flow goes back to Welcome with nothing kept (no step history, no gathered data) when the session ends, so a session ended just after signing in starts the flow fresh instead of showing the old Verify step (`f9c19e3`).
- The server's clock: the offset from the `Date` header of every answer, error or not; zero until one has been seen.
- `devCode`: fills the boxes, then is dropped from memory; never logged, never stored. Request logging is on in debug builds only.
- Errors branch on `ErrorCode` first and fall back to the status while the body carries none ([[S-87 Error Contract Story|Error Contract · S4–S8]]).

## Deviations from the story or the integration note

- **`devCode` pre-fills in production builds too** (`76e5f6b`), not only in debug and staging as [[FR-02 Auth & Sign-up Frontend Requirements]] says: with no code delivered, a production build could sign nobody in or up. Decided 2026-11-05 by Omar Fostok in the client; one switch, `DevCode.untilCodeDelivery`, goes to `false` when [[S-78 Code Delivery Story|Code Delivery · S8]] ships. The risk [[BI-02 Auth & Sign-up Backend Integration]] names applies to production now: anyone who knows an account's email or phone can sign in as it.
- **Registration errors without an `ErrorCode`** (`76e5f6b`): a 400 from `complete-registration` (the onboarding token expired, [[B-05 Expired onboarding token answers 401, not the documented 400]]) sends a new code and returns to Verify; a bare 409 asks `POST /auth/sign-up` with the same address: 409 → sign-up was finished, switch to sign-in; 201 → the Pin name went meanwhile, "taken" on s06; no answer (offline) → the error toast, Continue can be tapped again. The old guess that an expired token answers 401 is gone. When [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, the `E_AUTH_05` / `E_AUTH_08` / `E_PROFILE_02` branches take over with no change.
- **`PASSWORD_RESET` removed from the client** (`76e5f6b`). The client's copy of the OpenAPI spec (2026-11-01) still lists it in `VERIFICATION_PURPOSE`; the client test allows for that one retired value.
- **"Continue with LinkedIn" is on s01 and says Coming soon**; the flow is built and switched off until [[S-94 Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]].
- **The sign-up is longer than S-02's screens**: Start from, *Profile basics* and Interests sit between them (see *Screens shipped*).
- **Verify's layout is pinned only in part** (`f9c19e3`): [[S-02 Auth & Sign-up Story|Auth & Sign-up · S2]] (decided 2026-11-09) pins *Verify*, *Send a new code* and *Start sign-up again* at the bottom with the content scrolling above. The client pins *Verify and continue* and "Use a different …"; Resend and *Start sign-up again* stay under the error in the scrolling part. Nothing overflows any more (B-18), but those two can scroll out of sight with the keyboard up. In `pending` until they move to the footer.
- **s06 suggestions ask the availability endpoint** (`f9c19e3`): [[S-02 Auth & Sign-up Story|Auth & Sign-up · S3]] says the chips are built on the client with no endpoint; they still are, then each is checked with the existing availability call, so a taken name is never offered.

## Not done yet

- Resend and *Start sign-up again* pinned at the bottom with *Verify* → [[S-02 Auth & Sign-up Story|Auth & Sign-up · S2]] (`pending`).
- The 2026-11-09 work (`f801aaa`, `dde0533`, `f9c19e3`) is on `rings/F-11/honest-rings`; it reaches `main` with that branch.
- The code delivered by email or SMS, and `devCode` gone → [[S-78 Code Delivery Story|Code Delivery · S6–S8]]; then `DevCode.untilCodeDelivery` goes to `false`.
- "You can change it once a year." is copy only → [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S12–S13]].
- A suspended account mid-session reads "Your session has expired" until `E_AUTH_03` is on the wire, and a 404 `E_USER_01` ends the session only on `GET /users/me` → [[S-87 Error Contract Story|Error Contract · S4–S8]] ([[FD-04 Account Frontend Delivery]]).
- Registering the device on sign-in → [[S-82 Devices & NFC Story|Devices & NFC · S6]]; LinkedIn → [[S-94 Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]].

## Log

- 2026-10-18 · `main` @ `4231492` (social_pin) · s01, s02, s06, s08: passwordless sign-up and sign-in from one Welcome screen; Maestro flows in `157d303` · flagged nothing
- 2026-11-05 · `rings/F-11/honest-rings` @ `76e5f6b` (social_pin, not on `main` yet) · s06 registration errors without a code; `PASSWORD_RESET` removed; `devCode` pre-filled in production until Code Delivery · S8 · flagged F-32
- 2026-11-05 · flagged [[F-32 Code Delivery]]: the client pre-fills devCode in production builds too, decided 2026-11-05 by Omar Fostok: no code is delivered yet, so a production build could sign nobody in. Anyone who knows an account's email or phone can sign in as it until Code Delivery · S8; DevCode.untilCodeDelivery goes to false then. /owner records the decision here
- 2026-11-09 · app branch `rings/F-11/honest-rings` @ `f9c19e3` (with `dde0533`, `f801aaa`; social_pin, not on `main` yet) · parts: [[S-02 Auth & Sign-up Story|Auth & Sign-up · S2, S3, S5]] · screens: s02 (footer pinned, LTR code boxes, resend restarts only on success, expiry on the server clock), s06 (`!` prefix, 300 ms, only free suggestions, Gemma chip and code card removed), the flow back to Welcome when the session ends · bugs: [[B-18 Sign-in Verify overflows when the not-active message shows|B-18]], [[B-19 Claim your Pin shows the prefix @ instead of !|B-19]], [[B-20 In Arabic the code boxes fill right to left|B-20]], [[B-21 A failed resend restarts the countdown|B-21]] fixed in `f9c19e3`, [[B-22 The code's expiry counts with the phone clock|B-22]] in `f801aaa`: all five `ready` for QA's re-test (AU-23, AU-26, AU-47, AU-55, AU-60) · flagged [[S-02 Auth & Sign-up Story]]: S2's layout is pinned only in part (Resend and Start sign-up again scroll); the S-02 flag above stays until they are pinned too
