---
type: task
id: T-024-fe
status: todo
priority: critical
effort: S
feature: connections
module: connections
parent: T-024
labels: [frontend]
screens: [s47]
depends: [T-024-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/connections, priority/critical, frontend]
---

# ⬜ T-024-fe · Frontend: Block and unblock

**Parent:** [[T-024 Block and unblock]] · **Feature:** [[Connections]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-024-fe` when the team picks it up): [[T-024-fe Frontend Requirements|Frontend Requirements]] · [[T-024-fe Frontend Delivery|Frontend Delivery]] · [[T-024-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-024 Block and unblock]]: the screens below show what its *What* describes, built against [[Connections Backend Integration]] once the backend half ([[T-024-be Backend · Block and unblock]]) is current. Write the asks in [[T-024-fe Frontend Requirements]] first; it is blocked by default until [[T-024 Story]] is approved.

## Design

- [[Screen Index#s47|s47]]

## Impact

Same as the parent's: [[T-024 Block and unblock#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Connections Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-024
