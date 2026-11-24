---
id: FD-24
type: frontend-delivery
module: discovery
feature: pincast
status: done
scope: feature
deployedTo: [dev]
screens: [s11, s39, s40, s41, s42, s44]
depends: ["BI-20 PinCast & Nearby Backend Integration"]
affects: []
related: ["S-45 PinCast & Nearby Story", "FR-20 PinCast & Nearby Frontend Requirements", "BD-20 PinCast & Nearby Backend Delivery", "BI-16 Connections Backend Integration", "BI-08 Rings Backend Integration", "S-23 Connections Story", "S-96 Notifications Story", "FD-18 Discover Hub & Search Frontend Delivery", "POST /pincasts", "GET /pincasts/current", "PATCH /pincasts/current", "POST /pincasts/current/extend", "POST /pincasts/current/stop", "POST /pincasts/current/position", "GET /pincasts/current/people", "GET /pincasts/:id/results", "GET /views/pincast/:token", "GET /rings", "POST /connections/requests", "GET /connections/relationship", "POST /blocks"]
pending: []
created: 2026-11-24
updated: 2026-11-24
tags: [frontend-delivery, frontend-delivery/done, module/discovery, layer/frontend]
---

# ✅ PinCast & Nearby · Frontend Delivery

> ⚠ Affected by [[QF-07 PinCast & Nearby QA Frontend]] (2026-11-24): /frontend: on the build, the s42 row "Sent you a request" has Accept (s46), and Accept turns it to Connected "Met on PinCast" (PC-18, and the two-device run on the development API); the s42 row and the Calls table (POST /connections/requests/:id/accept with the row's requestId) don't say so

**Feature:** [[F-20 PinCast & Nearby]] · **Status:** Done · **Built from:** [[BI-20 PinCast & Nearby Backend Integration]] (current, backend `main` @ `ecd93c0`) · **Against:** [[S-45 PinCast & Nearby Story]] (approved, N1–N12) · **Requirements:** [[FR-20 PinCast & Nearby Frontend Requirements]] · **QA:** [[QF-07 PinCast & Nearby QA Frontend]]

What the client shipped for PinCast, S-45 S1 to S5:
- going visible from s39, with a one-tap *Go visible* on the last settings (S1);
- the setup on s41 (S2);
- the live screen s40, with the people found and the card they open on s44 (S3);
- Home's chip and its *Go visible* card (S4);
- the results on s42 (S5).

It is on `social_pin` `rings/F-11/honest-rings`, commits `8f61e9a`, `2568494` and the sign-out fix after them; not on `main` yet. The demo data the screens showed before is removed.

Tested with Patrol against a fake backend, and in a two-device run on the development API (2026-11-24).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s39\|s39]] PinCast · hidden | ✅ | *Hidden*, with no count of people nearby while hidden (N4). With last settings, a one-tap *Go visible* with them, and *Change* → s41. With none, *Set up a PinCast* → s41. The last settings are kept on the phone and cleared on sign-out. When location permission is missing, *Allow location* asks for it, when in use only, and says why (N9). After a PinCast ended, "Your last PinCast · See results" → s42 (N11) |
| [[Screen Index#s41\|s41]] Setup | ✅ | The Ring picker over my Rings; distance from 25 to 500 m; duration 5, 30, 60 or 180 min (N5); the sentence says what it does. *Start PinCast* takes the position and opens s40. Reached from s40's *Change* while live, it saves with *Save changes* |
| [[Screen Index#s40\|s40]] Live | ✅ | The countdown runs from the server's end time (N9). The people found are read every 10 s, filtered *All* or *New to me* (N7); new rows slide in. *+15 min* (N6), *Stop* → s42, *Change* → s41. The position is sent at start, then every 30 s, only while the app is in the foreground (N9). A tap on a person opens s44 |
| [[Screen Index#s44\|s44]] Person card | ✅ | Opened by `pincastToken` (N1): *Connect* and *Block* by the token; no *Save* |
| [[Screen Index#s42\|s42]] Results | ✅ | How many people were reached, then each person, with "Sent you a request", "Connected", or *Connect* by token (N8). Ended with nobody: "Nobody was nearby". After 30 days, only the count (N12). *Broadcast again* → s41 with the same settings; *Done* → Home |
| [[Screen Index#s11\|s11]] Home | ✅ | The live chip while a PinCast is on; the one-tap *Go visible* card; when it has ended, "PinCast ended · See results" → s42 (N11) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /pincasts/current` | s39, s11, s40 at the end | `current` null → hidden; `lastEnded` → "Your last PinCast" on s39 and the ended chip on s11 |
| `GET /rings` | s41 | The Ring picker ([[BI-08 Rings Backend Integration\|BI-08]]) |
| `POST /pincasts` | s39 and s11 *Go visible*, s41 *Start PinCast* | With the Ring, the distance, the duration and the position |
| `PATCH /pincasts/current` | s41, *Save changes* while live | |
| `GET /pincasts/current/people?filter=ALL\|NEW` | s40, every 10 s | *All* / *New to me* |
| `POST /pincasts/current/position` | s40 | At start, then every 30 s, foreground only |
| `POST /pincasts/current/extend` | s40, *+15 min* | |
| `POST /pincasts/current/stop` | s40 *Stop*; sign-out while live | → s42; on sign-out, before the session ends |
| `GET /views/pincast/:token` | s44 | The card by `pincastToken` |
| `GET /connections/relationship?pincastToken=` | s44 | The card's button ([[BI-16 Connections Backend Integration\|BI-16]]) |
| `POST /connections/requests` `{ pincastToken }` | s44, s42, *Connect* | |
| `POST /blocks` `{ pincastToken }` | s44, *Block* | |
| `GET /pincasts/:id/results` | s42 | `data` null after 30 days → the count only |

## State kept on the client

- **The last settings** (Ring, distance, duration): kept on the phone for the one-tap *Go visible*; cleared on sign-out.
- **In memory:** the current PinCast and its countdown from the server's end time; the people found; the results; the position (never kept).
- **Signing out** stops a live PinCast first.

## Deviations from the story or the integration note

- **s44 opened by a PinCast token has no *Save*:** only *Connect* and *Block*.
- **Signing out stops a live PinCast** before the session ends, so nobody stays findable after leaving the account; the story and BI-20 say nothing about sign-out.

## Not done yet

- **Notifications** ("PinCast ended", "pins nearby", push in place of polling) → [[S-96 Notifications Story]] (N11).
- **Nearby by Ring** → [[S-45 PinCast & Nearby Story#S6 · Nearby by Ring (no prototype screen; §6.2) · later (N10)|S-45 S6]], later (N10).

## Tests

- **Patrol PC-01 to PC-24**, against a fake backend: all passing.
- **A two-device run on the development API** (2026-11-24).

## Log

- 2026-11-24 · `docs/frontend/M-04-discovery/F-20-pincast/FD-24-built-from-bi-20` · app branch `rings/F-11/honest-rings` @ `8f61e9a`, `2568494` and the sign-out fix after them (social_pin, not on `main` yet) · S-45 S1–S5, built against [[BI-20 PinCast & Nearby Backend Integration|BI-20]] (current, backend `main` @ `ecd93c0`) · s39, s41, s40, s44 by token, s42, Home's chip and *Go visible* card; signing out stops a live PinCast first; demo data removed. Patrol PC-01 to PC-24 pass on the fake backend; a two-device run on the development API (2026-11-24); `deployedTo: [dev]`. Not done: notifications (S-96), Nearby by Ring (N10) · flagged nothing
