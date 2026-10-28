---
type: module
id: commerce
name: "Commerce"
created: 2026-10-18
updated: 2026-10-28
tags: [module, module/commerce]
---

# Commerce · Module

Orders, payments, Free vs Pro.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[F-27 Payments & Orders]] | ⬜ To do | [[S-69 Payments & Orders Story\|Story]] | [[FR-27 Payments & Orders Frontend Requirements\|Req.]] | [[BD-27 Payments & Orders Backend Delivery\|Delivery]] · [[Payments & Orders Backend Integration\|Integration]] | [[Payments & Orders Frontend Delivery\|Delivery]] | [[Payments & Orders QA Backend\|Backend]] · [[Payments & Orders QA Frontend\|Frontend]] |
| [[F-28 Subscription (Free vs Pro)]] | ⬜ To do | [[S-71 Subscription (Free vs Pro) Story\|Story]] | [[FR-28 Subscription (Free vs Pro) Frontend Requirements\|Req.]] | [[BD-28 Subscription (Free vs Pro) Backend Delivery\|Delivery]] · [[Subscription (Free vs Pro) Backend Integration\|Integration]] | [[Subscription (Free vs Pro) Frontend Delivery\|Delivery]] | [[Subscription (Free vs Pro) QA Backend\|Backend]] · [[Subscription (Free vs Pro) QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
