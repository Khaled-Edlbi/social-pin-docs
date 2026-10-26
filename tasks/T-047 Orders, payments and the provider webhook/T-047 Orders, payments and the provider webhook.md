---
type: task
id: T-047
status: needs-info
priority: high
effort: L
feature: payments
module: commerce
screens: [s51]
depends: []
created: 2026-10-15
updated: 2026-10-26
tags: [task, task/needs-info, module/commerce, priority/high]
---

# ❓ T-047 · Orders, payments and the provider webhook

> ⚠ Affected by [[Payment provider]] (2026-10-21): the provider is Stripe and the decision card now carries the block, so the hand-typed `needs-info` goes back to `todo`; the settlement callback is a Stripe webhook, idempotent on `providerReference`.

**Feature:** [[Payments & Orders]] · **Status:** Needs a decision / info · **Priority:** High · **Effort:** L (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-047-be Backend · Orders, payments and the provider webhook|Backend]] · **Story:** [[T-047 Story]]

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
