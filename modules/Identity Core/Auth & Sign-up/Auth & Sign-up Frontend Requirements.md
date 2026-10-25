---
type: frontend-requirements
code: auth
scope: feature
feature: auth
module: identity
status: draft
screens: [s01, s02, s06, s08, s68]
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Auth & Sign-up · Frontend Requirements

> ⚠ Affected by [[DR-06 Yearly rename, old name freed, case-insensitive]] (2026-10-25): D-06 decided, a Pin name can be changed once a year, the old name is free at once, names ignore capitals, suggestions come only from the person's own name.

**Feature:** [[Auth & Sign-up]] · **Status:** Draft · **Story:** [[Auth & Sign-up Story]] · **Backend Integration:** [[Auth & Sign-up Backend Integration]]

What the client needs from the backend for the welcome, code, Pin-name and session screens, and whether each need is met today. Everything here exists; the one thing missing is the delivery of the code itself, which the backend papers over with `devCode` for now. Passwordless since 2026-10-15 ([[D-01 Passwordless login]]); the client-side migration is in [[Frontend Passwordless Migration]].

## Per screen

### [[Screen Index#s01|s01]] Welcome

- Needs: start sign-up or sign-in from one email-or-phone field; learn only *when the code expires*, never whether the account exists; a distinct signal when an address already finished sign-up.
- Source today: `POST /auth/sign-up` → `201 { destination, channel, expiresAt, devCode }`, 409 `E_AUTH_01` when already registered, 400 `E_AUTH_07` when neither field is sent. `POST /auth/login { identifier }` → the same challenge shape (no `devCode` for an unknown identifier).

### [[Screen Index#s02|s02]] Verify

- Needs: submit a 6-digit code for either flow; resend; know the expiry instant; distinguish wrong code, burned code and inactive account.
- Source today: `POST /auth/verify-code { destination, code, purpose: "SIGN_UP" }` → onboarding token; `POST /auth/login/verify { identifier, code }` → session; `POST /auth/request-code { destination, purpose: "SIGN_UP" | "LOGIN" }`. Errors 400 `E_AUTH_05`, 429 `E_AUTH_06`, 403 `E_AUTH_03` (verify only).

### [[Screen Index#s06|s06]] Claim your Pin

- Needs: live availability of a handle; finish registration with the handle and an optional full name; get a session back.
- Source today: `GET /profiles/pin-name/:pinName/availability` (public) → `{ pinName, available }`; `POST /auth/complete-registration { onboardingToken, pinName, fullName? }` → session, 409 `E_AUTH_08` / `E_PROFILE_02`.

### [[Screen Index#s08|s08]] First Ring

- Needs: the default Ring and its projection to exist the instant registration returns.
- Source today: created in the same transaction as the account activation; readable with `GET /rings` and `GET /rings/:id/projection` ([[Rings Backend Integration]], [[Ring Projection Backend Integration]]).

### [[Screen Index#s68|s68]] Me / Account

- Needs: sign out this device; sign out everywhere; silent session renewal.
- Source today: `POST /auth/logout` (refresh token as bearer), `POST /auth/logout-everywhere` (access token), `POST /auth/refresh` (refresh token as bearer, single-use).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Start sign-up with email or phone | `POST /auth/sign-up` | ✅ | — |
| Verify the sign-up code → onboarding token | `POST /auth/verify-code` | ✅ | — |
| Check a Pin name | `GET /profiles/pin-name/:pinName/availability` | ✅ | — |
| Finish registration (pin name, optional full name) → session | `POST /auth/complete-registration` | ✅ | — |
| Start sign-in with email or phone → code issued | `POST /auth/login` | ✅ | — |
| Verify the sign-in code → session | `POST /auth/login/verify` | ✅ | — |
| Resend a code in either flow | `POST /auth/request-code` (`SIGN_UP` / `LOGIN`) | ✅ | — |
| Rotate the session | `POST /auth/refresh` | ✅ | — |
| Sign out this device / everywhere | `POST /auth/logout`, `POST /auth/logout-everywhere` | ✅ | — |
| The code actually delivered by email | — | ❌ | [[T-001 Wire an email provider for one-time codes]] |
| The code actually delivered by SMS | — | ❌ | [[T-002 Wire an SMS provider for one-time codes]] |
| `devCode` removed from every challenge | — | ❌ | [[T-003 Remove devCode once delivery works]] |
| Register the device on sign-in (s75) | — | ❌ | [[T-014 Register devices on login; list and remove]] |
| Sign in with LinkedIn | — | ❌ | [[T-019 LinkedIn OAuth link, unlink, login]] |
| Stable `ErrorCode` on the error body | — | ❌ | [[T-063 Put the ErrorCode on the error body]] |

Removed on 2026-10-15 and not coming back: `POST /auth/reset-password`, `POST /auth/change-password`, the `PASSWORD_RESET` purpose, the `password` field on `complete-registration` and `login`.

## Behaviour expectations

- **One code screen for both flows.** Same input, same resend, same expiry handling; the submit endpoint and the resend `purpose` are the only differences.
- **Expiry is server-driven.** The resend cool-down and the "expired" state come from `expiresAt` in the challenge; a resend replaces the previous code.
- **`devCode` is transitional.** Pre-fill the input when present; never require it, never persist it, never infer account existence from it. It is returned in every environment until T-003.
- **Refresh is serialised.** One in-flight refresh; 401 callers wait and retry once; a 401 `E_AUTH_04` on refresh is a sign-out.
- **No enumeration.** `sign-up` on a PENDING address re-issues; `login` and `request-code` return 201 for unknown addresses; the UI copy stays neutral at step 1.
- **Caching keys.** The session pair per device; the onboarding token in memory only, dropped after `complete-registration`.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 400 | `E_AUTH_07` | form validation: email or phone, exactly one |
| 409 | `E_AUTH_01` | "Already registered" → sign-in with the same address |
| 400 | `E_AUTH_05` | "Invalid or expired code" (+ "or sign up" on `login/verify`) |
| 429 | `E_AUTH_06` | input disabled, "Send a new code" |
| 403 | `E_AUTH_03` | "This account is not active" + "Start sign-up again" (`login/verify`); sign-out state on any other call (401) |
| 409 | `E_AUTH_08` | "Sign-up already completed" → sign-in |
| 409 | `E_PROFILE_02` | handle taken, focus the field |
| 401 | `E_AUTH_04` | sign in again |

`E_AUTH_02` and `E_USER_04` are retired and never returned. Until [[T-063 Put the ErrorCode on the error body]] ships the body carries no `ErrorCode`; branch on status and endpoint.

## Blocked by

- Nothing for the flows above. [[T-001 Wire an email provider for one-time codes]] / [[T-002 Wire an SMS provider for one-time codes]] decide when `devCode` can go ([[T-003 Remove devCode once delivery works]]).
- [[D-06 Pin name rules]] — suggestions and the rename limit on s06 wait on it.
