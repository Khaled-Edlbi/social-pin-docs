---
type: project
updated: 2026-10-15
tags: [project]
---

# Auth Model

As implemented. Feature note: [[Auth & Sign-up]]. Open question: [[D-01 Passwordless login]].

## Guarding

- `@AuthenticatedController({ controller })` applies `AuthGuard` + `@ApiBearerAuth()`. Controllers are guarded **by default**; a public route is a deliberate, greppable `@Public()`.
- `@AuthorizedApi({ api, url, role })` wires method, `RolesGuard`, `@ApiOperation` and status code (`POST` → 201).
- **`role: []` means "any authenticated user"**, not "no auth".
- `USER_ROLE` on the JWT is the platform-level role. `roles` / `user_roles` hold **scoped** roles (event, business, ring), checked per resource by services, never by `RolesGuard`.

## Tokens

| Token | Scope claim | Lifetime | Used for |
|---|---|---|---|
| access | `access` | 15 min | every API call |
| refresh | `refresh` | 7 days | only `/auth/refresh` and `/auth/logout`; **rotating, single-use**, stored bcrypt-hashed |
| onboarding | `onboarding` | 15 min | only `complete-registration` / `reset-password` |

`JwtStrategy` rejects anything whose scope is not exactly `access`, and **re-reads the user on every request**, so a SUSPENDED account loses access at once.

**What is hashed is the refresh JWT's `jti`, never the JWT.** bcrypt ignores input past 72 bytes, and the first 72 bytes of a refresh JWT are identical for every token a user holds. Hashing the JWT made every live row match every token, so rotation and revocation silently did nothing. Fixed and regression-tested 2026-10-07; `REFRESH_TOKEN_BYTES = 48` keeps the `jti` under the limit.

## Sign-up (three calls, in order)

```
POST /auth/sign-up               → PENDING user + OTP        (public)
POST /auth/verify-code           → onboarding token          (public)
POST /auth/complete-registration → password + pinName        (public)
     └─ one transaction: password, profile, default Ring, Ring projection
```

The password comes after the code because the brief (§3.1) says so. `complete-registration` is `@Transactional` as a whole: an account with a password but no default Ring has nothing for a scanned QR to resolve to.

## Enumeration resistance

One body for all login failures; a bcrypt compare even against a missing account; `request-code` returns a challenge for unknown destinations; the Pin-name availability check never says who holds a name; the `/views` 404 is identical for missing, not shared and blocked.

## Not wired

OTP delivery: `AuthService.issueCode` logs the code (`TODO(delivery)`). In `development`, `test` and `local` the code is also returned as `devCode`. The gate is an allow-list, not `!== 'production'`, so a misspelled `NODE_ENV` withholds the credential. See [[Code Delivery]].
