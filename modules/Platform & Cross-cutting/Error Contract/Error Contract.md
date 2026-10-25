---
type: feature
id: error-contract
name: "Error Contract"
priority: critical
release: mvp
module: platform
screens: []
created: 2026-10-18
updated: 2026-10-25
tags: [feature, module/platform, priority/critical, release/mvp]
---

# Error Contract

**Backend:** Partial (needs more) · **Priority:** Critical · **Release:** MVP · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Error Contract Story|Story]] · [[Error Contract Frontend Requirements|Frontend Requirements]] · [[Error Contract Backend Delivery|Backend Delivery]] · [[Error Contract Backend Integration|Backend Integration]] · [[Error Contract Frontend Delivery|Frontend Delivery]] · [[Error Contract QA Backend|QA Backend]] · [[Error Contract QA Frontend|QA Frontend]]

One error body for the whole API, with a stable per-domain code the client branches on and a human message it displays.

## Design reference

_No prototype screen. Every error state in the app depends on it._

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-063 Put the ErrorCode on the error body]] | ⬜ To do | Critical | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "error-contract" SORT priority ASC
```

## Related

- [[API Conventions]]
- [[Frontend Contract]]
- [[Frontend Contract]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
