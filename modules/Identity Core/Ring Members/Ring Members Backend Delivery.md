---
type: backend-delivery
code: ring-members
scope: feature
feature: ring-members
module: identity
status: done
screens: [s15, s47]
created: 2026-10-15
updated: 2026-10-26
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Ring Members · Backend Delivery

> ⚠ Affected by [[DR-04 Ring settings at launch and their defaults]] (2026-10-25): D-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

**Feature:** [[Ring Members]] · **Status:** Done · **Integration guide:** [[Ring Members Backend Integration]] · **Requirements:** [[Ring Members Frontend Requirements]] · **QA:** [[Ring Members QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

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

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Ring Members]] when the vault moved to layers
