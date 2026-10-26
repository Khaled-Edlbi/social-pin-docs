---
type: task
id: T-030
status: todo
priority: high
effort: S
feature: discover-hub
module: discovery
screens: [s38]
depends: []
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/todo, module/discovery, priority/high]
---

# ⬜ T-030 · Discover search by !pinname and recent searches

**Feature:** [[Discover Hub & Search]] · **Status:** To do · **Priority:** High · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-030-fe Frontend · Discover search by !pinname and recent searches|Frontend]] · [[T-030-be Backend · Discover search by !pinname and recent searches|Backend]] · **Story:** [[T-030 Story]]

## What

Exact-name resolve reuses `GET /views/pin`. Recent searches stored per user. No fuzzy search over other users' names.

## Design

- [[Screen Index#s38|s38]] Discover hub

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
