---
type: frontend-requirements
code: auth
scope: feature
feature: auth
module: identity
status: ready
screens: [s01, s02, s06, s08, s68, s75]
depends: []
affects: []
related: ["Passwordless login", "D-06 Yearly rename, old name freed, case-insensitive", "Onboarding Imports Frontend Requirements", "Profiles & Pin Name Frontend Requirements", "Interests Frontend Requirements", "Rings", "T-079 Enforce the once-a-year Pin name rename", "T-063 Put the ErrorCode on the error body"]
created: 2026-10-18
updated: 2026-10-26
owner: "Omar Fostok"
tags: [frontend-requirements, frontend-requirements/ready, module/identity, layer/frontend]
---

# Auth & Sign-up · Frontend Requirements

**Feature:** [[Auth & Sign-up]] · **Status:** Ready (waiting for the backend) · **Story:** [[Auth & Sign-up Story]] · **Backend Integration:** [[Auth & Sign-up Backend Integration]]

What the client needs from the backend for the welcome, code, Pin-name and session screens, and whether each need is met today, checked against the client's sign-up as built (2026-10-26). Everything this feature asks for exists; the one thing missing is the delivery of the code itself, which the backend papers over with `devCode` for now. Passwordless since 2026-10-15 ([[Passwordless login]]); the client-side migration is in [[Frontend Passwordless Migration]].

## The sign-up flow in the client

The design's sign-up is longer than this feature's screens. Each step, and the note that asks for what it needs:

| # | Step | Calls | Asked for in |
|---|---|---|---|
| 1 | [[Screen Index#s01|s01]] Welcome | `POST /auth/sign-up`, or `POST /auth/login` for an existing address | this note |
| 2 | [[Screen Index#s02|s02]] Verify | `POST /auth/verify-code` (sign-up) · `POST /auth/login/verify` (sign-in) · `POST /auth/request-code` | this note |
| 3 | [[Screen Index#s03|s03]] Start from → an import ([[Screen Index#s03a|s03a]], [[Screen Index#s03b|s03b]], [[Screen Index#s04|s04]] → [[Screen Index#s05|s05]]) or *Fill it in myself* | none yet | [[Onboarding Imports Frontend Requirements]] |
| 4 | *Profile basics* (no screen id yet): full name, photo, headline, company, location | the name goes into step 5; the rest is written after it | [[Profiles & Pin Name Frontend Requirements]] |
| 5 | [[Screen Index#s06|s06]] Claim your Pin | `GET /profiles/pin-name/:pinName/availability` · `POST /auth/complete-registration` (creates the account) | this note |
| 6 | [[Screen Index#s07|s07]] Interests | none yet | [[Interests Frontend Requirements]] |
| 7 | [[Screen Index#s08|s08]] First Ring | `GET /rings` | this note · [[Rings]] |
| 8 | [[Screen Index#s09|s09]] Create first Ring, [[Screen Index#s10|s10]] View-as teaser | `POST /rings`, then what the Ring shows | [[Rings]], [[Ring Projection]], [[View As & Pin Views]] |

Sign-in is steps 1 and 2 only, then Home.

## Per screen

### [[Screen Index#s01|s01]] Welcome

- One input with an **Email / Phone** switch; a phone is sent in E.164 with the country code from a picker.
- One button, "Send me a code", for sign-up and sign-in alike: the client always calls `POST /auth/sign-up` first; an address that already has an account (409 `E_AUTH_01`) is **switched to `POST /auth/login` by the client**, with the same identifier and no extra tap. The person never says which they are doing.
- An unfinished sign-up gets its code re-issued by `sign-up`, with no error.
- "Continue with LinkedIn" starts the LinkedIn import ([[Onboarding Imports Frontend Requirements]]); not served yet.
- Source today: `POST /auth/sign-up` → `201 { destination, channel, expiresAt, devCode }`, 409 `E_AUTH_01`, 400 `E_AUTH_07`. `POST /auth/login { identifier }` → the same challenge shape (no `devCode` for an unknown identifier).

### [[Screen Index#s02|s02]] Verify

- One screen for both codes: sign-up (with the step bar) and sign-in (no step bar); only the submit endpoint and the resend `purpose` differ.
- Six boxes, numeric keyboard, auto-advance. Resend is offered after 60 s (so a double tap can't burn the code on its way); whether the code still works comes from `expiresAt`, and the boxes lock when it passes.
- The sentence under the title says "It expires in 10 minutes" as fixed copy; the expired *state* follows `expiresAt`.
- A wrong code shakes and empties the boxes; five wrong tries lock them until "Send a new code".
- Sign-in: a wrong code shows only "wrong or expired" (the client asks for a sign-in code only after `sign-up` said the account exists, so "sign up instead" never applies). A refused account (403 `E_AUTH_03`) shows "This account isn't active" with **Start sign-up again**.
- `devCode` fills the boxes in debug and staging builds only; never kept beyond this screen.
- Source today: `POST /auth/verify-code { destination, code, purpose: "SIGN_UP" }` → onboarding token; `POST /auth/login/verify { identifier, code }` → session; `POST /auth/request-code { destination, purpose: "SIGN_UP" | "LOGIN" }`.

### [[Screen Index#s06|s06]] Claim your Pin

- The handle only: the full name is collected **before**, on *Profile basics*, and is required there; it reaches the backend as `fullName` in `complete-registration`.
- The `!` is a prefix, never sent; 3–30 letters, digits, `.`, `_`, checked on the client first; availability is asked 400 ms after typing stops.
- **Suggestions are built on the client** from the person's own name and shown as chips, as [[D-06 Yearly rename, old name freed, case-insensitive]] decided; no endpoint needed. Capitals don't matter: the backend already compares names lower-cased.
- The copy "You can change it once a year." is enforced by [[T-079 Enforce the once-a-year Pin name rename]], not yet.
- This is where the account is created: the onboarding token is dropped once `complete-registration` returns and the steps before can't be gone back to.
- An expired onboarding token sends a new code and goes back to Verify, keeping what was typed; 409 `E_AUTH_08` (already registered) asks for a sign-in code instead.
- Source today: `GET /profiles/pin-name/:pinName/availability` (public) → `{ pinName, available }`; `POST /auth/complete-registration { onboardingToken, pinName, fullName? }` → session, 409 `E_AUTH_08` / `E_PROFILE_02`.

### [[Screen Index#s08|s08]] First Ring

- The Pin is live; the default Ring already exists, created in the same transaction as the account. Then s09 creates a first Ring of the person's own.
- Source today: `GET /rings` ([[Rings Backend Integration]]); s09 uses `POST /rings` ([[Rings]]).

### [[Screen Index#s68|s68]] Me · [[Screen Index#s75|s75]] My devices

- **Sign out** is on Me (s68): the refresh token to `POST /auth/logout`, then everything kept for the person is cleared.
- **Sign out everywhere** is on My devices (s75): the access token to `POST /auth/logout-everywhere`, then the same local clear.
- Session renewal is silent: one `POST /auth/refresh` at a time; parallel 401s wait for it and are replayed once.
- No change-password entry anywhere.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Start sign-up with email or phone | `POST /auth/sign-up` | ✅ | — |
| Verify the sign-up code → onboarding token | `POST /auth/verify-code` | ✅ | — |
| Check a Pin name | `GET /profiles/pin-name/:pinName/availability` | ✅ | — |
| Finish registration (pin name, full name) → session | `POST /auth/complete-registration` | ✅ | — |
| Start sign-in with email or phone → code issued | `POST /auth/login` | ✅ | — |
| Verify the sign-in code → session | `POST /auth/login/verify` | ✅ | — |
| Resend a code in either flow | `POST /auth/request-code` (`SIGN_UP` / `LOGIN`) | ✅ | — |
| Rotate the session | `POST /auth/refresh` | ✅ | — |
| Sign out this device / everywhere | `POST /auth/logout`, `POST /auth/logout-everywhere` | ✅ | — |
| The default Ring after registration | `GET /rings` | ✅ | — (listed under [[Rings]]) |
| Suggested handles on s06 | — (client, from the person's own name) | ✅ | — ([[D-06 Yearly rename, old name freed, case-insensitive]]) |
| The once-a-year rename limit | — | ❌ | [[T-079 Enforce the once-a-year Pin name rename]] |
| The code actually delivered by email | — | ❌ | [[T-001 Wire an email provider for one-time codes]] |
| The code actually delivered by SMS | — | ❌ | [[T-002 Wire an SMS provider for one-time codes]] |
| `devCode` removed from every challenge | — | ❌ | [[T-003 Remove devCode once delivery works]] |
| Register the device on sign-in (s75) | — | ❌ | [[T-014 Register devices on login; list and remove]] |
| Sign in with LinkedIn | — | ❌ | [[T-019 LinkedIn OAuth link, unlink, login]] |
| Stable `ErrorCode` on the error body | — | ❌ | [[T-063 Put the ErrorCode on the error body]] |

The import steps, *Profile basics*' work fields and Interests are asked for in their own notes (see *The sign-up flow in the client*).

Removed on 2026-10-15 and not coming back: `POST /auth/reset-password`, `POST /auth/change-password`, the `PASSWORD_RESET` purpose, the `password` field on `complete-registration` and `login`.

## Behaviour expectations

- **Sign-up first, sign-in on 409.** One button; the client decides the flow from the answer, never asks the person.
- **One code screen for both flows.** Same boxes, same resend, same expiry handling.
- **Expiry is server-driven.** The expired state and the lock come from `expiresAt`; a resend replaces the previous code. Resend waits 60 s on the client.
- **`devCode` is transitional.** Pre-fill when present, in debug and staging builds only; never require it, never persist it, never infer account existence from it.
- **Refresh is serialised.** One in-flight refresh; 401 callers wait and retry once; a refused refresh (401 `E_AUTH_04`) ends the session: Welcome with "Your session has expired. Please sign in again."
- **The identifier is sent byte-identical** to `login` and `login/verify`.
- **Caching keys.** The session pair per device (secure storage); the onboarding token in memory only, dropped after `complete-registration`.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 400 | `E_AUTH_07` | form validation: email or phone, exactly one (the client never sends neither) |
| 409 | `E_AUTH_01` | nothing: the client asks for a sign-in code with the same address |
| 400 | `E_AUTH_05` | "That code is wrong or has expired."; boxes shake and empty |
| 429 | `E_AUTH_06` | boxes locked, "Send a new code" |
| 403 | `E_AUTH_03` | on `login/verify`: "This account isn't active" + Start sign-up again |
| 401 | `E_AUTH_03` | on any other call: signed out to Welcome with "This account can't sign in right now…" (lights up with [[T-063 Put the ErrorCode on the error body]]; until then the refused refresh ends the session) |
| 409 | `E_AUTH_08` | "Sign-up already completed": a sign-in code is sent instead |
| 409 | `E_PROFILE_02` | the handle shows as taken |
| 401 | `E_AUTH_04` | Welcome, "Your session has expired. Please sign in again." |

`E_AUTH_02` and `E_USER_04` are retired and never returned. Until [[T-063 Put the ErrorCode on the error body]] ships the body carries no `ErrorCode`; the client branches on status and endpoint.

## Blocked by

- Nothing for the flows above. [[T-001 Wire an email provider for one-time codes]] / [[T-002 Wire an SMS provider for one-time codes]] decide when `devCode` can go ([[T-003 Remove devCode once delivery works]]).
- The rename limit on s06 waits on [[T-079 Enforce the once-a-year Pin name rename]].
