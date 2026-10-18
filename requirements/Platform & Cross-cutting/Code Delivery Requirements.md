---
type: requirements
id: code-delivery
feature: code-delivery
status: draft
domain: platform
screens: [s02]
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/platform]
---

# Code Delivery · Frontend Requirements

**Feature:** [[Code Delivery]] · **Status:** Draft · **Story:** [[Code Delivery Story]] · **API Integration:** not yet (backend not built)

What the client needs to make s02 real: the challenge response it already gets, a code that reaches the user, and the timing facts behind the resend and expiry states. The calls exist; the delivery does not.

## Per screen

### [[Screen Index#s02|s02]] Verify

- Needs: the masked `destination` and `channel` (`EMAIL` | `PHONE`) from the challenge; `expiresAt` to drive the countdown; a six-box code input; "Verify and continue", "Resend", "Use a different email"; states code sent, wrong/expired, burned (429), resend timer.
- Source today: `POST /auth/sign-up`, `POST /auth/login` → `201 { destination, channel, expiresAt, devCode? }`; `POST /auth/request-code` → the same challenge shape. The verify call itself, `POST /auth/verify-code`, belongs to [[Auth & Sign-up]] and is documented there. The code reaches the user only through `devCode` on a dev server; against staging or production the screen cannot be completed until a provider is wired.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Issue a sign-up code and get the challenge | `POST /auth/sign-up` | ✅ | — (`devCode` in every environment until T-003) |
| Issue a sign-in code | `POST /auth/login` | ✅ | — (`devCode` in every environment until T-003) |
| Resend a sign-up or sign-in code | `POST /auth/request-code` | ✅ | — (`devCode` in every environment until T-003) |
| The email actually sent | — | ❌ | [[T-001 Wire an email provider for one-time codes]] |
| The SMS actually sent | — | ❌ | [[T-002 Wire an SMS provider for one-time codes]] |
| `devCode` removed from the challenge | — | ❌ | [[T-003 Remove devCode once delivery works]] (blocked on T-001, T-002) |

## Behaviour expectations

- Refetch / realtime: none. The screen waits on the user; no polling for delivery status exists or is planned.
- Countdown: run the resend timer from `expiresAt` (ten minutes from issue), with a shorter client-side resend cool-down product sets; the backend imposes no resend interval today, so the client must not rely on a 429 to throttle resends.
- `devCode`: fill the input when present; never require it, never persist it, never infer account existence from it. It disappears when [[T-003 Remove devCode once delivery works]] ships; no client change is needed then if the field is treated as optional.
- Caching keys: none. Keep the current challenge (`destination`, `channel`, `expiresAt`) in memory for the life of s02 only.
- Pagination / ordering: none.
- After a wrong guess keep the digits for editing; after a 429 clear them and disable "Verify" until a new challenge arrives.
- Copy: never confirm that a destination is registered. `request-code` answers the same for unknown addresses.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 400 | `E_AUTH_07` | sign-up with neither or both of email / phone: form validation on s01 |
| 409 | `E_AUTH_01` | address already registered: "Already registered, sign in" |
| 400 | `E_AUTH_05` | wrong, expired or consumed code: "Invalid or expired code" + resend |
| 429 | `E_AUTH_06` | code burned after five wrong guesses: "Request a new code" |
| 400 | validation (string array) | malformed email or non-E.164 phone: inline |

`ErrorCode` is not on the wire until [[T-063 Put the ErrorCode on the error body]] ships; branch on status and endpoint until then, and keep `message` display-only ([[Error Contract]]).

## Blocked by

- No decision blocks delivery itself; [[T-001 Wire an email provider for one-time codes]] and [[T-002 Wire an SMS provider for one-time codes]] are To do.
- [[D-01 Passwordless login]] — decides whether the same code also logs a returning user in; it needs delivery first either way.
