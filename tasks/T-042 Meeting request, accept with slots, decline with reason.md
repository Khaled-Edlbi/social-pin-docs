---
type: task
id: T-042
status: todo
priority: P0
effort: L
feature: meetings
domain: meetings
screens: [s59, s64]
depends: [T-041]
created: 2026-10-15
tags: [task, task/todo, domain/meetings, priority/P0]
---

# ⬜ T-042 · Meeting request, accept with slots, decline with reason

**Feature:** [[Meetings]] · **Status:** To do · **Priority:** P0 · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

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
