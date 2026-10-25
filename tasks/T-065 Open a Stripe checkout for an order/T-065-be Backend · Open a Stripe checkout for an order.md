---
type: task
id: T-065-be
status: todo
priority: high
effort: M
feature: pay-for-an-order
module: payments-gateway
parent: T-065
labels: [backend]
screens: [s51, s52]
depends: []
affects: []
related: []
pending: []
created: 2026-10-25
updated: 2026-10-25
tags: [task, task/todo, module/payments-gateway, priority/high, backend]
---

# ⬜ T-065-be · Backend: Open a Stripe checkout for an order

> ⚠ Affected by [[T-065 Open a Stripe checkout for an order]] (2026-10-25): the task covers s51 only (checkout, order state, audit entry); s52 and the webhook are the next task, so `screens:` and *Design* can drop s52.

**Parent:** [[T-065 Open a Stripe checkout for an order]] · **Feature:** [[Pay for an order]] · **Side:** Backend · **Status:** To do · **Priority:** high · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-065-be` when the team picks it up): [[T-065-be Backend Delivery|Backend Delivery]] · [[T-065-be Backend Integration|Backend Integration]] · [[T-065-be QA Backend|QA Backend]]

## What

The API side of [[T-065 Open a Stripe checkout for an order]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-065-be Backend Delivery]] and how to call it in [[T-065-be Backend Integration]], and roll both up into [[Pay for an order Backend Delivery]] and [[Pay for an order Backend Integration]].

## Design

- [[Screen Index#s51|s51]], [[Screen Index#s52|s52]]

## Impact

Same as the parent's: [[T-065 Open a Stripe checkout for an order#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-25 · created as the backend half of T-065
