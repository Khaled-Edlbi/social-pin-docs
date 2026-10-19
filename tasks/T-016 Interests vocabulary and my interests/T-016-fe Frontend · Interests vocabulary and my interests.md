---
type: task
id: T-016-fe
status: todo
priority: high
effort: S
feature: interests
module: platform
parent: T-016
labels: [frontend]
screens: [s07, s71]
depends: [T-016-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/high, frontend]
---

# ⬜ T-016-fe · Frontend: Interests vocabulary and my interests

**Parent:** [[T-016 Interests vocabulary and my interests]] · **Feature:** [[Interests]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** S (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-016-fe` when the team picks it up): [[T-016-fe Frontend Requirements|Frontend Requirements]] · [[T-016-fe Frontend Delivery|Frontend Delivery]] · [[T-016-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-016 Interests vocabulary and my interests]]: the screens below show what its *What* describes, built against [[Interests Backend Integration]] once the backend half ([[T-016-be Backend · Interests vocabulary and my interests]]) is current. Write the asks in [[T-016-fe Frontend Requirements]] first; it is blocked by default until [[T-016 Story]] is approved.

## Design

- [[Screen Index#s07|s07]], [[Screen Index#s71|s71]]

## Impact

Same as the parent's: [[T-016 Interests vocabulary and my interests#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Interests Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-016
