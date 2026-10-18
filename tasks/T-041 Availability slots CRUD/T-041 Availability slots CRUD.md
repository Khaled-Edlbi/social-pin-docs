---
type: task
id: T-041
status: todo
priority: P0
effort: M
feature: meetings
module: meetings
screens: [s59, s64]
depends: []
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/todo, module/meetings, priority/P0]
---

# ⬜ T-041 · Availability slots CRUD

**Feature:** [[Meetings]] · **Status:** To do · **Priority:** P0 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-041-fe Frontend · Availability slots CRUD|Frontend]] · [[T-041-be Backend · Availability slots CRUD|Backend]] · **Story:** [[T-041 Story]]

## What

Exclusion constraint already guards overlaps; map the DB error to a domain error.

## Design

- [[Screen Index#s59|s59]] Request a meeting
- [[Screen Index#s64|s64]] Incoming meetings

## Dependencies

- Unblocks [[T-042 Meeting request, accept with slots, decline with reason]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
