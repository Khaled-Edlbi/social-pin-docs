---
id: BD-09
type: backend-delivery
module: identity
feature: ring-members
status: done
scope: feature
screens: [s15, s47]
depends: ["FR-09 Ring Members Frontend Requirements", "S-16 Ring Members Story"]
affects: ["BI-06 Ring Members Backend Integration", "QB-11 Ring Members QA Backend"]
related: ["BD-17 Ring Invitations & Join Backend Delivery", "D-18 Ring names shown when joined knowingly", "D-29 Connection detail opens a member who is not a connection", "GET /rings/:ringId/members", "POST /rings/:ringId/members", "PATCH /rings/:ringId/members/:userId", "DELETE /rings/:ringId/members/:userId", "POST /rings/:ringId/members/:userId/reassign", "GET /connections/:userId", E_RING_02, E_RING_05, E_RING_07]
pending: ["[[FR-09 Ring Members Frontend Requirements]]: names on the roster (M10): displayName, pinName and avatarUrl on each row of GET /rings/:ringId/members (the card the owner may see, as GET /connections/:userId answers it), so s15 is one call, not one per member", "[[FR-09 Ring Members Frontend Requirements]]: search the roster by name (M10): GET /rings/:ringId/members?name= over display name and Pin name, with paging", "[[FR-09 Ring Members Frontend Requirements]]: the members a member may see (S8): a member-facing, paginated, searchable roster of each member's card for that Ring, only while the Ring's membersCanSeeEachOther is on, else the same not-shared 404; never the Ring's name (unless joined knowingly), windows, lapsed rows or the owner"]
created: 2026-10-15
updated: 2026-11-09
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

- s15 "+ Add" picks from my connections (`GET /connections`, [[F-14 Connections]], on `main`) and adds through `POST /rings/:ringId/members`; "Scan someone in" is not in the MVP ([[D-28 Scan someone in is not in the MVP]]).
- **No member-facing roster** ([[FR-09 Ring Members Frontend Requirements|FR-09]] S8, pending). The setting exists since `main` `12172c6` (`membersCanSeeEachOther`, off by default, [[D-04 Ring settings at launch and their defaults]], [[BD-11 Rings Backend Delivery]]) and today gates only the member count on Shared with me; no route lets a member read the other members of a Ring, so off and on both mean no roster for a member.
- **The roster carries `userId` only** ([[FR-09 Ring Members Frontend Requirements|FR-09]] M10, pending). Names come one member at a time from `GET /connections/:userId`, which answers for a connection and for a member of my Rings who is not one ([[D-29 Connection detail opens a member who is not a connection|D-29]]); `GET /rings/:ringId/members` returns no `displayName`, `pinName` or `avatarUrl`, and takes no `?name=` filter (only `status`, `limit`, `skip`).
- Delegated admins can already manage a roster when they hold a `RingAdmin` row at `MEMBER_MANAGER` or above, but nothing appoints one yet: [[S-31 Delegated Admins Story]], *What the backend has to build*.

## Log

- 2026-10-18 · split out of [[F-09 Ring Members]] when the vault moved to layers
- 2026-11-05 · `docs/backend/M-01-identity/F-09-ring-members/BD-09-links-and-flags` · checked against backend `main` f186ba1, no code change: the S-23 parts repointed (flag cleared), ND-04 replaced by its decision D-04 (flag cleared), the reassign direction stated, the delegated-admin gap added. [[FR-09 Ring Members Frontend Requirements]] sent back to `draft` the same day on its own branch.
- 2026-11-08 · `docs/backend/M-01-identity/F-09-ring-members/BD-09-bugs-fixed` · backend branch `B-09/ring/member-reactivate-and-unknown-user` (e3e32b6) merged to backend `main` e483d49: [[B-09 Re-adding a lapsed member answers 409, not a reactivation|B-09]] fixed, only a member live right now answers 409 `E_RING_MEMBER_01` and a lapsed member is reactivated with the new window (201); [[B-10 Adding an unknown userId answers 500|B-10]] fixed, an unknown or deleted `userId` answers 409 `E_RING_MEMBER_04`, the same body as a block, so the owner cannot probe which ids exist (it was a 500 from the foreign key). Both bugs set `ready` for QA's re-test on their own branches. The [[QB-11 Ring Members QA Backend]] flag cleared; [[BI-06 Ring Members Backend Integration]] Flow 2 and *Errors to handle* updated.
- 2026-11-08 · backend `main` `1c460b0` (merge of `FR-17/ring-invitation/invitations-codes-origin` @ `21899a6`, [[BD-17 Ring Invitations & Join Backend Delivery]]) · membership origin recorded: column `ring_members.origin` (enum `RING_MEMBER_ORIGIN`, default `PLACED`, every existing row placed) in migration `20261108150000_ring_invitations_and_join`; `RingMemberEntity` returns `origin` on every members route; add and reassign write `PLACED`; the knowing ways in write through `RingMemberService.admitKnowingly`. No route takes `origin` as input. [[BI-06 Ring Members Backend Integration]] updated on its own branch
- 2026-11-09 · `tickets/backend/M-01-identity/F-09-ring-members/FR-09-accepted` · [[FR-09 Ring Members Frontend Requirements]] reviewed against backend `main` `d8267d3` and **approved**. Three asks not on `main` go in `pending`, so this note is `done`, Partial: names on the roster (M10), `?name=` search on the roster (M10), the member-facing roster (S8). FR-09's join-requests row flipped ✅ (shipped by [[BD-17 Ring Invitations & Join Backend Delivery]]). *Gaps* brought up to date (connections, the setting, D-29). No code change.
- 2026-11-09 · flagged [[FR-09 Ring Members Frontend Requirements]]: membersCanSeeEachOther exists on a Ring since backend main 12172c6 (BD-11), so the 'the setting doesn't exist' lines (s15 footnote, s17 Source today, Blocked by S-18 S9) are stale; only the member-facing roster read is missing, pending on BD-09 (/frontend)
