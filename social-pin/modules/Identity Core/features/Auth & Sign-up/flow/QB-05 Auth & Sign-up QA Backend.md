---
id: QB-05
type: qa-backend
module: identity
feature: auth
status: passing
scope: feature
screens: [s01, s02, s06, s08, s68, s75]
depends: ["BD-02 Auth & Sign-up Backend Delivery", "S-02 Auth & Sign-up Story"]
affects: []
related: ["BI-02 Auth & Sign-up Backend Integration", "FR-02 Auth & Sign-up Frontend Requirements", "QB-04 Account QA Backend", "Auth Model", "BI-04 Profiles & Pin Name Backend Integration", "BD-35 Error Contract Backend Delivery", "S-78 Code Delivery Story", "S-87 Error Contract Story", "ND-01 Passwordless login", "POST /auth/sign-up", "POST /auth/verify-code", "POST /auth/request-code", "POST /auth/complete-registration", "POST /auth/login", "POST /auth/login/verify", "POST /auth/refresh", "POST /auth/logout", "POST /auth/logout-everywhere", "GET /profiles/pin-name/:pinName/availability", E_AUTH_01, E_AUTH_03, E_AUTH_04, E_AUTH_05, E_AUTH_06, E_AUTH_07, E_AUTH_08, E_PROFILE_02, E_USER_01, "B-03 Two refreshes at once both succeed and fork the session", "B-04 Sign-up accepts an email and a phone together", "B-05 Expired onboarding token answers 401, not the documented 400", "B-06 Timestamps the app writes are stored shifted by the server time zone", "ND-30 When five wrong code tries lock the code"]
created: 2026-10-27
updated: 2026-11-05
tags: [qa-backend, qa-backend/passing, module/identity, layer/qa]
---

# 🧪 Auth & Sign-up · QA Backend

> Blocked by default until [[BD-02 Auth & Sign-up Backend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-02 Auth & Sign-up]] · **Verifies:** [[BD-02 Auth & Sign-up Backend Delivery]] against [[S-02 Auth & Sign-up Story]] and [[FR-02 Auth & Sign-up Frontend Requirements]], with the shapes and errors of [[BI-02 Auth & Sign-up Backend Integration]] · **Verdict:** 🟢 Passing · 2026-11-05 · `main @ ce2a2e8 · localhost:3000, Node 22.22.2` · 50 of 50 as expected, nothing pending (B14 and B36 re-run on this build; B49, B50 last run on `8997be1`; B5, B15, B30, B42 on `504cb21`; the other 42 on `b4984d6`)

Expected behaviour of the API, as artefacts a person can check a build against: tables and diagrams, **not test code** (the specs live in the backend repo). `status: passing` or `failing` after a run; the verdict tells the PM whether the story can be fulfilled (passing with nothing pending).

## Scope

**Covered.** The nine auth routes and the one public Pin check of [[BI-02 Auth & Sign-up Backend Integration]]: the three sign-up calls (`sign-up` → `verify-code` → `complete-registration`), the two sign-in calls (`login` → `login/verify`), resend (`request-code`), the session calls (`refresh`, `logout`, `logout-everywhere`) and `GET /profiles/pin-name/:pinName/availability`. Their shapes, normalisation, the code lifecycle (10 minutes, five wrong guesses, superseded on resend), the token scopes, and the guarantee that `complete-registration` leaves either a whole identity or nothing.

**Not covered.** Copy, timers and screen states (that is the QA Frontend's). Delivery of codes by email or SMS, which does not exist yet ([[S-78 Code Delivery Story|Code Delivery · S6]], [[S-78 Code Delivery Story|Code Delivery · S7]]): every row reads the code from `devCode`. Suspended and deleted accounts on later calls, already run in [[QB-04 Account QA Backend]] (B14, B21); rows B46 and B47 here only point at them. The steps between s02 and s06 ([[F-05 Onboarding Imports]]) and after s08 ([[F-37 Interests]], [[F-11 Rings]]). Rate limiting: no route throttles requests today, so there is nothing to check yet.

**Rows that state the contract against the code.** Where the integration note and the code read differently, the row states the integration note's promise (that is the contract), so a difference shows up as 🔴 rather than being written into the expectation. B5 and B30 were such rows and both differ on the run. **B14 vs [[S-02 Auth & Sign-up Story]] S2:** the story says the 429 comes "after five wrong tries". The build counts five wrong guesses as 400s and answers the **sixth** submission 429, even when that sixth code is right; the row follows the integration note ("sixth wrong guess") and passes, and the story's wording is the PM's to check (in `pending`).

**Test data.** Throwaway addresses only, `qa-auth-<letter>-<run>@test.local` and `+44 20 718x xxxx` numbers (the `+1 555 01xx` range fails E.164 validation, see [[QB-04 Account QA Backend]]). Run on Node 20.19 or later: on Node 18 every write answers 500 (see [[QB-04 Account QA Backend]]'s verdict). The 2026-10-27 run (stamp `10271159`) deleted every account it completed (a, f, g, the phone account, and the re-check accounts) and left six PENDING sign-ups that hold no session and cannot be deleted through the API: `qa-auth-{b,c,d,e,x}-10271159@test.local` and `qa-auth-a-10271159@test.local` (re-signed-up by B10), plus `qa-auth-e2-…`, `qa-auth-e3-…`, `qa-auth-x2-…` and `qa-tz-…` from the re-checks. Time-based rows were set up without waiting: B15 by moving the code's stored `expires_at` back, B30 and B48 with tokens signed by the dev secret with an `exp` in the past.

## Expected behaviour

Every row is one acceptance criterion of [[S-02 Auth & Sign-up Story]] or one rule of [[BI-02 Auth & Sign-up Backend Integration]]. ✅ as expected · 🔴 differs · ⬜ not run. Bodies are the API's `{ statusCode, message, error, path, timestamp }`; `ErrorCode` is not on the wire until [[S-87 Error Contract Story|Error Contract · S4–S8]], so the code column names what the contract promises.

### `POST /auth/sign-up` — S1 Start with an email or a phone (s01)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B1 | an email no account holds | `{ email }` | 201 `{ destination, channel: "EMAIL", expiresAt, devCode }`; `expiresAt` is 10 minutes ahead; `devCode` is six digits; a PENDING account now exists | ✅ |
| B2 | an E.164 phone no account holds | `{ phone: "+442071838751" }` | 201, `channel: "PHONE"`, `destination` in E.164 | ✅ |
| B3 | an email typed with spaces and capitals | `{ email: "  QA-Auth-A@Test.Local " }` | 201, `destination` trimmed and lower-cased | ✅ |
| B4 | — | `{}` | 400 `E_AUTH_07` "Provide either an email address or a phone number"; nothing created | ✅ |
| B5 | — | `{ email, phone }` together | 400 `E_AUTH_07` (the integration note: "neither or both"); nothing created | ✅ re-run 2026-11-05 on `main @ 504cb21`: 400 "Provide either an email address or a phone number, not both", no user and no code stored ([[B-04 Sign-up accepts an email and a phone together]], fixed; on `b4984d6` it was a 201 that stored both) |
| B6 | — | `{ email: "not-an-email" }`, `{ phone: "0501234567" }` (no country code) | 400, `message` an array naming the field; nothing created | ✅ |
| B7 | — | `{ email, password: "x" }` | 400 `["property password should not exist"]`: there is no password anywhere | ✅ |
| B8 | an address whose sign-up is still PENDING | `sign-up` again with it | 201 with a **new** `devCode`, no error; the previous code no longer verifies (B13) | ✅ |
| B9 | an address that finished sign-up (ACTIVE) | `sign-up` with it | 409 `E_AUTH_01` "An account already exists for this email or phone. Sign in instead."; no code issued | ✅ |
| B10 | an address released by a deleted account | `sign-up` with it | 201 with a `devCode`: the address is free again | ✅ |

### `POST /auth/verify-code` and `POST /auth/request-code` — S2 Enter the code (s02)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B11 | a fresh sign-up code | `{ destination, code, purpose: "SIGN_UP" }` | 201 `{ onboardingToken, purpose: "SIGN_UP", expiresIn: "15m" }`; the account's `emailVerifiedAt` (or `phoneVerifiedAt`) is set; it is still PENDING | ✅ |
| B12 | the same code | sent a second time | 400 `E_AUTH_05` "That code is invalid or has expired": a code works once | ✅ |
| B13 | a code, then a resend | the **first** code | 400 `E_AUTH_05`: a resend supersedes the previous code; the new one verifies | ✅ |
| B14 | a fresh code | five wrong codes, then a submission **with the right code** | 400 `E_AUTH_05` four times, then 429 `E_AUTH_06` "Too many attempts. Request a new code." on the **fifth** wrong code itself ([[D-30 The fifth wrong code try locks the code]]); the right code after that is 400 (the code is burned); a resend gives a code that works | ✅ re-run 2026-11-05 on `main @ ce2a2e8`: 400 ×4, 429 on the fifth, right code 400, resend 201 (on `8997be1` the 429 came on the sixth submission) |
| B15 | a code older than 10 minutes | the right code | 400 `E_AUTH_05` | ✅ re-run 2026-11-05 on `main @ 504cb21` by ageing the code with Postgres's `now() - interval '1 minute'`: 400 "That code is invalid or has expired"; the fresh code's `expires_at` was 600 s after `now()` ([[B-06 Timestamps the app writes are stored shifted by the server time zone]], fixed; on `b4984d6` the code had to be aged by its stored `expires_at`) |
| B16 | — | `destination` typed with other capitals or spaces than at sign-up | 201: the server normalises the destination the same way at both steps | ✅ |
| B17 | — | `purpose: "LOGIN"`; `code: "12345"`; `code: "abcdef"` | 400 validation: `verify-code` takes `SIGN_UP` only, and exactly six digits | ✅ |
| B18 | a PENDING address | `request-code { destination, purpose: "SIGN_UP" }` | 201 with a new `devCode`; the old code is superseded | ✅ |
| B19 | an address no account holds | `request-code` with either purpose | 201 with `destination`, `channel`, `expiresAt` and **no `devCode`**; no code stored, so any code then sent to `verify-code` is 400 | ✅ |

### `GET /profiles/pin-name/:pinName/availability` and `POST /auth/complete-registration` — S3 Claim a Pin name (s06), S4 Land on the first Ring (s08)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B20 | no token at all | `GET …/availability` for a free name | 200 `{ pinName, available: true }`: the route is public | ✅ |
| B21 | a name held by another account | the same name in other capitals | 200 `{ available: false }`, and nothing in the body about who holds it | ✅ |
| B22 | — | `GET …/availability` for a name of 2 or 31 characters, or with `!`, a space or `-` | 200 `{ pinName, available }`: the route answers only a boolean and applies no format rule; the client validates 3 to 30 letters, digits, `.` and `_` itself ([[BI-02 Auth & Sign-up Backend Integration]]), and `complete-registration` refuses a bad name (B26). Observed: `available: true` for each of them | ✅ (expectation corrected: the first draft asked for a 400 no note promises) |
| B23 | an onboarding token from B11 | `{ onboardingToken, pinName: "QA.Auth_A", fullName: "QA Auth A" }` | 201 `{ accessToken, refreshToken, tokenType: "Bearer", expiresIn: "15m" }`; `GET /users/me` with the access token: `status: "ACTIVE"` | ✅ |
| B24 | B23's session | `GET /profiles`, `GET /rings`, `GET /rings/:id/projection` | the default profile (`isDefault: true`, `pinName` with its casing kept, `fullName`), one default Ring pointing at it, and its projection: the whole identity from one call | ✅ |
| B25 | a fresh onboarding token | no `fullName` | 201; the profile's `fullName` is empty | ✅ |
| B26 | a fresh onboarding token | `fullName` of 121 characters; `pinName` that fails the pattern; an extra `password` key | 400 validation each time; the account stays PENDING | ✅ |
| B27 | a Pin name held by another account, in other capitals | `complete-registration` with it | 409 `E_PROFILE_02` "This pin name is already taken"; the account is **still PENDING** with no profile and no Ring (nothing half-built); the same token then succeeds with a free name | ✅ |
| B28 | B23's onboarding token, already used | `complete-registration` again | 409 `E_AUTH_08` "This account is already set up. Sign in instead." | ✅ |
| B29 | an ACTIVE account | `request-code { purpose: "SIGN_UP" }`, `verify-code`, then `complete-registration` | 409 `E_AUTH_08` at the last step: an extra code cannot rebuild an existing identity | ✅ |
| B30 | an onboarding token older than 15 minutes, or one with a broken signature | `complete-registration` | 400 `E_AUTH_05` (the integration note); back to s02 | ✅ re-run 2026-11-05 on `main @ 504cb21`: 400 "Verification session is invalid or expired" for both, the account stays PENDING ([[B-05 Expired onboarding token answers 401, not the documented 400]], fixed; on `b4984d6` it was 401) |
| B31 | an onboarding token | used as `Authorization: Bearer` on `GET /users/me` | 401 `E_AUTH_04` "Token cannot be used for API access": it is not a session | ✅ |
| B50 | two PENDING accounts, each with a fresh onboarding token, and one free Pin name | both send `complete-registration` with that name at the same moment | one 201, one 409 `E_PROFILE_02` "This pin name is already taken", never 500; one profile holds the name; the loser stays PENDING and its same onboarding token registers with another handle (201) | ✅ added and run 2026-11-05 on `main @ 8997be1`: 5 races, 201 + 409 each, one holder, loser PENDING; a sixth race's loser then registered with another handle, 201. On `504cb21` the loser got 500 in 4 of 5 races (the backend's control run) |

### `POST /auth/login` and `POST /auth/login/verify` — S5 Come back later and sign in with a code (s01 → s02)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B32 | an ACTIVE account's email, then its phone | `login { identifier }` | 201 `{ destination, channel, expiresAt, devCode }`, channel matching the identifier | ✅ |
| B33 | an identifier no account holds | `login` | 201 with the **same fields** and no `devCode`; no code stored; `login/verify` with any code is 400 `E_AUTH_05` | ✅ |
| B34 | B32's code | `login/verify { identifier, code }` with the same string | 201 session pair; `GET /users/me` shows `lastLoginAt` at that instant | ✅ |
| B35 | B32's code | `login/verify` with the identifier in other capitals | 201: the server normalises; the client still sends the same string (S5) | ✅ |
| B36 | a login code | wrong code five times, then the right code | as B14: four 400 `E_AUTH_05`, then 429 `E_AUTH_06` on the fifth wrong code, code burned, the right code after it refused; no session | ✅ re-run 2026-11-05 on `main @ ce2a2e8`: 400 ×4, 429 on the fifth, right code 400 |
| B37 | a **sign-up** code for the address | sent to `login/verify` | 400 `E_AUTH_05`: sign-up and login codes do not cross | ✅ |
| B38 | an account whose sign-up stopped after B11 (PENDING) | `login`, then `login/verify` with the right code | 201 with a `devCode`, then 403 `E_AUTH_03` "This account is not active"; no session | ✅ |
| B39 | a SUSPENDED account | `login`, then `login/verify` | 403 `E_AUTH_03`, the **same body** as B38 | ✅ |
| B40 | a login code, then `request-code { purpose: "LOGIN" }` | the first code | 400 `E_AUTH_05`; the resent code signs in | ✅ |

### Sessions — S6 Stay signed in without noticing (s68, s75)

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B41 | a session | `POST /auth/refresh` with the **refresh** token as bearer | 201 with a new pair; the token sent is now dead: sending it again is 401 `E_AUTH_04` "Refresh token is no longer valid. Sign in again." | ✅ |
| B42 | one refresh token | two `refresh` calls at the same moment | one 201, one 401 `E_AUTH_04` (single use holds under a race) | ✅ re-run 2026-11-05 on `main @ 504cb21`, 10 races: one 201 and one 401 "Refresh token is no longer valid. Sign in again." every time, one live refresh token after each, and the winner's token refreshes again ([[B-03 Two refreshes at once both succeed and fork the session]], fixed; on `b4984d6` both answered 201 and the session forked) |
| B43 | a session | the **access** token sent to `refresh`; the **refresh** token sent to `GET /users/me` | 401 both times: each token works only where its scope allows | ✅ |
| B44 | a session | `POST /auth/logout` with the refresh token; then the same call again | 201 both times (idempotent); that refresh token is dead; the access token keeps working until it expires (at most 15 minutes) | ✅ |
| B45 | the same account signed in on two devices | `POST /auth/logout-everywhere` with one device's access token | 201 `{ revoked: N }`, N the live sessions; both devices' refresh tokens are then 401 `E_AUTH_04` | ✅ |
| B46 | a session, then the account is suspended | any call | 401 `E_AUTH_03` "Account is not active" (also [[QB-04 Account QA Backend]] B21) | ✅ |
| B47 | a session, then the account is deleted | any call | 404 `E_USER_01` "User not found" (also [[QB-04 Account QA Backend]] B14) | ✅ |
| B48 | an access token older than 15 minutes, or one with a forged signature | `GET /users/me` | 401; a refresh restores the session | ✅ |
| B49 | a session, then the account is suspended | `POST /auth/refresh` with its refresh token | 401 `E_AUTH_03` "Account is not active", the same status and body as B46 on any other route, so the client's refused-refresh path ends the session; no new pair | ✅ added and run 2026-11-05 on `main @ 8997be1`: 401 "Account is not active", identical to `GET /users/me` on the same account (on `504cb21` it was 403 "This account is not active") |

## State diagram

The account, as the auth routes move it:

```mermaid
stateDiagram-v2
  [*] --> PENDING: POST /auth/sign-up (new address)
  PENDING --> PENDING: sign-up again / request-code (new code, old one superseded)
  PENDING --> PENDING: verify-code (destination verified, onboarding token 15 min)
  PENDING --> ACTIVE: complete-registration (profile + default Ring + projection, one transaction)
  PENDING --> PENDING: complete-registration fails (pin taken, bad body) — nothing written
  ACTIVE --> ACTIVE: login → login/verify (session)
  ACTIVE --> SUSPENDED: PATCH /admin/users/:id/status
  SUSPENDED --> ACTIVE: PATCH /admin/users/:id/status
  ACTIVE --> DELETED: DELETE /users/me
  PENDING --> [*]: login/verify 403 E_AUTH_03
  SUSPENDED --> [*]: login/verify 403 E_AUTH_03, any call 401 E_AUTH_03
  DELETED --> [*]: any call 404 E_USER_01; address released
```

One code, from issue to end:

```mermaid
stateDiagram-v2
  [*] --> Live: issued (sign-up, request-code, login), 10 min
  Live --> Live: wrong guess 1–5 (400 E_AUTH_05)
  Live --> Used: right code (201)
  Live --> Burned: 6th submission (429 E_AUTH_06)
  Live --> Superseded: a newer code for the same destination and purpose
  Live --> Expired: 10 minutes pass
  Used --> [*]
  Burned --> [*]
  Superseded --> [*]
  Expired --> [*]
```

Every end state answers 400 `E_AUTH_05` to a further attempt.

## Error matrix

What the contract promises. The message column is the text the build sends; until [[S-87 Error Contract Story|Error Contract · S4–S8]] the client tells rows apart by status and endpoint.

| Situation | Status | ErrorCode | Message | Rows |
|---|---|---|---|---|
| sign-up with neither of email and phone | 400 | `E_AUTH_07` | "Provide either an email address or a phone number" | B4 |
| sign-up with both | 400 | `E_AUTH_07` | "Provide either an email address or a phone number, not both" | B5 |
| a field fails validation, or an unknown key is sent | 400 | — | an array, one entry per constraint | B6, B7, B17, B22, B26 |
| sign-up for an address that finished sign-up | 409 | `E_AUTH_01` | "An account already exists for this email or phone. Sign in instead." | B9 |
| wrong, expired, used, superseded or burned code; code of the other purpose | 400 | `E_AUTH_05` | "That code is invalid or has expired" | B12–B15, B19, B33, B37, B40 |
| the fifth wrong code of one code, on that guess | 429 | `E_AUTH_06` | "Too many attempts. Request a new code." | B14, B36 |
| onboarding token expired or forged | 400 | `E_AUTH_05` | "Verification session is invalid or expired" | B30 |
| Pin name taken at the last moment, also by a concurrent registration | 409 | `E_PROFILE_02` | "This pin name is already taken" | B27, B50 |
| complete-registration on an account already set up | 409 | `E_AUTH_08` | "This account is already set up. Sign in instead." | B28, B29 |
| login/verify for a PENDING or SUSPENDED account | 403 | `E_AUTH_03` | "This account is not active" | B38, B39 |
| refresh token rotated, revoked or replayed | 401 | `E_AUTH_04` | "Refresh token is no longer valid. Sign in again." | B41, B42 (a concurrent replay too), B45 |
| an onboarding or refresh token on an API route | 401 | `E_AUTH_04` | "Token cannot be used for API access" / "Unauthorized" | B31, B43 |
| suspended account on any later call, `POST /auth/refresh` included | 401 | `E_AUTH_03` | "Account is not active" | B46, B49 |
| deleted account on any later call | 404 | `E_USER_01` | "User not found" | B47 |

Retired, and never to be seen: `E_AUTH_02` (invalid password), `E_USER_04` (current password), purpose `PASSWORD_RESET`.

## Privacy and access checks

- **Existence is not revealed at step 1 of sign-in.** `login` and `request-code` answer a known and an unknown address with the same status and the same fields (B19, B33). **Standing caveat, not a row:** while `devCode` is returned ([[S-78 Code Delivery Story|Code Delivery · S8]]), its presence *does* tell a caller the account exists, and knowing an address is enough to sign in as it. Every privacy result here holds only once Code Delivery S8 ships.
- `sign-up` on an ACTIVE address answers 409 `E_AUTH_01` (B9): that reveals the account exists, by design, so the client can switch to sign-in without asking (S1).
- PENDING and SUSPENDED accounts get one identical 403 at `login/verify` (B38, B39): the client cannot tell them apart.
- The Pin check never names the holder of a taken name (B21).
- No response carries a password, a code hash, a refresh-token hash or a user id at step 1; the challenge is `destination`, `channel`, `expiresAt` and (for now) `devCode` only (B1, B32).
- Token scopes are not interchangeable: an onboarding or refresh token never opens an API route, an access token never refreshes (B31, B43).
- `complete-registration` leaves no half identity: a failure writes nothing (B27), also when it loses a Pin-name race (B50).

## Verdict

- **Run on:** 2026-11-05 · **build:** `main @ 8997be1 · localhost:3000, Node 22.22.2` · **result:** 🟢 **passing** · two rows added for what [[BI-02 Auth & Sign-up Backend Integration]] flagged and run, both as expected: **B49**, a suspended account's refresh is 401 `E_AUTH_03` (was 403); **B50**, two registrations racing for one free Pin name are 201 + 409 `E_PROFILE_02` in 5 of 5 (was 500 for the loser), and the loser registers with another handle on the same onboarding token. Those were the last two asks of [[FR-02 Auth & Sign-up Frontend Requirements]] left on [[BD-02 Auth & Sign-up Backend Delivery]], whose `pending` is now empty. The other 48 rows were not re-run on this build.
- **Not a row yet, for a later run:** the backend notes on BD-02 that `POST /auth/logout` at the same moment as a refresh of the same token may leave the new token live. Not reproduced or filed here.
- **Re-run on:** 2026-11-05 · **build:** `main @ 504cb21 · localhost:3000, Node 22.22.2` (machine time zone UTC+3) · **result:** 🟢 **passing** · the four rows that differed or were set up around a bug re-run, all as expected: B5 ([[B-04 Sign-up accepts an email and a phone together]]), B15 ([[B-06 Timestamps the app writes are stored shifted by the server time zone]]), B30 ([[B-05 Expired onboarding token answers 401, not the documented 400]]), B42 ([[B-03 Two refreshes at once both succeed and fork the session]], 10 races). All four bugs closed `done`, `resolution: fixed`, on khaled's word. The other 44 rows were not re-run on this build; their last run is 2026-10-27 on `b4984d6`, and the backend's unit suite (233 tests) passes on `504cb21`.
- **Settled since:** the S2 entry for `/pm` became [[ND-30 When five wrong code tries lock the code]], decided as [[D-30 The fifth wrong code try locks the code]] and shipped on `ce2a2e8` (B14, B36 above). The two FR-02 asks noted here on `504cb21` shipped on `8997be1` (B49, B50).
- **Previous run:** 2026-10-27 · **build:** `main @ b4984d6 · localhost:3001, Node 22.22.2` (the dev server on `localhost:3000` still runs Node 18.18) · **result:** 🔴 **failing** · 45 of 48 rows as expected, 3 differ (B5, B30, B42), none unrun.
- **B42 — the refresh rotation breaks under a race. Security.** Two refreshes with one token at the same moment both succeed and both new tokens stay live, so a replayed (stolen) token used while its owner refreshes forks the session instead of ending it. Filed as [[B-03 Two refreshes at once both succeed and fork the session]], high, `/backend`.
- **B5 — sign-up takes both an email and a phone**, and attaches the phone without proof. Filed as [[B-04 Sign-up accepts an email and a phone together]], medium, `/backend`.
- **B30 — an expired or forged onboarding token is 401, not 400.** Same code, other status. Filed as [[B-05 Expired onboarding token answers 401, not the documented 400]], low, `/backend` (fix the status or the note).
- **Found in passing, not a row: every timestamp the app writes is stored 3 hours early** on this machine (time zone UTC+3), while the API reads them back correctly. Found when ageing a code with Postgres's `now()` had no effect on B15. Filed as [[B-06 Timestamps the app writes are stored shifted by the server time zone]], high, `/backend`; it affects every table, not only auth.
- Everything else behaves as the integration note says: normalisation, the six-digit code with its 10 minutes, five wrong guesses then 429, resend superseding, the onboarding token's scope, a whole identity from `complete-registration` or nothing (B27), one 403 for PENDING and SUSPENDED, the same challenge for unknown addresses, token scopes, logout and logout-everywhere.
- **[[S-02 Auth & Sign-up Story]] (S-02) is not ready to fulfil** (2026-11-05): this note is passing with nothing pending or unmet, but [[F-02 Auth & Sign-up]] has no QA Frontend note yet, and the story needs both.

## Log

- 2026-10-27 · branch `docs/qa/M-01-identity/F-02-auth/QB-05-written` · written: 48 rows across the six stories, the account and code state diagrams, the error matrix and the privacy checks. `status: draft` until the first run on a named build.
- 2026-10-27 · same branch · first run on `main @ b4984d6` (localhost:3001, Node 22.22.2): 45 of 48 ✅, B5, B30 and B42 🔴, filed as [[B-04 Sign-up accepts an email and a phone together]], [[B-05 Expired onboarding token answers 401, not the documented 400]] and [[B-03 Two refreshes at once both succeed and fork the session]]; [[B-06 Timestamps the app writes are stored shifted by the server time zone]] found while setting up B15. B22's expectation corrected to the contract (the route answers a boolean only). Flagged [[BI-02 Auth & Sign-up Backend Integration]], [[BD-02 Auth & Sign-up Backend Delivery]] and [[S-02 Auth & Sign-up Story]].
- 2026-11-05 · branch `docs/qa/M-01-identity/F-02-auth/QB-05-passing` · re-test on `main @ 504cb21` (localhost:3000, Node 22.22.2): B5, B15, B30 and B42 ✅; [[B-03 Two refreshes at once both succeed and fork the session]], [[B-04 Sign-up accepts an email and a phone together]], [[B-05 Expired onboarding token answers 401, not the documented 400]] and [[B-06 Timestamps the app writes are stored shifted by the server time zone]] closed `done`, `resolution: fixed`, on khaled's word, and removed from `pending`; `failing` → `passing` (Partial: the S2 entry for `/pm` stays). Test data: `qa-auth-b42-11051300@test.local` completed and deleted; `qa-auth-b15-11051300@test.local` and `qa-auth-b30-11051300@test.local` left PENDING (no API deletes a PENDING sign-up). The B-06 flag under the H1 is cleared.
- 2026-11-05 · branch `docs/qa/M-01-identity/F-02-auth/QB-05-b49-b50-passing` · rows B49 (refresh for a suspended account) and B50 (two registrations racing for one Pin name) added from [[BI-02 Auth & Sign-up Backend Integration]]'s flag and run on `main @ 8997be1` (localhost:3000, Node 22.22.2): both ✅; the error matrix and the privacy checks name them; the flag under the H1 is cleared. Stays `passing`, Partial on the S2 entry for `/pm`. Test data: stamps `11051600` and `11051610`; 8 completed accounts deleted, 5 race losers left PENDING.
- 2026-11-05 · branch `docs/qa/M-01-identity/F-02-auth/QB-05-nothing-pending` · B14 and B36 rewritten to [[D-30 The fifth wrong code try locks the code]] and re-run on `main @ ce2a2e8` (localhost:3000, Node 22.22.2): both ✅, four 400s then 429 on the fifth wrong code, the right code after it refused, a resend works; the error matrix follows. The S2 entry is cleared from `pending` and the D-30 flag under the H1 removed: `passing` with nothing pending, no longer Partial. Test data: stamp `11051810`, the one completed account deleted.
