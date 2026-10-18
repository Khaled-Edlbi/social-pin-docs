---
type: module
id: identity
name: "Identity Core"
updated: 2026-10-18
tags: [module, module/identity]
---

# Identity Core · Module

Account, profile, Rings, what each Ring shows, and the access engine.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[Account]] | ✅ Done | [[Account Story\|Story]] | [[Account Frontend Requirements\|Req.]] | [[Account Backend Delivery\|Delivery]] · [[Account Backend Integration\|Integration]] | [[Account Frontend Delivery\|Delivery]] | [[Account QA Backend\|Backend]] · [[Account QA Frontend\|Frontend]] |
| [[Auth & Sign-up]] | ✅ Done | [[Auth & Sign-up Story\|Story]] | [[Auth & Sign-up Frontend Requirements\|Req.]] | [[Auth & Sign-up Backend Delivery\|Delivery]] · [[Auth & Sign-up Backend Integration\|Integration]] | [[Auth & Sign-up Frontend Delivery\|Delivery]] | [[Auth & Sign-up QA Backend\|Backend]] · [[Auth & Sign-up QA Frontend\|Frontend]] |
| [[Counts]] | 🟡 Partial | [[Counts Story\|Story]] | [[Counts Frontend Requirements\|Req.]] | [[Counts Backend Delivery\|Delivery]] · [[Counts Backend Integration\|Integration]] | [[Counts Frontend Delivery\|Delivery]] | [[Counts QA Backend\|Backend]] · [[Counts QA Frontend\|Frontend]] |
| [[Files Upload]] | ✅ Done | [[Files Upload Story\|Story]] | [[Files Upload Frontend Requirements\|Req.]] | [[Files Upload Backend Delivery\|Delivery]] · [[Files Upload Backend Integration\|Integration]] | [[Files Upload Frontend Delivery\|Delivery]] | [[Files Upload QA Backend\|Backend]] · [[Files Upload QA Frontend\|Frontend]] |
| [[Onboarding Imports]] | ⬜ To do | [[Onboarding Imports Story\|Story]] | [[Onboarding Imports Frontend Requirements\|Req.]] | [[Onboarding Imports Backend Delivery\|Delivery]] · [[Onboarding Imports Backend Integration\|Integration]] | [[Onboarding Imports Frontend Delivery\|Delivery]] | [[Onboarding Imports QA Backend\|Backend]] · [[Onboarding Imports QA Frontend\|Frontend]] |
| [[Photo Library]] | 🟡 Partial | [[Photo Library Story\|Story]] | [[Photo Library Frontend Requirements\|Req.]] | [[Photo Library Backend Delivery\|Delivery]] · [[Photo Library Backend Integration\|Integration]] | [[Photo Library Frontend Delivery\|Delivery]] | [[Photo Library QA Backend\|Backend]] · [[Photo Library QA Frontend\|Frontend]] |
| [[Profiles & Pin Name]] | ✅ Done | [[Profiles & Pin Name Story\|Story]] | [[Profiles & Pin Name Frontend Requirements\|Req.]] | [[Profiles & Pin Name Backend Delivery\|Delivery]] · [[Profiles & Pin Name Backend Integration\|Integration]] | [[Profiles & Pin Name Frontend Delivery\|Delivery]] | [[Profiles & Pin Name QA Backend\|Backend]] · [[Profiles & Pin Name QA Frontend\|Frontend]] |
| [[Ring Access Engine]] | ✅ Done | [[Ring Access Engine Story\|Story]] | [[Ring Access Engine Frontend Requirements\|Req.]] | [[Ring Access Engine Backend Delivery\|Delivery]] · [[Ring Access Engine Backend Integration\|Integration]] | [[Ring Access Engine Frontend Delivery\|Delivery]] | [[Ring Access Engine QA Backend\|Backend]] · [[Ring Access Engine QA Frontend\|Frontend]] |
| [[Ring Members]] | ✅ Done | [[Ring Members Story\|Story]] | [[Ring Members Frontend Requirements\|Req.]] | [[Ring Members Backend Delivery\|Delivery]] · [[Ring Members Backend Integration\|Integration]] | [[Ring Members Frontend Delivery\|Delivery]] | [[Ring Members QA Backend\|Backend]] · [[Ring Members QA Frontend\|Frontend]] |
| [[Ring Projection]] | ✅ Done | [[Ring Projection Story\|Story]] | [[Ring Projection Frontend Requirements\|Req.]] | [[Ring Projection Backend Delivery\|Delivery]] · [[Ring Projection Backend Integration\|Integration]] | [[Ring Projection Frontend Delivery\|Delivery]] | [[Ring Projection QA Backend\|Backend]] · [[Ring Projection QA Frontend\|Frontend]] |
| [[Rings]] | ✅ Done | [[Rings Story\|Story]] | [[Rings Frontend Requirements\|Req.]] | [[Rings Backend Delivery\|Delivery]] · [[Rings Backend Integration\|Integration]] | [[Rings Frontend Delivery\|Delivery]] | [[Rings QA Backend\|Backend]] · [[Rings QA Frontend\|Frontend]] |
| [[View As & Pin Views]] | ✅ Done | [[View As & Pin Views Story\|Story]] | [[View As & Pin Views Frontend Requirements\|Req.]] | [[View As & Pin Views Backend Delivery\|Delivery]] · [[View As & Pin Views Backend Integration\|Integration]] | [[View As & Pin Views Frontend Delivery\|Delivery]] | [[View As & Pin Views QA Backend\|Backend]] · [[View As & Pin Views QA Frontend\|Frontend]] |
| [[Widgets]] | 🟡 Partial | [[Widgets Story\|Story]] | [[Widgets Frontend Requirements\|Req.]] | [[Widgets Backend Delivery\|Delivery]] · [[Widgets Backend Integration\|Integration]] | [[Widgets Frontend Delivery\|Delivery]] | [[Widgets QA Backend\|Backend]] · [[Widgets QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers ([[T-064 Restructure the docs vault]])
