---
type: module
id: meetings
name: "Meetings"
created: 2026-10-18
updated: 2026-10-28
tags: [module, module/meetings]
---

# Meetings · Module

Availability slots, slot-based requests, temporary meeting Rings, calendar.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[F-26 Meetings]] | ⬜ To do | [[S-64 Meetings Story\|Story]] | [[FR-26 Meetings Frontend Requirements\|Req.]] | [[BD-26 Meetings Backend Delivery\|Delivery]] · [[Meetings Backend Integration\|Integration]] | [[Meetings Frontend Delivery\|Delivery]] | [[Meetings QA Backend\|Backend]] · [[Meetings QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
