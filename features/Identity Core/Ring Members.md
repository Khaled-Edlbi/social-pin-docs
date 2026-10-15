---
type: feature
id: ring-members
name: "Ring Members"
status: done
priority: P0
domain: identity
screens: [s15, s47]
updated: 2026-10-15
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ Ring Members

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

The owner's roster of a Ring: list, add, edit the access window, move someone to another Ring live, revoke.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s15|s15]] | Ring people |  |
| [[Screen Index#s47|s47]] | Connection detail | Reassign / revoke done; detail todo |

Wireframe brief sections: [[Wireframe Brief#Ring management|§4.2 Ring management]], [[Wireframe Brief#Connection screens|§5.1 Connection screens]], [[Wireframe Brief#Connection motion & states|§5.2 Connection motion & states]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints**

- `GET /rings/:ringId/members`
- `POST /rings/:ringId/members`
- `PATCH /rings/:ringId/members/:userId`
- `POST /rings/:ringId/members/:userId/reassign`
- `DELETE /rings/:ringId/members/:userId`

**Tables / models:** `RingMember`

**Code:** `src/modules/ring/ring-member.service.ts`, `src/modules/ring/ring-member.controller.ts`

### What exists

- Owner or delegated admin only. A member cannot read their own row, because the row names the Ring.
- Reassign and expiry take effect immediately: access is resolved per request.
- Membership carries its own `startsAt` / `expiresAt` window, checked alongside the Ring's.

### Gaps

- s15 "Scan someone in" and "Add" go through the connect flow, which does not exist yet. See [[Connections]].
- "Members can see each other" (s27) would change the owner-only rule. See [[D-04 Ring settings]].

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

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
