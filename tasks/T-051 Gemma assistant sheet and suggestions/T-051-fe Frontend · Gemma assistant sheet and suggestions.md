---
type: task
id: T-051-fe
status: todo
priority: P2
effort: L
feature: gemma
module: platform
parent: T-051
labels: [frontend]
screens: [s13]
depends: [T-016, T-049, T-051-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-18
tags: [task, task/todo, module/platform, priority/P2, frontend]
---

# ⬜ T-051-fe · Frontend: Gemma assistant sheet and suggestions

**Parent:** [[T-051 Gemma assistant sheet and suggestions]] · **Feature:** [[Gemma AI]] · **Side:** Frontend · **Status:** To do · **Priority:** P2 · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-051-fe` when the team picks it up): [[T-051-fe Frontend Requirements|Frontend Requirements]] · [[T-051-fe Frontend Delivery|Frontend Delivery]] · [[T-051-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-051 Gemma assistant sheet and suggestions]]: the screens below show what its *What* describes, built against [[Gemma AI Backend Integration]] once the backend half ([[T-051-be Backend · Gemma assistant sheet and suggestions]]) is current. Write the asks in [[T-051-fe Frontend Requirements]] first; it is blocked by default until [[T-051 Story]] is approved.

## Design

- [[Screen Index#s13|s13]]

## Impact

Same as the parent's: [[T-051 Gemma assistant sheet and suggestions#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Gemma AI Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-051
