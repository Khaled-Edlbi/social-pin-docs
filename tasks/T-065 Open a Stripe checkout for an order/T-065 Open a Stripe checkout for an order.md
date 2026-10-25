---
type: task
id: T-065
status: todo
priority: high
effort: M
feature: pay-for-an-order
module: payments-gateway
labels: []
screens: [s51]
depends: []
affects: ["Pay for an order", "Payments & Orders"]
related: ["T-047 Orders, payments and the provider webhook", "T-035 Registration transaction with order and payment", "DR-08 Stripe card checkout only", "DR-09 30-minute hold tied to the Stripe checkout", "Audit Log"]
pending: []
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [task, task/todo, module/payments-gateway, priority/high]
---

# ⬜ T-065 · Open a Stripe checkout for an order

**Feature:** [[Pay for an order]] · **Status:** To do · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-065-fe Frontend · Open a Stripe checkout for an order|Frontend]] · [[T-065-be Backend · Open a Stripe checkout for an order|Backend]] · **Story:** [[T-065 Story]]

## What

The buyer on the Payment screen taps "Pay" and lands on Stripe's hosted card page for exactly their order, and when they come back the app can read where the order stands. Backend: an endpoint that opens (or reuses) a Stripe Checkout Session for an unpaid order of the caller, card only ([[DR-08 Stripe card checkout only]]), with the order's total and currency, an expiry 30 minutes after the order was created ([[DR-09 30-minute hold tied to the Stripe checkout]]), and the session id stored as the payment's `providerReference`; an endpoint that returns the order's payment state (unpaid, pending, failed, paid); the audit entry for "checkout opened" ([[Audit Log]]). Frontend: s51 shows the order from the server, opens the hosted page, and on return shows pending or failed from the status endpoint. Out of this task: the webhook that marks the order paid and s52 (the next task, which takes the webhook over from [[T-047 Orders, payments and the provider webhook]]), and creating the order ([[T-035 Registration transaction with order and payment]]).

## Design

- [[Screen Index#s51|s51]] Payment: the order's lines and total, one "Pay $160" action opening Stripe's hosted card page; on return, "Waiting for confirmation" or the failed state with "Try again" and the time left on the hold.

## Impact

Output of `node scripts/build-tree.mjs --impact T-065` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[T-065 Story]] · S-106 — same task
- [[T-065-be Backend · Open a Stripe checkout for an order]] · T-065-be — same task
- [[T-065-fe Frontend · Open a Stripe checkout for an order]] · T-065-fe — same task
- [[Pay for an order Story]] · S-105 — related ←
- [[Pay for an order]] · F-41 — wikilink →

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] Only the order's buyer can open its checkout or read its state; a paid order never opens a second checkout
- [ ] No card data passes through Social Pin; the Stripe secret key lives in the environment, never in a response
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-25 · created with --scaffold task; first task of [[Pay for an order]], S1 and S2 of [[Pay for an order Story]]
