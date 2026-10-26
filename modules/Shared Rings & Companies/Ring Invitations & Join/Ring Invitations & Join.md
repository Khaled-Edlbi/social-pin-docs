---
type: feature
id: ring-invitations
name: "Ring Invitations & Join"
priority: high
release: v1
module: shared-rings
screens: [s17, s74]
related: ["View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-26
owner: "omar"
tags: [feature, module/shared-rings, priority/high, release/v1]
---

# Ring Invitations & Join

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[Shared Rings & Companies Module|Shared Rings & Companies]]

**Layers:** [[Ring Invitations & Join Story|Story]] · [[Ring Invitations & Join Frontend Requirements|Frontend Requirements]] · [[Ring Invitations & Join Backend Delivery|Backend Delivery]] · [[Ring Invitations & Join Backend Integration|Backend Integration]] · [[Ring Invitations & Join Frontend Delivery|Frontend Delivery]] · [[Ring Invitations & Join QA Backend|QA Backend]] · [[Ring Invitations & Join QA Frontend|QA Frontend]]

Being invited into someone else's Ring: review or decline an invite (s17), join with a code, a verified work email or a colleague's QR (s74), and "what you contribute" to a shared Ring.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s17|s17]] | Shared with me | List done; review / decline invite todo |
| [[Screen Index#s74|s74]] | Join a company Ring |  |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Organizer touchpoints|§9.3 Organizer touchpoints]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Product rules

- **An invitation names the Ring** it is for, so the invitee knows what they join; a Ring joined by an accepted invitation, a code or a verified work email keeps showing its name to that member ([[D-18 Ring names shown when joined knowingly]]). Its colour and type are never shown.
- Who may ask to join and whether the owner approves each one are Ring settings, by default **with a code or by invitation** and **approve each one** ([[D-04 Ring settings at launch and their defaults]]); members may invite others only when the owner turns that on.
- Not built yet: invitations, codes and work-email joining do not exist.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-026 Ring invitations invite, review, decline]] | ❓ Needs a decision / info | High | M |
| [[T-027 Join a Ring with a code or verified work email]] | ⛔ Blocked | High | M |
| [[T-028 What you contribute to a shared Ring]] | ❓ Needs a decision / info | Medium | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "ring-invitations" SORT priority ASC
```

## Decisions

- [[ND-04 Ring settings]] — decided, join with a code or by invitation and approve each one by default ([[D-04 Ring settings at launch and their defaults|D-04]])
- [[ND-18 Company and invited Ring names shown to members]] — decided, an invitation names its Ring and a Ring joined knowingly stays named ([[D-18 Ring names shown when joined knowingly|D-18]])

## Related

- [[Rings]]
- [[Companies]]
- [[Ring Members]]
- [[Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
