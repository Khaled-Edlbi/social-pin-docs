---
type: backend-delivery
code: ring-access
scope: feature
feature: ring-access
module: identity
status: done
screens: []
created: 2026-10-15
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/done, module/identity, layer/backend]
---

# ✅ Ring Access Engine · Backend Delivery

**Feature:** [[Ring Access Engine]] · **Status:** Done · **Integration guide:** [[Ring Access Engine Backend Integration]] · **Requirements:** [[Ring Access Engine Frontend Requirements]] · **QA:** [[Ring Access Engine QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Ring`, `RingMember`, `RingAdmin`, `UserBlock`

**Code:** `src/modules/ring-access/`

## How it works

`RingAccessService` exposes two reusable `where` fragments and four decisions. `ringLiveFilter(now)`: `ACTIVE`, not deleted, `startsAt` null or past, `expiresAt` null or **strictly** future. `membershipLiveFilter(now)`: the same on the membership row. `resolveAccessibleRings(viewer, owner)`: the owner's own live Rings (default first, then oldest) when viewer = owner; otherwise an empty list if `isBlockedEitherWay`, else the owner's live Rings the viewer is a live member of, in the same order. `resolveDefaultAccess` returns the first of those or throws the not-shared 404 (`E_RING_ACCESS_01`) so that "no such person" and "not shared" are one answer. `assertRingReadable(ringId, viewer)`: the Ring must pass `ringLiveFilter` (404 `E_RING_ACCESS_02`), the owner passes, a block or no live membership gives the not-shared 404. `assertCanAdminister(ringId, actor, minimumLevel)`: finds the Ring **without** the live filter (an expired Ring must stay editable), the owner passes, otherwise a `RingAdmin` row at or above the level (`MEMBER_MANAGER` < `CONTENT_MANAGER` < `FULL`) is required or it is 403 `E_RING_05`. Every call takes `now` as a parameter and queries fresh; nothing is cached. `RingService`, `RingMemberService` and `RingProfileService` import this service and never query `rings` or `ring_members` to decide access themselves.

### What exists

- Resolved on every request against `now`; nothing is cached. Re-assignment is live and expiry is a real boundary.
- Both windows are checked (the Ring's and the membership's). Expiry is exclusive, so a Ring is dead at its `expiresAt` instant.
- A block is mutual and overrides membership in both directions.
- `assertCanAdminister` deliberately ignores expiry for owner editing paths.

### Gaps

- Nothing can create a `UserBlock` yet, so the block rule is enforced but unreachable. See [[Connections]].
- New domains (events, meetings, PinCast, chat) must add their checks **here**, not in their own modules. Golden rule 8 in `CLAUDE.md`.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Ring Access Engine]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
