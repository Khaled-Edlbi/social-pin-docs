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
blockedBy: []
updated: <date>
tags: [frontend-requirements, frontend-requirements/draft, module/<module>, layer/frontend]
---

# <Feature name> · Frontend Requirements

**Feature:** [[<Feature name>]] · **Status:** Draft · **Story:** [[<Feature name> Story]] · **Backend Integration:** [[<Feature name> Backend Integration]]

Written by the **frontend** team, read by the backend: what the client needs to build the story, and whether each need is met today. `status: approved` once the backend accepts the list; `delivered` once every row is ✅.

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

- [[D-NN …]] — which rows above wait on it.

## Sign-off

- Approved by: — · on: —
