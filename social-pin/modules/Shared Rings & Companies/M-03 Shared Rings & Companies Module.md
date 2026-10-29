---
id: M-03
type: module
module: shared-rings
name: "Shared Rings & Companies"
created: 2026-10-18
updated: 2026-10-29
tags: [module, module/shared-rings]
---

# Shared Rings & Companies · Module

Rings owned by someone else that you belong to: invitations, joining, companies, delegated admins.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[F-15 Companies]] | ⬜ To do | [[S-29 Companies Story\|Story]] | [[FR-15 Companies Frontend Requirements\|Req.]] | [[BD-15 Companies Backend Delivery\|Delivery]] · [[Companies Backend Integration\|Integration]] | [[Companies Frontend Delivery\|Delivery]] | [[Companies QA Backend\|Backend]] · [[Companies QA Frontend\|Frontend]] |
| [[F-16 Delegated Admins]] | 🟡 Partial | [[S-31 Delegated Admins Story\|Story]] | [[FR-16 Delegated Admins Frontend Requirements\|Req.]] | [[BD-16 Delegated Admins Backend Delivery\|Delivery]] · [[Delegated Admins Backend Integration\|Integration]] | [[Delegated Admins Frontend Delivery\|Delivery]] | [[Delegated Admins QA Backend\|Backend]] · [[Delegated Admins QA Frontend\|Frontend]] |
| [[F-17 Ring Invitations & Join]] | ⬜ To do | [[S-33 Ring Invitations & Join Story\|Story]] | [[FR-17 Ring Invitations & Join Frontend Requirements\|Req.]] | [[BD-17 Ring Invitations & Join Backend Delivery\|Delivery]] · [[Ring Invitations & Join Backend Integration\|Integration]] | [[Ring Invitations & Join Frontend Delivery\|Delivery]] | [[Ring Invitations & Join QA Backend\|Backend]] · [[Ring Invitations & Join QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
