---
type: feature
id: ring-invitations
name: "Ring Invitations & Join"
status: todo
priority: P1
domain: shared-rings
screens: [s17, s74]
updated: 2026-10-15
tags: [feature, status/todo, domain/shared-rings, priority/P1]
---

# ❌ Ring Invitations & Join

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Shared Rings & Companies|Shared Rings & Companies]]

Being invited into someone else's Ring: review or decline an invite (s17), join with a code, a verified work email or a colleague's QR (s74), and "what you contribute" to a shared Ring.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s17|s17]] | Shared with me | List done; review / decline invite todo |
| [[Screen Index#s74|s74]] | Join a company Ring |  |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Organizer touchpoints|§9.3 Organizer touchpoints]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `GET /rings/shared-with-me (list only)`

**Tables / models:** `RingMember`, `Ring`

### What exists

- The shared-with-me list.

### Gaps

- Invitation object (or a `RingMember` in an INVITED state) with accept / decline.
- Join code and required verified email domain: both need Ring settings, see [[D-04 Ring settings]].
- "What you contribute" is a member-side projection into a shared Ring: new concept, not in the schema.

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

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
