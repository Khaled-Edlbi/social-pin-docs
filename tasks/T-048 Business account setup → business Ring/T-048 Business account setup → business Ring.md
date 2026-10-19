---
type: task
id: T-048
status: todo
priority: high
effort: L
feature: exhibitor
module: events
screens: [s63]
depends: [T-029]
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/todo, module/events, priority/high]
---

# ⬜ T-048 · Business account setup → business Ring

**Feature:** [[Exhibitor]] · **Status:** To do · **Priority:** High · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-048-fe Frontend · Business account setup → business Ring|Frontend]] · [[T-048-be Backend · Business account setup → business Ring|Backend]] · **Story:** [[T-048 Story]]

## What

Multi-step DTOs; creates `Business` + a `CORPORATE` Ring; team members become Ring members.

## Design

- [[Screen Index#s63|s63]] Business account

## Dependencies

- Waits on [[T-029 My companies and company detail]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
