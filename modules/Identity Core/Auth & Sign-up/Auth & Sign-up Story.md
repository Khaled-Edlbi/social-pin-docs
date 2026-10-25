---
type: story
code: auth
scope: feature
feature: auth
module: identity
status: draft
screens: [s01, s02, s06, s08, s68]
created: 2026-10-18
updated: 2026-10-25
owner: "omar"
related: ["DR-06 Yearly rename, old name freed, case-insensitive"]
tags: [story, story/draft, module/identity, layer/business]
---

# Auth & Sign-up · User Story

**Feature:** [[Auth & Sign-up]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Auth & Sign-up Frontend Requirements]] · **Backend Integration:** [[Auth & Sign-up Backend Integration]]

A person arrives with nothing but an email address or a phone number and leaves with a working identity: an active account, a Pin name, a default Ring and its projection. Coming back later costs them one code, never a password. The welcome screen's promise, *"We send a one-time code. No password to remember"*, is the whole contract ([[D-01 Passwordless login]], decided 2026-10-15).

## Persona

A **personal user** on their phone, in two moments: the first minute with the app (sign-up, s01 → s02 → s06 → s08) and every later return (sign-in, s01 → s02 → Home). The same screens serve a visitor arriving from an event invitation and an exhibitor who later upgrades to a business account; auth does not know the difference.

## Stories

### S1 · Start with an email or a phone ([[Screen Index#s01|s01]])

**As a** new user **I want** to type my email or my phone number and tap once **so that** a code is on its way and I never have to invent a password.

Acceptance criteria:
- [ ] One field accepts either an email or a phone; the client formats a phone to E.164 with the country code before sending.
- [ ] Tapping *Continue* calls `POST /auth/sign-up`; the screen advances to s02 on 201 and shows when the code expires.
- [ ] If the address already finished sign-up (409 `E_AUTH_01`), the copy offers *Sign in instead* and the same address is carried into the sign-in flow.
- [ ] If sign-up was started before but never finished, the tap re-issues a code with no error.
- [ ] No password field exists on this screen or any later one.

### S2 · Enter the code ([[Screen Index#s02|s02]])

**As a** user who just received a code **I want** to type six digits, see a resend timer, and recover from a wrong or expired code **so that** a flaky inbox never locks me out.

Acceptance criteria:
- [ ] Six cells, numeric keyboard, auto-advance; submit calls `POST /auth/verify-code` with `purpose: "SIGN_UP"`.
- [ ] The resend button is disabled until a short cool-down, then calls `POST /auth/request-code { purpose: "SIGN_UP" }`; the copy says a new code replaces the old one.
- [ ] A wrong or expired code (400 `E_AUTH_05`) clears the cells and shows "That code is invalid or has expired"; the "expired" state is driven by `expiresAt`, not a client constant.
- [ ] After five wrong tries (429 `E_AUTH_06`) the cells are disabled and only *Send a new code* remains.
- [ ] While delivery is unwired, `devCode` from the challenge pre-fills the cells; the screen works identically when it is absent.

### S3 · Claim a Pin name ([[Screen Index#s06|s06]])

**As a** new user **I want** to pick my `!handle` and see at once whether it is free **so that** I own a name people can scan for.

Acceptance criteria:
- [ ] The `!` is rendered as a prefix and never sent; the field validates 3 to 30 characters of letters, digits, `.` and `_` on the client.
- [ ] A debounced `GET /profiles/pin-name/:pinName/availability` shows free / taken; it never reveals who holds a taken name. Capitals don't matter (`Omar.Fostok` is `omar.fostok`).
- [ ] When the handle is taken, s06 offers suggestions built **only from my own name** (what I typed and the full name on this screen), never from anyone else's ([[DR-06 Yearly rename, old name freed, case-insensitive]], [[Profiles & Pin Name Story]] S1). Not available yet: the backend returns no suggestions today.
- [ ] An optional full name field (up to 120 characters) sits on the same screen.
- [ ] Submit calls `POST /auth/complete-registration { onboardingToken, pinName, fullName? }`; a 409 `E_PROFILE_02` returns focus to the handle.

### S4 · Land on the first Ring ([[Screen Index#s08|s08]])

**As a** user who just registered **I want** to arrive on my default Ring immediately **so that** the app feels ready rather than empty.

Acceptance criteria:
- [ ] On 201 the session pair is stored atomically and the app navigates to s08 without any further auth call.
- [ ] The default Ring, its projection and the profile all exist (one transaction on the backend); the first-Ring screen reads them with `GET /rings` and `GET /rings/:id/projection`.
- [ ] The onboarding token is discarded from memory once the session exists.

### S5 · Come back later and sign in with a code ([[Screen Index#s01|s01]] → [[Screen Index#s02|s02]])

**As a** returning user **I want** to type my email or phone, receive a code and be in **so that** signing in is as quick as signing up.

Acceptance criteria:
- [ ] *Sign in* calls `POST /auth/login { identifier }` and advances to the same code screen as S2, with the resend `purpose` set to `LOGIN` and submit going to `POST /auth/login/verify { identifier, code }`.
- [ ] Step 1 never says whether the account exists: an unknown address gets the same screen (the challenge arrives without `devCode`).
- [ ] 403 `E_AUTH_03` on verify shows "This account is not active" and offers *Start sign-up again*; the client cannot tell a suspended account from an unfinished sign-up and does not try.
- [ ] 400 `E_AUTH_05` on verify offers both *Try again* and *Sign up* (a person with no account lands here).
- [ ] The identifier sent to verify is byte-identical to the one sent to login.

### S6 · Stay signed in without noticing ([[Screen Index#s68|s68]])

**As a** signed-in user **I want** my session to renew silently and to end everywhere when I ask **so that** I neither re-enter codes every quarter hour nor leave a lost phone logged in.

Acceptance criteria:
- [ ] The access token is refreshed through one serialised `POST /auth/refresh`; concurrent 401s wait for it and retry once.
- [ ] A 401 `E_AUTH_04` on refresh returns the user to s01 with a neutral "please sign in again".
- [ ] *Sign out* sends the refresh token to `POST /auth/logout`; *Sign out everywhere* sends the access token to `POST /auth/logout-everywhere` and then clears the local store too.
- [ ] A suspended account (401 `E_AUTH_03` on any call) is signed out at once.
- [ ] There is no "change password" entry on Me; sign-out-everywhere is the only session control.

## States and motion the design asks for

- s01: idle, sending, "already registered" hint. s02: waiting, resend cool-down, wrong code, expired, locked after five tries.
- The code screen is one component in both flows; only the endpoint and the resend purpose change, so the transition s01 → s02 looks the same whichever way the user came.
- s06 → s08: the brief's "new ring forming" motion plays once registration returns 201; the Ring appears already named and themed by default.
- Reduced-motion users get the same states without the ring animation.

## Rules the backend already enforces

- Codes are 6 digits, bcrypt-hashed at rest, 10 minutes long; five wrong tries burn the code; a resend invalidates the previous code.
- `complete-registration` is one transaction: activate, profile, default Ring, projection. A partial identity never exists.
- `login` and `request-code` answer an unknown destination with the same challenge shape and issue no code; `login/verify` refuses a PENDING or SUSPENDED account with one 403.
- Refresh tokens rotate and are single-use; only the `jti` is hashed. `JwtStrategy` re-reads the user on every request.
- `devCode` is returned on every issued code, in every environment, until delivery is wired ([[Code Delivery]]); the client must not depend on it.

## Open questions

- Decided: [[DR-06 Yearly rename, old name freed, case-insensitive]]: s06 suggests handles from the person's own name; a later rename is limited to once a year ([[Profiles & Pin Name Story]] S5). Building the suggestions is not ticketed yet.
- Delivery latency once [[T-001 Wire an email provider for one-time codes]] lands: the resend cool-down and the expired state should be tuned on real numbers.
