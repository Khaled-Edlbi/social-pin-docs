---
id: F-43
type: feature
module: platform
feature: build-deploy
priority: medium
release: later
screens: []
depends: []
affects: []
related: ["F-34 E2E Test Run", "Developer Setup"]
created: 2026-10-26
updated: 2026-10-29
tags: [feature, module/platform, priority/medium, release/later]
---

# Build & Deploy

**Backend:** 🟡 Partial (shipped, dev and stage only) · **Priority:** Medium · **Release:** Later · **Deadline:** — · **Module:** [[M-08 Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[S-116 Build & Deploy Story|Story]] · [[Build & Deploy Frontend Requirements|Frontend Requirements]] · [[Build & Deploy Backend Delivery|Backend Delivery]] · [[Build & Deploy Backend Integration|Backend Integration]] · [[Build & Deploy Frontend Delivery|Frontend Delivery]] · [[Build & Deploy QA Backend|QA Backend]] · [[Build & Deploy QA Frontend|QA Frontend]]

How the backend gets built and shipped: the GitLab pipeline, the Docker image
and the compose files, and which branch deploys where. Not a product feature —
nobody using Social Pin ever sees it — but it is how everything else reaches a
server, which is why it gets a card rather than living only in a repository
nobody reads.

Two environments exist today, development and stage. There is no production
pipeline yet.

## Design reference

_No prototype screen. This is a delivery concern, not a product one._

## Product rules

- **A branch decides the environment, nothing else.** `main` and `master` build
  and deploy *development*; the `stage` branch builds and deploys *stage*. No
  other branch deploys anywhere, and there is no production job at all.
- **Secrets never live in the repository.** `SSH_PRIVATE_KEY` is read from the
  GitLab project variables; `.gitlab-ci.yml` carries a placeholder that says so
  in place of a value. The registry credentials are GitLab's own `CI_REGISTRY_*`.
- **The server keeps its own `.env`.** The deploy copies `.env.example` to
  `.env` only when none exists, so a deploy never overwrites the environment of
  a running host.
- **The image is built, pushed and pulled, never built on the host.** The deploy
  ships a compose file and runs `docker compose pull`, so what runs is the image
  the pipeline built.

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-116 Build & Deploy Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-073 | GitLab pipeline and Docker setup | Done | medium | history only |

### Log of the merged tasks

- T-073 · 2026-10-26 · filed retroactively under [[F-43 Build & Deploy]] for `c1dd4a4`, which

## Decisions

- None raised. `release:` and `priority:` are the owner's to set; the pipeline
  shipped before this card existed.

## Related

- [[F-34 E2E Test Run]] — the other half of CI: [[S-85 E2E Test Run Story|E2E Test Run · S4]]
  adds a test job to this pipeline
- [[Developer Setup]] — the same stack, run locally rather than in a job

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
