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

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

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
