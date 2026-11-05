---
id: BD-02
type: backend-delivery
module: identity
feature: auth
status: done
scope: feature
screens: [s01, s02, s06, s08, s68]
related: ["B-02 Deleted account answers 401, not the documented 404 E_USER_01", E_USER_01, "B-03 Two refreshes at once both succeed and fork the session", "B-04 Sign-up accepts an email and a phone together", "B-05 Expired onboarding token answers 401, not the documented 400", "B-06 Timestamps the app writes are stored shifted by the server time zone", "Database & Migrations"]
created: 2026-10-15
updated: 2026-11-05
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Auth & Sign-up · Backend Delivery

**Feature:** [[F-02 Auth & Sign-up]] · **Status:** Done · **Integration guide:** [[BI-02 Auth & Sign-up Backend Integration]] · **Requirements:** [[FR-02 Auth & Sign-up Frontend Requirements]] · **QA:** [[QB-05 Auth & Sign-up QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `POST /auth/sign-up`
- `POST /auth/request-code`
- `POST /auth/verify-code`
- `POST /auth/complete-registration`
- `POST /auth/login`
- `POST /auth/login/verify`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/logout-everywhere`

**Tables / models:** `User`, `VerificationCode`, `RefreshToken`, `UserRole`

**Code:** `src/modules/auth/`, `src/modules/auth/strategies/jwt.strategy.ts`

## How it works

**Sign-up, three calls.** `POST /auth/sign-up` takes exactly one of `email` and `phone`: neither or both is 400 `E_AUTH_07`, rejected in `UserService.findOrCreatePending` before any query, so an address that was never sent a code is never stored ([[B-04 Sign-up accepts an email and a phone together]]). It creates (or reuses) a `PENDING` user and a `VerificationCode` row in one transaction; the code is 6 random digits, bcrypt-hashed, 10 minutes long, and returned as `devCode` on every issued code. `POST /auth/verify-code` (purpose always `SIGN_UP`) finds the newest unconsumed code for that destination, locks it on the fifth wrong guess: guesses one to four answer 400 `E_AUTH_05`, the fifth burns the code and itself answers 429 `E_AUTH_06`, and the right code after it is refused ([[D-30 The fifth wrong code try locks the code]]; the count comes from the atomic increment and is committed in its own transaction, so the limit holds and two concurrent guesses cannot slip past it), marks the destination verified on a match and signs a 15-minute **onboarding token** (scope `onboarding`). `POST /auth/complete-registration` verifies that token (`TokenService.verifyOnboardingToken`: expired, forged or not of scope `onboarding` is 400 `E_AUTH_05`, the same answer as a token issued for another purpose, so the client goes back to s02 and never into a refresh, [[B-05 Expired onboarding token answers 401, not the documented 400]]), refuses an account that already finished (409 `E_AUTH_08`), then in **one transaction** activates the account, creates the initial profile (`ProfileService.createInitialProfile`: a taken Pin name is 409 `E_PROFILE_02`, also when a concurrent registration claims the same free name between the check and the insert, because the unique index's `P2002` is mapped to the same 409 by `isUniqueViolation` in `src/common/utils/prisma-errors.ts`; the loser's transaction rolls back and the account stays PENDING), the default Ring (`RingService`) and its projection (`RingProfileService`), and issues the session pair. A partial identity is the one state the flow must never leave behind.

**Sign-in, two calls.** `POST /auth/login { identifier }` resolves the identifier (an `@` means email, else E.164 phone) and issues a `LOGIN` code; for an unknown identifier it returns the same challenge shape with no `devCode` and stores nothing. `POST /auth/login/verify { identifier, code }` checks the code with the same rules, refuses a non-`ACTIVE` account with 403 `E_AUTH_03` (PENDING and SUSPENDED share the message), records `lastLoginAt` and issues the session pair. There is no password: `users.password_hash` was dropped and `reset-password` / `change-password` removed ([[ND-01 Passwordless login]]).

**Tokens.** `TokenService` signs a 15-minute access JWT (scope `access`) and a 7-day refresh JWT (scope `refresh`) whose `jti` is 48 random bytes; only the `jti` is bcrypt-hashed into `refresh_tokens`. `POST /auth/refresh` (refresh token as bearer, its own guard) finds the live row by comparing the `jti` against the user's live rows, then `TokenService.issueTokens` revokes it and writes the replacement in one transaction. The revoke is a conditional write (`updateMany` on `id`, `revokedAt: null`, `expiresAt > now`) that runs before the replacement is written: of two concurrent refreshes with one token, the second blocks on the row lock, matches 0 rows once the first commits, and answers 401 `E_AUTH_04` without writing a token ([[B-03 Two refreshes at once both succeed and fork the session]]). Each refresh token works once, under a race too; a replay or a lost race is the same 401 `E_AUTH_04` body (`refreshTokenNoLongerValid()`). A refresh for an account that is not ACTIVE is 401 `E_AUTH_03` "Account is not active", the same status and body as every other route, so the client's refused-refresh path ends the session (`login/verify` keeps its 403: a sign-in refused, not a session ending). `JwtStrategy` rejects any scope but `access` and re-reads the user on every request, so a suspended account is out immediately (401 `E_AUTH_03`).

**Resend and sign-out.** `POST /auth/request-code` (`SIGN_UP` or `LOGIN`) issues a replacement code for a real account and a plausible challenge for an unknown destination. `POST /auth/logout` revokes the presented refresh token; `logout-everywhere` revokes all of them, the caller's included.

**Times.** A code's `expires_at` and `consumed_at`, a refresh token's expiry and `lastLoginAt` are stored as the instant they claim to be, so Postgres's `now()` and any raw query agree with the API: every database session runs in UTC ([[Database & Migrations#Prisma 7 rules]], [[B-06 Timestamps the app writes are stored shifted by the server time zone]]).

**Delivery.** `AuthService.issueCode` logs the code at the `TODO(delivery)` line and returns it as `devCode` in every environment; no provider is wired ([[F-32 Code Delivery]]).

### What exists

- Three-call sign-up: `sign-up` → `verify-code` → `complete-registration` (pin name, no password). The last call activates the account and creates the profile, the default Ring and its projection in **one transaction**.
- `sign-up` takes exactly one of email and phone: neither **or both** is 400 `E_AUTH_07`, rejected in `UserService.findOrCreatePending` before any query, so a second, unverified address is never stored ([[B-04 Sign-up accepts an email and a phone together]]).
- Two-call sign-in: `login { identifier }` issues a LOGIN code, `login/verify { identifier, code }` returns the session. `request-code` resends `SIGN_UP` or `LOGIN` codes.
- No password anywhere: `users.password_hash` dropped, `reset-password` and `change-password` removed, `PASSWORD_RESET` / `E_AUTH_02` / `E_USER_04` retired.
- Three token scopes (`access`, `refresh`, `onboarding`); the `scope` claim is checked, so an onboarding token is never a session.
- An onboarding token that is expired, forged or of another scope answers 400 `E_AUTH_05` on `complete-registration`, like the wrong-purpose case, never 401: a 401 would send the client's session handler to a refresh the person does not have ([[B-05 Expired onboarding token answers 401, not the documented 400]]).
- Refresh tokens rotate, are stored bcrypt-hashed (the `jti`, not the JWT), and are revoked in the same transaction that issues the replacement. The revoke is a conditional write (`revokedAt: null`, not expired) that runs before the replacement is written, so of two concurrent refreshes with one token exactly one wins; the other gets the same 401 `E_AUTH_04` as a replay and writes no row ([[B-03 Two refreshes at once both succeed and fork the session]]).
- `JwtStrategy` re-reads the user on every request, so a SUSPENDED account loses access at once (401 `E_AUTH_03`), and a DELETED one answers 404 `E_USER_01` ([[B-02 Deleted account answers 401, not the documented 404 E_USER_01]]). `POST /auth/refresh` gives a SUSPENDED account the same 401 `E_AUTH_03`.
- A Pin name lost to a concurrent claim answers 409 `E_PROFILE_02`, never 500, on every write that sets one: registration, `POST /profiles` and a rename. `isUniqueViolation` (`src/common/utils/`) matches Prisma's `P2002` on the named column only, so another unique index on `profiles` is not mistaken for a taken handle.
- Account enumeration is resisted: `login` and `request-code` answer an unknown destination with the same challenge shape (no `devCode`, no code stored).
- The 5-wrong-attempts limit commits in its own transaction, so it actually triggers (it was rolled back with the error before). The fifth wrong guess is the lock: it burns the code and answers 429 `E_AUTH_06` itself, on `verify-code` and `login/verify` ([[D-30 The fifth wrong code try locks the code]]).

### Gaps

- Code delivery is not wired, see [[F-32 Code Delivery]]. Until it is, `devCode` is returned in every environment.
- Every ask of [[FR-02 Auth & Sign-up Frontend Requirements]] that this feature owns is met on `main @ 8997be1` (2026-11-05); nothing is left in `pending:`.
- `POST /auth/logout` sent at the same moment as a refresh of the same token can revoke the row that refresh just rotated, leaving the new token live. Found while fixing B-03, not filed; for `/qa` to confirm and file.

## Log

- 2026-10-18 · split out of [[F-02 Auth & Sign-up]] when the vault moved to layers
- 2026-10-29 · branch `B-06/prisma/utc-session-timezone`, merged to `main @ 26958cd` · fixes [[B-06 Timestamps the app writes are stored shifted by the server time zone]]: every Postgres session is pinned to UTC (`createPgAdapter` in `src/prisma/pg-adapter.ts`, used by `PrismaService` and the seed), so a sign-up code's `expires_at` is 10 minutes after Postgres's `now()` on a UTC+3 server, not 2 h 50 min before it. No endpoint, shape or error changed. Specs: `src/prisma/pg-adapter.spec.ts`, and `test/timestamps.e2e-spec.ts` (fails with 10 800 s of drift without the fix on an `Asia/Damascus` server, passes with it). Rows stored before the fix are not corrected ([[Database & Migrations#Prisma 7 rules]]). Flagged [[B-06 Timestamps the app writes are stored shifted by the server time zone]] and [[QB-05 Auth & Sign-up QA Backend]] (row B15 to re-run); the B-06 half of QB-05's flag on this note is cleared, the B-03 half stays.
- 2026-11-05 · vault branch `tickets/backend/M-01-identity/F-02-auth/FR-02-accepted` · [[FR-02 Auth & Sign-up Frontend Requirements]] accepted by the backend (approved by khaled); this note stays `done` with five `pending` asks (B-03, B-04, B-05, refresh 403 for a suspended account, the pin-name race 500), listed under *Gaps*. No code changed.
- 2026-11-05 · flagged [[B-03 Two refreshes at once both succeed and fork the session]]: fixed on backend main @ 504cb21 (branch B-03/auth/single-use-refresh-race, commit abbc9a8): the old row is revoked by a conditional write (revokedAt null, not expired) before the replacement is written, so the loser of a concurrent refresh gets 401 E_AUTH_04 and no new token; ready for re-test of QB-05 row B42
- 2026-11-05 · flagged [[B-04 Sign-up accepts an email and a phone together]]: fixed on backend main @ 504cb21 (branch B-04/auth/sign-up-exactly-one-destination, commit f086aa5): sign-up with both an email and a phone answers 400 E_AUTH_07 before any query; ready for re-test of QB-05 row B5
- 2026-11-05 · flagged [[B-05 Expired onboarding token answers 401, not the documented 400]]: fixed on backend main @ 504cb21 (branch B-05/auth/onboarding-token-400, commit 195f26c): an expired, forged or wrong-scope onboarding token on complete-registration answers 400 E_AUTH_05, as BI-02 documents; ready for re-test of QB-05 row B30
- 2026-11-05 · flagged [[B-06 Timestamps the app writes are stored shifted by the server time zone]]: fixed, ready for re-test: the fix is on backend main since 26958cd (branch B-06/prisma/utc-session-timezone) and is unchanged at 504cb21; src/prisma/pg-adapter.spec.ts passes on 504cb21. Re-run QB-05 row B15 by ageing a code with Postgres now()
- 2026-11-05 · branches `FR-02/auth/refresh-suspended-401` (`d1f769e`) and `FR-02/profile/pin-name-race-409` (`b719b71`), merged to `main @ 8997be1` · the last two `pending` asks of [[FR-02 Auth & Sign-up Frontend Requirements]] shipped: `POST /auth/refresh` for a non-ACTIVE account answers 401 `E_AUTH_03` "Account is not active" instead of 403; a Pin name lost to a concurrent claim answers 409 `E_PROFILE_02` instead of 500 on `complete-registration`, `POST /profiles` and `PATCH /profiles/:id`, through `isUniqueViolation` in `src/common/utils/prisma-errors.ts`. Specs: `auth.service.spec.ts`, `profile.service.spec.ts`, `prisma-errors.spec.ts` (244 tests pass). Checked live on localhost: the suspended refresh is 401 with the same body as `GET /users/me`; 5 of 5 races are 201 + 409 with one profile holding the name, against 201 + 500 in 4 of 5 on `504cb21`. `pending` cleared; no bug cards existed for either. Flagged [[BI-02 Auth & Sign-up Backend Integration]] (updated), [[FD-04 Account Frontend Delivery]], [[QF-04 Account QA Frontend]] and [[QB-05 Auth & Sign-up QA Backend]] (rows to add).
- 2026-11-05 · branch `D-30/auth/fifth-wrong-try-locks` (`6d874e2`), merged to `main @ ce2a2e8` · ships [[D-30 The fifth wrong code try locks the code]]: `AuthService.consumeCode` counts a wrong guess with an atomic increment and, on the guess that brings the count to five, burns the code and answers 429 `E_AUTH_06` "Too many attempts. Request a new code." itself (it was the next submission); a code already at the limit is still burned on sight. Both purposes (`verify-code`, `login/verify`). Shipped in the same change as the decision, so it never sat in `pending`. Specs: `auth.service.spec.ts` (247 tests pass). Checked live on localhost for a sign-up code and a login code: 400 ×4, then 429 on the fifth wrong guess, then the right code refused (400); a resent code verifies. Updated [[BI-02 Auth & Sign-up Backend Integration]]; [[QB-05 Auth & Sign-up QA Backend]] B14 and B36 to re-run.
