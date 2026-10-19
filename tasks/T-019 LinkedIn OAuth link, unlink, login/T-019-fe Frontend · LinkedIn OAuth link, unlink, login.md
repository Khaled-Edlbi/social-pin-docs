---
type: task
id: T-019-fe
status: todo
priority: high
effort: L
feature: linked-accounts
module: platform
parent: T-019
labels: [frontend]
screens: [s01, s04, s68]
depends: [T-019-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-19
tags: [task, task/todo, module/platform, priority/high, frontend]
---

# ⬜ T-019-fe · Frontend: LinkedIn OAuth link, unlink, login

**Parent:** [[T-019 LinkedIn OAuth link, unlink, login]] · **Feature:** [[Linked Accounts (OAuth)]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** L (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-019-fe` when the team picks it up): [[T-019-fe Frontend Requirements|Frontend Requirements]] · [[T-019-fe Frontend Delivery|Frontend Delivery]] · [[T-019-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-019 LinkedIn OAuth link, unlink, login]]: the screens below show what its *What* describes, built against [[Linked Accounts (OAuth) Backend Integration]] once the backend half ([[T-019-be Backend · LinkedIn OAuth link, unlink, login]]) is current. Write the asks in [[T-019-fe Frontend Requirements]] first; it is blocked by default until [[T-019 Story]] is approved.

## Design

- [[Screen Index#s01|s01]], [[Screen Index#s04|s04]], [[Screen Index#s68|s68]]

## Impact

Same as the parent's: [[T-019 LinkedIn OAuth link, unlink, login#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Linked Accounts (OAuth) Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-019
