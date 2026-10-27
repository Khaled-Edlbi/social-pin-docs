---
type: frontend-requirements
code: error-contract
scope: feature
feature: error-contract
module: platform
status: draft
screens: []
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Error Contract · Frontend Requirements

> ⚠ Affected by [[Error Contract Backend Delivery]] (2026-10-27): reviewed by `/backend` while still `draft`, at the owner's request. Not approvable as written; for the frontend to fix before setting it `ready`. Checked against the code on `main @ b4984d6` and [[Auth & Sign-up QA Backend]]'s run.
> 1. **Name the field.** The list says "the stable code" and an `ErrorCode` column but never the key. [[Error Contract Story]] S2 proposes **`errorCode`** (camelCase, optional, absent on validation errors per S8). Say that, so both sides build the same parser.
> 2. **The 401 rows are incomplete.** A 401 today is one of: no, malformed or expired access token (`message: "Unauthorized"`, no code, the most common one: refresh once); `E_AUTH_04` (refresh token dead or wrong scope: sign in again); `E_AUTH_03` (suspended: sign out, no refresh); and `E_AUTH_05` on `complete-registration` (onboarding token expired: back to s02, never a refresh; [[B-05 Expired onboarding token answers 401, not the documented 400]]). "401 = `E_AUTH_04` or `E_AUTH_03`" sends the last case to a refresh the user does not have.
> 3. **The 403 row is not only "not allowed".** 403 `E_AUTH_03` from `login/verify` and `refresh` means the **account** is not active (suspended or sign-up unfinished): a sign-out with its own copy, not a role refusal.
> 4. **A deleted account is a 404 on any route.** Since [[B-02 Deleted account answers 401, not the documented 404 E_USER_01]], 404 `E_USER_01` from the auth guard means "your account was deleted": a sign-out, not "not found". The 404 row and the behaviour list must carve it out.
> 5. **429 is not "retry later".** The only 429 is `E_AUTH_06`: the code is burned; the way on is "send a new code", and retrying the same request never succeeds.
> 6. **"Inline per field" needs a decision.** Validation errors come from the stock `ValidationPipe`: `message` is an array of English sentences that **start with the property name** (`"email must be an email"`), with no field key. Either accept matching the leading property name (fragile, English-only), or ask for a structured shape (`{ field, constraints }`) and raise it as a need; S8 as written keeps the plain array.
> 7. **Stale row.** "Single-meaning codes … no task yet": that work is now [[Error Contract Story|Error Contract · S9–S11]].
> 8. **Say what `error` will be.** S2 says it stops reading `"HttpException"`; the list should tell the client not to branch on `error` at all.
>
> Fine as written: one parser for every body; `message` string or array; 500 never shows the body; one 404 copy for the privacy-sensitive routes; reading the code as optional so it activates when it appears. `/frontend`: fix 1–8, then set `ready`; `/backend` approves or sends it back.

**Feature:** [[Error Contract]] · **Status:** Draft · **Story:** [[Error Contract Story]] · **API Integration:** not yet (backend not built)

What the client's error layer depends on. There is no screen; the per-feature requirements notes list the codes each endpoint will carry, and this note states the shape they all share and what is missing from it today.

## Per screen

### No screen

- Needs: one parser for the body `{ statusCode, message, error, path, timestamp }`; a switch on the stable code once it is on the wire; a fallback that shows `message` when no code is recognised.
- Source today: the body is served for every error. **`ErrorCode` is not on the wire** until [[Error Contract Story|Error Contract · S4–S8]]; `error` reads `"HttpException"` for every domain error.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| One error body for every route | — (cross-cutting; `AllExceptionsFilter`) | ✅ | — |
| The stable code on the body | — | ❌ | [[Error Contract Story|Error Contract · S4–S8]] |
| Single-meaning codes (`E_RING_01`, `E_RING_PROFILE_03` split) | — | ❌ | noted in [[Error Contract]]; no task yet |

## Behaviour expectations

- Until Error Contract · S4–S8 ships: branch on `statusCode` and the endpoint called; treat `message` as display-only; write the switch on the codes now, keyed by the per-feature tables, so it activates when the field appears. Read the field as optional so a body without it still parses.
- `message` is a string on domain errors and a string array on validation failures; render an array as a list or join it.
- 500 means an unhandled server error: show a generic message, never the body, and allow retry.
- 401 on any route with `E_AUTH_04` semantics is "sign in again" after one refresh attempt; 401 with `E_AUTH_03` semantics is "account suspended" and must not trigger a refresh.
- 404 on `/views/pin/:pinName` is one message for missing, not shared and blocked; never derive a difference from timing or wording.
- Caching keys, pagination, realtime: none.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 400 | validation (string array) | inline per field; the array lists every failed constraint |
| 400 | domain code | the per-feature message |
| 401 | `E_AUTH_04` / `E_AUTH_03` | re-authenticate / sign-out state |
| 403 | domain code | "not allowed" for this account or role |
| 404 | domain code | "not found", identical copy for the privacy-sensitive routes |
| 409 | domain code | conflict, e.g. name taken |
| 429 | domain code | retry later, e.g. code burned |
| 500 | — | generic failure, retry |

The `ErrorCode` column applies only after [[Error Contract Story|Error Contract · S4–S8]]; before it, the body has no code.

## Blocked by

- No decision. [[Error Contract Story|Error Contract · S4–S8]] is To do and every frontend note's error table assumes it.
