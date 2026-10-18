---
type: feature
id: ring-invitations
name: "Ring Invitations & Join"
status: todo
priority: P1
module: shared-rings
screens: [s17, s74]
related: ["View As & Pin Views"]
updated: 2026-10-18
tags: [feature, status/todo, module/shared-rings, priority/P1]
---

# ❌ Ring Invitations & Join

**Status:** TODO · **Priority:** P1 · **Module:** [[Shared Rings & Companies Module|Shared Rings & Companies]]

**Layers:** [[Ring Invitations & Join Story|Story]] · [[Ring Invitations & Join Frontend Requirements|Frontend Requirements]] · [[Ring Invitations & Join Backend Delivery|Backend Delivery]] · [[Ring Invitations & Join Backend Integration|Backend Integration]] · [[Ring Invitations & Join Frontend Delivery|Frontend Delivery]] · [[Ring Invitations & Join QA Backend|QA Backend]] · [[Ring Invitations & Join QA Frontend|QA Frontend]]

Being invited into someone else's Ring: review or decline an invite (s17), join with a code, a verified work email or a colleague's QR (s74), and "what you contribute" to a shared Ring.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s17|s17]] | Shared with me | List done; review / decline invite todo |
| [[Screen Index#s74|s74]] | Join a company Ring |  |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Organizer touchpoints|§9.3 Organizer touchpoints]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-026 Ring invitations invite, review, decline]] | ❓ Needs a decision / info | P1 | M |
| [[T-027 Join a Ring with a code or verified work email]] | ⛔ Blocked | P1 | M |
| [[T-028 What you contribute to a shared Ring]] | ❓ Needs a decision / info | P2 | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "ring-invitations" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]

## Related

- [[Rings]]
- [[Companies]]
- [[Ring Members]]
- [[Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
