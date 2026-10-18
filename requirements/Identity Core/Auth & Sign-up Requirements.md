---
type: requirements
id: auth
feature: auth
status: draft
domain: identity
screens: [s01, s02, s06, s08, s68]
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/identity]
---

# Auth & Sign-up · Frontend Requirements

**Feature:** [[Auth & Sign-up]] · **Status:** Draft · **Story:** [[Auth & Sign-up Story]] · **API Integration:** [[Auth & Sign-up Frontend]]

What the client needs from the backend to build the welcome, verify, Pin, first-Ring and account-security screens, and whether each need is met today. Request and response shapes, the token store and the refresh rules are in [[Auth & Sign-up Frontend]] and [[Auth Model]].

## Per screen

### [[Screen Index#s01|s01]] Welcome

- Needs: start a sign-up with one destination; start a login with identifier and password; a LinkedIn entry; one failure message for login; a hint when the address is already registered.
- Actions: Continue with Email, Continue with Phone, Continue with LinkedIn, Sign in.
- States: invalid email / number (client), submitting, "already registered" (409), "not active" (403).
- Source today: `POST /auth/sign-up`, `POST /auth/login`. LinkedIn: not yet.

### [[Screen Index#s02|s02]] Verify

- Needs: verify a code for `SIGN_UP` or `PASSWORD_RESET`; a resend; the expiry instant for the timer; the onboarding token for the next step.
- Actions: type six digits, Resend, Use a different email.
- States: code sent, wrong / expired (400), too many attempts (429), timer running / elapsed, dev pre-fill.
- Source today: `POST /auth/verify-code`, `POST /auth/request-code`; `expiresAt` and `devCode` from the sign-up / request-code response.

### [[Screen Index#s06|s06]] Claim your Pin

- Needs: live availability of a handle; completion of registration with password, Pin name and optional full name; a session afterwards.
- Actions: type the handle, set the password, Continue.
- States: checking, available, taken, invalid format, taken-at-submit (409), token expired (400).
- Source today: `GET /profiles/pin-name/:pinName/availability` (public), `POST /auth/complete-registration`.

### [[Screen Index#s08|s08]] First Ring

- Needs: the default Ring created at registration, by name and colour.
- Source today: `GET /rings` (default first).

### [[Screen Index#s68|s68]] Me / Account (security rows)

- Needs: change password, sign out, sign out everywhere.
- Source today: `POST /auth/change-password`, `POST /auth/logout`, `POST /auth/logout-everywhere`.

### Forgot password (no prototype screen)

- Needs: request a reset code, verify it, set a new password.
- Source today: `POST /auth/request-code` (`PASSWORD_RESET`), `POST /auth/verify-code`, `POST /auth/reset-password`.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Start sign-up, get a code | `POST /auth/sign-up` | ✅ | — |
| Resend or request a reset code | `POST /auth/request-code` | ✅ | — |
| Verify a code, get an onboarding token | `POST /auth/verify-code` | ✅ | — |
| Set password + Pin name, create the default Ring | `POST /auth/complete-registration` | ✅ | — |
| Live Pin-name availability | `GET /profiles/pin-name/:pinName/availability` | ✅ | — (listed under [[Profiles & Pin Name]]) |
| Login | `POST /auth/login` | ✅ | — |
| Rotate the session | `POST /auth/refresh` | ✅ | — |
| Sign out this device | `POST /auth/logout` | ✅ | — |
| Sign out everywhere | `POST /auth/logout-everywhere` | ✅ | — |
| Change password | `POST /auth/change-password` | ✅ | — |
| Reset password with a code | `POST /auth/reset-password` | ✅ | — |
| Code actually delivered by email | — | ❌ | [[T-001 Wire an email provider for one-time codes]] |
| Code actually delivered by SMS | — | ❌ | [[T-002 Wire an SMS provider for one-time codes]] |
| `devCode` retired from the response | — | ❌ | [[T-003 Remove devCode once delivery works]] |
| Login without a password (s01 copy) | — | ❌ | [[D-01 Passwordless login]] |
| Continue with LinkedIn | — | ❌ | [[T-019 LinkedIn OAuth link, unlink, login]] |
| Register the device on login | — | ❌ | [[T-014 Register devices on login; list and remove]] |

## Behaviour expectations

- Refetch / realtime: none; every step is a request-response. After `complete-registration` and `login`, fetch `GET /users/me`, `GET /profiles` and `GET /rings` once to seed the shell.
- Caching keys: none for auth responses. The session pair lives in secure storage keyed by nothing else; the onboarding token and `devCode` live in memory only.
- Pagination / ordering: none.
- Token store: atomic pair replacement; one in-flight refresh promise; retry a 401 once; `E_AUTH_04` from refresh clears the store.
- Timers: the resend countdown runs from the server's `expiresAt`, not from a client-side 10 minutes.
- Scopes: the refresh token goes only to `/auth/refresh` and `/auth/logout`; the access token everywhere else.
- Logout: clear the store even when the request fails; logout is idempotent server-side.
- Change / reset password: on 201 clear the store and go to login, because every session (this one included) is revoked.
- Enumeration: no copy, timing or styling difference anywhere reveals whether an address is registered. `request-code` for a reset is phrased conditionally.
- Environment: `devCode` is present only in `development` / `test` / `local`; a build must work when it is absent.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 400 | `E_AUTH_07` | form validation: one of email or phone |
| 409 | `E_AUTH_01` | "Already registered, sign in" |
| 400 | `E_AUTH_05` | "Invalid or expired code" + resend; on complete-registration: back to s02 |
| 429 | `E_AUTH_06` | "Request a new code"; input locked |
| 409 | `E_AUTH_08` | go to login |
| 409 | `E_PROFILE_02` | "That Pin name was just taken", stay on s06 |
| 401 | `E_AUTH_02` | one login failure message |
| 403 / 401 | `E_AUTH_03` | "This account is not active"; sign-out state |
| 401 | `E_AUTH_04` | sign in again |
| 400 | `E_USER_04` | "Current password is incorrect", inline |
| 400 | — (validation; `message` is a string array) | inline field errors |

Until [[T-063 Put the ErrorCode on the error body]] ships, branch on status and endpoint; the body carries no `ErrorCode`.

## Blocked by

- [[D-01 Passwordless login]] — the s01 copy and whether s06 keeps the password field. Build the password step as the backend requires today.
- [[T-001 Wire an email provider for one-time codes]], [[T-002 Wire an SMS provider for one-time codes]] — the flow cannot complete against production until a code is delivered; development uses `devCode`.
