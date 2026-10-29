---
id: FR-34
type: frontend-requirements
module: platform
feature: e2e-tests
status: draft
scope: feature
screens: []
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/draft, module/platform, layer/frontend]
---

# E2E Test Run · Frontend Requirements

**Feature:** [[F-34 E2E Test Run]] · **Status:** Draft · **Story:** [[S-85 E2E Test Run Story]] · **API Integration:** not yet (backend not built)

What the client depends on from the e2e run: nothing at runtime, everything at build time. A green e2e job is what lets the frontend treat the vault's endpoint tables, error tables and privacy guarantees as facts. There is no screen and no endpoint.

## Per screen

### No screen

- Needs: nothing rendered.
- Source today: none. The specs exist and typecheck; they have not run.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| CI job: PostGIS service, deploy, seed, `test:e2e` | — (CI, no route) | ❌ | [[S-85 E2E Test Run Story|E2E Test Run · S4]] |

## Behaviour expectations

- Guarantees the client builds on, each covered by an e2e spec once the suite runs: `GET /views/pin/:pinName` returns one 404 body for missing, not shared and blocked; no response carries `ringId`, or a hidden link; the error body is `{ statusCode, message, error, path, timestamp }` with `message` a string array on validation failures; `limit` above 50 is a 400, not a clamp; refresh tokens are single-use.
- Until [[S-85 E2E Test Run Story|E2E Test Run · S4]] ships, those guarantees rest on unit specs and code reading. The client should still build to them; nothing in the design depends on a different behaviour.
- Environment: the e2e run uses `NODE_ENV=test`, so the specs see `devCode`; the client must not read that as production behaviour.
- Refetch / realtime, caching keys, pagination: none.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| — | — | None. This feature has no runtime surface. |

## Blocked by

- No decision. [[S-85 E2E Test Run Story|E2E Test Run · S4]] is To do and needs only a CI definition.
