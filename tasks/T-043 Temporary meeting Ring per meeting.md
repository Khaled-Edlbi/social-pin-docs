---
type: task
id: T-043
status: todo
priority: P0
effort: M
feature: meetings
domain: meetings
screens: [s59, s67]
depends: [T-042]
created: 2026-10-15
tags: [task, task/todo, domain/meetings, priority/P0]
---

# ⬜ T-043 · Temporary meeting Ring per meeting

**Feature:** [[Meetings]] · **Status:** To do · **Priority:** P0 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

`MEETING` Ring with window = meeting time ± margin; both participants are members; disposition after.

## Design

- [[Screen Index#s59|s59]] Request a meeting
- [[Screen Index#s67|s67]] Meeting detail

## Dependencies

- Waits on [[T-042 Meeting request, accept with slots, decline with reason]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
