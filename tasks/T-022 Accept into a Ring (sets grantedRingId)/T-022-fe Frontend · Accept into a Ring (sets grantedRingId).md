---
type: task
id: T-022-fe
status: todo
priority: critical
effort: M
feature: connections
module: connections
parent: T-022
labels: [frontend]
screens: [s46]
depends: [T-021, T-022-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/connections, priority/critical, frontend]
---

# ⬜ T-022-fe · Frontend: Accept into a Ring (sets grantedRingId)

**Parent:** [[T-022 Accept into a Ring (sets grantedRingId)]] · **Feature:** [[Connections]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-022-fe` when the team picks it up): [[T-022-fe Frontend Requirements|Frontend Requirements]] · [[T-022-fe Frontend Delivery|Frontend Delivery]] · [[T-022-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-022 Accept into a Ring (sets grantedRingId)]]: the screens below show what its *What* describes, built against [[Connections Backend Integration]] once the backend half ([[T-022-be Backend · Accept into a Ring (sets grantedRingId)]]) is current. Write the asks in [[T-022-fe Frontend Requirements]] first; it is blocked by default until [[T-022 Story]] is approved.

## Design

- [[Screen Index#s46|s46]]

## Impact

Same as the parent's: [[T-022 Accept into a Ring (sets grantedRingId)#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Connections Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-022
