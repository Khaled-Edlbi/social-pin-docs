---
type: task
id: T-049-be
status: todo
priority: high
effort: M
feature: subscription
module: commerce
parent: T-049
labels: [backend]
screens: [s70]
depends: []
affects: []
related: []
pending: []
created: 2026-10-18
updated: 2026-10-26
tags: [task, task/todo, module/commerce, priority/high, backend]
---

# ⬜ T-049-be · Backend: Subscription endpoints and a single Pro gate

**Parent:** [[T-049 Subscription endpoints and a single Pro gate]] · **Feature:** [[Subscription (Free vs Pro)]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-049-be` when the team picks it up): [[T-049-be Backend Delivery|Backend Delivery]] · [[T-049-be Backend Integration|Backend Integration]] · [[T-049-be QA Backend|QA Backend]]

## What

The API side of [[T-049 Subscription endpoints and a single Pro gate]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-049-be Backend Delivery]] and how to call it in [[T-049-be Backend Integration]], and roll both up into [[Subscription (Free vs Pro) Backend Delivery]] and [[Subscription (Free vs Pro) Backend Integration]].

## Design

- [[Screen Index#s70|s70]]

## Impact

Same as the parent's: [[T-049 Subscription endpoints and a single Pro gate#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-049
