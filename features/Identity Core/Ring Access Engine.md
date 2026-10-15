---
type: feature
id: ring-access
name: "Ring Access Engine"
status: done
priority: P0
domain: identity
screens: []
updated: 2026-10-15
tags: [feature, status/done, domain/identity, priority/P0]
---

# ✅ Ring Access Engine

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]] · **Frontend guide:** [[Ring Access Engine Frontend]]

`RingAccessService`: the one place that decides whether a viewer may see something. Every read path, and every future feature (events, meetings, chat, posts, Gemma), routes through it.

## Design reference

_No prototype screen. This is a backend-only concern._

Wireframe brief sections: [[Wireframe Brief#Core product concept|§1 Core product concept]], [[Wireframe Brief#Connections & networking|§5 Connections & networking]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

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

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "ring-access" SORT priority ASC
```

## Open decisions

- [[D-04 Ring settings]]

## Related

- [[Rings]]
- [[Ring Members]]
- [[View As & Pin Views]]
- [[Connections]]
- [[Events During]]
- [[Meetings]]
- [[PinCast & Nearby]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
