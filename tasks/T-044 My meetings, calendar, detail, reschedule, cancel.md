---
type: task
id: T-044
status: todo
priority: P0
effort: M
feature: meetings
module: meetings
screens: [s61, s66, s67]
depends: [T-042]
created: 2026-10-15
tags: [task, task/todo, module/meetings, priority/P0]
---

# ⬜ T-044 · My meetings, calendar, detail, reschedule, cancel

**Feature:** [[Meetings]] · **Status:** To do · **Priority:** P0 · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

## What

Agenda, shared files (via `File`), reschedule = new request referencing the old meeting.

## Design

- [[Screen Index#s61|s61]] My meetings
- [[Screen Index#s66|s66]] Meetings
- [[Screen Index#s67|s67]] Meeting detail

## Dependencies

- Waits on [[T-042 Meeting request, accept with slots, decline with reason]]
- Unblocks [[T-050 Post-event summary and follow-ups]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
