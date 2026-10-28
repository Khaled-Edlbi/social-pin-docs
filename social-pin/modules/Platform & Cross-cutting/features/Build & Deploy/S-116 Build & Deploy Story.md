---
type: story
code: build-deploy
scope: feature
feature: build-deploy
module: platform
status: draft
screens: []
depends: []
affects: []
related: ["F-43 Build & Deploy", "Architecture", "Developer Setup"]
pending: []
approvedBy: ""
approvedAt: ""
owner: "Omar Fostok"
created: 2026-10-27
updated: 2026-10-28
tags: [story, story/draft, module/platform, layer/business]
---

# Build & Deploy · User Story

**Feature:** [[F-43 Build & Deploy]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** — (no client part) · **Backend Integration:** — · **Verified by:** [[Build & Deploy QA Backend]]

The people who build Social Pin want every change that is merged to reach a server on its own, the same way every time, without anyone copying files by hand or keeping a password in the code. Today a merge to `main` reaches **development** and a merge to `stage` reaches **stage**; there is no production pipeline yet. Nobody using the app ever sees this feature: it is how every other feature reaches a server. The work that set it up (T-073, done) is in the history on [[F-43 Build & Deploy]].

## Persona

A **backend developer** on the team, merging a change, and the **person who looks after the servers**, who must trust that a deploy never breaks the environment a host is already running with.

## Stories

### S1 · A merge to main reaches development (journey, no prototype screen)

**As a** backend developer **I want** a merge to `main` (or `master`) to build and deploy development by itself **so that** the team tries my change on a real server minutes later.

Acceptance criteria:
- [ ] A push to `main` or `master` runs the GitLab pipeline: it builds the Docker image, pushes it to the GitLab registry and deploys **development**.
- [ ] A push to any other branch builds nothing and deploys nowhere.
- [ ] A failed build deploys nothing; the server keeps running the last good image.

### S2 · The stage branch reaches stage (journey, no prototype screen)

**As a** backend developer **I want** a merge to `stage` to deploy the stage server **so that** a release can be checked on a server that is not development.

Acceptance criteria:
- [ ] A push to `stage` builds, pushes and deploys **stage**, and only stage.
- [ ] Development and stage never deploy from the same push.

### S3 · No secret lives in the code (journey, no prototype screen)

**As the** person who looks after the servers **I want** no key or password in the repository **so that** reading the code never gives anyone access to a server.

Acceptance criteria:
- [ ] The SSH key is read from the GitLab project variables (`SSH_PRIVATE_KEY`); `.gitlab-ci.yml` carries a placeholder that says so, never a value.
- [ ] The registry login uses GitLab's own `CI_REGISTRY_*` credentials.

### S4 · A deploy never overwrites a server's own settings (journey, no prototype screen)

**As the** person who looks after the servers **I want** a deploy to leave a host's `.env` alone **so that** a running environment keeps its database, keys and URLs.

Acceptance criteria:
- [ ] The deploy copies `.env.example` to `.env` only when the host has no `.env` yet.
- [ ] An existing `.env` is never changed by a deploy.

### S5 · What runs is what the pipeline built (journey, no prototype screen)

**As a** backend developer **I want** the server to run the exact image the pipeline built **so that** what was tested is what is running.

Acceptance criteria:
- [ ] The host receives a compose file and runs `docker compose pull`, then starts the pulled image; nothing is built on the host.

### S6 · Production (journey, no prototype screen)

**As the** team **I want** a production pipeline **so that** the app can go live.

Acceptance criteria:
- [ ] Not available yet: there is no production job, no production server and no task for it. Which branch deploys production, and with which approval, is an open question below.

## States and motion the design asks for

- None: no screen. A deploy's states are the pipeline's own (running, passed, failed), read in GitLab.

## Rules the backend already enforces

- A branch decides the environment, nothing else: `main` / `master` → development, `stage` → stage, nothing else deploys ([[F-43 Build & Deploy]] *Product rules*).
- Secrets stay in GitLab's variables; the server keeps its own `.env`; the image is built, pushed and pulled, never built on the host.

## Open questions

- **Production.** Which branch (or tag) deploys production, whether a person must approve it, and on which server: no decision card yet; the owner raises one when production is planned (the feature's release is *later*).
- This feature has no client part and no screen: its Frontend Requirements, Frontend Delivery and QA Frontend cards are not needed. Whether to mark it as backend-only on the feature card is the owner's call.
