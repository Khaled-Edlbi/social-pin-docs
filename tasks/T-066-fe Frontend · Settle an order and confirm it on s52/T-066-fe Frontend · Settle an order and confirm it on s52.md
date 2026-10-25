---
type: task
id: T-066-fe
status: done
priority: high
effort: M
feature: pay-for-an-order
module: payments-gateway
parent: T-066
labels: [frontend]
screens: [s51, s52]
depends: [T-066-be]
affects: []
related: ["T-066-fe Frontend Requirements", "T-066-fe Frontend Delivery", "T-066-be Backend Integration"]
pending: ["@qa: QA Frontend run on t066-fe-sim-2026-10-25 (T-066-fe QA Frontend not written yet)"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [task, task/done, module/payments-gateway, priority/high, frontend]
---

# ✅ T-066-fe · Frontend: Settle an order and confirm it on s52

**Parent:** [[T-066 Settle an order and confirm it on s52]] · **Feature:** [[Pay for an order]] · **Side:** Frontend · **Status:** Done (simulated) · **Priority:** high · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-066-fe` when the team picks it up): [[T-066-fe Frontend Requirements|Frontend Requirements]] · [[T-066-fe Frontend Delivery|Frontend Delivery]] · [[T-066-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-066 Settle an order and confirm it on s52]]: the screens below show what its *What* describes, built against [[Pay for an order Backend Integration]] once the backend half ([[T-066-be Backend · Settle an order and confirm it on s52]]) is current. Write the asks in [[T-066-fe Frontend Requirements]] first; it is blocked by default until [[T-066 Story]] is approved.

## Design

- [[Screen Index#s51|s51]], [[Screen Index#s52|s52]]

## Impact

Same as the parent's: [[T-066 Settle an order and confirm it on s52#Impact]].

## Definition of done

- [x] Frontend Requirements written before asking for backend work ([[T-066-fe Frontend Requirements]], 2026-10-25)
- [x] Every row of this task ✅ against [[T-066-be Backend Integration]] (reading the Ring itself is T-011's)
- [x] Screens merged (s51 → s52, app start, simulated); [[T-066-fe Frontend Delivery]] written and rolled up into [[Pay for an order Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over (handed to QA in `pending`)
- [x] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-25 · created as the frontend half of T-066
- 2026-10-25 · `tickets/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FR-42-draft` · requirements written (FR-42), draft until the backend accepts them
- 2026-10-25 · `payments-gateway/T-066/s52-confirmation` in the frontend repo (simulated, no code: M-09 agent-flow test) · s51 → s52 and app start shipped on `t066-fe-sim-2026-10-25` against [[T-066-be Backend Integration]] ([[T-066-fe Frontend Delivery]]); rolled up into FD-02, its pending cleared; QA Frontend handed over in `pending`
