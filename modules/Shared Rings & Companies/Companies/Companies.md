---
type: feature
id: companies
name: "Companies"
priority: P1
module: shared-rings
screens: [s72, s73]
related: ["Ring Members"]
updated: 2026-10-18
tags: [feature, module/shared-rings, priority/P1]
---

# Companies

**Backend:** TODO · **Priority:** P1 · **Module:** [[Shared Rings & Companies Module|Shared Rings & Companies]]

**Layers:** [[Companies Story|Story]] · [[Companies Frontend Requirements|Frontend Requirements]] · [[Companies Backend Delivery|Backend Delivery]] · [[Companies Backend Integration|Backend Integration]] · [[Companies Frontend Delivery|Frontend Delivery]] · [[Companies QA Backend|QA Backend]] · [[Companies QA Frontend|QA Frontend]]

My companies (s72) and company detail (s73): the business tables exist (`Business`, `BusinessMember`, tags, files), no endpoints.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s72|s72]] | My companies |  |
| [[Screen Index#s73|s73]] | Company detail |  |

Wireframe brief sections: [[Wireframe Brief#Business account setup|§9.1 Business account setup]], [[Wireframe Brief#Organizer touchpoints|§9.3 Organizer touchpoints]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-029 My companies and company detail]] | ⬜ To do | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "companies" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]

## Related

- [[Ring Invitations & Join]]
- [[Delegated Admins]]
- [[Exhibitor]]
- [[Rings]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
