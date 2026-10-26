---
type: task
id: T-034
status: todo
priority: critical
effort: M
feature: events-before
module: events
screens: [s50]
depends: [T-033]
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/todo, module/events, priority/critical]
---

# ⬜ T-034 · Tickets, packages, levels, sold-out

**Feature:** [[Events Before]] · **Status:** To do · **Priority:** Critical · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-034-fe Frontend · Tickets, packages, levels, sold-out|Frontend]] · [[T-034-be Backend · Tickets, packages, levels, sold-out|Backend]] · **Story:** [[T-034 Story]]

## What

Packages with entitlements; capacity → sold out.

## Design

- [[Screen Index#s50|s50]] Tickets & levels

## Dependencies

- Waits on [[T-033 Events list, detail, schedule]]
- Unblocks [[T-035 Registration transaction with order and payment]]
- Unblocks [[T-040 Lounges and upgrades]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
