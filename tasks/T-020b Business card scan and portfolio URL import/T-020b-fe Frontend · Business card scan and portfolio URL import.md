---
type: task
id: T-020b-fe
status: todo
priority: P2
effort: L
feature: onboarding-imports
module: identity
parent: T-020b
labels: [frontend]
screens: [s03a, s03b]
depends: [D-02, T-020b-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/identity, priority/P2, frontend]
---

# ⬜ T-020b-fe · Frontend: Business card scan and portfolio URL import

**Parent:** [[T-020b Business card scan and portfolio URL import]] · **Feature:** [[Onboarding Imports]] · **Side:** Frontend · **Status:** To do · **Priority:** P2 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-020b-fe` when the team picks it up): [[T-020b-fe Frontend Requirements|Frontend Requirements]] · [[T-020b-fe Frontend Delivery|Frontend Delivery]] · [[T-020b-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-020b Business card scan and portfolio URL import]]: the screens below show what its *What* describes, built against [[Onboarding Imports Backend Integration]] once the backend half ([[T-020b-be Backend · Business card scan and portfolio URL import]]) is current. Write the asks in [[T-020b-fe Frontend Requirements]] first; it is blocked by default until [[T-020b Story]] is approved.

## Design

- [[Screen Index#s03a|s03a]], [[Screen Index#s03b|s03b]]

## Impact

Same as the parent's: [[T-020b Business card scan and portfolio URL import#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Onboarding Imports Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-020b
