---
type: story
code: e2e-tests
scope: feature
feature: e2e-tests
module: platform
status: approved
screens: []
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-25
tags: [story, story/approved, module/platform, layer/business]
---

# E2E Test Run · User Story

**Feature:** [[E2E Test Run]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[E2E Test Run Frontend Requirements]] · **API Integration:** not yet (backend not built)

The e2e specs boot the whole app through the same `configureApp(app)` as `main.ts` and assert the behaviour the [[Frontend Contract]] promises: the three-call sign-up, the identical 404 for missing / not shared / blocked, the error body shape. They typecheck and have never run, because they need a disposable, migrated and seeded PostGIS database. Until they run in CI, the contract is a claim rather than a check. There is no screen.

## Persona

The developer opening a pull request, and the product owner who wants "the API does what the vault says" to be mechanically true before a client is built on it.

## Stories

### S1 · The suite runs on every pull request

**As a** developer **I want** `pnpm test:e2e` to run in CI against a fresh PostGIS container **so that** a change that breaks the contract fails the PR, not the client.

Acceptance criteria:
- [ ] CI starts a `postgis/postgis` service, runs `pnpm prisma:deploy`, `pnpm db:seed`, then `pnpm test:e2e`, in that order.
- [ ] The three hand-authored migrations replay cleanly (extensions, init, constraints) and the GiST index on `pincasts.geo` survives.
- [ ] The job is required for merge.

### S2 · The database is disposable

**As the** operator **I want** the e2e database created and thrown away per run **so that** no spec ever points at a shared or production instance.

Acceptance criteria:
- [ ] `DATABASE_URL` for the job names the service container only; no secret from staging or production is mounted.
- [ ] Specs write freely; nothing they write outlives the job.

### S3 · The contract the client relies on is asserted

**As a** frontend developer **I want** the specs that matter to a client kept green **so that** I can build the 404 handling, the token store and the error parsing from the vault without re-verifying by hand.

Acceptance criteria:
- [ ] The specs asserting identical 404 bodies for "no such name", "not shared" and "blocked" pass.
- [ ] The specs asserting that hidden links and `ringId` never appear in a response pass, and the passwordless sign-in flow (`login` → `login/verify`) is covered end to end.
- [ ] A spec asserts `devCode` is present under `NODE_ENV=test` and absent otherwise.

## States and motion the design asks for

- None. No prototype screen references the test run.

## Rules the backend already enforces

- `configureApp(app)` is called by `main.ts` and by every e2e spec, so the prefix, versioning, validation pipe, serializer and exception filter under test are the ones in production.
- Specs live in `test/` with `test/jest-e2e.config.js`; unit specs sit beside their units and already run.

## Open questions

- No decision note names this feature. [[T-055 Run the e2e suite in CI against PostGIS]] is To do.
