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

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]] · **Frontend guide:** [[Ring Members Frontend]]

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

## How it works

`RingMemberService` is owner-or-admin only on every method, through `assertCanAdminister(…, 'MEMBER_MANAGER')`; there is no member-facing read path because the row names the Ring. `POST /rings/:ringId/members` refuses the owner (400 `E_RING_MEMBER_03`), refuses a pair with a block in either direction (409 `E_RING_MEMBER_04`, the row could never resolve to access), refuses an already-active member (409 `E_RING_MEMBER_01`), and otherwise **upserts** on the unique `(ring, user)` pair so re-adding a `REMOVED` or lapsed member reactivates the row with the new window. `PATCH …/:userId` edits `startsAt` / `expiresAt` in place, `null` clearing a bound. `POST …/:userId/reassign` checks the actor may administer both Rings and that they share an owner (400 `E_RING_07`), then marks the source row `REMOVED` and upserts the target row with the same window, in one transaction, so there is no instant where the member sees both or neither; the engine reads these rows per request, so "live" needs no cache invalidation. `DELETE …/:userId` marks the row `REMOVED` rather than deleting it (it is the record that the person was once in the Ring). `GET …/members` lists newest first with an optional `status` filter. `RING_MEMBER_STATUS.EXPIRED` is never written; the engine evaluates the window live.

### What exists

- Owner or delegated admin only. A member cannot read their own row, because the row names the Ring.
- Reassign and expiry take effect immediately: access is resolved per request.
- Membership carries its own `startsAt` / `expiresAt` window, checked alongside the Ring's.

### Gaps

- s15 "Scan someone in" and "Add" go through the connect flow, which does not exist yet. See [[Connections]].
- "Members can see each other" (s27) would change the owner-only rule. See [[D-04 Ring settings]].
- **The roster carries `userId` only.** No endpoint resolves a user id to a name or Pin name, so the people screen (s15) cannot show names until the contacts work lands. See [[T-023 Connection detail and contacts list]].

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
