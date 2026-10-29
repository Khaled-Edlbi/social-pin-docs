---
type: module
id: identity
name: "Identity Core"
created: 2026-10-18
updated: 2026-10-28
tags: [module, module/identity]
---

# Identity Core · Module

Account, profile, Rings, what each Ring shows, and the access engine.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[F-01 Account]] | ✅ Done | [[S-01 Account Story\|Story]] | [[FR-01 Account Frontend Requirements\|Req.]] | [[BD-01 Account Backend Delivery\|Delivery]] · [[BI-01 Account Backend Integration\|Integration]] | [[FD-04 Account Frontend Delivery\|Delivery]] | [[QB-04 Account QA Backend\|Backend]] · [[QF-04 Account QA Frontend\|Frontend]] |
| [[F-02 Auth & Sign-up]] | ✅ Done | [[S-02 Auth & Sign-up Story\|Story]] | [[FR-02 Auth & Sign-up Frontend Requirements\|Req.]] | [[BD-02 Auth & Sign-up Backend Delivery\|Delivery]] · [[BI-02 Auth & Sign-up Backend Integration\|Integration]] | [[Auth & Sign-up Frontend Delivery\|Delivery]] | [[QB-05 Auth & Sign-up QA Backend\|Backend]] · [[Auth & Sign-up QA Frontend\|Frontend]] |
| [[F-03 Counts]] | 🟡 Partial | [[S-03 Counts Story\|Story]] | [[FR-03 Counts Frontend Requirements\|Req.]] | [[BD-03 Counts Backend Delivery\|Delivery]] · [[Counts Backend Integration\|Integration]] | [[Counts Frontend Delivery\|Delivery]] | [[Counts QA Backend\|Backend]] · [[Counts QA Frontend\|Frontend]] |
| [[F-04 Files Upload]] | ✅ Done | [[S-06 Files Upload Story\|Story]] | [[FR-04 Files Upload Frontend Requirements\|Req.]] | [[BD-04 Files Upload Backend Delivery\|Delivery]] · [[BI-03 Files Upload Backend Integration\|Integration]] | [[Files Upload Frontend Delivery\|Delivery]] | [[QB-06 Files Upload QA Backend\|Backend]] · [[Files Upload QA Frontend\|Frontend]] |
| [[F-05 Onboarding Imports]] | ⬜ To do | [[S-08 Onboarding Imports Story\|Story]] | [[FR-05 Onboarding Imports Frontend Requirements\|Req.]] | [[BD-05 Onboarding Imports Backend Delivery\|Delivery]] · [[Onboarding Imports Backend Integration\|Integration]] | [[Onboarding Imports Frontend Delivery\|Delivery]] | [[Onboarding Imports QA Backend\|Backend]] · [[Onboarding Imports QA Frontend\|Frontend]] |
| [[F-06 Photo Library]] | 🟡 Partial | [[S-11 Photo Library Story\|Story]] | [[FR-06 Photo Library Frontend Requirements\|Req.]] | [[BD-06 Photo Library Backend Delivery\|Delivery]] · [[Photo Library Backend Integration\|Integration]] | [[Photo Library Frontend Delivery\|Delivery]] | [[Photo Library QA Backend\|Backend]] · [[Photo Library QA Frontend\|Frontend]] |
| [[F-07 Profiles & Pin Name]] | ✅ Done | [[S-14 Profiles & Pin Name Story\|Story]] | [[FR-07 Profiles & Pin Name Frontend Requirements\|Req.]] | [[BD-07 Profiles & Pin Name Backend Delivery\|Delivery]] · [[BI-04 Profiles & Pin Name Backend Integration\|Integration]] | [[Profiles & Pin Name Frontend Delivery\|Delivery]] | [[Profiles & Pin Name QA Backend\|Backend]] · [[Profiles & Pin Name QA Frontend\|Frontend]] |
| [[F-08 Ring Access Engine]] | ✅ Done | [[S-15 Ring Access Engine Story\|Story]] | [[FR-08 Ring Access Engine Frontend Requirements\|Req.]] | [[BD-08 Ring Access Engine Backend Delivery\|Delivery]] · [[BI-05 Ring Access Engine Backend Integration\|Integration]] | [[Ring Access Engine Frontend Delivery\|Delivery]] | [[Ring Access Engine QA Backend\|Backend]] · [[Ring Access Engine QA Frontend\|Frontend]] |
| [[F-09 Ring Members]] | ✅ Done | [[S-16 Ring Members Story\|Story]] | [[FR-09 Ring Members Frontend Requirements\|Req.]] | [[BD-09 Ring Members Backend Delivery\|Delivery]] · [[BI-06 Ring Members Backend Integration\|Integration]] | [[Ring Members Frontend Delivery\|Delivery]] | [[Ring Members QA Backend\|Backend]] · [[Ring Members QA Frontend\|Frontend]] |
| [[F-10 Ring Projection]] | ✅ Done | [[S-17 Ring Projection Story\|Story]] | [[FR-10 Ring Projection Frontend Requirements\|Req.]] | [[BD-10 Ring Projection Backend Delivery\|Delivery]] · [[BI-07 Ring Projection Backend Integration\|Integration]] | [[Ring Projection Frontend Delivery\|Delivery]] | [[Ring Projection QA Backend\|Backend]] · [[Ring Projection QA Frontend\|Frontend]] |
| [[F-11 Rings]] | ✅ Done | [[S-18 Rings Story\|Story]] | [[FR-11 Rings Frontend Requirements\|Req.]] | [[BD-11 Rings Backend Delivery\|Delivery]] · [[BI-08 Rings Backend Integration\|Integration]] | [[Rings Frontend Delivery\|Delivery]] | [[Rings QA Backend\|Backend]] · [[Rings QA Frontend\|Frontend]] |
| [[F-12 View As & Pin Views]] | ✅ Done | [[S-19 View As & Pin Views Story\|Story]] | [[FR-12 View As & Pin Views Frontend Requirements\|Req.]] | [[BD-12 View As & Pin Views Backend Delivery\|Delivery]] · [[BI-09 View As & Pin Views Backend Integration\|Integration]] | [[View As & Pin Views Frontend Delivery\|Delivery]] | [[View As & Pin Views QA Backend\|Backend]] · [[View As & Pin Views QA Frontend\|Frontend]] |
| [[F-13 Widgets]] | 🟡 Partial | [[S-20 Widgets Story\|Story]] | [[FR-13 Widgets Frontend Requirements\|Req.]] | [[BD-13 Widgets Backend Delivery\|Delivery]] · [[Widgets Backend Integration\|Integration]] | [[Widgets Frontend Delivery\|Delivery]] | [[Widgets QA Backend\|Backend]] · [[Widgets QA Frontend\|Frontend]] |

## Cross-cutting rules

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-18 · created when the vault moved to layers
