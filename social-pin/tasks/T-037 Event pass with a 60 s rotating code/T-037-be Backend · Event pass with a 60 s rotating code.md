---
type: task
id: T-037-be
status: todo
priority: high
effort: M
feature: events-during
module: events
parent: T-037
labels: [backend]
screens: [s56]
depends: ["T-007"]
affects: []
related: ["Event Ring Auto-creation Story"]
pending: []
created: 2026-10-18
updated: 2026-10-27
tags: [task, task/todo, module/events, priority/high, backend]
---

# ⬜ T-037-be · Backend: Event pass with a 60 s rotating code

**Parent:** [[T-037 Event pass with a 60 s rotating code]] · **Feature:** [[Events During]] · **Side:** Backend · **Status:** To do · **Priority:** High · **Effort:** M (same as the parent until the team sizes it)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-037-be` when the team picks it up): [[T-037-be Backend Delivery|Backend Delivery]] · [[T-037-be Backend Integration|Backend Integration]] · [[T-037-be QA Backend|QA Backend]]

## What

The API side of [[T-037 Event pass with a 60 s rotating code]]: the endpoints, data and rules its *What* describes. Record what shipped in [[T-037-be Backend Delivery]] and how to call it in [[T-037-be Backend Integration]], and roll both up into [[Events During Backend Delivery]] and [[Events During Backend Integration]].

## Design

- [[Screen Index#s56|s56]]

## Impact

Same as the parent's: [[T-037 Event pass with a 60 s rotating code#Impact]].

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Backend Delivery and Backend Integration notes written and rolled up into the feature-level notes; QA Backend run; `pending` cleared or handed over
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-18 · created as the backend half of T-037
