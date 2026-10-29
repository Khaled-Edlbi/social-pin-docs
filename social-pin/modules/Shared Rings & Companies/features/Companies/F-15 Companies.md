---
id: F-15
type: feature
module: shared-rings
feature: companies
priority: high
release: v1
screens: [s72, s73]
owner: "omar"
related: ["F-09 Ring Members"]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/shared-rings, priority/high, release/v1]
---

# Companies

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[M-03 Shared Rings & Companies Module|Shared Rings & Companies]]

**Layers:** [[S-29 Companies Story|Story]] · [[FR-15 Companies Frontend Requirements|Frontend Requirements]] · [[BD-15 Companies Backend Delivery|Backend Delivery]] · [[Companies Backend Integration|Backend Integration]] · [[Companies Frontend Delivery|Frontend Delivery]] · [[Companies QA Backend|QA Backend]] · [[Companies QA Frontend|QA Frontend]]

My companies (s72) and company detail (s73): the business tables exist (`Business`, `BusinessMember`, tags, files), no endpoints.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s72|s72]] | My companies |  |
| [[Screen Index#s73|s73]] | Company detail |  |

Wireframe brief sections: [[Wireframe Brief#Business account setup|§9.1 Business account setup]], [[Wireframe Brief#Organizer touchpoints|§9.3 Organizer touchpoints]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- **Company Rings a member joined knowingly are named** on My companies and Company detail ("Acme Team", "Company"); one the owner placed them in is listed unnamed ([[D-18 Ring names shown when joined knowingly]], the exception to [[D-14 Shared with me lists people, never the Ring]]). The name only: never the Ring's colour, type or place in the company's hierarchy.
- A plain member sees colleagues only where the Ring's "members can see each other" is on ([[D-04 Ring settings at launch and their defaults]]).
- The required work email domain belongs to this feature, not to the launch set of Ring settings.
- Not built yet: memberships do not record how they were created, and the company screens do not exist.

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-29 Companies Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-029 | My companies and company detail | To do | high | S6 |

### Log of the merged tasks

- T-029 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-029 · 2026-10-18 · created as the backend half of T-029
- T-029 · 2026-10-18 · created as the frontend half of T-029

## Decisions

- [[ND-04 Ring settings]] — decided, six settings at launch; the required work email domain comes later, with Companies ([[D-04 Ring settings at launch and their defaults|D-04]])
- [[ND-18 Company and invited Ring names shown to members]] — decided, company Rings joined knowingly are named ([[D-18 Ring names shown when joined knowingly|D-18]])

## Related

- [[F-17 Ring Invitations & Join]]
- [[F-16 Delegated Admins]]
- [[F-24 Exhibitor]]
- [[F-11 Rings]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
