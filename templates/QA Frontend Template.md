---
type: qa-frontend
code: <feature id, or T-NNN for a task-level note>
scope: feature
feature: <feature id>
module: <module id>
status: draft
screens: []
depends: []
affects: []
related: []
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
updated: <date>
tags: [qa-frontend, qa-frontend/draft, module/<module>, layer/qa]
---

# 🧪 <Feature name> · QA Frontend

> Blocked by default until [[<Feature name> Frontend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[<Feature name>]] · **Verifies:** [[<Feature name> Frontend Delivery]] against [[<Feature name> Story]] · **Verdict:** Draft

Expected behaviour of the screens, as artefacts: journeys, states and copy to check a build against, **not test code**. `status: passing` or `failing` after a run; the verdict feeds the story's `verified`.

## Scope

Screens and journeys covered.

## Journeys

| # | Story | Steps | Expected | Checked |
|---|---|---|---|---|
| F1 | S1 | … | … | ⬜ |

## Screen states

| Screen | State | Expected rendering |
|---|---|---|
| [[Screen Index#sNN|sNN]] | loading / empty / error / … | … |

## Flow diagram

```mermaid
flowchart LR
  s01 --> s02 --> s06
```

## Error copy

| ErrorCode | Where | Copy shown |
|---|---|---|

## Verdict

- Run on: — · build: — · result: — · failing rows: —
