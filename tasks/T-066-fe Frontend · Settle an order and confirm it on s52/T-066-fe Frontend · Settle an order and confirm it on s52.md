---
type: task
id: T-066-fe
status: todo
priority: high
effort: M
feature: pay-for-an-order
module: payments-gateway
parent: T-066
labels: [frontend]
screens: [s51, s52]
depends: [T-066-be]
affects: []
related: ["T-066-fe Frontend Requirements"]
pending: []
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [task, task/todo, module/payments-gateway, priority/high, frontend]
---

# ⬜ T-066-fe · Frontend: Settle an order and confirm it on s52

**Parent:** [[T-066 Settle an order and confirm it on s52]] · **Feature:** [[Pay for an order]] · **Side:** Frontend · **Status:** To do · **Priority:** high · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-066-fe` when the team picks it up): [[T-066-fe Frontend Requirements|Frontend Requirements]] · [[T-066-fe Frontend Delivery|Frontend Delivery]] · [[T-066-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-066 Settle an order and confirm it on s52]]: the screens below show what its *What* describes, built against [[Pay for an order Backend Integration]] once the backend half ([[T-066-be Backend · Settle an order and confirm it on s52]]) is current. Write the asks in [[T-066-fe Frontend Requirements]] first; it is blocked by default until [[T-066 Story]] is approved.

## Design

- [[Screen Index#s51|s51]], [[Screen Index#s52|s52]]

## Impact

Same as the parent's: [[T-066 Settle an order and confirm it on s52#Impact]].

## Definition of done

- [x] Frontend Requirements written before asking for backend work ([[T-066-fe Frontend Requirements]], 2026-10-25)
- [ ] Every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Pay for an order Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-25 · created as the frontend half of T-066
- 2026-10-25 · `tickets/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FR-42-draft` · requirements written (FR-42), draft until the backend accepts them
