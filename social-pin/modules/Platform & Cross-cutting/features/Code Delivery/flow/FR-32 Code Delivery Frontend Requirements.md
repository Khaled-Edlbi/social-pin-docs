---
id: FR-32
type: frontend-requirements
module: platform
feature: code-delivery
status: draft
scope: feature
screens: [s02]
created: 2026-10-18
updated: 2026-11-15
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Code Delivery · Frontend Requirements

> ⚠ Affected by [[S-78 Code Delivery Story]] (2026-11-12): S4 now has two messages, not one. A wrong code (E_AUTH_05) shakes and clears the boxes ("That code is wrong or has expired."), against "keep the digits for editing". An expired code, found by the phone's own timer, says "This code has expired. Ask for a new one." The fifth wrong guess locks (E_AUTH_06: "Too many tries. Ask for a new code.")

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
- After a wrong guess the boxes **shake and clear**, so the next try starts at once ([[S-78 Code Delivery Story|Code Delivery · S4]]). Fewer than six digits sends nothing: the boxes shake. When the phone's own timer (from `expiresAt`, on the server's clock) reaches zero before a try is sent, the boxes clear and switch off. After a 429 they clear and "Verify" stays off until a new challenge arrives.
- Copy: never confirm that a destination is registered. `request-code` answers the same for unknown addresses.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 400 | `E_AUTH_07` | sign-up with neither or both of email / phone: form validation on s01 |
| 409 | `E_AUTH_01` | address already registered: "Already registered, sign in" |
| 400 | `E_AUTH_05` | wrong, expired or consumed code: the boxes shake and clear, "That code is wrong or has expired." + resend |
| — | — (no call) | expired by the phone's own timer: the boxes clear and switch off, "This code has expired. Ask for a new one." + resend |
| — | — (no call) | fewer than six digits: the boxes shake, "Enter all six digits." |
| 429 | `E_AUTH_06` | code burned after the fifth wrong guess ([[D-30 The fifth wrong code try locks the code\|D-30]]): the boxes clear and switch off, "Too many tries. Ask for a new code." |
| 400 | validation (string array) | malformed email or non-E.164 phone: inline |

`ErrorCode` is not on the wire until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships; branch on status and endpoint until then, and keep `message` display-only ([[F-35 Error Contract]]).

## Blocked by

- No decision blocks delivery itself; [[S-78 Code Delivery Story|Code Delivery · S6]] and [[S-78 Code Delivery Story|Code Delivery · S7]] are To do.
- [[ND-01 Passwordless login]] — decides whether the same code also logs a returning user in; it needs delivery first either way.

## Log

- 2026-11-15 · the wrong-code behaviour corrected to the app (social_pin rings/F-11/honest-rings @ 778d9b4) and [[S-78 Code Delivery Story|Code Delivery · S4]] as rewritten 2026-11-12: a wrong code shakes and clears the boxes, the phone-timer expiry and the too-few-digits rows added, the copy as the app has it; no endpoint changed
