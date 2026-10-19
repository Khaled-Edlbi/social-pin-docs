---
type: backend-integration
code: <feature id, or T-NNN for a task-level note>
scope: feature
feature: <feature id>
module: <module id>
status: draft
screens: []
depends: []
affects: []
related: []
# priority: high           # optional: inherits the task's or the feature's when absent (critical | high | medium | low)
# deadline: YYYY-MM-DD      # optional: inherits the task's or the feature's when absent
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
updated: <date>
tags: [backend-integration, backend-integration/draft, module/<module>, layer/backend]
---

# 🔌 <Feature name> · Backend Integration

> Blocked by default until [[<Feature name> Backend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[<Feature name>]] · **Backend:** [[<Feature name> Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]]

Written by the **backend** team for the frontend: how to call what was delivered. `status: current` once it matches the code on `main`.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#sNN|sNN]] | … | `GET /…` |

## Flow

1. …

## Shapes that matter

```json
{ }
```

## State to keep on the client

- …

## Errors to handle

| Status | ErrorCode | Meaning | Show |
|---|---|---|---|

## Rules the UI must respect

- …

## Not available yet

- … → [[T-NNN …]]

## Checklist

- [ ] …
