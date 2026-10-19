---
type: task
id: T-030-fe
status: todo
priority: high
effort: S
feature: discover-hub
module: discovery
parent: T-030
labels: [frontend]
screens: [s38]
depends: [T-030-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/discovery, priority/high, frontend]
---

# ⬜ T-030-fe · Frontend: Discover search by !pinname and recent searches

**Parent:** [[T-030 Discover search by !pinname and recent searches]] · **Feature:** [[Discover Hub & Search]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-030-fe` when the team picks it up): [[T-030-fe Frontend Requirements|Frontend Requirements]] · [[T-030-fe Frontend Delivery|Frontend Delivery]] · [[T-030-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-030 Discover search by !pinname and recent searches]]: the screens below show what its *What* describes, built against [[Discover Hub & Search Backend Integration]] once the backend half ([[T-030-be Backend · Discover search by !pinname and recent searches]]) is current. Write the asks in [[T-030-fe Frontend Requirements]] first; it is blocked by default until [[T-030 Story]] is approved.

## Design

- [[Screen Index#s38|s38]]

## Impact

Same as the parent's: [[T-030 Discover search by !pinname and recent searches#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Discover Hub & Search Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-030
