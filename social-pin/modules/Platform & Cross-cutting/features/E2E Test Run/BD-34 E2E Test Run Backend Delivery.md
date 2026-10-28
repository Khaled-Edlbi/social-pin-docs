---
type: backend-delivery
code: e2e-tests
scope: feature
feature: e2e-tests
module: platform
status: todo
screens: []
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/todo, module/platform, layer/backend]
---

# ⬜ E2E Test Run · Backend Delivery

**Feature:** [[F-34 E2E Test Run]] · **Status:** To do · **Integration guide:** [[E2E Test Run Backend Integration]] · **Requirements:** [[FR-34 E2E Test Run Frontend Requirements]] · **QA:** [[E2E Test Run QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Code:** `test/`, `test/jest-e2e.config.js`, `ci/`

### What exists

- Specs exist; `configureApp(app)` is shared with `main.ts`.

### Gaps

- CI job with a `postgis/postgis` service container.
- Run `pnpm prisma:deploy && pnpm db:seed && pnpm test:e2e`.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[F-34 E2E Test Run]] when the vault moved to layers
