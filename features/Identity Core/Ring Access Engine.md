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

**Status:** Done · **Priority:** P0 · **Domain:** [[Feature Tree#Identity Core|Identity Core]]

`RingAccessService`: the one place that decides whether a viewer may see something. Every read path, and every future feature (events, meetings, chat, posts, Gemma), routes through it.

## Design reference

_No prototype screen. This is a backend-only concern._

Wireframe brief sections: [[Wireframe Brief#Core product concept|§1 Core product concept]], [[Wireframe Brief#Connections & networking|§5 Connections & networking]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Ring`, `RingMember`, `RingAdmin`, `UserBlock`

**Code:** `src/modules/ring-access/`

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
