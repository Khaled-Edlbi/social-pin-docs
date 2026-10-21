---
type: task
id: T-049
status: todo
priority: high
effort: M
feature: subscription
module: commerce
screens: [s70]
depends: []
created: 2026-10-15
updated: 2026-10-19
tags: [task, task/todo, module/commerce, priority/high]
---

# ⬜ T-049 · Subscription endpoints and a single Pro gate

> ⚠ Affected by [[D-07 Payment provider]] (2026-10-21): Pro is billed as a Stripe subscription; the Pro gate reads the subscription state the gateway keeps.

**Feature:** [[Subscription (Free vs Pro)]] · **Status:** To do · **Priority:** High · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-049-fe Frontend · Subscription endpoints and a single Pro gate|Frontend]] · [[T-049-be Backend · Subscription endpoints and a single Pro gate|Backend]] · **Story:** [[T-049 Story]]

## What

Subscribe / cancel / status; `ProGate` helper used by Smart Match, lounges, Gemma automation, permanent QR.

## Design

- [[Screen Index#s70|s70]] Subscription

## Dependencies

- Unblocks [[T-040 Lounges and upgrades]]
- Unblocks [[T-051 Gemma assistant sheet and suggestions]]

## Definition of done

- [ ] DTOs + entity + service + controller per [[Architecture#Build order for a new feature]]
- [ ] Every visibility decision goes through `RingAccessService` ([[Ring Access Model]])
- [ ] Spec covers each thrown domain error, each filter, and asserts secret fields are absent
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Feature note updated (status, endpoints)

## Log

- 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
