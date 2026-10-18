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
updated: <date>
tags: [backend-delivery, backend-delivery/todo, module/<module>, layer/backend]
---

# ⬜ <Feature name> · Backend Delivery

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
