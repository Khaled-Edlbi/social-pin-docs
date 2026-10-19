---
type: task
id: T-007-fe
status: todo
priority: critical
effort: M
feature: badge-qr
module: discovery
parent: T-007
labels: [frontend]
screens: [s34]
depends: [T-007-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/discovery, priority/critical, frontend]
---

# ⬜ T-007-fe · Frontend: Issue and rotate the QR token for a Ring

**Parent:** [[T-007 Issue and rotate the QR token for a Ring]] · **Feature:** [[Badge & QR]] · **Side:** Frontend · **Status:** To do · **Priority:** Critical · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-007-fe` when the team picks it up): [[T-007-fe Frontend Requirements|Frontend Requirements]] · [[T-007-fe Frontend Delivery|Frontend Delivery]] · [[T-007-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-007 Issue and rotate the QR token for a Ring]]: the screens below show what its *What* describes, built against [[Badge & QR Backend Integration]] once the backend half ([[T-007-be Backend · Issue and rotate the QR token for a Ring]]) is current. Write the asks in [[T-007-fe Frontend Requirements]] first; it is blocked by default until [[T-007 Story]] is approved.

## Design

- [[Screen Index#s34|s34]]

## Impact

Same as the parent's: [[T-007 Issue and rotate the QR token for a Ring#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Badge & QR Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-007
