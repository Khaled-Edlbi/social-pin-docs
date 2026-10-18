---
type: task
id: T-032-fe
status: todo
priority: P1
effort: L
feature: pincast
module: discovery
parent: T-032
labels: [frontend]
screens: [s39, s40, s41, s42]
depends: [T-032-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/discovery, priority/P1, frontend]
---

# ⬜ T-032-fe · Frontend: PinCast setup, start, stop, results

**Parent:** [[T-032 PinCast setup, start, stop, results]] · **Feature:** [[PinCast & Nearby]] · **Side:** Frontend · **Status:** To do · **Priority:** P1 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-032-fe` when the team picks it up): [[T-032-fe Frontend Requirements|Frontend Requirements]] · [[T-032-fe Frontend Delivery|Frontend Delivery]] · [[T-032-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-032 PinCast setup, start, stop, results]]: the screens below show what its *What* describes, built against [[PinCast & Nearby Backend Integration]] once the backend half ([[T-032-be Backend · PinCast setup, start, stop, results]]) is current. Write the asks in [[T-032-fe Frontend Requirements]] first; it is blocked by default until [[T-032 Story]] is approved.

## Design

- [[Screen Index#s39|s39]], [[Screen Index#s40|s40]], [[Screen Index#s41|s41]], [[Screen Index#s42|s42]]

## Impact

Same as the parent's: [[T-032 PinCast setup, start, stop, results#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[PinCast & Nearby Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-032
