---
type: module
id: platform
name: "Platform & Cross-cutting"
created: 2026-10-18
updated: 2026-10-27
tags: [module, module/platform]
---

# Platform & Cross-cutting · Module

Notifications, Gemma, devices, interests, code delivery, errors, jobs, tests,
the operator panel, the build and deploy pipeline.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[App Shell & Onboarding Narrative]] | 🖼️ Frontend only | [[App Shell & Onboarding Narrative Story\|Story]] | [[App Shell & Onboarding Narrative Frontend Requirements\|Req.]] | [[App Shell & Onboarding Narrative Backend Delivery\|Delivery]] · [[App Shell & Onboarding Narrative Backend Integration\|Integration]] | [[App Shell & Onboarding Narrative Frontend Delivery\|Delivery]] | [[App Shell & Onboarding Narrative QA Backend\|Backend]] · [[App Shell & Onboarding Narrative QA Frontend\|Frontend]] |
| [[Audit Log]] | ⬜ To do | [[Audit Log Story\|Story]] | [[Audit Log Frontend Requirements\|Req.]] | [[Audit Log Backend Delivery\|Delivery]] · [[Audit Log Backend Integration\|Integration]] | [[Audit Log Frontend Delivery\|Delivery]] | [[Audit Log QA Backend\|Backend]] · [[Audit Log QA Frontend\|Frontend]] |
| [[Build & Deploy]] | 🟡 Partial | [[Build & Deploy Story\|Story]] | [[Build & Deploy Frontend Requirements\|Req.]] | [[Build & Deploy Backend Delivery\|Delivery]] · [[Build & Deploy Backend Integration\|Integration]] | [[Build & Deploy Frontend Delivery\|Delivery]] | [[Build & Deploy QA Backend\|Backend]] · [[Build & Deploy QA Frontend\|Frontend]] |
| [[Cleanup Jobs]] | ⬜ To do | [[Cleanup Jobs Story\|Story]] | [[Cleanup Jobs Frontend Requirements\|Req.]] | [[Cleanup Jobs Backend Delivery\|Delivery]] · [[Cleanup Jobs Backend Integration\|Integration]] | [[Cleanup Jobs Frontend Delivery\|Delivery]] | [[Cleanup Jobs QA Backend\|Backend]] · [[Cleanup Jobs QA Frontend\|Frontend]] |
| [[Code Delivery]] | 🟡 Partial | [[Code Delivery Story\|Story]] | [[Code Delivery Frontend Requirements\|Req.]] | [[Code Delivery Backend Delivery\|Delivery]] · [[Code Delivery Backend Integration\|Integration]] | [[Code Delivery Frontend Delivery\|Delivery]] | [[Code Delivery QA Backend\|Backend]] · [[Code Delivery QA Frontend\|Frontend]] |
| [[Devices & NFC]] | 🟡 Partial | [[Devices & NFC Story\|Story]] | [[Devices & NFC Frontend Requirements\|Req.]] | [[Devices & NFC Backend Delivery\|Delivery]] · [[Devices & NFC Backend Integration\|Integration]] | [[Devices & NFC Frontend Delivery\|Delivery]] | [[Devices & NFC QA Backend\|Backend]] · [[Devices & NFC QA Frontend\|Frontend]] |
| [[E2E Test Run]] | ⬜ To do | [[E2E Test Run Story\|Story]] | [[E2E Test Run Frontend Requirements\|Req.]] | [[E2E Test Run Backend Delivery\|Delivery]] · [[E2E Test Run Backend Integration\|Integration]] | [[E2E Test Run Frontend Delivery\|Delivery]] | [[E2E Test Run QA Backend\|Backend]] · [[E2E Test Run QA Frontend\|Frontend]] |
| [[Error Contract]] | 🟡 Partial | [[Error Contract Story\|Story]] | [[Error Contract Frontend Requirements\|Req.]] | [[Error Contract Backend Delivery\|Delivery]] · [[Error Contract Backend Integration\|Integration]] | [[Error Contract Frontend Delivery\|Delivery]] | [[Error Contract QA Backend\|Backend]] · [[Error Contract QA Frontend\|Frontend]] |
| [[Gemma AI]] | ⬜ To do | [[Gemma AI Story\|Story]] | [[Gemma AI Frontend Requirements\|Req.]] | [[Gemma AI Backend Delivery\|Delivery]] · [[Gemma AI Backend Integration\|Integration]] | [[Gemma AI Frontend Delivery\|Delivery]] | [[Gemma AI QA Backend\|Backend]] · [[Gemma AI QA Frontend\|Frontend]] |
| [[Interests]] | 🟡 Partial | [[Interests Story\|Story]] | [[Interests Frontend Requirements\|Req.]] | [[Interests Backend Delivery\|Delivery]] · [[Interests Backend Integration\|Integration]] | [[Interests Frontend Delivery\|Delivery]] | [[Interests QA Backend\|Backend]] · [[Interests QA Frontend\|Frontend]] |
| [[Linked Accounts (OAuth)]] | 🟡 Partial | [[Linked Accounts (OAuth) Story\|Story]] | [[Linked Accounts (OAuth) Frontend Requirements\|Req.]] | [[Linked Accounts (OAuth) Backend Delivery\|Delivery]] · [[Linked Accounts (OAuth) Backend Integration\|Integration]] | [[Linked Accounts (OAuth) Frontend Delivery\|Delivery]] | [[Linked Accounts (OAuth) QA Backend\|Backend]] · [[Linked Accounts (OAuth) QA Frontend\|Frontend]] |
| [[Notifications]] | ⬜ To do | [[Notifications Story\|Story]] | [[Notifications Frontend Requirements\|Req.]] | [[Notifications Backend Delivery\|Delivery]] · [[Notifications Backend Integration\|Integration]] | [[Notifications Frontend Delivery\|Delivery]] | [[Notifications QA Backend\|Backend]] · [[Notifications QA Frontend\|Frontend]] |
| [[Operator Panel]] | 🟡 In progress | [[Operator Panel Story\|Story]] | [[Operator Panel Frontend Requirements\|Req.]] | [[Operator Panel Backend Delivery\|Delivery]] · [[Operator Panel Backend Integration\|Integration]] | [[Operator Panel Frontend Delivery\|Delivery]] | [[Operator Panel QA Backend\|Backend]] · [[Operator Panel QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
- 2026-10-26 · [[Operator Panel]] added, with T-068 to T-072 under it
- 2026-10-26 · [[Build & Deploy]] added for the pipeline that already shipped (Build & Deploy · GitLab pipeline and Docker setup)
