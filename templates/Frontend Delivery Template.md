---
id: FD-NN                  # the card code, in front of the file name; --scaffold writes it
type: frontend-delivery
module: <module id>
feature: <feature id>
status: todo
scope: feature
# priority: high           # optional: inherits the feature's when absent (critical | high | medium | low)
# deadline: YYYY-MM-DD      # optional: inherits the feature's when absent
# deployedTo: where this build runs, dev | staging | prod (docs.config.json environments); empty until deployed
deployedTo: []
screens: []
depends: []
affects: []
related: []
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
created: <date>
updated: <date>
tags: [frontend-delivery, frontend-delivery/todo, module/<module>, layer/frontend]
---

# ⬜ <Feature name> · Frontend Delivery

> Blocked by default until [[<Feature name> Backend Integration]] is `current` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[<Feature name>]] · **Status:** To do · **Built from:** [[<Feature name> Backend Integration]] · **Against:** [[<Feature name> Story]] · **QA:** [[<Feature name> QA Frontend]]

Written by the **frontend** team after shipping: what the client built, so the backend, QA and product know what exists. One note per feature: a new part of the story adds its screens here.

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

- … (and why; link the decision or the story part if one exists)

## Not done yet

- … → [[S-NN <Feature name> Story#S<n> · …]] or [[ND-NN …]]

## Log

- <date> · <branch> · what shipped
