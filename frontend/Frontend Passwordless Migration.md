---
type: project
created: 2026-10-18
updated: 2026-10-18
tags: [project, frontend, auth]
layer: frontend
---

# Frontend · Passwordless Migration

**Audience:** the app / web client team.
**Backend change:** `feat(auth): passwordless sign-in with OTP codes`, merged into `main` of `social-pin` on 2026-10-15 (PR #1, branch `auth/no-ticket/passwordless-otp-login`).
**Decision:** [[D-01 Passwordless login]] — option A, code-only login, as the welcome screen (s01) promises: *"We send a one-time code. No password to remember."*

Full reference: [[Frontend API Guide]] · model notes: [[Auth Model]] · feature: [[Auth & Sign-up]].

---

## TL;DR

- **There is no password anywhere any more.** Not at sign-up, not at sign-in, not in account settings. The `password_hash` column was dropped.
- **Sign-up** is still three calls, but `complete-registration` no longer takes `password`.
- **Sign-in** is now two calls: `POST /auth/login { identifier }` issues a code, `POST /auth/login/verify { identifier, code }` returns the session.
- **Removed:** `POST /auth/reset-password`, `POST /auth/change-password`, the `PASSWORD_RESET` purpose, error codes `E_AUTH_02` and `E_USER_04`.
- **`devCode`** (the plaintext one-time code) is returned in **every** environment, including production, until email / SMS delivery is wired. It is absent when no code was issued (unknown email or phone).
- Tokens, refresh rotation, logout and the error envelope are **unchanged**.

---

## What changed, endpoint by endpoint

| Endpoint | Before | Now |
|---|---|---|
| `POST /auth/sign-up` | `{ email }` or `{ phone }` → challenge (`devCode` in dev only) | Same body. `devCode` always present. |
| `POST /auth/request-code` | `purpose`: `SIGN_UP` or `PASSWORD_RESET` | `purpose`: `SIGN_UP` or `LOGIN` |
| `POST /auth/verify-code` | `purpose`: `SIGN_UP` or `PASSWORD_RESET` → onboarding token | `purpose`: `SIGN_UP` only → onboarding token. Login codes go to `login/verify`. |
| `POST /auth/complete-registration` | `{ onboardingToken, password, pinName, fullName? }` | `{ onboardingToken, pinName, fullName? }` |
| `POST /auth/login` | `{ identifier, password }` → session | `{ identifier }` → challenge (a code is issued) |
| `POST /auth/login/verify` | — | **New.** `{ identifier, code }` → session |
| `POST /auth/reset-password` | `{ onboardingToken, password }` | **Removed** (404) |
| `POST /auth/change-password` | `{ currentPassword, newPassword }` | **Removed** (404) |
| `POST /auth/refresh` | refresh token as bearer → new pair | Unchanged |
| `POST /auth/logout` | refresh token as bearer | Unchanged |
| `POST /auth/logout-everywhere` | access token | Unchanged |
| `GET / PATCH / DELETE /users/me` | — | Unchanged; there was never a password field here |

Error codes:

| Code | Before | Now |
|---|---|---|
| `E_AUTH_02` | 401 invalid password | **Retired.** Never returned again, never reused. |
| `E_USER_04` | 400 current password does not match | **Retired.** |
| `E_AUTH_03` | 403 account not active | Now also returned by `login/verify` for a PENDING account (sign-up never finished) |
| `E_AUTH_05` | 400 code invalid or expired | Unchanged, now also from `login/verify` |
| `E_AUTH_06` | 429 too many attempts | Unchanged, now also from `login/verify`. **The 5-attempt limit works now** (it was silently broken before). |
| `E_AUTH_07` | 400 neither email nor phone | Unchanged |
| `E_AUTH_08` | 409 sign-up already completed | Unchanged |

---

## The flows, as the client sees them

Base URL `/api/v1`. All auth routes below are public (no bearer) unless stated.

### Sign-up (three calls, in order)

```
1. POST /auth/sign-up
   { "email": "sara@example.com" }            or   { "phone": "+971501234567" }
   → 201 { destination, channel, expiresAt, devCode }
     409 E_AUTH_01  already registered → send them to sign-in
     400 E_AUTH_07  neither email nor phone

2. POST /auth/verify-code
   { "destination": "sara@example.com", "code": "482913", "purpose": "SIGN_UP" }
   → 201 { onboardingToken, purpose: "SIGN_UP", expiresIn: "15m" }
     400 E_AUTH_05  wrong or expired code
     429 E_AUTH_06  five wrong tries → request a new code

3. POST /auth/complete-registration
   { "onboardingToken": "<from step 2>", "pinName": "SaraAz", "fullName": "Sara Azzam" }
   → 201 { accessToken, refreshToken, tokenType: "Bearer", expiresIn: "15m" }
     409 E_AUTH_08     sign-up already completed → sign in instead
     409 E_PROFILE_02  pin name taken
```

Notes:

- `pinName`: 3–30 characters, letters / digits / `_` / `.`, sent **without** the leading `!`. Check it first with the public `GET /profiles/pin-name/:pinName/availability` → `{ pinName, available }`.
- The `onboardingToken` is **not** a session. Keep it in memory for the duration of the form; do not persist it, and never send it as a bearer. It lives 15 minutes.
- A successful step 3 means the person has an active account, a profile, a default Ring and its projection. Go straight to the app.

### Sign-in (two calls)

```
1. POST /auth/login
   { "identifier": "sara@example.com" }        email or E.164 phone
   → 201 { destination, channel, expiresAt, devCode }
     (unknown identifier → still 201, same shape, but NO devCode)

2. POST /auth/login/verify
   { "identifier": "sara@example.com", "code": "482913" }
   → 201 { accessToken, refreshToken, tokenType: "Bearer", expiresIn: "15m" }
     400 E_AUTH_05  wrong or expired code
     403 E_AUTH_03  account suspended, or sign-up never finished
     429 E_AUTH_06  five wrong tries → request a new code
```

Notes:

- `identifier` in step 2 must be the **same string** as in step 1.
- `POST /auth/login` never says whether the account exists. Do not show "no account with this email" after step 1. If the user has no account they will fail at step 2 with `E_AUTH_05`, and the right UI there is "wrong code, or sign up".
- `403 E_AUTH_03` at step 2 covers both a SUSPENDED account and a PENDING one (sign-up started, step 3 never done), with the **same message** ("This account is not active"). The client cannot tell them apart. Show that message and offer "Start sign-up again": `sign-up` with the same address is safe to re-submit for a PENDING account (it re-issues the code) and returns `409 E_AUTH_01` for an active one.

### Resend a code

```
POST /auth/request-code
{ "destination": "sara@example.com", "purpose": "SIGN_UP" }     during sign-up
{ "destination": "sara@example.com", "purpose": "LOGIN" }       during sign-in
→ 201 { destination, channel, expiresAt, devCode? }
```

A new code **replaces** the previous one; the old code stops working. An unknown destination still gets a 201 with no `devCode`. `PASSWORD_RESET` is no longer accepted (400 validation error).

### Code rules (same for sign-up and sign-in)

| Rule | Value |
|---|---|
| Format | 6 digits, sent as a string (`"482913"`) |
| Lifetime | 10 minutes (`expiresAt` in the challenge is the authoritative instant) |
| Wrong attempts | 5, then `429 E_AUTH_06` and the code is burned; the user must request a new one |
| Resend | `request-code`; the previous code is invalidated |

Drive the resend timer and the "code expired" state (s02) from `expiresAt`, not from a client-side constant.

---

## `devCode` — read this before building the code screen

OTP delivery (email / SMS) is **not wired** on the backend ([[Code Delivery]], T-001 / T-002). Until it is, every response that issues a code returns the plaintext code as `devCode`, **in every environment**. This is a deliberate product decision (2026-10-15) so the app can sign in end to end before a provider exists.

What that means for the client:

1. **For now:** read `devCode` from the challenge and pre-fill (or auto-submit) the code field, so testers never have to open server logs.
2. **Build the code-entry screen as if `devCode` did not exist.** It will be removed ([[T-003 Remove devCode once delivery works]]) with no API version bump. The field is optional in the OpenAPI document for exactly this reason.
3. **Never branch on `devCode` being present to decide whether the account exists.** Its absence today means "no code was issued", which is also what an unknown identifier returns, but that is a side effect, not a contract.
4. **Do not log or persist it** beyond the screen that uses it.
5. Security reality while it is returned: anyone who knows an account's email or phone can sign in as it. Treat every environment as a dev environment until T-003 ships.

---

## Sessions — unchanged, restated

| Token | Lifetime | Send as | Used for |
|---|---|---|---|
| `accessToken` | 15 min | `Authorization: Bearer` | every API call |
| `refreshToken` | 7 days | `Authorization: Bearer` | **only** `/auth/refresh` and `/auth/logout` |

- Refresh tokens are **single-use and rotating**. `POST /auth/refresh` returns a new pair and kills the one you sent, in the same transaction. Replace what you stored. A replay is `401 E_AUTH_04` and means "sign in again".
- **Serialise refreshes.** Two concurrent refreshes: the second consumes a token the first already rotated and the session dies. Queue one refresh and let the waiters retry with the new token.
- Access and refresh tokens carry a `scope` claim and different secrets; sending one where the other is expected is a 401.
- `POST /auth/logout-everywhere` revokes all sessions including the caller's. This used to also happen on `change-password`; that route is gone, so this is now the only "sign me out of every device" action.

---

## Frontend checklist

Remove:

- [ ] Password field on the registration form (step 3 is pin name + optional full name only).
- [ ] Password field on the login screen.
- [ ] "Forgot password" / reset-password flow and its screens.
- [ ] "Change password" in account settings (s68). There is nothing to replace it with; sign-out-everywhere is the only session control.
- [ ] Any handling of `E_AUTH_02` and `E_USER_04`.
- [ ] `PASSWORD_RESET` from any purpose enum / union on the client.
- [ ] Any `NODE_ENV` / build-flag gate around reading `devCode`: it is there in every environment now.

Add:

- [ ] `POST /auth/login/verify` to the API client.
- [ ] A code-entry step after login, reusing the sign-up code screen (s02): same 6-digit input, same resend button, same expired state. Only the submit endpoint differs (`verify-code` vs `login/verify`).
- [ ] `purpose: "LOGIN"` on the resend button during sign-in.
- [ ] Handling for `403 E_AUTH_03` at `login/verify`: show the message and offer the sign-up flow. Suspended and unfinished accounts are not distinguishable from the response.
- [ ] Handling for `429 E_AUTH_06` at `login/verify`: disable the input and offer "send a new code".

Change:

- [ ] `complete-registration` request body: drop `password`.
- [ ] `login` request body: drop `password`; the response is now a challenge, not a session.
- [ ] `verify-code` request: `purpose` is always `"SIGN_UP"`.
- [ ] Any UI copy that mentions a password.
- [ ] If the client regenerates types from `/docs-json`, regenerate: `LoginDto`, `CompleteRegistrationDto`, `RequestCodeDto`, `VerifyCodeDto` changed; `VerifyLoginDto` is new; `ResetPasswordDto` and `ChangePasswordDto` are gone.

Keep as is:

- Token storage, refresh queue, 401 handling, logout, logout-everywhere.
- Error envelope parsing (`ErrorCode` + `message`, `message` may be a string array on validation failures).
- The pin-name availability check.
- Everything outside `/auth`.

---

## Minimal client sequence (pseudo-TypeScript)

```ts
const api = (path: string, body: unknown, bearer?: string) =>
  fetch(`${BASE}/api/v1${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    body: JSON.stringify(body),
  }).then(async (r) => (r.ok ? r.json() : Promise.reject(await r.json())));

// ---- sign-in
const challenge = await api('/auth/login', { identifier });
// challenge: { destination, channel, expiresAt, devCode? }
const code = challenge.devCode ?? (await askUserForCode(challenge.expiresAt));
const session = await api('/auth/login/verify', { identifier, code });
// session: { accessToken, refreshToken, tokenType, expiresIn }
store(session);

// ---- sign-up
const c1 = await api('/auth/sign-up', { email });
const { onboardingToken } = await api('/auth/verify-code', {
  destination: email,
  code: c1.devCode ?? (await askUserForCode(c1.expiresAt)),
  purpose: 'SIGN_UP',
});
const s2 = await api('/auth/complete-registration', { onboardingToken, pinName, fullName });
store(s2);

// ---- resend (either flow)
await api('/auth/request-code', { destination: identifier, purpose: 'LOGIN' }); // or 'SIGN_UP'

// ---- refresh (serialise this!)
const next = await api('/auth/refresh', {}, stored.refreshToken);
store(next); // the old refresh token is dead now
```

---

## How to try it against a local backend

```bash
# backend: pnpm install && pnpm prisma:generate && pnpm prisma:deploy && pnpm start:dev
# Swagger: http://localhost:3000/docs   (the banner prints the real URLs)

curl -s localhost:3000/api/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"identifier":"sara@socialpin.test"}'
# {"destination":"sara@socialpin.test","channel":"EMAIL","expiresAt":"...","devCode":"482913"}

curl -s localhost:3000/api/v1/auth/login/verify \
  -H 'content-type: application/json' \
  -d '{"identifier":"sara@socialpin.test","code":"482913"}'
# {"accessToken":"...","refreshToken":"...","tokenType":"Bearer","expiresIn":"15m"}
```

`sara@socialpin.test` is a demo account from `pnpm db:seed` (not seeded in production); see [[Developer Setup]].

---

## What is still coming (and will not change the contract above)

- Email and SMS delivery of the code ([[T-001 Wire an email provider for one-time codes]], [[T-002 Wire an SMS provider for one-time codes]]). When that lands, `devCode` disappears ([[T-003 Remove devCode once delivery works]]) and the user types the code they received. Nothing else changes.
- Login via a linked provider (LinkedIn) is a separate feature, [[T-019 LinkedIn OAuth link, unlink, login]], no longer blocked by D-01.
