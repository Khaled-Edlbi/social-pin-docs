---
type: task
id: T-010-fe
status: todo
priority: high
effort: M
feature: badge-qr
module: discovery
parent: T-010
labels: [frontend]
screens: [s34]
depends: [T-008, T-010-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/discovery, priority/high, frontend]
---

# ⬜ T-010-fe · Frontend: Public browser page for viewers without the app

**Parent:** [[T-010 Public browser page for viewers without the app]] · **Feature:** [[Badge & QR]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-010-fe` when the team picks it up): [[T-010-fe Frontend Requirements|Frontend Requirements]] · [[T-010-fe Frontend Delivery|Frontend Delivery]] · [[T-010-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-010 Public browser page for viewers without the app]]: the screens below show what its *What* describes, built against [[Badge & QR Backend Integration]] once the backend half ([[T-010-be Backend · Public browser page for viewers without the app]]) is current. Write the asks in [[T-010-fe Frontend Requirements]] first; it is blocked by default until [[T-010 Story]] is approved.

## Design

- [[Screen Index#s34|s34]]

## Impact

Same as the parent's: [[T-010 Public browser page for viewers without the app#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Badge & QR Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-010
