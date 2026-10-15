---
type: project
updated: 2026-10-15
tags: [project]
---

# Frontend Contract

What a client must get right. The OpenAPI document at `/docs` is the signature; [[FRONTEND_API_GUIDE]] is the full explanation. Base URL `/api/v1`.

## The one concept

**You never fetch "a user's profile". You fetch a Ring projection.** Consequences:

1. The same Pin name returns a different body to different viewers. Key caches by (viewer, person).
2. A `null` field means *this Ring does not share it*, not *the person left it blank*. Render "not shared".
3. The response never tells you which Ring you are in. There is no `ringId`, and it will not appear later.
4. `GET /views/pin/:pinName` returns the same 404 for "no such name", "not shared with you" and "blocked". Show one message.

## Sessions

Access token 15 min, refresh token 7 days, **single-use and rotating**. Serialise refreshes: two concurrent refreshes kill the session. `401 E_AUTH_04` means sign in again. `devCode` in the sign-up response is development-only; never depend on it.

## Lists and errors

`{ data, meta: { total } }`, `meta.total` unpaginated, `limit` capped at 50 (a 400 above it, not a clamp). One error body; branch on `ErrorCode`, display `message`; validation failures make `message` a string array. Unknown body keys are a 400.

## Endpoints by feature

| Feature | Endpoints | Status |
|---|---|---|
| [[Auth & Sign-up]] | `POST /auth/sign-up`, `request-code`, `verify-code`, `complete-registration`, `login`, `reset-password`, `refresh`, `logout`, `logout-everywhere`, `change-password` | ✅ |
| [[Account]] | `GET / PATCH / DELETE /users/me` | ✅ |
| [[Profiles & Pin Name]] | `GET /profiles/pin-name/:pinName/availability` (public), `GET / POST /profiles`, `GET / PATCH / DELETE /profiles/:id`, `POST /profiles/:id/default` | ✅ |
| [[Rings]] | `GET /rings`, `GET /rings/shared-with-me`, `POST /rings`, `GET / PATCH / DELETE /rings/:id`, `POST /rings/:id/default`, `POST /rings/:id/disposition` | ✅ |
| [[Ring Members]] | `GET / POST /rings/:ringId/members`, `PATCH / DELETE …/members/:userId`, `POST …/members/:userId/reassign` | ✅ |
| [[Ring Projection]] | `GET / PATCH /rings/:ringId/projection`, `…/links`, `…/info-blocks`, `…/attachments` | ✅ |
| [[View As & Pin Views]] | `GET /views/pin/:pinName`, `GET /views/ring/:ringId`, `GET /views/user/:userId/perspectives` | ✅ |
| [[Files Upload]] | `POST /files`, `GET / DELETE /files/:id` | ✅ |
| Everything else | see [[Feature Tree]] | 🟡 / ❌ |

49 endpoints in total. What is not yet available: connections, events, exhibitors, meetings, PinCast, businesses, payments, notifications, Gemma, QR token issue / resolve, device and interest management.

## Enums worth knowing

`RING_TYPE`: PERSONAL, CORPORATE, EVENT, MINI_EVENT, MEETING · `RING_STATUS`: ACTIVE, EXPIRED, ARCHIVED, DELETED · `RING_DISPOSITION`: UNDECIDED, KEEP, MERGE, AUTO_DELETE · `ACCOUNT_TYPE`: FREE, PRO · `LINK_TYPE`: 15 values. All enums carry stable `enumName`s in `/docs`.
