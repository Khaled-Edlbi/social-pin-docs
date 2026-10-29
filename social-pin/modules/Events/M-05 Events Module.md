---
id: M-05
type: module
module: events
created: 2026-10-18
updated: 2026-10-29
tags: [module, module/events]
---

# Events · Module

Before the event, during, exhibitor tools, post-event.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[F-21 Event Ring Auto-creation]] | 🟡 Partial | [[S-47 Event Ring Auto-creation Story\|Story]] | [[FR-21 Event Ring Auto-creation Frontend Requirements\|Req.]] | [[BD-21 Event Ring Auto-creation Backend Delivery\|Delivery]] · [[Event Ring Auto-creation Backend Integration\|Integration]] | [[Event Ring Auto-creation Frontend Delivery\|Delivery]] | [[Event Ring Auto-creation QA Backend\|Backend]] · [[Event Ring Auto-creation QA Frontend\|Frontend]] |
| [[F-22 Events Before]] | ⬜ To do | [[S-49 Events Before Story\|Story]] | [[FR-22 Events Before Frontend Requirements\|Req.]] | [[BD-22 Events Before Backend Delivery\|Delivery]] · [[Events Before Backend Integration\|Integration]] | [[Events Before Frontend Delivery\|Delivery]] | [[Events Before QA Backend\|Backend]] · [[Events Before QA Frontend\|Frontend]] |
| [[F-23 Events During]] | ⬜ To do | [[S-53 Events During Story\|Story]] | [[FR-23 Events During Frontend Requirements\|Req.]] | [[BD-23 Events During Backend Delivery\|Delivery]] · [[Events During Backend Integration\|Integration]] | [[Events During Frontend Delivery\|Delivery]] | [[Events During QA Backend\|Backend]] · [[Events During QA Frontend\|Frontend]] |
| [[F-24 Exhibitor]] | ⬜ To do | [[S-59 Exhibitor Story\|Story]] | [[FR-24 Exhibitor Frontend Requirements\|Req.]] | [[BD-24 Exhibitor Backend Delivery\|Delivery]] · [[Exhibitor Backend Integration\|Integration]] | [[Exhibitor Frontend Delivery\|Delivery]] | [[Exhibitor QA Backend\|Backend]] · [[Exhibitor QA Frontend\|Frontend]] |
| [[F-25 Post-Event]] | ⬜ To do | [[S-62 Post-Event Story\|Story]] | [[FR-25 Post-Event Frontend Requirements\|Req.]] | [[BD-25 Post-Event Backend Delivery\|Delivery]] · [[Post-Event Backend Integration\|Integration]] | [[Post-Event Frontend Delivery\|Delivery]] | [[Post-Event QA Backend\|Backend]] · [[Post-Event QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
