---
type: module
id: events
name: "Events"
created: 2026-10-18
updated: 2026-10-18
tags: [module, module/events]
---

# Events · Module

Before the event, during, exhibitor tools, post-event.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[Event Ring Auto-creation]] | 🟡 Partial | [[Event Ring Auto-creation Story\|Story]] | [[Event Ring Auto-creation Frontend Requirements\|Req.]] | [[Event Ring Auto-creation Backend Delivery\|Delivery]] · [[Event Ring Auto-creation Backend Integration\|Integration]] | [[Event Ring Auto-creation Frontend Delivery\|Delivery]] | [[Event Ring Auto-creation QA Backend\|Backend]] · [[Event Ring Auto-creation QA Frontend\|Frontend]] |
| [[Events Before]] | ⬜ To do | [[Events Before Story\|Story]] | [[Events Before Frontend Requirements\|Req.]] | [[Events Before Backend Delivery\|Delivery]] · [[Events Before Backend Integration\|Integration]] | [[Events Before Frontend Delivery\|Delivery]] | [[Events Before QA Backend\|Backend]] · [[Events Before QA Frontend\|Frontend]] |
| [[Events During]] | ⬜ To do | [[Events During Story\|Story]] | [[Events During Frontend Requirements\|Req.]] | [[Events During Backend Delivery\|Delivery]] · [[Events During Backend Integration\|Integration]] | [[Events During Frontend Delivery\|Delivery]] | [[Events During QA Backend\|Backend]] · [[Events During QA Frontend\|Frontend]] |
| [[Exhibitor]] | ⬜ To do | [[Exhibitor Story\|Story]] | [[Exhibitor Frontend Requirements\|Req.]] | [[Exhibitor Backend Delivery\|Delivery]] · [[Exhibitor Backend Integration\|Integration]] | [[Exhibitor Frontend Delivery\|Delivery]] | [[Exhibitor QA Backend\|Backend]] · [[Exhibitor QA Frontend\|Frontend]] |
| [[Post-Event]] | ⬜ To do | [[Post-Event Story\|Story]] | [[Post-Event Frontend Requirements\|Req.]] | [[Post-Event Backend Delivery\|Delivery]] · [[Post-Event Backend Integration\|Integration]] | [[Post-Event Frontend Delivery\|Delivery]] | [[Post-Event QA Backend\|Backend]] · [[Post-Event QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers ([[T-064 Restructure the docs vault]])
