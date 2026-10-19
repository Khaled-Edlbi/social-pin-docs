---
type: feature
id: delegated-admins
name: "Delegated Admins"
priority: high
module: shared-rings
screens: [s26, s27]
updated: 2026-10-19
tags: [feature, module/shared-rings, priority/high]
---

# Delegated Admins

**Backend:** Partial (needs more) · **Priority:** High · **Module:** [[Shared Rings & Companies Module|Shared Rings & Companies]]

**Layers:** [[Delegated Admins Story|Story]] · [[Delegated Admins Frontend Requirements|Frontend Requirements]] · [[Delegated Admins Backend Delivery|Backend Delivery]] · [[Delegated Admins Backend Integration|Backend Integration]] · [[Delegated Admins Frontend Delivery|Frontend Delivery]] · [[Delegated Admins QA Backend|QA Backend]] · [[Delegated Admins QA Frontend|QA Frontend]]

Company Rings delegate administration at permission levels (`RingAdmin`). The rules are enforced by `assertCanAdminister`; there is no way to add, change or remove an admin.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s26|s26]] | Edit · access | Settings → D-04 |
| [[Screen Index#s27|s27]] | Edit · permissions | All settings → D-04 |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-006 Delegated admin endpoints]] | ⬜ To do | High | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "delegated-admins" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]

## Related

- [[Rings]]
- [[Companies]]
- [[Ring Access Engine]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
