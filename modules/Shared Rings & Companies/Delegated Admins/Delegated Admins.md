---
type: feature
id: delegated-admins
name: "Delegated Admins"
priority: high
release: v1
module: shared-rings
screens: [s26, s27]
created: 2026-10-15
updated: 2026-10-25
owner: "omar"
tags: [feature, module/shared-rings, priority/high, release/v1]
---

# Delegated Admins

**Backend:** Partial (needs more) · **Priority:** High · **Release:** v1 · **Module:** [[Shared Rings & Companies Module|Shared Rings & Companies]]

**Layers:** [[Delegated Admins Story|Story]] · [[Delegated Admins Frontend Requirements|Frontend Requirements]] · [[Delegated Admins Backend Delivery|Backend Delivery]] · [[Delegated Admins Backend Integration|Backend Integration]] · [[Delegated Admins Frontend Delivery|Frontend Delivery]] · [[Delegated Admins QA Backend|QA Backend]] · [[Delegated Admins QA Frontend|QA Frontend]]

Company Rings delegate administration at permission levels (`RingAdmin`). The rules are enforced by `assertCanAdminister`; there is no way to add, change or remove an admin.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s26|s26]] | Edit · access | Settings decided (DR-04), not built |
| [[Screen Index#s27|s27]] | Edit · permissions | Settings decided (DR-04), not built |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- A Ring's **admins can change its settings**, as the owner can ([[DR-04 Ring settings at launch and their defaults]]). Whether some settings stay the owner's only was not decided; until it is, admins can change all of them.
- Not built yet: there is no way to add, change or remove an admin.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-006 Delegated admin endpoints]] | ⬜ To do | High | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "delegated-admins" SORT priority ASC
```

## Decisions

- [[D-04 Ring settings]] — decided, six settings at launch; the owner and the Ring's admins change them ([[DR-04 Ring settings at launch and their defaults|DR-04]])

## Related

- [[Rings]]
- [[Companies]]
- [[Ring Access Engine]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
