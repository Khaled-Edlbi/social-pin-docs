---
type: task
id: T-004
status: todo
priority: P1
effort: S
feature: counts
module: identity
screens: [s14, s16]
depends: []
created: 2026-10-15
tags: [task, task/todo, module/identity, priority/P1]
---

# ⬜ T-004 · Member count per Ring on list and detail

**Feature:** [[Counts]] · **Status:** To do · **Priority:** P1 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

## What

Add `memberCount` (live members only) to `RingEntity` via a `_count` select filtered by the same window logic, or a stats sub-endpoint. Owner-only.

## Design

- [[Screen Index#s14|s14]] Ring data
- [[Screen Index#s16|s16]] My Rings

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
