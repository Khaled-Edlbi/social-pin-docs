---
type: backend-delivery
code: pincast
scope: feature
feature: pincast
module: discovery
status: todo
screens: [s11, s39, s40, s41, s42]
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/todo, module/discovery, layer/backend]
---

# ⬜ PinCast & Nearby · Backend Delivery

**Feature:** [[PinCast & Nearby]] · **Status:** To do · **Integration guide:** [[PinCast & Nearby Backend Integration]] · **Requirements:** [[PinCast & Nearby Frontend Requirements]] · **QA:** [[PinCast & Nearby QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Pincast`, `PincastRecipient`, `Location`

**Code:** `prisma/migrations/…_constraints_and_indexes (pincasts_geo_gist)`

### What exists

- `pincasts.geo` geography column kept in sync by trigger, GiST index, `PincastRecipient.detectedAt` indexed for purging.

### Gaps

- Setup / start / stop a PinCast bound to a Ring, radius and duration.
- Geo query for nearby PinCasts and nearby-by-Ring (through [[Ring Access Engine]]).
- Results list of who was reached; coordinates never reach a recipient.
- "PinCast ended" and "pins nearby" notifications.
- Recipient purge job, see [[Cleanup Jobs]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[PinCast & Nearby]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
