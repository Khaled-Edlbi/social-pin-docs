---
id: BD-02
type: backend-delivery
module: identity
feature: auth
status: done
scope: feature
screens: [s01, s02, s06, s08, s68]
related: ["B-02 Deleted account answers 401, not the documented 404 E_USER_01", E_USER_01, "B-06 Timestamps the app writes are stored shifted by the server time zone", "Database & Migrations"]
pending: ["[[FR-02 Auth & Sign-up Frontend Requirements]]: an expired or forged onboarding token on complete-registration answers the documented status, not 401 (B-05)", "[[FR-02 Auth & Sign-up Frontend Requirements]]: a refused refresh for a SUSPENDED account is 401, not 403, so the client's refused-refresh path ends the session", "[[FR-02 Auth & Sign-up Frontend Requirements]]: two concurrent complete-registration calls claiming one free pin name answer 409 E_PROFILE_02, not 500 (the unique-index P2002 is not mapped)"]
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

**Sign-up, three calls.** `POST /auth/sign-up` creates (or reuses) a `PENDING` user and a `VerificationCode` row in one transaction; the code is 6 random digits, bcrypt-hashed, 10 minutes long, and returned as `devCode` on every issued code. `POST /auth/verify-code` (purpose always `SIGN_UP`) finds the newest unconsumed code for that destination, burns it after 5 wrong guesses (429 `E_AUTH_06`, committed in its own transaction so the limit holds), marks the destination verified on a match and signs a 15-minute **onboarding token** (scope `onboarding`). `POST /auth/complete-registration` verifies that token's purpose, refuses an account that already finished (409 `E_AUTH_08`), then in **one transaction** activates the account, creates the initial profile (`ProfileService`), the default Ring (`RingService`) and its projection (`RingProfileService`), and issues the session pair. A partial identity is the one state the flow must never leave behind.

**Sign-in, two calls.** `POST /auth/login { identifier }` resolves the identifier (an `@` means email, else E.164 phone) and issues a `LOGIN` code; for an unknown identifier it returns the same challenge shape with no `devCode` and stores nothing. `POST /auth/login/verify { identifier, code }` checks the code with the same rules, refuses a non-`ACTIVE` account with 403 `E_AUTH_03` (PENDING and SUSPENDED share the message), records `lastLoginAt` and issues the session pair. There is no password: `users.password_hash` was dropped and `reset-password` / `change-password` removed ([[ND-01 Passwordless login]]).

**Tokens.** `TokenService` signs a 15-minute access JWT (scope `access`) and a 7-day refresh JWT (scope `refresh`) whose `jti` is 48 random bytes; only the `jti` is bcrypt-hashed into `refresh_tokens`. `POST /auth/refresh` (refresh token as bearer, its own guard) finds the live row by comparing the `jti` against the user's live rows, revokes it and writes the replacement in one transaction: each refresh token works once; a replay is 401 `E_AUTH_04`. `JwtStrategy` rejects any scope but `access` and re-reads the user on every request, so a suspended account is out immediately (401 `E_AUTH_03`).

**Resend and sign-out.** `POST /auth/request-code` (`SIGN_UP` or `LOGIN`) issues a replacement code for a real account and a plausible challenge for an unknown destination. `POST /auth/logout` revokes the presented refresh token; `logout-everywhere` revokes all of them, the caller's included.

**Times.** A code's `expires_at` and `consumed_at`, a refresh token's expiry and `lastLoginAt` are stored as the instant they claim to be, so Postgres's `now()` and any raw query agree with the API: every database session runs in UTC ([[Database & Migrations#Prisma 7 rules]], [[B-06 Timestamps the app writes are stored shifted by the server time zone]]).

**Delivery.** `AuthService.issueCode` logs the code at the `TODO(delivery)` line and returns it as `devCode` in every environment; no provider is wired ([[F-32 Code Delivery]]).

### What exists

- Three-call sign-up: `sign-up` → `verify-code` → `complete-registration` (pin name, no password). The last call activates the account and creates the profile, the default Ring and its projection in **one transaction**.
- `sign-up` takes exactly one of email and phone: neither **or both** is 400 `E_AUTH_07`, rejected in `UserService.findOrCreatePending` before any query, so a second, unverified address is never stored ([[B-04 Sign-up accepts an email and a phone together]]).
- Two-call sign-in: `login { identifier }` issues a LOGIN code, `login/verify { identifier, code }` returns the session. `request-code` resends `SIGN_UP` or `LOGIN` codes.
- No password anywhere: `users.password_hash` dropped, `reset-password` and `change-password` removed, `PASSWORD_RESET` / `E_AUTH_02` / `E_USER_04` retired.
- Three token scopes (`access`, `refresh`, `onboarding`); the `scope` claim is checked, so an onboarding token is never a session.
- Refresh tokens rotate, are stored bcrypt-hashed (the `jti`, not the JWT), and are revoked in the same transaction that issues the replacement. The revoke is a conditional write (`revokedAt: null`, not expired) that runs before the replacement is written, so of two concurrent refreshes with one token exactly one wins; the other gets the same 401 `E_AUTH_04` as a replay and writes no row ([[B-03 Two refreshes at once both succeed and fork the session]]).
- `JwtStrategy` re-reads the user on every request, so a SUSPENDED account loses access at once (401 `E_AUTH_03`), and a DELETED one answers 404 `E_USER_01` ([[B-02 Deleted account answers 401, not the documented 404 E_USER_01]]).
- Account enumeration is resisted: `login` and `request-code` answer an unknown destination with the same challenge shape (no `devCode`, no code stored).
- The 5-wrong-attempts limit commits in its own transaction, so it actually triggers (it was rolled back with the error before).

### Gaps

- Code delivery is not wired, see [[F-32 Code Delivery]]. Until it is, `devCode` is returned in every environment.
- Asks of [[FR-02 Auth & Sign-up Frontend Requirements]] not met by `main @ 26958cd`, carried in `pending:` (checked against the code 2026-11-05):
  - An expired or forged onboarding token on `complete-registration` answers 401 `E_AUTH_05` (`TokenService.verifyOnboardingToken`), not the documented 400 ([[B-05 Expired onboarding token answers 401, not the documented 400]]).
  - `POST /auth/refresh` for a SUSPENDED account answers **403** `E_AUTH_03` (`AuthService.refresh`), while FR-02 ends the session on a refused refresh by its 401.
  - Two concurrent `complete-registration` calls with the same free pin name: both pass `assertPinNameFree`, the second insert hits the unique index and Prisma's `P2002` is not mapped, so it answers 500 instead of 409 `E_PROFILE_02`.

## Log

- 2026-10-18 · split out of [[F-02 Auth & Sign-up]] when the vault moved to layers
- 2026-10-29 · branch `B-06/prisma/utc-session-timezone`, merged to `main @ 26958cd` · fixes [[B-06 Timestamps the app writes are stored shifted by the server time zone]]: every Postgres session is pinned to UTC (`createPgAdapter` in `src/prisma/pg-adapter.ts`, used by `PrismaService` and the seed), so a sign-up code's `expires_at` is 10 minutes after Postgres's `now()` on a UTC+3 server, not 2 h 50 min before it. No endpoint, shape or error changed. Specs: `src/prisma/pg-adapter.spec.ts`, and `test/timestamps.e2e-spec.ts` (fails with 10 800 s of drift without the fix on an `Asia/Damascus` server, passes with it). Rows stored before the fix are not corrected ([[Database & Migrations#Prisma 7 rules]]). Flagged [[B-06 Timestamps the app writes are stored shifted by the server time zone]] and [[QB-05 Auth & Sign-up QA Backend]] (row B15 to re-run); the B-06 half of QB-05's flag on this note is cleared, the B-03 half stays.
- 2026-11-05 · vault branch `tickets/backend/M-01-identity/F-02-auth/FR-02-accepted` · [[FR-02 Auth & Sign-up Frontend Requirements]] accepted by the backend (approved by khaled); this note stays `done` with five `pending` asks (B-03, B-04, B-05, refresh 403 for a suspended account, the pin-name race 500), listed under *Gaps*. No code changed.
- 2026-11-05 · flagged [[B-03 Two refreshes at once both succeed and fork the session]]: fixed on backend main @ 504cb21 (branch B-03/auth/single-use-refresh-race, commit abbc9a8): the old row is revoked by a conditional write (revokedAt null, not expired) before the replacement is written, so the loser of a concurrent refresh gets 401 E_AUTH_04 and no new token; ready for re-test of QB-05 row B42
- 2026-11-05 · flagged [[B-04 Sign-up accepts an email and a phone together]]: fixed on backend main @ 504cb21 (branch B-04/auth/sign-up-exactly-one-destination, commit f086aa5): sign-up with both an email and a phone answers 400 E_AUTH_07 before any query; ready for re-test of QB-05 row B5
