---
type: task
id: T-049-fe
status: todo
priority: high
effort: M
feature: subscription
module: commerce
parent: T-049
labels: [frontend]
screens: [s70]
depends: [T-049-be]
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/commerce, priority/high, frontend]
---

# ⬜ T-049-fe · Frontend: Subscription endpoints and a single Pro gate

**Parent:** [[T-049 Subscription endpoints and a single Pro gate]] · **Feature:** [[Subscription (Free vs Pro)]] · **Side:** Frontend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-049-fe` when the team picks it up): [[T-049-fe Frontend Requirements|Frontend Requirements]] · [[T-049-fe Frontend Delivery|Frontend Delivery]] · [[T-049-fe QA Frontend|QA Frontend]]

## What

The client side of [[T-049 Subscription endpoints and a single Pro gate]]: the screens below show what its *What* describes, built against [[Subscription (Free vs Pro) Backend Integration]] once the backend half ([[T-049-be Backend · Subscription endpoints and a single Pro gate]]) is current. Write the asks in [[T-049-fe Frontend Requirements]] first; it is blocked by default until [[T-049 Story]] is approved.

## Design

- [[Screen Index#s70|s70]]

## Impact

Same as the parent's: [[T-049 Subscription endpoints and a single Pro gate#Impact]].

## Definition of done

- [ ] Frontend Requirements written before asking for backend work; every row ✅ against the Backend Integration note
- [ ] Screens merged; Frontend Delivery note written and rolled up into [[Subscription (Free vs Pro) Frontend Delivery]]
- [ ] QA Frontend run on a named build; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the frontend half of T-049
