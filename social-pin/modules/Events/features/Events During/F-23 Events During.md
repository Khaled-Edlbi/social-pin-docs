---
id: F-23
type: feature
module: events
feature: events-during
priority: critical
release: mvp
screens: [s53, s54, s55, s56, s57, s58]
related: ["F-11 Rings", "F-12 View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/events, priority/critical, release/mvp]
---

# Events During

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[M-05 Events Module|Events]]

**Layers:** [[S-53 Events During Story|Story]] · [[FR-23 Events During Frontend Requirements|Frontend Requirements]] · [[BD-23 Events During Backend Delivery|Backend Delivery]] · [[Events During Backend Integration|Backend Integration]] · [[Events During Frontend Delivery|Frontend Delivery]] · [[Events During QA Backend|QA Backend]] · [[Events During QA Frontend|QA Frontend]]

Event mode hub (s53), exhibitors list and detail (s54, s55), event pass with a 60-second rotating code (s56), floor map and booths (s57), catalogue of products and talks (s58), lounges and upgrades.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s53|s53]] | Event mode |  |
| [[Screen Index#s54|s54]] | Exhibitors |  |
| [[Screen Index#s55|s55]] | Exhibitor |  |
| [[Screen Index#s56|s56]] | Event pass |  |
| [[Screen Index#s57|s57]] | Floor map |  |
| [[Screen Index#s58|s58]] | Catalogue | No products table |

Wireframe brief sections: [[Wireframe Brief#In-event hub|§8.1 In-event hub]], [[Wireframe Brief#Sub-events, lounges, upgrades|§8.3 Sub-events, lounges, upgrades]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-53 Events During Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-036 | Event mode exhibitors list and detail | Blocked | critical | S8 |
| T-037 | Event pass with a 60 s rotating code | Blocked | high | S9 |
| T-038 | Floor map and booths | Blocked | high | S10 |
| T-039 | Catalogue products and talks (new table) | Needs a decision | high | S11 |
| T-040 | Lounges and upgrades | Blocked | high | S12 |

### Log of the merged tasks

- T-036 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-036 · 2026-10-18 · created as the backend half of T-036
- T-036 · 2026-10-18 · created as the frontend half of T-036
- T-037 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-037 · 2026-10-18 · created as the backend half of T-037
- T-037 · 2026-10-18 · created as the frontend half of T-037
- T-038 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-038 · 2026-10-18 · created as the backend half of T-038
- T-038 · 2026-10-18 · created as the frontend half of T-038
- T-039 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-039 · 2026-10-18 · created as the backend half of T-039
- T-039 · 2026-10-18 · created as the frontend half of T-039
- T-040 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-040 · 2026-10-18 · created as the backend half of T-040
- T-040 · 2026-10-18 · created as the frontend half of T-040

## Related

- [[F-22 Events Before]]
- [[F-18 Badge & QR]]
- [[F-26 Meetings]]
- [[F-24 Exhibitor]]
- [[F-28 Subscription (Free vs Pro)]]
- [[F-08 Ring Access Engine]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
