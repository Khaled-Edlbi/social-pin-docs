---
type: frontend-requirements
code: <feature id, or T-NNN for a task-level note>
scope: feature
feature: <feature id>
module: <identity|connections|shared-rings|discovery|events|meetings|commerce|platform>
status: draft
screens: []
depends: []
affects: []
related: []
# priority: high           # optional: inherits the task's or the feature's when absent (critical | high | medium | low)
# deadline: YYYY-MM-DD      # optional: inherits the task's or the feature's when absent
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
blockedBy: []
created: <date>
updated: <date>
tags: [frontend-requirements, frontend-requirements/draft, module/<module>, layer/frontend]
---

# <Feature name> · Frontend Requirements

> Blocked by default until [[<Feature name> Story]] is `approved` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[<Feature name>]] · **Status:** Draft · **Story:** [[<Feature name> Story]] · **Backend Integration:** [[<Feature name> Backend Integration]]

Written by the **frontend** team, read by the backend: what the client needs to build the story, and whether each need is met today. `status: approved` once the backend accepts the list; ✅ delivered on its own (the build computes it) once the backend cards of its scope are done with nothing pending.

## Per screen

### [[Screen Index#sNN|sNN]] <Screen name>

- Needs: the data shown, the actions taken, the states to render.
- Source today: endpoint, or "not yet".

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| … | `GET /…` | ✅ | — |
| … | — | ❌ | [[T-NNN …]] |

## Behaviour expectations

- Refetch / realtime: …
- Caching keys: …
- Pagination / ordering: …

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|

## Blocked by

- [[ND-NN …]] — which rows above wait on it.

## Sign-off

- Approved by: — · on: —
