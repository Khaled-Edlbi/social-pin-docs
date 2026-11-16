---
id: FR-20
type: frontend-requirements
module: discovery
feature: pincast
status: ready
scope: feature
screens: [s11, s39, s40, s41, s42, s44]
blockedBy: []
depends: ["S-45 PinCast & Nearby Story"]
affects: ["BD-20 PinCast & Nearby Backend Delivery"]
related: ["S-45 PinCast & Nearby Story", "D-10 Connect sends what the requester already has", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "S-23 Connections Story", "BI-16 Connections Backend Integration", "FR-14 Connections Frontend Requirements", "BI-08 Rings Backend Integration", "S-96 Notifications Story", "S-87 Error Contract Story", "F-31 Cleanup Jobs", "Frontend Contract", "GET /rings", "POST /connections/requests"]
pending: []
created: 2026-10-18
updated: 2026-11-16
tags: [frontend-requirements, frontend-requirements/ready, module/discovery, layer/frontend]
---

# 📨 PinCast & Nearby · Frontend Requirements

**Feature:** [[F-20 PinCast & Nearby]] · **Status:** Ready, 2026-11-16 (waiting on the backend's review) · **Story:** [[S-45 PinCast & Nearby Story]] (approved 2026-11-16, N1–N12) · **Backend Integration:** not yet (no PinCast route: [[BD-20 PinCast & Nearby Backend Delivery]])

What the client needs from the backend to build [[S-45 PinCast & Nearby Story]] S1 to S5, and whether each need is met today. **Rewritten 2026-11-16** against the story as rewritten that day and its rules N1–N12 ([[S-45 PinCast & Nearby Story#Decided in this story|Decided in this story]]). Nearby by Ring (S6) is later (N10) and asks for nothing here; the old *PinCast & Nearby · S7* links are gone with that part.

**What exists today.** The geo column, its trigger and the GiST index; no PinCast route. The Ring picker (`GET /rings` ✅) and Connect / Accept by a token on a card ([[BI-16 Connections Backend Integration|BI-16]], the badge's `qrToken`) work today. In the app (`rings/F-11/honest-rings` @ `778d9b4`), s39–s42 and the Home chip are built as screens and send nothing for PinCast.

**Four rules that shape every row below:**

1. **No position, distance, direction or map, ever** (N3). The backend sends no coordinate, distance or bearing for anyone; the app shows only my own range ("100 m"). The device position lives in memory only and is **never logged**, cached or sent to analytics.
2. **Mutual and bounded** (N2): the server decides who is in range and visible; the app shows what it gets and never filters by position itself.
3. **Like a badge scan** (N1): a person found is opened by a **PinCast token**, never by Pin name and never by user id; the card is their broadcast Ring's, with no Ring name and no membership.
4. **The server's clock** (N9, S3): the countdown is computed from the server's `endsAt` and the server time in the same answer, never the device clock alone; the broadcast runs on the server until then.

## Per screen

### [[Screen Index#s39|s39]] PinCast · hidden (S1)

- On open: `GET /pincasts/current` ❌ → my live PinCast or `null`; live → go to s40.
- *Hidden*, "Go visible to see who's around": **no count**, no call for people nearby (N4).
- **Last settings** (Ring, distance, duration) for the one-tap *Go visible*: kept on the phone per user; no backend need. A Ring that's gone from `GET /rings` drops them, and *Set up a PinCast* shows instead.
- **"Your last PinCast · See results"** (N11): from `lastEnded` in the same answer (`{ id, endsAt }` while its results last, N12) → s42.
- Location permission: asked from the primary action; denied → "Open settings". No background permission is ever asked (N9).
- States: loading; hidden with last settings; first time; permission needed; last PinCast; offline.

### [[Screen Index#s41|s41]] PinCast setup (S2)

- **Ring picker:** `GET /rings` ✅, my live Rings (name, colour), default first. Its name is shown to me only.
- **Distance** 25–500 m and **duration** 5 min, 30 min, 1 hr, 3 hr (N5): fixed on the phone from the story; the server refuses anything else (400 below).
- *Start PinCast*: the position at that moment (N9), then `POST /pincasts { ringId, radiusMeters, durationMinutes, lat, lng }` ❌ → 201 `PincastEntity` (below), then s40.
- Opened from s40 with *Change*: `PATCH /pincasts/current { ringId?, radiusMeters? }` ❌ keeps the end time. (Proposed; the backend may prefer stop and start again.)
- States: setup; starting; permission needed; "You already have a live PinCast" (409) → s40.

### [[Screen Index#s40|s40]] PinCast · live (S3)

- **`PincastEntity`** ❌ (from start, current, extend):

  | Shown | Field | Notes |
  |---|---|---|
  | My Ring's name | `ring { id, name, colorHex }` | mine only |
  | My range | `radiusMeters` | "100 m" (N3) |
  | Time left | `endsAt`, `serverNow` | the countdown (rule 4) |
  | — | `id`, `startedAt`, `durationMinutes` | |
  | Position refresh | `positionRefreshSeconds` | the interval the server asks for |

- **People found:** `GET /pincasts/current/people?filter=ALL|NEW&limit=&skip=` ❌ → `{ data: PincastPersonEntity[], meta: { total } }`, newest first:

  | Shown | Field | Notes |
  |---|---|---|
  | Name, photo | `displayName`, `avatarUrl` | as **their broadcast Ring's card** shows them (N1); initials until files load |
  | "New to me" | `isConnection` (false = new) | for the filter (N7) |
  | — | `token`, `detectedAt` | the PinCast token opens the card; never a user id, a Pin name, a Ring id or name |

  No distance, no direction, no position (N3).
- **Filters:** *All* and *New to me* only (N7), sent as `filter`. No match %, no "Worth meeting", no event filter.
- **A person → s44:** `GET /views/pincast/:token` ❌ → their broadcast Ring's card (`RingProfileViewEntity`, no Ring id or name), readable while the token lasts, giving no membership (N1).
- ***+15 min*:** `POST /pincasts/current/extend` ❌ → the `PincastEntity` with the new `endsAt` (N6).
- ***Stop*:** `POST /pincasts/current/stop` ❌ → 200 with the ended PinCast's id → s42.
- **Position refresh** while the app is open (N9): `POST /pincasts/current/position { lat, lng }` ❌ → 204, every `positionRefreshSeconds`, and when the app comes back to the foreground. **Nothing in the background**; leaving the app doesn't stop the broadcast.
- **Polling** until notifications exist ([[S-96 Notifications Story]]): the people every 10 s while s40 is open; stop on end, stop, or leaving the screen. New rows animate in.
- **The end:** when `endsAt` passes, refetch `GET /pincasts/current` (→ `null`) and go to s42.
- States: live with people, live with none yet, filtered, extending, stopping, offline (the list keeps what it had, "You're offline").

### [[Screen Index#s11|s11]] Home · the PinCast chip (S4)

- From `GET /pincasts/current` ❌ on Home's open and every 30 s while live: my Ring's name and the countdown (rule 4); tap → s40.
- When the time ends: **"PinCast ended · See results"** → s42 (N11), from `lastEnded`. No notification in the MVP.
- Follows *+15 min* and *Stop* done on s40 (the same cache).

### [[Screen Index#s42|s42]] PinCast results (S5)

- `GET /pincasts/:id/results?limit=&skip=` ❌ → `{ pincast { ring, radiusMeters, startedAt, endedAt }, count, data: PincastResultEntity[] | null, meta: { total } }`. After **30 days** `data` is `null` and only `count` shows (N12).
- **`PincastResultEntity`:** `displayName`, `avatarUrl`, `token`, `detectedAt` and `state`: `NONE` / `REQUESTED_ME` / `CONNECTED`.
  - `REQUESTED_ME` → **"Sent you a request"** with *Accept* ([[S-23 Connections Story|Connections · S5]]; the request id for it, as `GET /connections/relationship` gives one today, [[BI-16 Connections Backend Integration|BI-16]]);
  - `CONNECTED` → **"Connected"**;
  - `NONE` → *Connect*.
  - **Never** "Opened your card" (N8): the backend doesn't send it.
- ***Connect* by PinCast token** (N1): `POST /connections/requests { pincastToken, note? }` ❌, as `{ qrToken, note? }` works today ([[S-23 Connections Story|Connections · S2]], [[FR-14 Connections Frontend Requirements|FR-14]]); likewise `GET /connections/relationship?pincastToken=` for where we stand. Never a Pin name.
- Ended-empty: "Nobody was nearby". *Broadcast again* → s41 with the same settings; *Done* → Home.
- Refetched on open and on focus; paged, `limit` ≤ 50.
- States: loading, with people, empty, past 30 days (count only), offline.

### Later (N10, N11): not asked for now

- **Nearby by Ring** (S6): the radar and its Ring filter.
- **Notifications:** "PinCast ended", "pins nearby", and push in place of polling on s40 ([[S-96 Notifications Story]]).
- Match %, "Worth meeting" (with Gemma), an event filter (with Events).

## Endpoints required

| Need | Endpoint (proposed) | Available | Story part / rule |
|---|---|---|---|
| My Rings for the picker | `GET /rings` | ✅ | S2 |
| Start, with Ring, range, duration and position | `POST /pincasts` | ❌ | S2 · N5, N9 |
| The current PinCast with the server end time and `serverNow`, and the last ended one | `GET /pincasts/current` | ❌ | S1, S3, S4 · N9, N11 |
| Change Ring or range, keeping the end time | `PATCH /pincasts/current` | ❌ | S2 |
| Extend by 15 min | `POST /pincasts/current/extend` | ❌ | S3 · N6 |
| Stop now | `POST /pincasts/current/stop` | ❌ | S3 |
| Position refresh while the app is open | `POST /pincasts/current/position` | ❌ | S3 · N9 |
| People in range, mutually visible, All / New to me, no coordinates | `GET /pincasts/current/people` | ❌ | S3 · N2, N3, N7 |
| The broadcast Ring's card by PinCast token, no membership, no Ring name | `GET /views/pincast/:token` | ❌ | S3 · N1 |
| Connect, relationship (and block) by PinCast token | `POST /connections/requests { pincastToken }`, `GET /connections/relationship?pincastToken=` | ❌ (✅ by `qrToken`) | S5 · N1 · [[S-23 Connections Story\|Connections · S2]] |
| Accept a request from a result row | the inbox accept route | ✅ | S5 · [[S-23 Connections Story\|Connections · S5]] |
| Results, with each person's state, complete 30 days then the count | `GET /pincasts/:id/results` | ❌ | S5 · N8, N12 · [[F-31 Cleanup Jobs]] |
| PinCast error codes | — | ❌ | all |

## Behaviour expectations

- **Polling, no realtime** until [[S-96 Notifications Story]]: s40's people every 10 s while it is open; Home's chip and s39 every 30 s while a PinCast is live; nothing while hidden. Stop every poll on end, stop and leaving.
- **Countdown:** from `endsAt` and the offset `serverNow − device time` taken from the latest answer; re-taken on every refetch.
- **Caching keys:** the current PinCast by (signed-in user); its people by (pincast id, filter); results by (pincast id); a card by (viewer, token). Invalidate the current PinCast on start, change, extend, stop and when `endsAt` passes.
- **Kept on the phone:** the last settings, by user; nothing else. Cleared on sign-out with every PinCast cache.
- **Position:** read at start and every `positionRefreshSeconds` while the app is in the foreground; in memory only; **never logged, cached, persisted or sent anywhere but the position call** (rule 1). No background location.
- **Optimistic:** none. Start, extend, stop and connect wait for the answer.
- **Offline:** nothing queued; each write says it couldn't be sent; the countdown keeps running from the last `endsAt`.
- **Privacy:** never render a map, a distance or a bearing, even if a field appears later; never show which Ring someone broadcast through; never open a person by Pin name or user id.

## Error states the UI must handle

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] puts `ErrorCode` on the wire, the app branches on status and endpoint ([[Frontend Contract]]). The **proposed** codes are names for the backend to keep or rename.

| Status | ErrorCode | Where | Show |
|---|---|---|---|
| 409 | `E_PINCAST_01` (proposed) already live | start | refetch current, go to s40 |
| 404 | `E_PINCAST_02` (proposed) no live PinCast | extend, stop, position, people | it ended: refetch current, go to s42 |
| 400 | `E_PINCAST_03` (proposed) range or duration not allowed | start, change | should not happen (fixed steps); "Couldn't start" |
| 404 | `E_RING_02` | start, change | the Ring is gone: refetch `GET /rings`, back to s41 |
| 404 | `E_PINCAST_04` (proposed) token expired or unknown | the card, connect | "This person isn't available any more"; the row stays |
| 404 | `E_RING_ACCESS_01` | the card | the same neutral line |
| 404 | `E_PINCAST_05` (proposed) results gone or not mine | results | back to s39 |
| 401 | `E_AUTH_04` | all | sign in again |
| client | location permission denied | s39, s41 | "Open settings" |
| — | offline, 5xx | all writes | "Couldn't … Try again."; nothing queued |

## Blocked by

The story is approved (2026-11-16), so this list isn't blocked by it. Rows wait on:

- [[BD-20 PinCast & Nearby Backend Delivery|BD-20]]: every PinCast route above, the temporary card read (N1), the PinCast token, the results with the 30-day purge.
- [[S-23 Connections Story|Connections · S2]] ([[FR-14 Connections Frontend Requirements|FR-14]]): connect and relationship by `pincastToken`.
- [[F-31 Cleanup Jobs]]: the purge at 30 days (N12).
- [[S-96 Notifications Story]]: push in place of polling, later.
- [[S-87 Error Contract Story|Error Contract · S4–S8]]: the codes above are by status until then.

## Sign-off

- Approved by: — · on: —

## Log

- 2026-11-16 · `tickets/frontend/M-04-discovery/F-20-pincast/FR-20-s-45-2026-11-16` · rewritten from S-45 as rewritten and approved 2026-11-16 (N1–N12): per screen s39, s41, s40, s42 and the Home chip; the endpoints the story lists as not built, proposed as `/pincasts` routes (start, current with `endsAt` and `serverNow`, change, extend, stop, position refresh, people in range with mutual visibility, `GET /views/pincast/:token`, connect and relationship by `pincastToken` like the badge `qrToken`, results kept 30 days then the count); polling while live until notifications exist; the countdown from the server clock; no distance or position ever shown or logged; filters All and New to me only; Nearby by Ring later; proposed `E_PINCAST_01`–`05`. Repointed the Connections links (S-23 S2, S5), dropped the *PinCast & Nearby · S7* links. Cleared the S-45 and S-23 flags. Kept `draft`
- 2026-11-16 · `tickets/frontend/M-04-discovery/F-20-pincast/FR-20-ready` · every screen, endpoint row and error state is in: set `ready` (📨) on Omar Fostok's word, handed to the backend; flagged [[BD-20 PinCast & Nearby Backend Delivery]] and [[FR-14 Connections Frontend Requirements]] (connect and relationship by `pincastToken`)
