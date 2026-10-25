---
type: feature
id: profiles
name: "Profiles & Pin Name"
priority: critical
module: identity
screens: [s06]
updated: 2026-10-25
tags: [feature, module/identity, priority/critical]
---

# Profiles & Pin Name

**Backend:** Done · **Priority:** Critical · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Profiles & Pin Name Story|Story]] · [[Profiles & Pin Name Frontend Requirements|Frontend Requirements]] · [[Profiles & Pin Name Backend Delivery|Backend Delivery]] · [[Profiles & Pin Name Backend Integration|Backend Integration]] · [[Profiles & Pin Name Frontend Delivery|Frontend Delivery]] · [[Profiles & Pin Name QA Backend|QA Backend]] · [[Profiles & Pin Name QA Frontend|QA Frontend]]

Multiple profiles per account, the `!`-prefixed unique Pin name with a public live availability check, and the sensitive base fields (birthdate, gender, marital status) that Rings opt into.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s06|s06]] | Claim your Pin | Availability check done; yearly rename + suggestions decided ([[DR-06 Yearly rename, old name freed, case-insensitive|DR-06]]), not built |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- **One main profile every Ring starts from**: headline, role, company, location, photo and bio, and nothing more. Full name is the same in every Ring; the other fields a Ring may change for itself ([[DR-02 One main profile every Ring starts from]]). Not built yet: `Profile` has none of these fields today.
- A Pin name can be **changed once a year**; the old name is **free for anyone** at the rename, with no redirect ([[DR-06 Yearly rename, old name freed, case-insensitive]]). Not built yet: renames are unlimited today.
- Pin names **ignore capitals**: `Omar.Fostok` and `omar.fostok` are one name.
- When a name is taken, **suggestions come only from the person's own name**; the availability check never reveals who holds a name.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-057 Decide base profile work fields]] | ❓ Needs a decision / info | Critical | S |
| [[T-061 Decide Pin name rules]] | ❓ Needs a decision / info | High | S |

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
