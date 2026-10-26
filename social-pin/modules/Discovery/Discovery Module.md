---
type: module
id: discovery
name: "Discovery"
created: 2026-10-18
updated: 2026-10-26
tags: [module, module/discovery]
---

# Discovery · Module

Badge / QR, Discover hub, PinCast proximity broadcast, nearby by Ring.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[Badge & QR]] | 🟡 Partial | [[Badge & QR Story\|Story]] | [[Badge & QR Frontend Requirements\|Req.]] | [[Badge & QR Backend Delivery\|Delivery]] · [[Badge & QR Backend Integration\|Integration]] | [[Badge & QR Frontend Delivery\|Delivery]] | [[Badge & QR QA Backend\|Backend]] · [[Badge & QR QA Frontend\|Frontend]] |
| [[Discover Hub & Search]] | ⬜ To do | [[Discover Hub & Search Story\|Story]] | [[Discover Hub & Search Frontend Requirements\|Req.]] | [[Discover Hub & Search Backend Delivery\|Delivery]] · [[Discover Hub & Search Backend Integration\|Integration]] | [[Discover Hub & Search Frontend Delivery\|Delivery]] | [[Discover Hub & Search QA Backend\|Backend]] · [[Discover Hub & Search QA Frontend\|Frontend]] |
| [[PinCast & Nearby]] | ⬜ To do | [[PinCast & Nearby Story\|Story]] | [[PinCast & Nearby Frontend Requirements\|Req.]] | [[PinCast & Nearby Backend Delivery\|Delivery]] · [[PinCast & Nearby Backend Integration\|Integration]] | [[PinCast & Nearby Frontend Delivery\|Delivery]] | [[PinCast & Nearby QA Backend\|Backend]] · [[PinCast & Nearby QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
