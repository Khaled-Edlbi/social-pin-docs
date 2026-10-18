---
type: task
id: T-035
status: blocked
priority: P0
effort: L
feature: events-before
module: events
screens: [s51, s52]
depends: [T-034, T-047]
created: 2026-10-15
updated: 2026-10-18
tags: [task, task/blocked, module/events, priority/P0]
---

# ⛔ T-035 · Registration transaction with order and payment

**Feature:** [[Events Before]] · **Status:** Blocked · **Priority:** P0 · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-035-fe Frontend · Registration transaction with order and payment|Frontend]] · [[T-035-be Backend · Registration transaction with order and payment|Backend]] · **Story:** [[T-035 Story]]

## What

Participant + order + payment intent; on webhook success → T-011 Event Ring.

## Design

- [[Screen Index#s51|s51]] Payment
- [[Screen Index#s52|s52]] Event Ring granted

## Dependencies

- Waits on [[T-034 Tickets, packages, levels, sold-out]]
- Waits on [[T-047 Orders, payments and the provider webhook]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
