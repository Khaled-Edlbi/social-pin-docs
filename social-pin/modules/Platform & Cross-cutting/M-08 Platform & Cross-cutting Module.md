---
type: module
id: platform
name: "Platform & Cross-cutting"
created: 2026-10-18
updated: 2026-10-28
tags: [module, module/platform]
---

# Platform & Cross-cutting · Module

Notifications, Gemma, devices, interests, code delivery, errors, jobs, tests,
the operator panel, the build and deploy pipeline.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[F-29 App Shell & Onboarding Narrative]] | 🖼️ Frontend only | [[S-73 App Shell & Onboarding Narrative Story\|Story]] | [[FR-29 App Shell & Onboarding Narrative Frontend Requirements\|Req.]] | [[BD-29 App Shell & Onboarding Narrative Backend Delivery\|Delivery]] · [[App Shell & Onboarding Narrative Backend Integration\|Integration]] | [[App Shell & Onboarding Narrative Frontend Delivery\|Delivery]] | [[App Shell & Onboarding Narrative QA Backend\|Backend]] · [[App Shell & Onboarding Narrative QA Frontend\|Frontend]] |
| [[F-30 Audit Log]] | ⬜ To do | [[S-74 Audit Log Story\|Story]] | [[FR-30 Audit Log Frontend Requirements\|Req.]] | [[BD-30 Audit Log Backend Delivery\|Delivery]] · [[Audit Log Backend Integration\|Integration]] | [[Audit Log Frontend Delivery\|Delivery]] | [[Audit Log QA Backend\|Backend]] · [[Audit Log QA Frontend\|Frontend]] |
| [[F-43 Build & Deploy]] | 🟡 Partial | [[S-116 Build & Deploy Story\|Story]] | [[Build & Deploy Frontend Requirements\|Req.]] | [[Build & Deploy Backend Delivery\|Delivery]] · [[Build & Deploy Backend Integration\|Integration]] | [[Build & Deploy Frontend Delivery\|Delivery]] | [[Build & Deploy QA Backend\|Backend]] · [[Build & Deploy QA Frontend\|Frontend]] |
| [[F-31 Cleanup Jobs]] | ⬜ To do | [[S-76 Cleanup Jobs Story\|Story]] | [[FR-31 Cleanup Jobs Frontend Requirements\|Req.]] | [[BD-31 Cleanup Jobs Backend Delivery\|Delivery]] · [[Cleanup Jobs Backend Integration\|Integration]] | [[Cleanup Jobs Frontend Delivery\|Delivery]] | [[Cleanup Jobs QA Backend\|Backend]] · [[Cleanup Jobs QA Frontend\|Frontend]] |
| [[F-32 Code Delivery]] | 🟡 Partial | [[S-78 Code Delivery Story\|Story]] | [[FR-32 Code Delivery Frontend Requirements\|Req.]] | [[BD-32 Code Delivery Backend Delivery\|Delivery]] · [[Code Delivery Backend Integration\|Integration]] | [[Code Delivery Frontend Delivery\|Delivery]] | [[Code Delivery QA Backend\|Backend]] · [[Code Delivery QA Frontend\|Frontend]] |
| [[F-33 Devices & NFC]] | 🟡 Partial | [[S-82 Devices & NFC Story\|Story]] | [[FR-33 Devices & NFC Frontend Requirements\|Req.]] | [[BD-33 Devices & NFC Backend Delivery\|Delivery]] · [[Devices & NFC Backend Integration\|Integration]] | [[Devices & NFC Frontend Delivery\|Delivery]] | [[Devices & NFC QA Backend\|Backend]] · [[Devices & NFC QA Frontend\|Frontend]] |
| [[F-34 E2E Test Run]] | ⬜ To do | [[S-85 E2E Test Run Story\|Story]] | [[FR-34 E2E Test Run Frontend Requirements\|Req.]] | [[BD-34 E2E Test Run Backend Delivery\|Delivery]] · [[E2E Test Run Backend Integration\|Integration]] | [[E2E Test Run Frontend Delivery\|Delivery]] | [[E2E Test Run QA Backend\|Backend]] · [[E2E Test Run QA Frontend\|Frontend]] |
| [[F-35 Error Contract]] | 🟡 Partial | [[S-87 Error Contract Story\|Story]] | [[FR-35 Error Contract Frontend Requirements\|Req.]] | [[BD-35 Error Contract Backend Delivery\|Delivery]] · [[Error Contract Backend Integration\|Integration]] | [[Error Contract Frontend Delivery\|Delivery]] | [[Error Contract QA Backend\|Backend]] · [[Error Contract QA Frontend\|Frontend]] |
| [[F-36 Gemma AI]] | ⬜ To do | [[S-89 Gemma AI Story\|Story]] | [[FR-36 Gemma AI Frontend Requirements\|Req.]] | [[BD-36 Gemma AI Backend Delivery\|Delivery]] · [[Gemma AI Backend Integration\|Integration]] | [[Gemma AI Frontend Delivery\|Delivery]] | [[Gemma AI QA Backend\|Backend]] · [[Gemma AI QA Frontend\|Frontend]] |
| [[F-37 Interests]] | 🟡 Partial | [[S-92 Interests Story\|Story]] | [[FR-37 Interests Frontend Requirements\|Req.]] | [[BD-37 Interests Backend Delivery\|Delivery]] · [[Interests Backend Integration\|Integration]] | [[Interests Frontend Delivery\|Delivery]] | [[Interests QA Backend\|Backend]] · [[Interests QA Frontend\|Frontend]] |
| [[F-38 Linked Accounts (OAuth)]] | 🟡 Partial | [[S-94 Linked Accounts (OAuth) Story\|Story]] | [[FR-38 Linked Accounts (OAuth) Frontend Requirements\|Req.]] | [[BD-38 Linked Accounts (OAuth) Backend Delivery\|Delivery]] · [[Linked Accounts (OAuth) Backend Integration\|Integration]] | [[Linked Accounts (OAuth) Frontend Delivery\|Delivery]] | [[Linked Accounts (OAuth) QA Backend\|Backend]] · [[Linked Accounts (OAuth) QA Frontend\|Frontend]] |
| [[F-39 Notifications]] | ⬜ To do | [[S-96 Notifications Story\|Story]] | [[FR-39 Notifications Frontend Requirements\|Req.]] | [[BD-39 Notifications Backend Delivery\|Delivery]] · [[Notifications Backend Integration\|Integration]] | [[Notifications Frontend Delivery\|Delivery]] | [[Notifications QA Backend\|Backend]] · [[Notifications QA Frontend\|Frontend]] |
| [[F-42 Operator Panel]] | 🟡 In progress | [[S-117 Operator Panel Story\|Story]] | [[Operator Panel Frontend Requirements\|Req.]] | [[Operator Panel Backend Delivery\|Delivery]] · [[Operator Panel Backend Integration\|Integration]] | [[Operator Panel Frontend Delivery\|Delivery]] | [[Operator Panel QA Backend\|Backend]] · [[Operator Panel QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
- 2026-10-26 · [[F-42 Operator Panel]] added, with Operator Panel · S3 to Operator Panel · S7 under it
- 2026-10-26 · [[F-43 Build & Deploy]] added for the pipeline that already shipped (Build & Deploy · GitLab pipeline and Docker setup)
