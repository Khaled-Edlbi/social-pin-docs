---
type: frontend
id: auth
feature: auth
domain: identity
screens: [s01, s02, s06, s08, s68]
updated: 2026-10-15
tags: [frontend, domain/identity]
---

# 📱 Auth & Sign-up · Frontend

**Feature note:** [[Auth & Sign-up]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]], [[Auth Model]]

What the client builds: the welcome and verify screens, the claim-your-Pin step, the password step, login, a token store that handles rotation, and the password reset and change flows.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s01\|s01]] Welcome | enters email or phone | `POST /auth/sign-up` (new) · `POST /auth/login` (returning, with password) |
| [[Screen Index#s02\|s02]] Verify | types the 6-digit code; taps resend | `POST /auth/verify-code` · `POST /auth/request-code` |
| [[Screen Index#s06\|s06]] Claim your Pin | types a handle, sees it is free | `GET /profiles/pin-name/:pinName/availability` (public, debounced) |
| s06 → [[Screen Index#s08\|s08]] | sets the password, submits | `POST /auth/complete-registration` → session; the default Ring now exists |
| [[Screen Index#s68\|s68]] Me / Account | change password, sign out, sign out everywhere | `POST /auth/change-password` · `POST /auth/logout` · `POST /auth/logout-everywhere` |
| Forgot password | destination → code → new password | `request-code` (`PASSWORD_RESET`) → `verify-code` → `POST /auth/reset-password` |

## Flow · sign-up (three calls, in order)

1. **`POST /auth/sign-up`** with `{ email }` or `{ phone }`. Exactly one: neither is a 400 `E_AUTH_07`. Phone is E.164 with the country code.
   → `201 { destination, channel: "EMAIL" | "PHONE", expiresAt }`. The code lives 10 minutes; run the resend timer from `expiresAt`. In a development environment the body also has `devCode`: use it to fill the field automatically on a dev build, never require it.
   Re-submitting for an address that is still PENDING re-issues the code (no error). An address that already finished sign-up is a 409 `E_AUTH_01`: offer login.
2. **`POST /auth/verify-code`** with `{ destination, code, purpose: "SIGN_UP" }`.
   → `201 { onboardingToken, purpose, expiresIn: "15m" }`. Keep the token in memory for the length of the form. It is not a session and every API route rejects it.
   Wrong code: 400 `E_AUTH_05`, counter incremented. Sixth wrong guess: 429 `E_AUTH_06`, the code is burned and the only way on is resend. Expired code: 400 `E_AUTH_05` too, so show "invalid or expired" and the resend button.
3. **Pin name check** while the user types: `GET /profiles/pin-name/:pinName/availability` → `{ pinName, available }`. Send the handle without the `!`. Rules: 3 to 30 characters, letters, digits, `.` and `_`. Uniqueness ignores case (`SaraAz` and `saraaz` are the same handle); the original casing is kept for display. The answer never says who holds a taken name.
4. **`POST /auth/complete-registration`** with `{ onboardingToken, password, pinName, fullName? }`. Password 10 to 72 characters; `fullName` up to 120.
   → `201 { accessToken, refreshToken, tokenType: "Bearer", expiresIn: "15m" }`. One transaction set the password and created the profile, the default Ring and its projection, so the app can go straight to Home.
   409 `E_AUTH_08`: this account is already set up → login. 409 `E_PROFILE_02`: the handle was taken between the check and the submit → back to s06. 400 `E_AUTH_05`: the onboarding token is expired or was issued for another purpose → back to s02.

## Flow · login

`POST /auth/login` with `{ identifier, password }`. The identifier is an email or an E.164 phone; the server tells them apart by the `@`. → `201` session pair.

401 `E_AUTH_02` covers both "no such account" and "wrong password": show one message. 403 `E_AUTH_03`: the account is suspended or not active.

## Sessions and the token store

| Token | Lifetime | Send as | Only for |
|---|---|---|---|
| `accessToken` | 15 min | `Authorization: Bearer` | every API call |
| `refreshToken` | 7 days | `Authorization: Bearer` | `POST /auth/refresh` and `POST /auth/logout` |

- **Refresh is single-use.** `POST /auth/refresh` with the *refresh* token as bearer returns a new pair and kills the one sent, in the same transaction. Persist the new pair atomically; the old refresh token is worthless the moment the response arrives.
- **Serialise refreshes.** Keep one in-flight refresh promise; every request that got a 401 waits on it and retries once with the new access token. Two concurrent refreshes end the session.
- 401 `E_AUTH_04` from `/auth/refresh` means sign in again. Rotated, revoked, expired and forged tokens all give this one answer.
- A SUSPENDED account gets 401 `E_AUTH_03` on its next call, not after the access token expires: treat it as a sign-out, do not refresh.
- `POST /auth/logout` takes the **refresh** token as bearer, `POST /auth/logout-everywhere` the access token. Both return 201 with no body. Logout is idempotent.
- `POST /auth/change-password` with `{ currentPassword, newPassword }` (400 `E_USER_04` when the current one is wrong) and `POST /auth/reset-password` both revoke every session, the caller's included. Clear the store and go to login afterwards.
- Sending the access token to `/auth/refresh`, or the refresh token to any other route, is a 401 `E_AUTH_04`: the scopes are checked.

## Flow · password reset

```
POST /auth/request-code   { destination, purpose: "PASSWORD_RESET" }   → 201 challenge
POST /auth/verify-code    { destination, code, purpose: "PASSWORD_RESET" } → 201 { onboardingToken }
POST /auth/reset-password { onboardingToken, password }                 → 201, no body
```

`request-code` returns the same 201 whether or not the account exists. Word the screen as "if an account exists, a code is on its way", never as a confirmation.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 400 | `E_AUTH_07` | sign-up with neither or both of email / phone | form validation |
| 409 | `E_AUTH_01` | sign-up for an address that already completed registration | "Already registered, sign in" |
| 400 | `E_AUTH_05` | wrong, expired or consumed code; onboarding token expired or for another purpose | "Invalid or expired code" + resend |
| 429 | `E_AUTH_06` | too many wrong guesses; the code is burned | "Request a new code" |
| 409 | `E_AUTH_08` | complete-registration on an account that already has a password | go to login |
| 409 | `E_PROFILE_02` | pin name taken at the last moment | back to the Pin step |
| 401 | `E_AUTH_02` | login: unknown account or wrong password | one message |
| 403 / 401 | `E_AUTH_03` | account not active (login) / suspended (any call) | sign-out state |
| 401 | `E_AUTH_04` | refresh token rotated, revoked, expired or wrong scope | sign in again |
| 400 | `E_USER_04` | change-password with a wrong current password | inline error |

Until [[T-063 Put the ErrorCode on the error body]] ships, the wire body carries `statusCode`, `message` and `error` but **not** `ErrorCode`; branch on status and endpoint, and keep `message` display-only. See [[Error Contract]].

## Rules the UI must respect

- Never persist the onboarding token or `devCode`. Never depend on `devCode`: it is absent outside development.
- One failure message for login. Do not add "this email is not registered" from any signal.
- The password step exists. The design's welcome screen (s01) promises a login without a password; that is [[D-01 Passwordless login]], undecided. Build the password step as the backend requires today.
- `fullName` is optional at registration and is the only profile field set there. Everything else (bio, photo, links) is per Ring: see [[Ring Projection Frontend]].

## Not available yet

- **Code delivery.** No email or SMS provider is wired ([[T-001 Wire an email provider for one-time codes]], [[T-002 Wire an SMS provider for one-time codes]]). Against a dev server use `devCode`; against production the flow cannot be completed yet. See [[Code Delivery]].
- Social login ([[T-019 LinkedIn OAuth link, unlink, login]]), passwordless login ([[D-01 Passwordless login]]), device registration on login ([[T-014 Register devices on login; list and remove]]).

## Checklist

- [ ] Sign-up form accepts email **or** phone, with E.164 formatting for phone.
- [ ] Verify screen: 6-digit input, resend timer from `expiresAt`, handles 400 / 429 as above.
- [ ] Pin step: debounced availability check, client-side regex, `!` shown as decoration only.
- [ ] Password step: 10 to 72 characters.
- [ ] Token store: atomic pair replacement, one in-flight refresh, 401 retry once.
- [ ] Logout sends the refresh token; logout-everywhere the access token.
- [ ] Change / reset password clears the store and returns to login.
- [ ] No message anywhere reveals whether an address is registered.
