---
type: task
id: T-033
status: todo
priority: P0
effort: L
feature: events-before
domain: events
screens: [s48, s49]
depends: []
created: 2026-10-15
tags: [task, task/todo, domain/events, priority/P0]
---

# ⬜ T-033 · Events list, detail, schedule

**Feature:** [[Events Before]] · **Status:** To do · **Priority:** P0 · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

## What

`GET /events` with filters and 'contacts going' (needs T-023), `GET /events/:id`, schedule and mini-events.

## Design

- [[Screen Index#s48|s48]] Events tab
- [[Screen Index#s49|s49]] Event landing

## Dependencies

- Unblocks [[T-011 Create the Event Ring on registration]]
- Unblocks [[T-034 Tickets, packages, levels, sold-out]]
- Unblocks [[T-036 Event mode exhibitors list and detail]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
