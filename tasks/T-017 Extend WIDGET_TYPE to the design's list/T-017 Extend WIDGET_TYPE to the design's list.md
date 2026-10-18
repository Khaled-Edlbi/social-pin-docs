---
type: task
id: T-017
status: todo
priority: P1
effort: S
feature: widgets
module: identity
screens: [s37]
depends: []
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/todo, module/identity, priority/P1]
---

# ⬜ T-017 · Extend WIDGET_TYPE to the design's list

**Feature:** [[Widgets]] · **Status:** To do · **Priority:** P1 · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-017-fe Frontend · Extend WIDGET_TYPE to the design's list|Frontend]] · [[T-017-be Backend · Extend WIDGET_TYPE to the design's list|Backend]] · **Story:** [[T-017 Story]]

## What

Add AVAILABILITY, PAYMENT, NOW_PLAYING, TESTIMONIAL. New migration; never edit an applied one.

## Design

- [[Screen Index#s37|s37]] Widgets

## Dependencies

- Unblocks [[T-018 Widget CRUD on the projection]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
