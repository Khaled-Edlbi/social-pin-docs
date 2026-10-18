---
type: feature
id: ring-members
name: "Ring Members"
status: done
priority: P0
module: identity
screens: [s15, s47]
related: ["View As & Pin Views"]
updated: 2026-10-18
tags: [feature, status/done, module/identity, priority/P0]
---

# ✅ Ring Members

**Status:** Done · **Priority:** P0 · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Ring Members Story|Story]] · [[Ring Members Frontend Requirements|Frontend Requirements]] · [[Ring Members Backend Delivery|Backend Delivery]] · [[Ring Members Backend Integration|Backend Integration]] · [[Ring Members Frontend Delivery|Frontend Delivery]] · [[Ring Members QA Backend|QA Backend]] · [[Ring Members QA Frontend|QA Frontend]]

The owner's roster of a Ring: list, add, edit the access window, move someone to another Ring live, revoke.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s15|s15]] | Ring people |  |
| [[Screen Index#s47|s47]] | Connection detail | Reassign / revoke done; detail todo |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Connection screens|§5.1 Connection screens]], [[Wireframe Brief#Connection motion & states|§5.2 Connection motion & states]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "ring-members" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]

## Related

- [[Rings]]
- [[Ring Access Engine]]
- [[Connections]]
- [[Delegated Admins]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
