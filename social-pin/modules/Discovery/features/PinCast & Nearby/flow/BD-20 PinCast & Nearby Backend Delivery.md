---
id: BD-20
type: backend-delivery
module: discovery
feature: pincast
status: in-progress
scope: feature
screens: [s11, s39, s40, s41, s42]
created: 2026-10-18
updated: 2026-11-23
tags: [backend-delivery, backend-delivery/in-progress, module/discovery, layer/backend]
---

# 🟡 PinCast & Nearby · Backend Delivery

> ⚠ Affected by [[S-45 PinCast & Nearby Story]] (2026-11-16): rewritten for the MVP (draft), N1–N12; its *What the backend has to build* replaces the old S7 (T-032): start / +15 min / stop (25–500 m; 5 min, 30 min, 1 hr, 3 hr), the current PinCast with the server end time, position refresh while the app is open (no background), people in range with mutual visibility and no coordinates, a temporary view of the broadcast Ring without membership or Ring name, connect by PinCast token (like D-10's qrToken), results ("Sent you a request" / "Connected") complete for 30 days then the count, error codes. Nearby by Ring is later

**Feature:** [[F-20 PinCast & Nearby]] · **Status:** In progress · **Integration guide:** [[PinCast & Nearby Backend Integration]] · **Requirements:** [[FR-20 PinCast & Nearby Frontend Requirements]] · **QA:** [[PinCast & Nearby QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Pincast`, `PincastRecipient`, `Location`

**Code:** `prisma/migrations/…_constraints_and_indexes (pincasts_geo_gist)`

### What exists

- `pincasts.geo` geography column kept in sync by trigger, GiST index, `PincastRecipient.detectedAt` indexed for purging.

### Gaps

- Setup / start / stop a PinCast bound to a Ring, radius and duration.
- Geo query for nearby PinCasts and nearby-by-Ring (through [[F-08 Ring Access Engine]]).
- Results list of who was reached; coordinates never reach a recipient.
- "PinCast ended" and "pins nearby" notifications.
- Recipient purge job, see [[F-31 Cleanup Jobs]].

## Log

- 2026-10-18 · split out of [[F-20 PinCast & Nearby]] when the vault moved to layers
- 2026-11-23 · `tickets/backend/M-04-discovery/F-20-pincast/FR-20-accepted` · [[FR-20 PinCast & Nearby Frontend Requirements]] reviewed against [[S-45 PinCast & Nearby Story]] S1–S5 and N1–N12 and set `approved`; this note `in-progress`. Work ahead is the story's *What the backend has to build* 1–8 with FR-20's proposed routes as the working names (`/pincasts` start, current, change, extend, stop, position, people; `GET /views/pincast/:token`; `pincastToken` on connect and relationship; results with the 30-day purge; `E_PINCAST_01`–`05`); the position refresh interval and the token's validity after the end are this note's to set. Cleared the FR-20 flag; the S-45 flag stays until the delivery is written. No code branch yet
- 2026-11-23 · code branch `BD-20/pincast/pincast-routes` in `social-pin` (commit `ad6e30e`, **not on `main` yet**: nothing above is available to the client until it merges) · the story's *What the backend has to build* 1–8 written and unit-tested (1147 specs green, typecheck clean): `POST /pincasts`, `GET /pincasts/current` (`current`, `lastEnded`, `serverNow`), `PATCH /pincasts/current`, `POST /pincasts/current/extend`, `POST /pincasts/current/stop`, `POST /pincasts/current/position`, `GET /pincasts/current/people?filter=ALL|NEW`, `GET /pincasts/:id/results`, `GET /views/pincast/:token`; `pincastToken` on `POST /connections/requests`, `GET /connections/relationship` and `POST /blocks`; migration `20261123120000_pincast_routes` (one live PinCast per user, `shown_ring_id` and `token_hash` on the recipients, `duration_minutes`, `ended_at`, `reached_count`); reach is mutual at the smaller of the two radii (`ST_DWithin` on the GiST index) and decided by `RingAccessService.filterRingsPresentedTo`. **Set here, as the story left to the backend:** `positionRefreshSeconds` = 30; a PinCast token lives 30 days from the detection, with the row (so Connect from a result row works as long as the results do; the card by token too, which is longer than the story's "ends with the PinCast": for the PM to confirm or send back). **Codes as the code spells them:** `E_PINCAST_01` already live (409), `E_PINCAST_02` no live PinCast (404), `E_PINCAST_03` distance or duration not allowed (400), `E_PINCAST_04` no such PinCast of yours (404, the results); the token routes (the card, connect, relationship, block) answer the views' one `E_RING_ACCESS_01` for an unknown, expired or foreign token, an ended Ring, a deleted account and a block alike, as the badge does, so FR-20's proposed `E_PINCAST_04` (token) and `E_PINCAST_05` (results) are not used as proposed: FR-20's rows to update when this merges. A range or duration off the steps is `E_PINCAST_03` from the service, not a validation 400. Not verified against a PostGIS database in this session (no database here): the migration and the geo query are to be run on dev before the merge. Delivery and Integration notes follow when it is on `main`
