---
type: project
created: 2026-10-15
updated: 2026-10-28
related: ["B-02 Deleted account answers 401, not the documented 404 E_USER_01", E_USER_01, E_AUTH_03]
tags: [project]
layer: backend
---

# Auth Model

As implemented. Feature note: [[F-02 Auth & Sign-up]]. Decided: [[ND-01 Passwordless login]] (code-only, 2026-10-15). Client-facing changes: [[Frontend Passwordless Migration]].

**There is no password anywhere.** Every sign-in is a 6-digit OTP. `users.password_hash` was dropped (`20261015120000_drop_password_hash`); `VERIFICATION_PURPOSE.PASSWORD_RESET`, `E_AUTH_02` and `E_USER_04` are retired and must not be reused.

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
| onboarding | `onboarding` | 15 min | only `complete-registration` |

`JwtStrategy` rejects anything whose scope is not exactly `access`, and **re-reads the user on every request**, so a SUSPENDED account loses access at once (401 `E_AUTH_03`). A DELETED account, or a `sub` with no row, answers **404 `E_USER_01`** on every route instead, so the client can tell "deleted" from "suspended" ([[B-02 Deleted account answers 401, not the documented 404 E_USER_01]]).

**What is hashed is the refresh JWT's `jti`, never the JWT.** bcrypt ignores input past 72 bytes, and the first 72 bytes of a refresh JWT are identical for every token a user holds. Hashing the JWT made every live row match every token, so rotation and revocation silently did nothing. Fixed and regression-tested 2026-10-07; `REFRESH_TOKEN_BYTES = 48` keeps the `jti` under the limit.

## Sign-up (three calls, in order)

```
POST /auth/sign-up               → PENDING user + OTP        (public)
POST /auth/verify-code           → onboarding token, 15 min  (public)
POST /auth/complete-registration → pinName                   (public)
     └─ one transaction: activate, profile, default Ring, Ring projection
```

`complete-registration` is `@Transactional` as a whole: an ACTIVE account with no default Ring has nothing for a scanned QR to resolve to, and that is the one state this flow must never leave behind.

## Sign-in (two calls)

```
POST /auth/login          → LOGIN OTP                            (public)
POST /auth/login/verify   → session; 403 E_AUTH_03 unless ACTIVE (public)
```

`request-code` resends a `SIGN_UP` or `LOGIN` code; a new code replaces the previous one. Codes live 10 minutes and burn after 5 wrong attempts (`429 E_AUTH_06`); the attempt counter commits in its own transaction (`Propagation.RequiresNew`) so a thrown error cannot roll it back.

## Enumeration resistance

`login` and `request-code` return a challenge of the same shape for an unknown destination, with no `devCode` and no code stored; the Pin-name availability check never says who holds a name; the `/views` 404 is identical for missing, not shared and blocked.

## Not wired

OTP delivery: `AuthService.issueCode` logs the code (`TODO(delivery)`). Because nothing is delivered, `sign-up`, `login` and `request-code` return the plaintext code as `devCode` **in every environment** (product decision, 2026-10-15), so the app can sign in before a provider exists. While it is returned, anyone who knows an account's email or phone can sign in as it. Delete `devCode` from `AuthService.issueCode` and `VerificationChallengeEntity` when delivery is wired. See [[F-32 Code Delivery]].
