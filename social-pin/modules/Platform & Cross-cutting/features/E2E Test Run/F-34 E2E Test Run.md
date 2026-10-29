---
id: F-34
type: feature
module: platform
feature: e2e-tests
priority: critical
release: mvp
screens: []
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/platform, priority/critical, release/mvp]
---

# E2E Test Run

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[M-08 Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[S-85 E2E Test Run Story|Story]] · [[FR-34 E2E Test Run Frontend Requirements|Frontend Requirements]] · [[BD-34 E2E Test Run Backend Delivery|Backend Delivery]] · [[E2E Test Run Backend Integration|Backend Integration]] · [[E2E Test Run Frontend Delivery|Frontend Delivery]] · [[E2E Test Run QA Backend|QA Backend]] · [[E2E Test Run QA Frontend|QA Frontend]]

The e2e specs are written and typecheck but have never run: they need a disposable, migrated and seeded PostGIS database.

## Design reference

_No prototype screen. This is a backend-only concern._

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-85 E2E Test Run Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-055 | Run the e2e suite in CI against PostGIS | To do | critical | S4 |

### Log of the merged tasks

- T-055 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-055 · 2026-10-18 · created as the backend half of T-055

## Related

- [[F-02 Auth & Sign-up]]
- [[F-12 View As & Pin Views]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
