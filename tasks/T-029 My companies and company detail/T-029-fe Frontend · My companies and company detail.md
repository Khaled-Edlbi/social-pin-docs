---
type: task
id: T-029-fe
status: todo
priority: high
effort: M
feature: companies
module: shared-rings
parent: T-029
labels: [frontend]
screens: [s72, s73]
depends: [T-029-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/shared-rings, priority/high, frontend]
---

# ⬜ T-029-fe · Frontend: My companies and company detail

**Parent:** [[T-029 My companies and company detail]] · **Feature:** [[Companies]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-029-fe` when the team picks it up): [[T-029-fe Frontend Requirements|Frontend Requirements]] · [[T-029-fe Frontend Delivery|Frontend Delivery]] · [[T-029-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-029 My companies and company detail]]: the screens below show what its *What* describes, built against [[Companies Backend Integration]] once the backend half ([[T-029-be Backend · My companies and company detail]]) is current. Write the asks in [[T-029-fe Frontend Requirements]] first; it is blocked by default until [[T-029 Story]] is approved.

## Design

- [[Screen Index#s72|s72]], [[Screen Index#s73|s73]]

## Impact

Same as the parent's: [[T-029 My companies and company detail#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Companies Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-029
