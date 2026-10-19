---
type: task
id: T-NNN
status: todo
priority: high
# deadline: YYYY-MM-DD      # optional: when it must be done; the tree colours it green → yellow → red as the day comes, 💀 once missed (docs.config.json deadlines); the task's layer notes inherit it
effort: M
feature: <feature slug>
module: <module id>
# parent: T-NNN            # optional: makes this a sub-task of T-NNN (same feature); it then hangs under that task in the tree
# labels: [bug]            # optional: bug | chore | spike | docs | frontend | backend (docs.config.json taskLabels); a bug found against a task is a sub-task with labels: [bug]; the frontend / backend halves of a task are sub-tasks T-NNN-fe / T-NNN-be with the matching label
labels: []
screens: []
depends: []
affects: []
related: []
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
created: <date>
tags: [task, task/todo, module/<module>, priority/high]
---

# ⬜ T-NNN · <Title>

**Feature:** [[<Feature name>]] · **Status:** To do · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** M (S < 1 day, M 1–3 days, L > 3 days)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-NNN` as each team picks the task up): [[T-NNN Story|Story]] · [[T-NNN Frontend Requirements|Frontend Requirements]] · [[T-NNN Backend Delivery|Backend Delivery]] · [[T-NNN Backend Integration|Backend Integration]] · [[T-NNN Frontend Delivery|Frontend Delivery]] · [[T-NNN QA Backend|QA Backend]] · [[T-NNN QA Frontend|QA Frontend]]

## What

One paragraph: the change, in product terms, and the code it touches.

## Design

- [[Screen Index#sNN|sNN]] …

## Impact

Output of `node scripts/build-tree.mjs --impact T-NNN` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- …

## Definition of done

- [ ] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [ ] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- <date> · created from …
