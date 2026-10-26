---
type: task
id: T-052-fe
status: todo
priority: medium
effort: L
feature: gemma
module: platform
parent: T-052
labels: [frontend]
screens: [s60]
depends: [T-051, T-036, T-052-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/platform, priority/medium, frontend]
---

# ⬜ T-052-fe · Frontend: Smart Match

**Parent:** [[T-052 Smart Match]] · **Feature:** [[Gemma AI]] · **Side:** Frontend · **Status:** To do · **Priority:** Medium · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-052-fe` when the team picks it up): [[T-052-fe Frontend Requirements|Frontend Requirements]] · [[T-052-fe Frontend Delivery|Frontend Delivery]] · [[T-052-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-052 Smart Match]]: the screens below show what its *What* describes, built against [[Gemma AI Backend Integration]] once the backend half ([[T-052-be Backend · Smart Match]]) is current. Write the asks in [[T-052-fe Frontend Requirements]] first; it is blocked by default until [[T-052 Story]] is approved.

## Design

- [[Screen Index#s60|s60]]

## Impact

Same as the parent's: [[T-052 Smart Match#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Gemma AI Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-052
