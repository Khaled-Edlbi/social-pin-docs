---
type: backend-integration
code: auth
scope: feature
feature: auth
module: identity
status: current
screens: [s01, s02, s06, s08, s68]
created: 2026-10-15
updated: 2026-10-26
related: ["B-02 Deleted account answers 401, not the documented 404 E_USER_01", E_USER_01]
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Auth & Sign-up · Backend Integration

**Feature:** [[Auth & Sign-up]] · **Backend:** ✅ Done (passwordless since 2026-10-15, [[ND-01 Passwordless login]]) · **Read first:** [[Frontend Contract]], [[Auth Model]], [[Frontend Passwordless Migration]]

What the client builds: the welcome screen, one code-entry screen used by both sign-up and sign-in, the claim-your-Pin step, a token store that handles rotation, and sign-out. **There is no password anywhere**: not at sign-up, not at sign-in, not in account settings.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s01\|s01]] Welcome | enters email or phone | `POST /auth/sign-up` (new) · `POST /auth/login` (returning) |
| [[Screen Index#s02\|s02]] Verify | types the 6-digit code; taps resend | `POST /auth/verify-code` (sign-up) · `POST /auth/login/verify` (sign-in) · `POST /auth/request-code` (resend, either) |
| [[Screen Index#s06\|s06]] Claim your Pin | types a handle, sees it is free | `GET /profiles/pin-name/:pinName/availability` (public, debounced) |
| s06 → [[Screen Index#s08\|s08]] | submits the Pin name | `POST /auth/complete-registration` → session; the default Ring now exists |
| [[Screen Index#s68\|s68]] Me / Account | sign out, sign out everywhere | `POST /auth/logout` · `POST /auth/logout-everywhere` |

## Flow · sign-up (three calls, in order)

1. **`POST /auth/sign-up`** with `{ email }` or `{ phone }`. Exactly one: neither is a 400 `E_AUTH_07`. Phone is E.164 with the country code.
   → `201 { destination, channel: "EMAIL" | "PHONE", expiresAt, devCode }`. The code lives 10 minutes; run the resend timer and the "expired" state from `expiresAt`, never from a client constant.
   Re-submitting for an address that is still PENDING re-issues the code (no error). An address that already finished sign-up is a 409 `E_AUTH_01`: send them to sign-in.
2. **`POST /auth/verify-code`** with `{ destination, code, purpose: "SIGN_UP" }` (`purpose` is always `SIGN_UP` here; sign-in codes go to `login/verify`).
   → `201 { onboardingToken, purpose, expiresIn: "15m" }`. Keep the token in memory for the length of the form; it is not a session and every API route rejects it.
   Wrong or expired code: 400 `E_AUTH_05`. Sixth wrong guess: 429 `E_AUTH_06`, the code is burned and the only way on is resend.
3. **Pin name check** while the user types: `GET /profiles/pin-name/:pinName/availability` → `{ pinName, available }`. Send the handle without the `!`. Rules: 3 to 30 characters, letters, digits, `.` and `_`. Uniqueness ignores case; the original casing is kept for display. The answer never says who holds a taken name.
4. **`POST /auth/complete-registration`** with `{ onboardingToken, pinName, fullName? }` (`fullName` up to 120 characters). **No password field.**
   → `201 { accessToken, refreshToken, tokenType: "Bearer", expiresIn: "15m" }`. One transaction activated the account and created the profile, the default Ring and its projection, so the app can go straight to Home.
   409 `E_AUTH_08`: sign-up already completed → sign-in. 409 `E_PROFILE_02`: the handle was taken between the check and the submit → back to s06. 400 `E_AUTH_05`: the onboarding token expired or was issued for another purpose → back to s02.

## Flow · sign-in (two calls)

1. **`POST /auth/login`** with `{ identifier }`, an email or an E.164 phone. → `201 { destination, channel, expiresAt, devCode? }`.
   An unknown identifier still gets a 201 with the same fields, but **no `devCode`** (no code was issued). Never show "no account with this email" after this step.
2. **`POST /auth/login/verify`** with `{ identifier, code }`. The identifier must be the **same string** as in step 1. → `201` session pair.
   400 `E_AUTH_05`: wrong or expired code (for a user with no account this is where they land: the right copy is "wrong code, or sign up"). 403 `E_AUTH_03`: the account is suspended **or** never finished sign-up; the two share one message, so offer "start sign-up again" (`sign-up` with the same address is safe: it re-issues the code for a PENDING account and 409s for an active one). 429 `E_AUTH_06`: five wrong tries, request a new code.

**Resend**, in either flow: `POST /auth/request-code` with `{ destination, purpose: "SIGN_UP" | "LOGIN" }` → 201 challenge. A new code replaces the previous one. An unknown destination gets a 201 with no `devCode`.

One code screen serves both flows: same six-cell input, same resend button with `purpose` set by the flow, same expired state; only the submit endpoint differs.

## `devCode` — read before building the code screen

OTP delivery is not wired ([[Code Delivery]]). Until it is, **every response that issues a code returns the plaintext code as `devCode`, in every environment, production included**: a product decision of 2026-10-15 so the app can be used before a provider exists.

- For now: pre-fill (or auto-submit) the code from `devCode` so testers never read server logs.
- Build the screen as if `devCode` did not exist. It will be removed without an API version bump ([[T-003 Remove devCode once delivery works]]); the field is optional in the OpenAPI document for that reason.
- Never branch on its presence to decide whether an account exists; never log or persist it.
- Security reality while it is returned: anyone who knows an account's email or phone can sign in as it. Treat every environment as a dev environment until T-003 ships.

## Sessions and the token store

| Token | Lifetime | Send as | Only for |
|---|---|---|---|
| `accessToken` | 15 min | `Authorization: Bearer` | every API call |
| `refreshToken` | 7 days | `Authorization: Bearer` | `POST /auth/refresh` and `POST /auth/logout` |

- **Refresh is single-use.** `POST /auth/refresh` with the *refresh* token as bearer returns a new pair and kills the one sent, in the same transaction. Persist the new pair atomically.
- **Serialise refreshes.** One in-flight refresh promise; every request that got a 401 waits on it and retries once. Two concurrent refreshes end the session.
- 401 `E_AUTH_04` from `/auth/refresh` means sign in again. Rotated, revoked, expired and forged tokens all give that one answer.
- A SUSPENDED account gets 401 `E_AUTH_03` on its next call, not after the access token expires: treat it as a sign-out, do not refresh.
- A DELETED account (deleted on another device) gets **404 `E_USER_01`** on its next call, on any route: also a sign-out, with the "account deleted" copy ([[Account Backend Integration]]).
- `POST /auth/logout` takes the **refresh** token as bearer; `POST /auth/logout-everywhere` takes the access token and revokes every session, the caller's included. It is the only "sign me out of every device" action; there is no change-password to do it any more.
- Sending the access token to `/auth/refresh`, or the refresh token to any other route, is a 401 `E_AUTH_04`: the scopes are checked.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 400 | `E_AUTH_07` | sign-up with neither or both of email / phone | form validation |
| 409 | `E_AUTH_01` | sign-up for an address that already completed registration | "Already registered, sign in" |
| 400 | `E_AUTH_05` | wrong, expired or consumed code; onboarding token expired or for another purpose | "Invalid or expired code" + resend |
| 429 | `E_AUTH_06` | five wrong guesses; the code is burned | "Request a new code" |
| 403 | `E_AUTH_03` | `login/verify` on a suspended or never-finished account | one message + "start sign-up again" |
| 409 | `E_AUTH_08` | complete-registration on an account that already finished | go to sign-in |
| 409 | `E_PROFILE_02` | pin name taken at the last moment | back to the Pin step |
| 401 | `E_AUTH_03` | suspended account on any later call | sign-out state |
| 404 | `E_USER_01` | deleted account on any later call | sign-out state, "account deleted" |
| 401 | `E_AUTH_04` | refresh token rotated, revoked, expired or wrong scope | sign in again |

Retired and never returned again: `E_AUTH_02` (invalid password) and `E_USER_04` (current password). Remove any handling of them. Until [[T-063 Put the ErrorCode on the error body]] ships, the wire body carries `statusCode`, `message` and `error` but **not** `ErrorCode`; branch on status and endpoint. See [[Error Contract]].

## Rules the UI must respect

- No password field, no "forgot password", no "change password" (s68), anywhere. `PASSWORD_RESET` is gone from the purpose enum.
- Never persist the onboarding token or `devCode`.
- `POST /auth/login` never reveals whether an account exists; neither does `request-code`. Keep the copy neutral at step 1.
- `fullName` is optional at registration and is the only profile field set there. Everything else (bio, photo, links) is per Ring: see [[Ring Projection Backend Integration]].

## Not available yet

- **Code delivery.** No email or SMS provider is wired ([[T-001 Wire an email provider for one-time codes]], [[T-002 Wire an SMS provider for one-time codes]]); `devCode` stands in until then.
- Social login ([[T-019 LinkedIn OAuth link, unlink, login]]), device registration on login ([[T-014 Register devices on login; list and remove]]).

## Checklist

- [ ] Welcome accepts email **or** phone, with E.164 formatting for phone; the same screen starts sign-up and sign-in.
- [ ] One code screen: six-cell input, resend with the right `purpose`, timer and expired state from `expiresAt`, 400 / 403 / 429 handled as above.
- [ ] `devCode` pre-fills the code when present; nothing depends on it.
- [ ] Pin step: debounced availability check, client-side regex, `!` shown as decoration only.
- [ ] `complete-registration` body is `{ onboardingToken, pinName, fullName? }`.
- [ ] Token store: atomic pair replacement, one in-flight refresh, 401 retry once.
- [ ] Logout sends the refresh token; logout-everywhere the access token.
- [ ] No password UI, no `E_AUTH_02` / `E_USER_04` handling, no `PASSWORD_RESET` anywhere in the client.
