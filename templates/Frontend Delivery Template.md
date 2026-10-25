---
type: frontend-delivery
code: <feature id, or T-NNN for a task-level note>
scope: feature
feature: <feature id>
module: <module id>
status: todo
screens: []
depends: []
affects: []
related: []
# priority: high           # optional: inherits the task's or the feature's when absent (critical | high | medium | low)
# deadline: YYYY-MM-DD      # optional: inherits the task's or the feature's when absent
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
# deployedTo: where this build runs, dev | staging | prod (docs.config.json environments); empty until deployed
deployedTo: []
updated: <date>
tags: [frontend-delivery, frontend-delivery/todo, module/<module>, layer/frontend]
---

# ⬜ <Feature name> · Frontend Delivery

> Blocked by default until [[<Feature name> Backend Integration]] is `current` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[<Feature name>]] · **Status:** To do · **Built from:** [[<Feature name> Backend Integration]] · **Against:** [[<Feature name> Story]] · **QA:** [[<Feature name> QA Frontend]]

Written by the **frontend** team after shipping: what the client built, so the backend, QA and product know what exists. A feature-level note is the sum of its task-level notes (table at the end).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#sNN|sNN]] | ✅ / 🟡 / ⬜ | … |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|

## State kept on the client

- …

## Deviations from the story or the integration note

- … (and why; link the decision or task if one exists)

## Not done yet

- … → [[T-NNN …]]

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|

## Log

- <date> · <branch> · what shipped
