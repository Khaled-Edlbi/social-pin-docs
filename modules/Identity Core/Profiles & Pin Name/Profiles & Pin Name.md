---
type: feature
id: profiles
name: "Profiles & Pin Name"
priority: P0
module: identity
screens: [s06]
updated: 2026-10-18
tags: [feature, module/identity, priority/P0]
---

# Profiles & Pin Name

**Backend:** Done · **Priority:** P0 · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Profiles & Pin Name Story|Story]] · [[Profiles & Pin Name Frontend Requirements|Frontend Requirements]] · [[Profiles & Pin Name Backend Delivery|Backend Delivery]] · [[Profiles & Pin Name Backend Integration|Backend Integration]] · [[Profiles & Pin Name Frontend Delivery|Frontend Delivery]] · [[Profiles & Pin Name QA Backend|QA Backend]] · [[Profiles & Pin Name QA Frontend|QA Frontend]]

Multiple profiles per account, the `!`-prefixed unique Pin name with a public live availability check, and the sensitive base fields (birthdate, gender, marital status) that Rings opt into.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s06|s06]] | Claim your Pin | Availability check done; yearly rename + suggestions → D-06 |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-057 Decide base profile work fields]] | ❓ Needs a decision / info | P0 | S |
| [[T-061 Decide Pin name rules]] | ❓ Needs a decision / info | P1 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "profiles" SORT priority ASC
```

## Open decisions

- [[D-02 Base profile work fields]]
- [[D-06 Pin name rules]]

## Related

- [[Auth & Sign-up]]
- [[Ring Projection]]
- [[Onboarding Imports]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
