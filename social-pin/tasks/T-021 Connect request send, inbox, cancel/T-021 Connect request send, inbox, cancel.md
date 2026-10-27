---
type: task
id: T-021
status: todo
priority: critical
effort: M
feature: connections
module: connections
screens: [s44, s45]
depends: []
created: 2026-10-15
updated: 2026-10-27
owner: "omar"
related: ["D-13 The requester sees a declined request", "D-17 Requests expire after 30 days, optional note, ask again at once"]
tags: [task, task/todo, module/connections, priority/critical]
---

# ⬜ T-021 · Connect request: send, inbox, cancel

**Feature:** [[Connections]] · **Status:** To do · **Priority:** Critical · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-021-fe Frontend · Connect request send, inbox, cancel|Frontend]] · [[T-021-be Backend · Connect request send, inbox, cancel|Backend]] · **Story:** [[T-021 Story]]

## What

`POST /connections/requests` (target by user id from a resolved view, an optional note of up to 200 characters), `GET /connections/requests?direction=incoming|sent`, `DELETE …/:id`. Blocked pairs rejected with the same 404 as views. A request is pending, accepted, declined, cancelled or expired (30 days unanswered); the requester sees declined and expired requests and can ask again straight away ([[D-13 The requester sees a declined request]], [[D-17 Requests expire after 30 days, optional note, ask again at once]]).

## Design

- [[Screen Index#s44|s44]] Scanned Pin
- [[Screen Index#s45|s45]] Requests

## Dependencies

- Unblocks [[Counts Story|Counts · S11]]
- Unblocks [[T-022 Accept into a Ring (sets grantedRingId)]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- 2026-10-25 · `tickets/pm/M-02-connections/F-14-connections/S-24-decisions` · story and What updated for D-13 (decline visible) and D-17 (30-day expiry, optional note, ask again at once); flags cleared. Still Blocked · ND-10.
