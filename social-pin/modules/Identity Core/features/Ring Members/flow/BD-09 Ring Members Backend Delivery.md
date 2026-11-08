---
id: BD-09
type: backend-delivery
module: identity
feature: ring-members
status: done
scope: feature
screens: [s15, s47]
created: 2026-10-15
updated: 2026-11-08
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Ring Members · Backend Delivery

**Feature:** [[F-09 Ring Members]] · **Status:** Done · **Integration guide:** [[BI-06 Ring Members Backend Integration]] · **Requirements:** [[FR-09 Ring Members Frontend Requirements]] · **QA:** [[QB-11 Ring Members QA Backend]]

What the backend shipped for this feature and how it works.

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

`RingMemberService` is owner-or-admin only on every method, through `assertCanAdminister(…, 'MEMBER_MANAGER')`; there is no member-facing read path because the row names the Ring. `POST /rings/:ringId/members` refuses the owner (400 `E_RING_MEMBER_03`); refuses, before any write, a `userId` that names no user or a deleted one, and a pair with a block in either direction (the row could never resolve to access), all three with **one body**, 409 `E_RING_MEMBER_04` "This user cannot be added", so the owner cannot probe which ids exist or tell "blocked" from "deleted"; refuses a member who is **live right now** (409 `E_RING_MEMBER_01`), "live" being the engine's `RingAccessService.membershipLiveFilter` (`ACTIVE` and inside the membership's own window); and otherwise **upserts** on the unique `(ring, user)` pair, so re-adding a `REMOVED` or lapsed member (an `ACTIVE` row whose window has closed) reactivates the same row with the new window. A row whose `startsAt` is still in the future is not live either, so re-adding it replaces its window. `PATCH …/:userId` edits `startsAt` / `expiresAt` in place, `null` clearing a bound. `POST …/:userId/reassign` moves the person **out of** the URL's `:ringId` **into** the body's `toRingId`; it checks the actor may administer both Rings and that they share an owner (400 `E_RING_07`), then marks the source row `REMOVED` and upserts the target row with the same window, in one transaction, so there is no instant where the member sees both or neither; the engine reads these rows per request, so "live" needs no cache invalidation. `DELETE …/:userId` marks the row `REMOVED` rather than deleting it (it is the record that the person was once in the Ring). `GET …/members` lists newest first with an optional `status` filter. `RING_MEMBER_STATUS.EXPIRED` is never written; the engine evaluates the window live.

### What exists

- Owner or delegated admin only. A member cannot read their own row, because the row names the Ring.
- Reassign and expiry take effect immediately: access is resolved per request.
- Membership carries its own `startsAt` / `expiresAt` window, checked alongside the Ring's.
- Membership records **how it was made** (`origin`, since `main` `1c460b0`): `PLACED` (the default: an owner or admin add, a connection accepted into the Ring, a reassign) or joined knowingly through an `INVITATION`, a `JOIN_CODE` or an approved `JOIN_REQUEST` ([[BD-17 Ring Invitations & Join Backend Delivery]]). The roster returns it to the owner. `POST /rings/:ringId/members` and reassign always write `PLACED`, even when they re-activate a row first made by joining knowingly, so a Ring the owner places someone in is never named to them (D-18).

### Gaps

- s15 "Scan someone in" and "Add" go through the connect flow, which does not exist yet: sending and accepting are [[S-23 Connections Story|Connections · S2–S7]] ([[F-14 Connections]]).
- "Members can see each other" (s27) would open a member-facing read of the roster, against today's owner-only rule. [[D-04 Ring settings at launch and their defaults]] decided it as one of six launch settings, off by default; neither the setting nor that read path exists yet ([[S-18 Rings Story|Rings · S9]]).
- **The roster carries `userId` only.** No endpoint resolves a user id to a name or Pin name, so the people screen (s15) cannot show names until the contacts work lands. See [[S-23 Connections Story|Connections · S8–S12]].
- Delegated admins can already manage a roster when they hold a `RingAdmin` row at `MEMBER_MANAGER` or above, but nothing appoints one yet: [[S-31 Delegated Admins Story]], *What the backend has to build*.

## Log

- 2026-10-18 · split out of [[F-09 Ring Members]] when the vault moved to layers
- 2026-11-05 · `docs/backend/M-01-identity/F-09-ring-members/BD-09-links-and-flags` · checked against backend `main` f186ba1, no code change: the S-23 parts repointed (flag cleared), ND-04 replaced by its decision D-04 (flag cleared), the reassign direction stated, the delegated-admin gap added. [[FR-09 Ring Members Frontend Requirements]] sent back to `draft` the same day on its own branch.
- 2026-11-08 · `docs/backend/M-01-identity/F-09-ring-members/BD-09-bugs-fixed` · backend branch `B-09/ring/member-reactivate-and-unknown-user` (e3e32b6) merged to backend `main` e483d49: [[B-09 Re-adding a lapsed member answers 409, not a reactivation|B-09]] fixed, only a member live right now answers 409 `E_RING_MEMBER_01` and a lapsed member is reactivated with the new window (201); [[B-10 Adding an unknown userId answers 500|B-10]] fixed, an unknown or deleted `userId` answers 409 `E_RING_MEMBER_04`, the same body as a block, so the owner cannot probe which ids exist (it was a 500 from the foreign key). Both bugs set `ready` for QA's re-test on their own branches. The [[QB-11 Ring Members QA Backend]] flag cleared; [[BI-06 Ring Members Backend Integration]] Flow 2 and *Errors to handle* updated.
- 2026-11-08 · backend `main` `1c460b0` (merge of `FR-17/ring-invitation/invitations-codes-origin` @ `21899a6`, [[BD-17 Ring Invitations & Join Backend Delivery]]) · membership origin recorded: column `ring_members.origin` (enum `RING_MEMBER_ORIGIN`, default `PLACED`, every existing row placed) in migration `20261108150000_ring_invitations_and_join`; `RingMemberEntity` returns `origin` on every members route; add and reassign write `PLACED`; the knowing ways in write through `RingMemberService.admitKnowingly`. No route takes `origin` as input. [[BI-06 Ring Members Backend Integration]] updated on its own branch
