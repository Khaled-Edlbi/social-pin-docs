---
type: project
created: 2026-10-15
updated: 2026-10-27
tags: [project]
layer: frontend
---

# Frontend Contract

What a client must get right. The OpenAPI document at `/docs` is the signature; [[Frontend API Guide]] is the full explanation; **each feature's Backend Integration note** (`modules/<Module>/features/<Feature>/<Feature> Backend Integration.md`, listed below) has the screens, the calls, the flow and the errors. Base URL `/api/v1`.

> **2026-10-15 — auth is passwordless.** Every sign-up and sign-in is a 6-digit one-time code; `reset-password` and `change-password` are gone. What changed and what the client must do: [[Frontend Passwordless Migration]].

## The one concept

**You never fetch "a user's profile". You fetch a Ring projection.** Consequences:

1. The same Pin name returns a different body to different viewers. Key caches by (viewer, person).
2. A `null` field means *this Ring does not share it*, not *the person left it blank*. Render "not shared".
3. The response never tells you which Ring you are in. There is no `ringId`, and it will not appear later.
4. `GET /views/pin/:pinName` returns the same 404 for "no such name", "not shared with you" and "blocked". Show one message.

## Sessions

Access token 15 min, refresh token 7 days, **single-use and rotating**. Serialise refreshes: two concurrent refreshes kill the session. `401 E_AUTH_04` means sign in again.

Sign-up: `sign-up` → `verify-code` → `complete-registration` (pin name, no password). Sign-in: `login { identifier }` issues a code, `login/verify { identifier, code }` returns the session. `devCode` is returned on every issued code **in every environment** until delivery is wired; pre-fill it for now, but build the code screen as if it did not exist.

## Lists and errors

`{ data, meta: { total } }`, `meta.total` unpaginated, `limit` capped at 50 (a 400 above it, not a clamp). One error body `{ statusCode, message, error, path, timestamp }`; validation failures make `message` a string array; unknown body keys are a 400.

**The stable `ErrorCode` is not on the wire yet.** Services throw it, the filter drops it ([[Error Contract Story|Error Contract · S4–S8]]). Until that ships, branch on `statusCode` and the endpoint, and keep `message` display-only; the per-feature notes list the codes each endpoint will carry so the switch can be written now.

**No file bytes can be fetched.** `avatarFileId` and attachment ids have no URL ([[Files Upload Story|Files Upload · showing files]]); render placeholders.

## Endpoints by feature

| Feature | Endpoints | Status |
|---|---|---|
| [[Auth & Sign-up]] ([[Auth & Sign-up Backend Integration\|📱]]) | `POST /auth/sign-up`, `request-code`, `verify-code`, `complete-registration`, `login`, `login/verify`, `refresh`, `logout`, `logout-everywhere` | ✅ |
| [[Account]] ([[Account Backend Integration\|📱]]) | `GET / PATCH / DELETE /users/me` | ✅ |
| [[Profiles & Pin Name]] ([[Profiles & Pin Name Backend Integration\|📱]]) | `GET /profiles/pin-name/:pinName/availability` (public), `GET / POST /profiles`, `GET / PATCH / DELETE /profiles/:id`, `POST /profiles/:id/default` | ✅ |
| [[Rings]] ([[Rings Backend Integration\|📱]]) | `GET /rings`, `GET /rings/shared-with-me`, `POST /rings`, `GET / PATCH / DELETE /rings/:id`, `POST /rings/:id/default`, `POST /rings/:id/disposition` | ✅ |
| [[Ring Members]] ([[Ring Members Backend Integration\|📱]]) | `GET / POST /rings/:ringId/members`, `PATCH / DELETE …/members/:userId`, `POST …/members/:userId/reassign` | ✅ |
| [[Ring Projection]] ([[Ring Projection Backend Integration\|📱]]) | `GET / PATCH /rings/:ringId/projection`, `…/links`, `…/info-blocks`, `…/attachments` | ✅ |
| [[View As & Pin Views]] ([[View As & Pin Views Backend Integration\|📱]]) | `GET /views/pin/:pinName`, `GET /views/ring/:ringId`, `GET /views/user/:userId/perspectives` | ✅ |
| [[Files Upload]] ([[Files Upload Backend Integration\|📱]]) | `POST /files`, `GET / DELETE /files/:id` | ✅ |
| Everything else | see [[Feature Tree]] | 🟡 / ❌ |

48 endpoints in total (re-counted 2026-10-18, after the passwordless change). What is not yet available: connections, events, exhibitors, meetings, PinCast, businesses, payments, notifications, Gemma, QR token issue / resolve, device and interest management, file download by id, `ErrorCode` on the error body.

## Enums worth knowing

`RING_TYPE`: PERSONAL, CORPORATE, EVENT, MINI_EVENT, MEETING · `RING_STATUS`: ACTIVE, EXPIRED, ARCHIVED, DELETED · `RING_DISPOSITION`: UNDECIDED, KEEP, MERGE, AUTO_DELETE · `ACCOUNT_TYPE`: FREE, PRO · `LINK_TYPE`: 15 values. All enums carry stable `enumName`s in `/docs`.
