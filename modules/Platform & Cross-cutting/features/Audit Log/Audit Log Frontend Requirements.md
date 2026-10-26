---
type: frontend-requirements
code: audit-log
scope: feature
feature: audit-log
module: platform
status: draft
screens: []
created: 2026-10-18
updated: 2026-10-26
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# Audit Log · Frontend Requirements

**Feature:** [[Audit Log]] · **Status:** Draft · **Story:** [[Audit Log Story]] · **API Integration:** not yet (backend not built)

What the client depends on from the audit log: nothing it can see. There is no screen, no read endpoint and no task proposing one. The requirements here are the guarantees the client relies on while the writes are added behind calls it already makes.

## Per screen

### No screen

- Needs: nothing rendered. The design has no audit view, and [[T-053 Audit log writes]] adds writes only.
- Source today: none.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Audit rows written behind auth, Ring member, payment and AI calls | — (side effect of existing calls) | ❌ | [[T-053 Audit log writes]] |
| Read my own audit trail | — | ❌ | not proposed; no task exists |

## Behaviour expectations

- Refetch / realtime: none. The client never reads the log.
- No change to request or response shapes: the audit write is a side effect inside the service, so `POST /auth/login/verify`, `POST /auth/logout-everywhere`, the `/rings/:ringId/members` routes and, later, payment and Gemma calls keep the bodies documented in their own notes.
- The client sends no extra field for auditing. `ipAddress` and `userAgent` are taken from the request by the server; the client keeps sending a meaningful `User-Agent` as it does today.
- A failed audit write must not change the status the client sees; a successful call stays 200/201.
- Latency: the write is one insert in the same transaction; no visible delay is expected or acceptable.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| — | — | None specific to this feature. Until [[T-063 Put the ErrorCode on the error body]] ships, no `ErrorCode` is on the wire for any call. |

## Blocked by

- No decision. [[T-053 Audit log writes]] is To do; nothing on the client waits on it.
