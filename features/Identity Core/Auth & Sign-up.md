---
type: feature
id: auth
name: "Auth & Sign-up"
status: done
priority: P0
domain: identity
screens: [s01, s02, s06, s08, s68]
updated: 2026-10-18
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ Auth & Sign-up

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

Sign up with email or phone, verify the one-time code, finish registration with a Pin name, sign in with a one-time code, refresh, log out, log out everywhere. **Passwordless** since 2026-10-15 ([[D-01 Passwordless login]]); client changes in [[Frontend Passwordless Migration]].

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s01|s01]] | Welcome | "No password to remember" — implemented (D-01) |
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
- `POST /auth/login/verify`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/logout-everywhere`

**Tables / models:** `User`, `VerificationCode`, `RefreshToken`, `UserRole`

**Code:** `src/modules/auth/`, `src/modules/auth/strategies/jwt.strategy.ts`

### What exists

- Three-call sign-up: `sign-up` → `verify-code` → `complete-registration` (pin name, no password). The last call activates the account and creates the profile, the default Ring and its projection in **one transaction**.
- Two-call sign-in: `login { identifier }` issues a LOGIN code, `login/verify { identifier, code }` returns the session. `request-code` resends `SIGN_UP` or `LOGIN` codes.
- No password anywhere: `users.password_hash` dropped, `reset-password` and `change-password` removed, `PASSWORD_RESET` / `E_AUTH_02` / `E_USER_04` retired.
- Three token scopes (`access`, `refresh`, `onboarding`); the `scope` claim is checked, so an onboarding token is never a session.
- Refresh tokens rotate, are stored bcrypt-hashed (the `jti`, not the JWT), and are revoked in the same transaction that issues the replacement.
- `JwtStrategy` re-reads the user on every request, so a SUSPENDED account loses access at once.
- Account enumeration is resisted: `login` and `request-code` answer an unknown destination with the same challenge shape (no `devCode`, no code stored).
- The 5-wrong-attempts limit commits in its own transaction, so it actually triggers (it was rolled back with the error before).

### Gaps

- Code delivery is not wired, see [[Code Delivery]]. Until it is, `devCode` is returned in every environment.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-056 Decide passwordless login]] | ✅ Done | P0 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "auth" SORT priority ASC
```

## Decisions

- [[D-01 Passwordless login]] — decided, code-only login

## Related

- [[Account]]
- [[Profiles & Pin Name]]
- [[Rings]]
- [[Code Delivery]]
- [[Linked Accounts (OAuth)]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
