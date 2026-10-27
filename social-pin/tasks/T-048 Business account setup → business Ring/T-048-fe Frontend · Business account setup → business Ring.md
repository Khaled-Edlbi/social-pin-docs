---
type: task
id: T-048-fe
status: todo
priority: high
effort: L
feature: exhibitor
module: events
parent: T-048
labels: [frontend]
screens: [s63]
depends: ["T-048-be"]
affects: []
related: ["Companies Story"]
pending: []
created: 2026-10-18
updated: 2026-10-27
tags: [task, task/todo, module/events, priority/high, frontend]
---

# ⬜ T-048-fe · Frontend: Business account setup → business Ring

**Parent:** [[T-048 Business account setup → business Ring]] · **Feature:** [[Exhibitor]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-048-fe` when the team picks it up): [[T-048-fe Frontend Requirements|Frontend Requirements]] · [[T-048-fe Frontend Delivery|Frontend Delivery]] · [[T-048-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-048 Business account setup → business Ring]]: the screens below show what its *What* describes, built against [[Exhibitor Backend Integration]] once the backend half ([[T-048-be Backend · Business account setup → business Ring]]) is current. Write the asks in [[T-048-fe Frontend Requirements]] first; it is blocked by default until [[T-048 Story]] is approved.

## Design

- [[Screen Index#s63|s63]]

## Impact

Same as the parent's: [[T-048 Business account setup → business Ring#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Exhibitor Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-048
