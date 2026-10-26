---
type: task
id: T-020-fe
status: todo
priority: high
effort: L
feature: onboarding-imports
module: identity
parent: T-020
labels: [frontend]
screens: [s04, s05]
depends: [T-019, ND-02, T-020-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/identity, priority/high, frontend]
---

# ⬜ T-020-fe · Frontend: LinkedIn import → review → base profile

**Parent:** [[T-020 LinkedIn import → review → base profile]] · **Feature:** [[Onboarding Imports]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-020-fe` when the team picks it up): [[T-020-fe Frontend Requirements|Frontend Requirements]] · [[T-020-fe Frontend Delivery|Frontend Delivery]] · [[T-020-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-020 LinkedIn import → review → base profile]]: the screens below show what its *What* describes, built against [[Onboarding Imports Backend Integration]] once the backend half ([[T-020-be Backend · LinkedIn import → review → base profile]]) is current. Write the asks in [[T-020-fe Frontend Requirements]] first; it is blocked by default until [[T-020 Story]] is approved.

## Design

- [[Screen Index#s04|s04]], [[Screen Index#s05|s05]]

## Impact

Same as the parent's: [[T-020 LinkedIn import → review → base profile#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Onboarding Imports Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-020
