---
type: feature
id: events-during
name: "Events During"
priority: critical
release: mvp
module: events
screens: [s53, s54, s55, s56, s57, s58]
related: ["Rings", "View As & Pin Views"]
updated: 2026-10-25
tags: [feature, module/events, priority/critical, release/mvp]
---

# Events During

**Backend:** TODO · **Priority:** Critical · **Release:** MVP · **Module:** [[Events Module|Events]]

**Layers:** [[Events During Story|Story]] · [[Events During Frontend Requirements|Frontend Requirements]] · [[Events During Backend Delivery|Backend Delivery]] · [[Events During Backend Integration|Backend Integration]] · [[Events During Frontend Delivery|Frontend Delivery]] · [[Events During QA Backend|QA Backend]] · [[Events During QA Frontend|QA Frontend]]

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

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-036 Event mode exhibitors list and detail]] | ⛔ Blocked | Critical | M |
| [[T-037 Event pass with a 60 s rotating code]] | ⛔ Blocked | High | M |
| [[T-038 Floor map and booths]] | ⛔ Blocked | High | M |
| [[T-039 Catalogue products and talks (new table)]] | ❓ Needs a decision / info | High | L |
| [[T-040 Lounges and upgrades]] | ⛔ Blocked | High | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "events-during" SORT priority ASC
```

## Related

- [[Events Before]]
- [[Badge & QR]]
- [[Meetings]]
- [[Exhibitor]]
- [[Subscription (Free vs Pro)]]
- [[Ring Access Engine]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
