---
type: task
id: T-035
status: blocked
priority: critical
effort: L
feature: events-before
module: events
screens: [s51, s52]
depends: ["T-034"]
created: 2026-10-15
updated: 2026-10-27
tags: [task, task/blocked, module/events, priority/critical]
related: ["Payments & Orders Story"]
---

# ⛔ T-035 · Registration transaction with order and payment

> ⚠ Affected by [[ND-07 Payment provider]] (2026-10-21): the payment step of the registration is a Stripe checkout; still waits on T-034 and Payments & Orders · S7.

**Feature:** [[Events Before]] · **Status:** Blocked · **Priority:** Critical · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-035-fe Frontend · Registration transaction with order and payment|Frontend]] · [[T-035-be Backend · Registration transaction with order and payment|Backend]] · **Story:** [[T-035 Story]]

## What

Participant + order + payment intent; on webhook success → Event Ring Auto-creation · S6 Event Ring.

## Design

- [[Screen Index#s51|s51]] Payment
- [[Screen Index#s52|s52]] Event Ring granted

## Dependencies

- Waits on [[T-034 Tickets, packages, levels, sold-out]]
- Waits on [[Payments & Orders Story|Payments & Orders · S7]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
