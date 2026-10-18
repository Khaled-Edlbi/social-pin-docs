---
type: frontend-requirements
code: error-contract
scope: feature
feature: error-contract
module: platform
status: draft
screens: []
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Error Contract · Frontend Requirements

**Feature:** [[Error Contract]] · **Status:** Draft · **Story:** [[Error Contract Story]] · **API Integration:** not yet (backend not built)

What the client's error layer depends on. There is no screen; the per-feature requirements notes list the codes each endpoint will carry, and this note states the shape they all share and what is missing from it today.

## Per screen

### No screen

- Needs: one parser for the body `{ statusCode, message, error, path, timestamp }`; a switch on the stable code once it is on the wire; a fallback that shows `message` when no code is recognised.
- Source today: the body is served for every error. **`ErrorCode` is not on the wire** until [[T-063 Put the ErrorCode on the error body]]; `error` reads `"HttpException"` for every domain error.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| One error body for every route | — (cross-cutting; `AllExceptionsFilter`) | ✅ | — |
| The stable code on the body | — | ❌ | [[T-063 Put the ErrorCode on the error body]] |
| Single-meaning codes (`E_RING_01`, `E_RING_PROFILE_03` split) | — | ❌ | noted in [[Error Contract]]; no task yet |

## Behaviour expectations

- Until T-063 ships: branch on `statusCode` and the endpoint called; treat `message` as display-only; write the switch on the codes now, keyed by the per-feature tables, so it activates when the field appears. Read the field as optional so a body without it still parses.
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

The `ErrorCode` column applies only after [[T-063 Put the ErrorCode on the error body]]; before it, the body has no code.

## Blocked by

- No decision. [[T-063 Put the ErrorCode on the error body]] is To do and every frontend note's error table assumes it.
