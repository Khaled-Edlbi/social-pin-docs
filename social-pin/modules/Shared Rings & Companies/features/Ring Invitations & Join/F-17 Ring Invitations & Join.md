---
type: feature
id: ring-invitations
name: "Ring Invitations & Join"
priority: high
release: v1
module: shared-rings
screens: [s17, s74]
related: ["F-12 View As & Pin Views"]
created: 2026-10-15
updated: 2026-10-28
owner: "omar"
tags: [feature, module/shared-rings, priority/high, release/v1]
---

# Ring Invitations & Join

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[M-03 Shared Rings & Companies Module|Shared Rings & Companies]]

**Layers:** [[S-33 Ring Invitations & Join Story|Story]] · [[FR-17 Ring Invitations & Join Frontend Requirements|Frontend Requirements]] · [[BD-17 Ring Invitations & Join Backend Delivery|Backend Delivery]] · [[Ring Invitations & Join Backend Integration|Backend Integration]] · [[Ring Invitations & Join Frontend Delivery|Frontend Delivery]] · [[Ring Invitations & Join QA Backend|QA Backend]] · [[Ring Invitations & Join QA Frontend|QA Frontend]]

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

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-33 Ring Invitations & Join Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-026 | Ring invitations invite, review, decline | Needs a decision | high | S7 |
| T-027 | Join a Ring with a code or verified work email | Blocked | high | S8 |
| T-028 | What you contribute to a shared Ring | Needs a decision | medium | S9 |

### Log of the merged tasks

- T-026 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-026 · 2026-10-25 · ND-04 decided ([[D-04 Ring settings at launch and their defaults]]); What and Dependencies updated, flag cleared. Status left as typed (needs-info) until product says it can move to todo.
- T-026 · 2026-10-18 · created as the backend half of T-026
- T-026 · 2026-10-18 · created as the frontend half of T-026
- T-027 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-027 · 2026-10-25 · ND-04 decided ([[D-04 Ring settings at launch and their defaults]]); What and Dependencies updated, flag cleared. Still waits on T-026.
- T-027 · 2026-10-18 · created as the backend half of T-027
- T-027 · 2026-10-18 · created as the frontend half of T-027
- T-028 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-028 · 2026-10-18 · created as the backend half of T-028
- T-028 · 2026-10-18 · created as the frontend half of T-028

## Decisions

- [[ND-04 Ring settings]] — decided, join with a code or by invitation and approve each one by default ([[D-04 Ring settings at launch and their defaults|D-04]])
- [[ND-18 Company and invited Ring names shown to members]] — decided, an invitation names its Ring and a Ring joined knowingly stays named ([[D-18 Ring names shown when joined knowingly|D-18]])

## Related

- [[F-11 Rings]]
- [[F-15 Companies]]
- [[F-09 Ring Members]]
- [[F-39 Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
