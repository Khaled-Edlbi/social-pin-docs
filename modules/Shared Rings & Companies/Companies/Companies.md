---
type: feature
id: companies
name: "Companies"
priority: high
module: shared-rings
screens: [s72, s73]
related: ["Ring Members"]
updated: 2026-10-25
owner: "omar"
tags: [feature, module/shared-rings, priority/high]
---

# Companies

**Backend:** TODO · **Priority:** High · **Module:** [[Shared Rings & Companies Module|Shared Rings & Companies]]

**Layers:** [[Companies Story|Story]] · [[Companies Frontend Requirements|Frontend Requirements]] · [[Companies Backend Delivery|Backend Delivery]] · [[Companies Backend Integration|Backend Integration]] · [[Companies Frontend Delivery|Frontend Delivery]] · [[Companies QA Backend|QA Backend]] · [[Companies QA Frontend|QA Frontend]]

My companies (s72) and company detail (s73): the business tables exist (`Business`, `BusinessMember`, tags, files), no endpoints.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s72|s72]] | My companies |  |
| [[Screen Index#s73|s73]] | Company detail |  |

Wireframe brief sections: [[Wireframe Brief#Business account setup|§9.1 Business account setup]], [[Wireframe Brief#Organizer touchpoints|§9.3 Organizer touchpoints]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- **Company Rings a member joined knowingly are named** on My companies and Company detail ("Acme Team", "Company"); one the owner placed them in is listed unnamed ([[DR-18 Ring names shown when joined knowingly]], the exception to [[DR-14 Shared with me lists people, never the Ring]]). The name only: never the Ring's colour, type or place in the company's hierarchy.
- A plain member sees colleagues only where the Ring's "members can see each other" is on ([[DR-04 Ring settings at launch and their defaults]]).
- The required work email domain belongs to this feature, not to the launch set of Ring settings.
- Not built yet: memberships do not record how they were created, and the company screens do not exist.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-029 My companies and company detail]] | ⬜ To do | High | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "companies" SORT priority ASC
```

## Decisions

- [[D-04 Ring settings]] — decided, six settings at launch; the required work email domain comes later, with Companies ([[DR-04 Ring settings at launch and their defaults|DR-04]])
- [[D-18 Company and invited Ring names shown to members]] — open; blocks [[Companies Story]] and [[Ring Invitations & Join Story]]

## Related

- [[Ring Invitations & Join]]
- [[Delegated Admins]]
- [[Exhibitor]]
- [[Rings]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
