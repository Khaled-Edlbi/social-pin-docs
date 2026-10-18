---
type: requirements
id: <feature slug — same as the feature note's id>
feature: <feature slug>
status: draft
domain: <identity|connections|shared-rings|discovery|events|meetings|commerce|platform>
screens: []
updated: <date>
tags: [requirements, requirements/draft, domain/<domain>]
---

# <Feature name> · Frontend Requirements

**Feature:** [[<Feature name>]] · **Status:** Draft · **Story:** [[<Feature name> Story]] · **API Integration:** [[<Feature name> Frontend]]

What the client needs from the backend to build the screens in the story, and whether each need is met today.

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
