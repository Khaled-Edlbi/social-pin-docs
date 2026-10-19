---
type: task
id: T-032
status: todo
priority: high
effort: L
feature: pincast
module: discovery
screens: [s39, s40, s41, s42]
depends: []
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/todo, module/discovery, priority/high]
---

# ⬜ T-032 · PinCast: setup, start, stop, results

**Feature:** [[PinCast & Nearby]] · **Status:** To do · **Priority:** High · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-032-fe Frontend · PinCast setup, start, stop, results|Frontend]] · [[T-032-be Backend · PinCast setup, start, stop, results|Backend]] · **Story:** [[T-032 Story]]

## What

Bound to a Ring, radius, duration. Geo query with the existing GiST index. Recipients list; coordinates never returned. Nearby-by-Ring through `RingAccessService`.

## Design

- [[Screen Index#s39|s39]] PinCast · hidden
- [[Screen Index#s40|s40]] PinCast · live
- [[Screen Index#s41|s41]] PinCast setup
- [[Screen Index#s42|s42]] PinCast results

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
