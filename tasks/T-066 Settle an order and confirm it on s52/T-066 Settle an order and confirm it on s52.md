---
type: task
id: T-066
status: todo
priority: high
effort: M
feature: pay-for-an-order
module: payments-gateway
labels: []
screens: [s51, s52]
depends: []
affects: ["Pay for an order", "Payments & Orders", "Event Ring Auto-creation"]
related: ["T-065 Open a Stripe checkout for an order", "T-047 Orders, payments and the provider webhook", "T-035 Registration transaction with order and payment", "T-011 Create the Event Ring on registration", "DR-08 Stripe card checkout only", "DR-09 30-minute hold tied to the Stripe checkout", "Audit Log"]
pending: []
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [task, task/todo, module/payments-gateway, priority/high]
---

# ⬜ T-066 · Settle an order and confirm it on s52

**Feature:** [[Pay for an order]] · **Status:** To do · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Sub-tasks:** [[T-066-fe Frontend · Settle an order and confirm it on s52|Frontend]] · [[T-066-be Backend · Settle an order and confirm it on s52|Backend]] · **Story:** [[T-066 Story]]

## What

The second and last task of [[Pay for an order]]: stories S3 and S4 of [[Pay for an order Story]], what [[T-065 Open a Stripe checkout for an order]] left out. Backend: the endpoint Stripe calls back to settle an order (the webhook), signed by Stripe, idempotent on the payment's `providerReference`, which marks the payment succeeded or failed, completes the registration and grants the Event Ring in the same transaction, and audits every settlement ([[Audit Log]]); the order read gains whether the registration is complete and the Event Ring's id. This takes the webhook over from [[T-047 Orders, payments and the provider webhook]]. Frontend: s51 carries a paid order on to s52; s52 shows the Event Ring granted, or "Setting up your Ring…" until it is readable; a buyer who paid and closed the app finds the order paid and the Ring in the hub on the next open. Out of this task: creating the order on s50 ([[T-035 Registration transaction with order and payment]]).

## Design

- [[Screen Index#s51|s51]] Payment: from `PAID`, on to s52 (today it stops at "Payment received").
- [[Screen Index#s52|s52]] Event Ring granted: reached only from a paid order; the Ring as [[Event Ring Auto-creation Story]] S1 shows it; "Setting up your Ring…" while it is not readable.

## Impact

Output of `node scripts/build-tree.mjs --impact T-066` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[T-066 Story]] · S-107 — same task
- [[T-066-be Backend · Settle an order and confirm it on s52]] · T-066-be — same task
- [[T-066-fe Frontend · Settle an order and confirm it on s52]] · T-066-fe — same task
- [[Pay for an order Story]] · S-105 — related ←
- [[Pay for an order]] · F-41 — wikilink →
- [[Pay for an order Backend Delivery]] · BD-41 — wikilink →
- [[Pay for an order Backend Integration]] · BI-11 — wikilink →
- [[Pay for an order Frontend Delivery]] · FD-02 — wikilink →

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] The webhook rejects an unsigned or wrongly signed call; a replayed event changes nothing (one payment, one Event Ring, one audit entry)
- [ ] Nothing is granted on a pending or failed payment; s52 is never reached from an unpaid order
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks): BD-41's and FD-02's `pending` cleared, QB-02's and QF-02's S3 / S4 rows run
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-25 · created with --scaffold task; story S3 and S4 of [[Pay for an order Story]], the gaps handed to the PM on [[Pay for an order Backend Delivery]] and [[Pay for an order Frontend Delivery]]
