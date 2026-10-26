---
type: task
id: T-031-fe
status: todo
priority: medium
effort: M
feature: discover-hub
module: discovery
parent: T-031
labels: [frontend]
screens: [s38]
depends: [T-031-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/discovery, priority/medium, frontend]
---

# ⬜ T-031-fe · Frontend: Import contacts

**Parent:** [[T-031 Import contacts]] · **Feature:** [[Discover Hub & Search]] · **Side:** Frontend · **Status:** To do · **Priority:** Medium · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-031-fe` when the team picks it up): [[T-031-fe Frontend Requirements|Frontend Requirements]] · [[T-031-fe Frontend Delivery|Frontend Delivery]] · [[T-031-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-031 Import contacts]]: the screens below show what its *What* describes, built against [[Discover Hub & Search Backend Integration]] once the backend half ([[T-031-be Backend · Import contacts]]) is current. Write the asks in [[T-031-fe Frontend Requirements]] first; it is blocked by default until [[T-031 Story]] is approved.

## Design

- [[Screen Index#s38|s38]]

## Impact

Same as the parent's: [[T-031 Import contacts#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Discover Hub & Search Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-031
