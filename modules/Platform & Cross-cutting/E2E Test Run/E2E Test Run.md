---
type: feature
id: e2e-tests
name: "E2E Test Run"
priority: critical
module: platform
screens: []
updated: 2026-10-19
tags: [feature, module/platform, priority/critical]
---

# E2E Test Run

**Backend:** TODO · **Priority:** Critical · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[E2E Test Run Story|Story]] · [[E2E Test Run Frontend Requirements|Frontend Requirements]] · [[E2E Test Run Backend Delivery|Backend Delivery]] · [[E2E Test Run Backend Integration|Backend Integration]] · [[E2E Test Run Frontend Delivery|Frontend Delivery]] · [[E2E Test Run QA Backend|QA Backend]] · [[E2E Test Run QA Frontend|QA Frontend]]

The e2e specs are written and typecheck but have never run: they need a disposable, migrated and seeded PostGIS database.

## Design reference

_No prototype screen. This is a backend-only concern._

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-055 Run the e2e suite in CI against PostGIS]] | ⬜ To do | Critical | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "e2e-tests" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]
- [[View As & Pin Views]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
