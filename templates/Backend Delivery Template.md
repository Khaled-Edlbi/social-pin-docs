---
id: BD-NN                  # the card code, in front of the file name; --scaffold writes it
type: backend-delivery
module: <module id>
feature: <feature id>
status: todo
scope: feature
# priority: high           # optional: inherits the feature's when absent (critical | high | medium | low)
# deadline: YYYY-MM-DD      # optional: inherits the feature's when absent
# deployedTo: where this delivery runs, dev | staging | prod (docs.config.json environments); empty until deployed
deployedTo: []
screens: []
depends: []
affects: []
related: []
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
created: <date>
updated: <date>
tags: [backend-delivery, backend-delivery/todo, module/<module>, layer/backend]
---

# ⬜ <Feature name> · Backend Delivery

> Blocked by default until [[<Feature name> Frontend Requirements]] is `approved` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[<Feature name>]] · **Status:** To do · **Integration guide:** [[<Feature name> Backend Integration]] · **Requirements:** [[<Feature name> Frontend Requirements]] · **QA:** [[<Feature name> QA Backend]]

Written by the **backend** team: what shipped and how it works, as it **is**. One note per feature: a new part of the story adds its rows here.

## Endpoints, tables and code

**Endpoints**

- `GET /…`

**Tables / models:** `…`

**Code:** `src/modules/<feature>/`

## How it works

Call order, transactions, access checks (every visibility decision goes through `RingAccessService`), what each error means.

### What exists

- …

### Gaps

- … → [[S-NN <Feature name> Story#S<n> · …]] or [[ND-NN …]]

## Log

- <date> · <branch> · what shipped (endpoints, tables, codes)
