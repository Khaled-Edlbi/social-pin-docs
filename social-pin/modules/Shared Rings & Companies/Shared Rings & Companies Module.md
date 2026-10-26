---
type: module
id: shared-rings
name: "Shared Rings & Companies"
created: 2026-10-18
updated: 2026-10-26
tags: [module, module/shared-rings]
---

# Shared Rings & Companies · Module

Rings owned by someone else that you belong to: invitations, joining, companies, delegated admins.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[Companies]] | ⬜ To do | [[Companies Story\|Story]] | [[Companies Frontend Requirements\|Req.]] | [[Companies Backend Delivery\|Delivery]] · [[Companies Backend Integration\|Integration]] | [[Companies Frontend Delivery\|Delivery]] | [[Companies QA Backend\|Backend]] · [[Companies QA Frontend\|Frontend]] |
| [[Delegated Admins]] | 🟡 Partial | [[Delegated Admins Story\|Story]] | [[Delegated Admins Frontend Requirements\|Req.]] | [[Delegated Admins Backend Delivery\|Delivery]] · [[Delegated Admins Backend Integration\|Integration]] | [[Delegated Admins Frontend Delivery\|Delivery]] | [[Delegated Admins QA Backend\|Backend]] · [[Delegated Admins QA Frontend\|Frontend]] |
| [[Ring Invitations & Join]] | ⬜ To do | [[Ring Invitations & Join Story\|Story]] | [[Ring Invitations & Join Frontend Requirements\|Req.]] | [[Ring Invitations & Join Backend Delivery\|Delivery]] · [[Ring Invitations & Join Backend Integration\|Integration]] | [[Ring Invitations & Join Frontend Delivery\|Delivery]] | [[Ring Invitations & Join QA Backend\|Backend]] · [[Ring Invitations & Join QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
