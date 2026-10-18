---
type: feature
id: e2e-tests
name: "E2E Test Run"
status: todo
priority: P0
domain: platform
screens: []
updated: 2026-10-18
tags: [feature, status/todo, domain/platform, priority/P0]
---

# ❌ E2E Test Run

**Status:** TODO · **Priority:** P0 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]] · **Story:** [[E2E Test Run Story]] · **Requirements:** [[E2E Test Run Requirements]]

The e2e specs are written and typecheck but have never run: they need a disposable, migrated and seeded PostGIS database.

## Design reference

_No prototype screen. This is a backend-only concern._

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Code:** `test/`, `test/jest-e2e.config.js`, `ci/`

### What exists

- Specs exist; `configureApp(app)` is shared with `main.ts`.

### Gaps

- CI job with a `postgis/postgis` service container.
- Run `pnpm prisma:deploy && pnpm db:seed && pnpm test:e2e`.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-055 Run the e2e suite in CI against PostGIS]] | ⬜ To do | P0 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "e2e-tests" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]
- [[View As & Pin Views]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
