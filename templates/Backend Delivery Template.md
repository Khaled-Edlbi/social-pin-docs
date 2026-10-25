---
type: backend-delivery
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
# deployedTo: where this delivery runs, dev | staging | prod (docs.config.json environments); empty until deployed
deployedTo: []
created: <date>
updated: <date>
tags: [backend-delivery, backend-delivery/todo, module/<module>, layer/backend]
---

# ⬜ <Feature name> · Backend Delivery

> Blocked by default until [[<Feature name> Frontend Requirements]] is `approved` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[<Feature name>]] · **Status:** To do · **Integration guide:** [[<Feature name> Backend Integration]] · **Requirements:** [[<Feature name> Frontend Requirements]] · **QA:** [[<Feature name> QA Backend]]

Written by the **backend** team: what shipped and how it works, as it **is**. A feature-level note is the sum of its task-level notes (table at the end).

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

- … → [[T-NNN …]]

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|

## Log

- <date> · <branch> · what shipped (endpoints, tables, codes)
