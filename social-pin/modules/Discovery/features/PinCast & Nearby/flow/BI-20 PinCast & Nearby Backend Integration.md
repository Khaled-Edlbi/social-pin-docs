---
id: BI-20
type: backend-integration
module: discovery
feature: pincast
status: current
scope: feature
screens: [s11, s39, s40, s41, s42, s44]
depends: ["BD-20 PinCast & Nearby Backend Delivery", "FR-20 PinCast & Nearby Frontend Requirements", "S-45 PinCast & Nearby Story"]
affects: ["FR-20 PinCast & Nearby Frontend Requirements"]
related: ["POST /pincasts", "GET /pincasts/current", "PATCH /pincasts/current", "POST /pincasts/current/extend", "POST /pincasts/current/stop", "POST /pincasts/current/position", "GET /pincasts/current/people", "GET /pincasts/:id/results", "GET /views/pincast/:token", "GET /rings", "POST /connections/requests", "GET /connections/relationship", "POST /connections/requests/:id/accept", "POST /blocks", "E_PINCAST_01", "E_PINCAST_02", "E_PINCAST_03", "E_PINCAST_04", "E_RING_02", "E_RING_03", "BI-16 Connections Backend Integration", "BI-15 Badge & QR Backend Integration", "BI-08 Rings Backend Integration", "Frontend Contract", "Frontend API Guide", "S-96 Notifications Story", "F-31 Cleanup Jobs"]
pending: []
created: 2026-11-23
updated: 2026-11-23
tags: [backend-integration, backend-integration/current, module/discovery, layer/backend]
---

# 🔌 PinCast & Nearby · Backend Integration

**Feature:** [[F-20 PinCast & Nearby]] · **Backend:** [[BD-20 PinCast & Nearby Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]]

Written by the **backend** team for the frontend: how to call what [[BD-20 PinCast & Nearby Backend Delivery|BD-20]] delivered, on backend `main` `ecd93c0` (2026-11-23). It answers [[FR-20 PinCast & Nearby Frontend Requirements|FR-20]] row by row; where the shipped shape differs from FR-20's proposal it says so. Base URL `/api/v1`, bearer token on every call.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s39\|s39]] PinCast · hidden | opens the screen | `GET /pincasts/current` → `current` null (hidden), or a live one → s40; `lastEnded` → "Your last PinCast · See results" |
| [[Screen Index#s41\|s41]] setup | picks the Ring | `GET /rings` (my live Rings, [[BI-08 Rings Backend Integration\|BI-08]]) |
| s41 | *Start PinCast* | `POST /pincasts { ringId, radiusMeters, durationMinutes, lat, lng }` → 201 → s40 |
| [[Screen Index#s40\|s40]] live | *Change* (from s41) | `PATCH /pincasts/current { ringId?, radiusMeters? }` |
| s40 | sees the people found | `GET /pincasts/current/people?filter=ALL\|NEW&limit=&skip=`, every 10 s while open |
| s40 | every `positionRefreshSeconds`, foreground only | `POST /pincasts/current/position { lat, lng }` → 204 |
| s40 | *+15 min* | `POST /pincasts/current/extend` → 200 |
| s40 | *Stop* | `POST /pincasts/current/stop` → 200 `{ id, endedAt }` → s42 |
| s40, s42 → [[Screen Index#s44\|s44]] | taps a person | `GET /views/pincast/:token` |
| s44 | the card's button | `GET /connections/relationship?pincastToken=` ([[BI-16 Connections Backend Integration\|BI-16]]) |
| s44, s42 | *Connect* | `POST /connections/requests { pincastToken, note? }` |
| s44 | *Block* | `POST /blocks { pincastToken }` |
| [[Screen Index#s11\|s11]] Home chip | while live, every 30 s | `GET /pincasts/current` |
| [[Screen Index#s42\|s42]] results | opens the results | `GET /pincasts/:id/results?limit=&skip=` |
| s42 | *Accept* on "Sent you a request" | `POST /connections/requests/:requestId/accept { ringId, … }` (BI-16, S-23 S5) |

## Flow

1. **Open PinCast (s39):** `GET /pincasts/current`. `current` null → hidden; show `lastEnded` as "Your last PinCast · See results" when present (it is the most recent ended PinCast whose 30 days are not over; `resultsUntil` says when they are). `current` set → go to s40.
2. **Start (s41):** the Ring from `GET /rings`; distance and duration on the fixed steps; take the position; `POST /pincasts`. Keep the answer as *the current PinCast* and take the clock offset from `serverNow`.
3. **Live (s40):** countdown to `endsAt` from the offset; `GET …/people` every 10 s (the server runs a detection pass on each call, so the list grows without a manual refresh); `POST …/position` every `positionRefreshSeconds` (30) and on return to the foreground; stop both on end, stop and leaving the screen.
4. **+15 min / Stop / Change:** each answers the new `PincastEntity` (stop: `{ id, endedAt }`); replace the cached current PinCast with it. After stop, go to s42 with `id`.
5. **The end:** when the countdown reaches zero, `GET /pincasts/current` → `current` null, `lastEnded` set → s42 with `lastEnded.id`. Home does the same with its chip (N11).
6. **A person (s44):** `GET /views/pincast/:token` for the card, `GET /connections/relationship?pincastToken=` for the button; *Connect* and *Block* by the same token. The token is also on each results row, so *Connect* from s42 needs no card open.
7. **Results (s42):** `GET /pincasts/:id/results`; `data` null means the 30 days are over: show `count` only.

## Shapes that matter

`PincastEntity` (start, current, change, extend):

```json
{
  "id": "uuid",
  "ring": { "id": "uuid", "name": "Clients", "colorHex": "#2563EB" },
  "radiusMeters": 100,
  "durationMinutes": 30,
  "startedAt": "2026-11-23T10:00:00.000Z",
  "endsAt": "2026-11-23T10:30:00.000Z",
  "serverNow": "2026-11-23T10:05:12.000Z",
  "positionRefreshSeconds": 30
}
```

`GET /pincasts/current`:

```json
{
  "current": null,
  "lastEnded": { "id": "uuid", "endedAt": "…", "resultsUntil": "…" },
  "serverNow": "…"
}
```

`GET /pincasts/current/people` → `{ data: PincastPersonEntity[], meta: { total } }`, newest first:

```json
{ "displayName": "Sara", "avatarUrl": "/api/v1/files/content/…", "isConnection": false, "token": "q7Zt0cX3mKp9WvL2aR8sYbN4eH6uJ1fD", "detectedAt": "…" }
```

`GET /pincasts/:id/results`:

```json
{
  "pincast": { "ring": { "id": "uuid", "name": "Clients", "colorHex": null }, "radiusMeters": 100, "startedAt": "…", "endedAt": "…" },
  "count": 7,
  "data": [
    { "displayName": "Sara", "avatarUrl": null, "token": "…", "detectedAt": "…", "state": "REQUESTED_ME", "requestId": "uuid" }
  ],
  "meta": { "total": 7 }
}
```

`GET /views/pincast/:token` → `RingProfileViewEntity` (exactly `GET /views/ring/:ringId`'s body: `pinName`, `displayName`, `headline`, …, `links`, `attachments`) **plus** `expiresAt`, when the token stops working.

Differences from FR-20's proposal: `GET /pincasts/current` wraps the PinCast in `current` (so `serverNow` and `lastEnded` exist while hidden); `lastEnded` is `{ id, endedAt, resultsUntil }`, not `{ id, endsAt }`; `PincastEntity.startedAt` (not `startsAt`); a result row carries `requestId` for *Accept*; `PincastViewEntity` carries the full card plus `expiresAt`.

## State to keep on the client

- **The current PinCast** by signed-in user: replaced by every start / change / extend answer, cleared by stop and when `endsAt` passes; refetched on Home's open and every 30 s while live.
- **The clock offset** `serverNow − device time`, re-taken on every answer that carries `serverNow`; the countdown is `endsAt − (device time + offset)`.
- **The people** by (PinCast id, filter) and **the results** by PinCast id; a card by (viewer, token). New rows animate in; the list keeps what it had when offline.
- **The last settings** (Ring id, distance, duration) per user, on the phone only; drop them when the Ring is gone from `GET /rings`.
- **The position** in memory only, never logged or cached, sent only to `POST /pincasts` and `POST …/position`.

## Errors to handle

Until [[S-87 Error Contract Story|Error Contract]] puts `errorCode` on the wire, branch on the status and the endpoint; the codes below are what the body will carry.

| Status | ErrorCode | Where | Meaning | Show |
|---|---|---|---|---|
| 409 | `E_PINCAST_01` | start | you already have a live PinCast | refetch current, go to s40 |
| 404 | `E_PINCAST_02` | change, extend, stop, position, people | no live PinCast: it ended, was stopped, or never started | refetch current; `lastEnded` → s42 |
| 400 | `E_PINCAST_03` | start, change | distance off 25–500 m, or duration not 5 / 30 / 60 / 180 min | should not happen (fixed steps); "Couldn't start" |
| 400 | — (validation) | start, change, position, people | bad types, `lat` / `lng` out of range, `filter` not ALL / NEW, `limit` > 50 | "Couldn't …" |
| 404 | `E_RING_02` | start, change | the Ring is gone or not yours | refetch `GET /rings`, back to s41 |
| 409 | `E_RING_03` | start, change | your Ring has ended or was archived | the same |
| 404 | `E_PINCAST_04` | results | no such PinCast of yours | back to s39 |
| 404 | `E_RING_ACCESS_01` | the card, connect, relationship, block by `pincastToken` | one body for a malformed, unknown or expired token, a token from another list, an ended Ring, a deleted account and a block either way, with the same answer time | "This person isn't available any more"; the row stays |
| 400 | `E_CONNECTION_REQUEST_04` | connect | never by PinCast token (a PinCast never reaches its own broadcaster); listed for completeness | — |
| 409 | `E_CONNECTION_01` / `E_CONNECTION_REQUEST_03` | connect | already connected / they already asked (their `requestId`) | as BI-16 |
| 401 | `E_AUTH_04` | all | session expired | sign in again |

FR-20's proposed `E_PINCAST_04` (token) and `E_PINCAST_05` (results) are **not** on the wire: the token routes answer the views' one `E_RING_ACCESS_01`, as the badge does, and the results' code is `E_PINCAST_04`.

## Rules the UI must respect

- **No map, distance or direction, ever** (N3): no field carries one, and none will be shown. My own range (`radiusMeters`) is the one distance on screen.
- **A person is a token** (N1): never a user id, a Pin name, a Ring id or a Ring name. The people and results rows carry no `pinName`; the card does (as every card), and it is the card's.
- **The server's clock** (N9): count down from `endsAt` and `serverNow`, never from the device clock alone; the broadcast runs on the server until then, and leaving the app does not stop it.
- **Polling, no realtime** until [[S-96 Notifications Story]]: people every 10 s on s40, current every 30 s on Home and s39 while live, nothing while hidden.
- **Position** at start, then every `positionRefreshSeconds` while in the foreground, and when coming back to the foreground; never in the background; never persisted.
- **Nothing optimistic**: start, change, extend, stop and connect wait for the answer; nothing is queued offline.
- A token lives **30 days from `detectedAt`** (`expiresAt` on the card): after that the card and Connect answer 404 like any other, and the results have `data: null`.

## Not available yet

- "PinCast ended" and "pins nearby" notifications, and push in place of polling → [[S-96 Notifications Story]] (N11).
- Nearby by Ring (S6) → [[S-45 PinCast & Nearby Story#S6 · Nearby by Ring (no prototype screen; §6.2) · later (N10)|S-45 S6]].
- The 30-day purge of the rows → [[F-31 Cleanup Jobs]]; until it runs, the results route already hides rows past 30 days.
- Match %, "Worth meeting", an event filter → later (N7).

## Checklist

- [ ] s39: `current` null → hidden; `lastEnded` → "Your last PinCast · See results".
- [ ] s41: Ring from `GET /rings`; steps 25–500 m and 5 / 30 / 60 / 180 min; `POST /pincasts` with the position.
- [ ] s40: countdown from `endsAt` and the `serverNow` offset; people every 10 s; position every `positionRefreshSeconds`, foreground only; +15 min, Stop, Change.
- [ ] s44 from a token: `GET /views/pincast/:token`, button from `GET /connections/relationship?pincastToken=`, Connect and Block by `pincastToken`.
- [ ] s11: the chip every 30 s while live; "PinCast ended · See results" from `lastEnded`.
- [ ] s42: `GET /pincasts/:id/results`; `REQUESTED_ME` → Accept with `requestId`; `CONNECTED`; `NONE` → Connect by token; `data: null` → the count only.
- [ ] Every 404 on the token routes shows the one neutral line; the row stays.
- [ ] No coordinate, distance or bearing rendered or logged anywhere.
