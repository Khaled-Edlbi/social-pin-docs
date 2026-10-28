---
type: feature
id: delegated-admins
name: "Delegated Admins"
priority: high
release: v1
module: shared-rings
screens: [s26, s27]
created: 2026-10-15
updated: 2026-10-28
owner: "omar"
tags: [feature, module/shared-rings, priority/high, release/v1]
---

# Delegated Admins

**Backend:** Partial (needs more) · **Priority:** High · **Release:** v1 · **Module:** [[M-03 Shared Rings & Companies Module|Shared Rings & Companies]]

**Layers:** [[S-31 Delegated Admins Story|Story]] · [[FR-16 Delegated Admins Frontend Requirements|Frontend Requirements]] · [[BD-16 Delegated Admins Backend Delivery|Backend Delivery]] · [[Delegated Admins Backend Integration|Backend Integration]] · [[Delegated Admins Frontend Delivery|Frontend Delivery]] · [[Delegated Admins QA Backend|QA Backend]] · [[Delegated Admins QA Frontend|QA Frontend]]

Company Rings delegate administration at permission levels (`RingAdmin`). The rules are enforced by `assertCanAdminister`; there is no way to add, change or remove an admin.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s26|s26]] | Edit · access | Settings decided (D-04), not built |
| [[Screen Index#s27|s27]] | Edit · permissions | Settings decided (D-04), not built |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- A Ring's **admins can change its settings**, as the owner can ([[D-04 Ring settings at launch and their defaults]]). Whether some settings stay the owner's only was not decided; until it is, admins can change all of them.
- Not built yet: there is no way to add, change or remove an admin.

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-31 Delegated Admins Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-006 | Delegated admin endpoints | To do | high | S6 |

### Log of the merged tasks

- T-006 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-006 · 2026-10-18 · created as the backend half of T-006
- T-006 · 2026-10-18 · created as the frontend half of T-006

## Decisions

- [[ND-04 Ring settings]] — decided, six settings at launch; the owner and the Ring's admins change them ([[D-04 Ring settings at launch and their defaults|D-04]])

## Related

- [[F-11 Rings]]
- [[F-15 Companies]]
- [[F-08 Ring Access Engine]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
