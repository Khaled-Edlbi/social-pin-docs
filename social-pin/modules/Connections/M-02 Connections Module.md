---
id: M-02
type: module
module: connections
created: 2026-10-18
updated: 2026-10-29
tags: [module, module/connections]
---

# Connections · Module

Connect requests after a scan, accept into a Ring, blocks, contacts.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[F-14 Connections]] | ✅ Done | [[S-23 Connections Story\|Story]] | [[FR-14 Connections Frontend Requirements\|Req.]] | [[BD-14 Connections Backend Delivery\|Delivery]] · [[BI-16 Connections Backend Integration\|Integration]] | [[FD-13 Connections Frontend Delivery\|Delivery]] | [[QB-15 Connections QA Backend\|Backend]] · [[Connections QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
