---
type: feature
id: error-contract
name: "Error Contract"
priority: P0
module: platform
screens: []
updated: 2026-10-18
tags: [feature, module/platform, priority/P0]
---

# Error Contract

**Backend:** Partial (needs more) · **Priority:** P0 · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Error Contract Story|Story]] · [[Error Contract Frontend Requirements|Frontend Requirements]] · [[Error Contract Backend Delivery|Backend Delivery]] · [[Error Contract Backend Integration|Backend Integration]] · [[Error Contract Frontend Delivery|Frontend Delivery]] · [[Error Contract QA Backend|QA Backend]] · [[Error Contract QA Frontend|QA Frontend]]

One error body for the whole API, with a stable per-domain code the client branches on and a human message it displays.

## Design reference

_No prototype screen. Every error state in the app depends on it._

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-063 Put the ErrorCode on the error body]] | ⬜ To do | P0 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "error-contract" SORT priority ASC
```

## Related

- [[API Conventions]]
- [[Frontend Contract]]
- [[Frontend Contract]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
