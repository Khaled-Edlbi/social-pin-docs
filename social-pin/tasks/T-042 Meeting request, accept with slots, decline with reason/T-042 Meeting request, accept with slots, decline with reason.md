---
type: task
id: T-042
status: todo
priority: critical
effort: L
feature: meetings
module: meetings
screens: [s59, s64]
depends: [T-041]
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/todo, module/meetings, priority/critical]
---

# ⬜ T-042 · Meeting request, accept with slots, decline with reason

**Feature:** [[Meetings]] · **Status:** To do · **Priority:** Critical · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-042-fe Frontend · Meeting request, accept with slots, decline with reason|Frontend]] · [[T-042-be Backend · Meeting request, accept with slots, decline with reason|Backend]] · **Story:** [[T-042 Story]]

## What

Each transition `@Transactional`. Decline → notification with reason (T-045).

## Design

- [[Screen Index#s59|s59]] Request a meeting
- [[Screen Index#s64|s64]] Incoming meetings

## Dependencies

- Waits on [[T-041 Availability slots CRUD]]
- Unblocks [[T-043 Temporary meeting Ring per meeting]]
- Unblocks [[T-044 My meetings, calendar, detail, reschedule, cancel]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
