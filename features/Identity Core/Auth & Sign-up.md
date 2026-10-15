---
type: feature
id: auth
name: "Auth & Sign-up"
status: done
priority: P0
domain: identity
screens: [s01, s02, s06, s08, s68]
updated: 2026-10-15
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ Auth & Sign-up

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]] · **Frontend guide:** [[Auth & Sign-up Frontend]]

Sign up with email or phone, verify the one-time code, finish registration with a password and Pin name, log in, refresh, log out, log out everywhere, change or reset the password.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s01|s01]] | Welcome | Promises no password → D-01 |
| [[Screen Index#s02|s02]] | Verify | Resend timer, expired code |
| [[Screen Index#s06|s06]] | Claim your Pin | Availability check done; yearly rename + suggestions → D-06 |
| [[Screen Index#s08|s08]] | First Ring | Default Ring is created by complete-registration |
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `POST /auth/sign-up`
- `POST /auth/request-code`
- `POST /auth/verify-code`
- `POST /auth/complete-registration`
- `POST /auth/login`
- `POST /auth/reset-password`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/logout-everywhere`
- `POST /auth/change-password`

**Tables / models:** `User`, `VerificationCode`, `RefreshToken`, `UserRole`

**Code:** `src/modules/auth/`, `src/modules/auth/strategies/jwt.strategy.ts`

## How it works

**Sign-up, three calls.** `POST /auth/sign-up` creates (or reuses) a `PENDING` user and a `VerificationCode` row in one transaction; the code is 6 random digits, bcrypt-hashed, 10 minutes long, and in `development` / `test` / `local` also returned as `devCode`. `POST /auth/verify-code` finds the newest unconsumed code for that destination and purpose, burns it after 5 wrong guesses (429 `E_AUTH_06`), marks the destination verified on a match and signs a 15-minute **onboarding token** (scope `onboarding`). `POST /auth/complete-registration` verifies that token's purpose is `SIGN_UP`, refuses an account that already has a password (409 `E_AUTH_08`), then in **one transaction** sets the password, creates the initial profile (`ProfileService`), the default Ring (`RingService`) and its projection (`RingProfileService`), and issues the session pair. A partial result here is the one state the flow must never leave behind.

**Login.** `POST /auth/login` resolves the identifier (an `@` means email, else E.164 phone), compares the password even when no user exists (constant-time answer), rejects a non-`ACTIVE` account with 403 `E_AUTH_03`, records `lastLoginAt` and issues tokens.

**Tokens.** `TokenService` signs a 15-minute access JWT (scope `access`) and a 7-day refresh JWT (scope `refresh`) whose `jti` is 48 random bytes; only the `jti` is bcrypt-hashed into `refresh_tokens`. `POST /auth/refresh` (refresh token as bearer, its own guard) finds the live row by comparing the `jti` against the user's live rows, revokes it and writes the replacement in one transaction: each refresh token works once; a replay is 401 `E_AUTH_04`. `JwtStrategy` rejects any scope but `access` and re-reads the user on every request, so a suspended account is out immediately (401 `E_AUTH_03`).

**Resend and reset.** `POST /auth/request-code` returns a plausible challenge whether or not the destination exists and issues a code only for a real account. `POST /auth/reset-password` takes a `PASSWORD_RESET` onboarding token, sets the password and revokes every session; `POST /auth/change-password` requires the current password (400 `E_USER_04`) and does the same. `POST /auth/logout` revokes the presented refresh token; `logout-everywhere` revokes all of them.

**Delivery.** `AuthService.issueCode` logs the code at the `TODO(delivery)` line; no provider is wired ([[Code Delivery]]).

### What exists

- Three-call sign-up: `sign-up` → `verify-code` → `complete-registration`. The last call creates the profile, the default Ring and its projection in **one transaction**.
- Three token scopes (`access`, `refresh`, `onboarding`); the `scope` claim is checked, so an onboarding token is never a session.
- Refresh tokens rotate, are stored bcrypt-hashed (the `jti`, not the JWT), and are revoked in the same transaction that issues the replacement.
- `JwtStrategy` re-reads the user on every request, so a SUSPENDED account loses access at once.
- Account enumeration is resisted: one login failure body, a bcrypt compare even for a missing account, `request-code` answers for unknown destinations too.

### Gaps

- Code delivery is not wired, see [[Code Delivery]].
- The design's welcome screen (s01) promises login **without** a password. See [[D-01 Passwordless login]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-056 Decide passwordless login]] | ❓ Needs a decision / info | P0 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "auth" SORT priority ASC
```

## Open decisions

- [[D-01 Passwordless login]]

## Related

- [[Account]]
- [[Profiles & Pin Name]]
- [[Rings]]
- [[Code Delivery]]
- [[Linked Accounts (OAuth)]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
