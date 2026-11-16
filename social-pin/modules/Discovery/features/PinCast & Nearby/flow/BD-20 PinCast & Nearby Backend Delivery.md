---
id: BD-20
type: backend-delivery
module: discovery
feature: pincast
status: todo
scope: feature
screens: [s11, s39, s40, s41, s42]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/todo, module/discovery, layer/backend]
---

# ⬜ PinCast & Nearby · Backend Delivery

> ⚠ Affected by [[FR-20 PinCast & Nearby Frontend Requirements]] (2026-11-16): FR-20 is `ready` for review: proposed `POST /pincasts`, `GET /pincasts/current` (with `endsAt`, `serverNow`, `positionRefreshSeconds`, `lastEnded`), `PATCH` / `extend` / `stop` / `position` on `/pincasts/current`, `GET /pincasts/current/people?filter=ALL|NEW` (no coordinates, a token per person), `GET /views/pincast/:token`, `POST /connections/requests { pincastToken }` and `GET /connections/relationship?pincastToken=`, `GET /pincasts/:id/results` (state NONE / REQUESTED_ME / CONNECTED, 30 days then the count); proposed `E_PINCAST_01`–`05`

> ⚠ Affected by [[S-45 PinCast & Nearby Story]] (2026-11-16): rewritten for the MVP (draft), N1–N12; its *What the backend has to build* replaces the old S7 (T-032): start / +15 min / stop (25–500 m; 5 min, 30 min, 1 hr, 3 hr), the current PinCast with the server end time, position refresh while the app is open (no background), people in range with mutual visibility and no coordinates, a temporary view of the broadcast Ring without membership or Ring name, connect by PinCast token (like D-10's qrToken), results ("Sent you a request" / "Connected") complete for 30 days then the count, error codes. Nearby by Ring is later

**Feature:** [[F-20 PinCast & Nearby]] · **Status:** To do · **Integration guide:** [[PinCast & Nearby Backend Integration]] · **Requirements:** [[FR-20 PinCast & Nearby Frontend Requirements]] · **QA:** [[PinCast & Nearby QA Backend]]

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
