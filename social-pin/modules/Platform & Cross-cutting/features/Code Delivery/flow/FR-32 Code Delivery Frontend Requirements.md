---
id: FR-32
type: frontend-requirements
module: platform
feature: code-delivery
status: draft
scope: feature
screens: [s02]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Code Delivery · Frontend Requirements

**Feature:** [[F-32 Code Delivery]] · **Status:** Draft · **Story:** [[S-78 Code Delivery Story]] · **API Integration:** not yet (backend not built)

What the client needs to make s02 real: the challenge response it already gets, a code that reaches the user, and the timing facts behind the resend and expiry states. The calls exist; the delivery does not.

## Per screen

### [[Screen Index#s02|s02]] Verify

- Needs: the masked `destination` and `channel` (`EMAIL` | `PHONE`) from the challenge; `expiresAt` to drive the countdown; a six-box code input; "Verify and continue", "Resend", "Use a different email"; states code sent, wrong/expired, burned (429), resend timer.
- Source today: `POST /auth/sign-up`, `POST /auth/login` → `201 { destination, channel, expiresAt, devCode? }`; `POST /auth/request-code` → the same challenge shape. The verify call itself, `POST /auth/verify-code`, belongs to [[F-02 Auth & Sign-up]] and is documented there. The code reaches the user only through `devCode` on a dev server; against staging or production the screen cannot be completed until a provider is wired.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Issue a sign-up code and get the challenge | `POST /auth/sign-up` | ✅ | — (`devCode` in every environment until Code Delivery · S8) |
| Issue a sign-in code | `POST /auth/login` | ✅ | — (`devCode` in every environment until Code Delivery · S8) |
| Resend a sign-up or sign-in code | `POST /auth/request-code` | ✅ | — (`devCode` in every environment until Code Delivery · S8) |
| The email actually sent | — | ❌ | [[S-78 Code Delivery Story|Code Delivery · S6]] |
| The SMS actually sent | — | ❌ | [[S-78 Code Delivery Story|Code Delivery · S7]] |
| `devCode` removed from the challenge | — | ❌ | [[S-78 Code Delivery Story|Code Delivery · S8]] (blocked on Code Delivery · S6, Code Delivery · S7) |

## Behaviour expectations

- Refetch / realtime: none. The screen waits on the user; no polling for delivery status exists or is planned.
- Countdown: run the resend timer from `expiresAt` (ten minutes from issue), with a shorter client-side resend cool-down product sets; the backend imposes no resend interval today, so the client must not rely on a 429 to throttle resends.
- `devCode`: fill the input when present; never require it, never persist it, never infer account existence from it. It disappears when [[S-78 Code Delivery Story|Code Delivery · S8]] ships; no client change is needed then if the field is treated as optional.
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

`ErrorCode` is not on the wire until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships; branch on status and endpoint until then, and keep `message` display-only ([[F-35 Error Contract]]).

## Blocked by

- No decision blocks delivery itself; [[S-78 Code Delivery Story|Code Delivery · S6]] and [[S-78 Code Delivery Story|Code Delivery · S7]] are To do.
- [[ND-01 Passwordless login]] — decides whether the same code also logs a returning user in; it needs delivery first either way.
