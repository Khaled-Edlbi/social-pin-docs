---
type: task
id: T-047
status: needs-info
priority: P1
effort: L
feature: payments
module: commerce
screens: [s51]
depends: []
created: 2026-10-15
tags: [task, task/needs-info, module/commerce, priority/P1]
---

# ❓ T-047 · Orders, payments and the provider webhook

**Feature:** [[Payments & Orders]] · **Status:** Needs a decision / info · **Priority:** P1 · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

## What

Provider undecided. Webhook idempotent on `providerReference`. Audit every payment action.

## Design

- [[Screen Index#s51|s51]] Payment

## Dependencies

- Unblocks [[T-035 Registration transaction with order and payment]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
