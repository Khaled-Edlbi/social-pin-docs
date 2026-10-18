---
type: task
id: T-013-fe
status: todo
priority: P2
effort: S
feature: photo-library
module: identity
parent: T-013
labels: [frontend]
screens: [s30]
depends: [T-012, T-013-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/identity, priority/P2, frontend]
---

# ⬜ T-013-fe · Frontend: Usage count per file across Rings

**Parent:** [[T-013 Usage count per file across Rings]] · **Feature:** [[Photo Library]] · **Side:** Frontend · **Status:** To do · **Priority:** P2 · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-013-fe` when the team picks it up): [[T-013-fe Frontend Requirements|Frontend Requirements]] · [[T-013-fe Frontend Delivery|Frontend Delivery]] · [[T-013-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-013 Usage count per file across Rings]]: the screens below show what its *What* describes, built against [[Photo Library Backend Integration]] once the backend half ([[T-013-be Backend · Usage count per file across Rings]]) is current. Write the asks in [[T-013-fe Frontend Requirements]] first; it is blocked by default until [[T-013 Story]] is approved.

## Design

- [[Screen Index#s30|s30]]

## Impact

Same as the parent's: [[T-013 Usage count per file across Rings#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Photo Library Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-013
