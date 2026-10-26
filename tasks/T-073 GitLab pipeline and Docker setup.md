---
type: task
id: T-073
status: done
priority: medium
effort: S
feature: build-deploy
module: platform
labels: [chore]
screens: []
depends: []
affects: ["Developer Guide", "Developer Setup"]
related: [T-055]
pending: ["@backend: the pipeline's runs are not verified from here", "@backend: no production job — only development and stage", "@backend: docs-only task, so no layer notes (Workflow §3)"]
created: 2026-10-26
updated: 2026-10-26
tags: [task, task/done, module/platform, priority/medium, chore]
---

# ✅ T-073 · GitLab pipeline and Docker setup

**Feature:** [[Build & Deploy]] · **Status:** Done · **Priority:** Medium · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Layer notes** (created with `node scripts/build-tree.mjs --scaffold <kind> T-073` as each team picks the task up): [[T-073 Story|Story]] · [[T-073 Frontend Requirements|Frontend Requirements]] · [[T-073 Backend Delivery|Backend Delivery]] · [[T-073 Backend Integration|Backend Integration]] · [[T-073 Frontend Delivery|Frontend Delivery]] · [[T-073 QA Backend|QA Backend]] · [[T-073 QA Frontend|QA Frontend]]

## What

The pipeline that builds the backend and puts it on a server, shipped in
`c1dd4a4` before this vault had a card for it. `.gitlab-ci.yml` declares the
`build` and `deploy` stages and includes `ci/scripts.yml` (the shared anchors),
`ci/development.yml` and `ci/stage.yml`. That gives four jobs:
`build:development` and `deploy:development`, which run only on `main` or
`master`, and `build:stage` and `deploy:stage`, which run only on `stage`.

A build logs into GitLab's registry, prunes old and dangling images, then
builds `docker/Dockerfile` (a two-stage `node:22-alpine` image that runs
`prisma generate` before `nest build`, with a throwaway `DATABASE_URL` because
`prisma.config.ts` reads one at import time) and pushes it under the
environment's tag. A deploy adds the SSH key from the GitLab variables, copies
the matching compose file to the host, seeds `.env` from `.env.example` when the
host has none, then pulls the image and brings the stack up.

This card records what exists rather than asking for new work. What is **not**
there: a production job, any test or migration step in the pipeline (see
[[T-055 Run the e2e suite in CI against PostGIS]]), and any verification from
the vault's side that the jobs actually pass.

## Design

- —

## Impact

Output of `node scripts/build-tree.mjs --impact T-073` when the task was written: the notes this change touches and that must be updated or flagged when it ships.

- [[Build & Deploy]] · F-43 — wikilink ←

## Definition of done

- [x] Code per the backend's `CLAUDE.md` (every visibility decision through `RingAccessService`)
- [x] `pnpm typecheck && pnpm test` green
- [ ] Task-level layer notes written by each team that touched it; feature-level notes updated (the feature is the sum of its tasks)
- [x] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [x] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- 2026-10-26 · filed retroactively under [[Build & Deploy]] for `c1dd4a4`, which
  shipped the pipeline before the vault tracked it. Done, with `pending:` for
  the production job that does not exist and for the runs nobody has checked
  from here, so it reads Partial rather than clean.
