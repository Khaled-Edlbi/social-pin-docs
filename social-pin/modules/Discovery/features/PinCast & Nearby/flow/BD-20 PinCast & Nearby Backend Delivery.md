---
id: BD-20
type: backend-delivery
module: discovery
feature: pincast
status: done
scope: feature
deployedTo: []
screens: [s11, s39, s40, s41, s42, s44]
depends: ["FR-20 PinCast & Nearby Frontend Requirements", "S-45 PinCast & Nearby Story", "D-10 Connect sends what the requester already has", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "D-28 Scan someone in is not in the MVP", "BD-08 Ring Access Engine Backend Delivery", "BD-12 View As & Pin Views Backend Delivery", "BD-14 Connections Backend Delivery", "BD-18 Badge & QR Backend Delivery"]
affects: ["FR-20 PinCast & Nearby Frontend Requirements", "FR-14 Connections Frontend Requirements", "BI-20 PinCast & Nearby Backend Integration", "Frontend API Guide"]
related: ["POST /pincasts", "GET /pincasts/current", "PATCH /pincasts/current", "POST /pincasts/current/extend", "POST /pincasts/current/stop", "POST /pincasts/current/position", "GET /pincasts/current/people", "GET /pincasts/:id/results", "GET /views/pincast/:token", "GET /views/ring/:ringId", "POST /connections/requests", "GET /connections/relationship", "POST /blocks", "E_PINCAST_01", "E_PINCAST_02", "E_PINCAST_03", "E_PINCAST_04", "E_RING_02", "E_RING_03", "Ring Access Model", "F-31 Cleanup Jobs", "F-39 Notifications", "F-08 Ring Access Engine"]
pending: []
created: 2026-10-18
updated: 2026-11-23
tags: [backend-delivery, backend-delivery/done, module/discovery, layer/backend]
---

# ✅ PinCast & Nearby · Backend Delivery

> ⚠ Affected by [[QB-19 PinCast & Nearby QA Backend]] (2026-11-23): QB-19 PinCast & Nearby QA Backend is written and passing, 49 of 49, on backend main ecd93c0 run on PostgreSQL 16.15 + PostGIS 3.4.2 (2026-11-23): the migration applied cleanly and the geo query bounded reach as N2 says. The Gaps line 'Not run against PostGIS yet' can go; deployedTo is still empty (not on dev)

**Feature:** [[F-20 PinCast & Nearby]] · **Status:** Done · **Integration guide:** [[BI-20 PinCast & Nearby Backend Integration]] · **Requirements:** [[FR-20 PinCast & Nearby Frontend Requirements]] · **QA:** [[QB-19 PinCast & Nearby QA Backend]]

What the backend shipped for this feature and how it works. **On backend `main` since `ecd93c0`** (2026-11-23): the code branch `BD-20/pincast/pincast-routes` (`ad6e30e`), merged on top of F-19's search; 1163 unit tests green and the typecheck clean on the combination. **Not yet run against a PostGIS database** (the session that wrote it had none): the migration and the geo query are to be exercised on dev before QA. PinCast, S-45 S1 to S5 and the twelve rules N1–N12; Nearby by Ring (S6) is later (N10) and nothing here serves it.

## Endpoints, tables and code

**Endpoints** (all signed in, all the signed-in user's own PinCast; on `main`)

| Method and path | What | Story |
|---|---|---|
| `POST /pincasts` | start through one of my live Rings: `{ ringId, radiusMeters, durationMinutes, lat, lng }` → 201 `PincastEntity` | S2 · N5, N9 |
| `GET /pincasts/current` | `{ current: PincastEntity \| null, lastEnded: { id, endedAt, resultsUntil } \| null, serverNow }` | S1, S3, S4 · N9, N11 |
| `PATCH /pincasts/current` | `{ ringId?, radiusMeters? }`, the end time kept → `PincastEntity` | S2 |
| `POST /pincasts/current/extend` | +15 min → 200 `PincastEntity` | S3 · N6 |
| `POST /pincasts/current/stop` | end now → 200 `{ id, endedAt }` | S3 |
| `POST /pincasts/current/position` | `{ lat, lng }` → 204; also a detection pass | S3 · N9 |
| `GET /pincasts/current/people?filter=ALL\|NEW&limit=&skip=` | the people reached so far, newest first, `{ data: PincastPersonEntity[], meta: { total } }` | S3 · N1, N2, N3, N7 |
| `GET /pincasts/:id/results?limit=&skip=` | `{ pincast: { ring, radiusMeters, startedAt, endedAt }, count, data: PincastResultEntity[] \| null, meta: { total } }` | S5 · N8, N12 |
| `GET /views/pincast/:token` | the card of a person my PinCast reached: `GET /views/ring/:ringId`'s body plus the token's `expiresAt` | S3 · N1 |
| `POST /connections/requests { pincastToken, note? }`, `GET /connections/relationship?pincastToken=`, `POST /blocks { pincastToken }` | Connect, the card's button and Block by PinCast token, beside `qrToken` and `pinName` ([[BD-14 Connections Backend Delivery]]) | S5 · N1 |

**Tables / models:** `Pincast` (`pincasts`) gains `duration_minutes`, `ended_at`, `position_at`, `reached_count` and the partial unique index `pincasts_one_active_per_user` (one `ACTIVE` row per user); `PincastRecipient` (`pincast_recipients`) gains `shown_ring_id` (FK to `rings`, the Ring the person broadcast through) and `token_hash` (unique). Migration `20261123120000_pincast_routes`. The geography column, its trigger and the GiST index are the first migrations'.

**Code:** `src/modules/pincast/` (`pincast.service.ts`, `pincast.controller.ts`, `pincast-view.controller.ts`, `pincast-token.service.ts`, `pincast-presenter.service.ts` + `pincast-presenter.module.ts`, `pincast-people.query-builder.service.ts`, `dto/`, `entities/`); `src/common/utils/derived-token.ts` (the HMAC token the badge code and the PinCast token now share; `BadgeTokenService` keeps its API); `RingAccessService.filterRingsPresentedTo` and `userNotBlockedWithFilter`; `PersonCardService.connectedAmong` made public; `ConnectionRequestService.pincastPerson` and `pendingFromAmong`; `pincastToken` on the three Connections DTOs. Config `PINCAST_TOKEN_SECRET` (optional; else derived from `JWT_SECRET`).

## How it works

**One live PinCast per user, on the server (S2, N5, N9).**
- `start` checks the steps (25–500 m; 5, 30, 60 or 180 min, else 400 `E_PINCAST_03`), that the Ring is mine (`RingService.findOneForOwner`, else 404 `E_RING_02`) and live (`RingAccessService.assertRingPresented`, else 409 `E_RING_03`: the badge's two answers), ends my lapsed PinCast, and refuses a second live one with 409 `E_PINCAST_01`: by the read, and by the partial unique index under concurrency.
- The row holds `startsAt = now`, `endsAt = now + duration`, the position and `positionAt`. **The position is the broadcaster's current one**: `POST …/position` overwrites it while the app is open (N9); nothing in the background, and nothing the phone fails to do ends the broadcast.
- **The server's end (N9):** a PinCast whose `endsAt` has passed is `ENDED` with `endedAt = endsAt`, written lazily on the next read of its owner's PinCasts (one `UPDATE`); the detection query ignores lapsed rows anyway. *Stop* sets `ENDED`, `endedAt = now`, conditionally on `ACTIVE`, so a stop and an extend racing cannot undo each other. *+15 min* moves `endsAt` from its current value, conditionally on still live; `durationMinutes` stays what was chosen.
- Every answer carries `serverNow` and `positionRefreshSeconds` (**30**, the backend's number from S-45's open question: the people list is polled every 10 s, and a position 30 s old still decides reach within a few paces).

**Reach is mutual and bounded (N2), and the engine decides it (rule 8).** A detection pass runs on every `GET …/people` and every `POST …/position`, in one transaction:
1. one raw query on the GiST index: every other `ACTIVE` PinCast inside its window within **the smaller of the two radii** of mine (`ST_DWithin(other.geo, me.geo, LEAST(radii))`), not already among my recipients;
2. `RingAccessService.filterRingsPresentedTo(me, theirRings)`: the Ring they broadcast through is live, their account active, **no block either way**; membership is not asked and none is made ([[D-28 Scan someone in is not in the MVP|D-28]]). My own Ring must still be presentable too, else I find and reach nobody;
3. for each person kept, **two rows**: them on my PinCast (`shownRingId` = their Ring) and me on theirs (`shownRingId` = my Ring), `createMany … skipDuplicates` so both sides polling at once leave one row per direction; then `reachedCount` is recomputed on every PinCast touched. The pair's distance is stored on the rows for later analytics and **never returned**.

**Nothing about where (N3).** No coordinate, distance or direction is in any entity: `selectPincast` does not read `latitude` / `longitude`, not even for the broadcaster, and the lists carry no distance; the specs assert the strings are absent from the serialized bodies.

**Like a badge scan (N1): the PinCast token.** Each recipient row has a token, `base64url(HMAC-SHA256(key, "pincast:" + rowId))` cut to 24 bytes (32 characters, opaque: no Ring id, user id or Pin name), only `sha256(token)` stored, the same token on every poll. `GET /views/pincast/:token` (`PincastPresenterService.resolvePresenter`): the token's shape, then its hash, **bound to the viewer's own PinCasts** (a token read from someone else's list opens nothing), **alive 30 days from the detection** (N12: as long as the results, so Connect from a result row works until the row is purged), the person's account active; then `assertRingPresented(shownRingId, viewer)`: the Ring live, no block. The card is `RingProfileService.viewByRing`, the Ring's audience view (`RingProfileViewEntity`, no Ring id, name, user id or file id), plus `expiresAt`. The first open is recorded on the row (`openedAt`) and never shown (N8). **One refusal:** malformed, unknown, expired, another broadcaster's, a dead key, an ended or deleted Ring, a deleted account, a block: 404 `E_RING_ACCESS_01`, the views' one body, no sooner than 300 ms after the request began. The token therefore keeps the card readable for the 30 days, longer than S-45's "it ends with the PinCast" for the temporary view: the backend's choice, for the PM to confirm or send back.

**Connect, the button and Block by PinCast token (S5, [[D-10 Connect sends what the requester already has|D-10]]).** `POST /connections/requests { pincastToken }` (`source: PINCAST`), `GET /connections/relationship?pincastToken=` and `POST /blocks { pincastToken }` resolve the person with the same decision as the card (`ConnectionRequestService.pincastPerson`, behind the same 300 ms floor), then require an active account, the same as a Pin name's. Exactly one of `pinName`, `qrToken`, `pincastToken` (and `againFor` / `userId` where those exist) per body.

**The lists (S3, S5).** Both read `pincast_recipients` through one query builder: the person's account live, no block with the viewer either way (so a block made after the detection removes the person from both lists at once, and nothing says why); `filter=NEW` keeps people with no `ACTIVE` connection to the viewer (N7). Cards come from `RingProfileService.cardsForRings(shownRingId)`: `displayName` and `avatarUrl` as the broadcast Ring shows them, **no Pin name**. `isConnection` is `PersonCardService.connectedAmong`, one query per page. Results add each person's state (N8): `CONNECTED`; `REQUESTED_ME` with their pending request's id (`ConnectionRequestService.pendingFromAmong`, one query per page) for *Accept*; else `NONE`. Never "opened your card". After 30 days from `endedAt`, `data` is `null`, `meta.total` 0 and `count` (`reachedCount`) remains (N12); the rows themselves are the cleanup job's to purge ([[F-31 Cleanup Jobs]]). A PinCast that is not mine or does not exist: 404 `E_PINCAST_04`.

**Codes.** `E_PINCAST_01` already live (409) · `E_PINCAST_02` no live PinCast (404: extend, stop, position, people, change) · `E_PINCAST_03` distance or duration not allowed (400) · `E_PINCAST_04` no such PinCast of mine (404, results). FR-20's proposed `E_PINCAST_04` (token) and `E_PINCAST_05` (results) are not used as proposed: the token routes answer `E_RING_ACCESS_01`, and the results' code is `E_PINCAST_04`.

### What exists

- Everything in the table above, on backend `main` `ecd93c0`.
- `pincasts.geo` kept by trigger, GiST index; `pincast_recipients.detected_at` indexed for the purge.

### Gaps

- **Not run against PostGIS yet**: `pnpm prisma:deploy` and a two-phone start / position / people pass on dev are owed before [[QB-19 PinCast & Nearby QA Backend]].
- The 30-day purge of `pincast_recipients` → [[F-31 Cleanup Jobs]] (`detectedAt` indexed; `reachedCount` survives it).
- "PinCast ended" and "pins nearby" notifications, and push in place of the 10 s polling → [[S-96 Notifications Story]] (N11: none in the MVP).
- Nearby by Ring (S6) → [[S-45 PinCast & Nearby Story#S6 · Nearby by Ring (no prototype screen; §6.2) · later (N10)|S-45 S6]], later.
- No rate limit on the token resolve (the badge has 20 a minute): a PinCast token is bound to the viewer's own rows, so walking the token space gains nothing; the floor alone holds. Revisit with the badge's limiter if abuse appears.
- `deployedTo` empty: on `main`, not yet on dev.

## Log

- 2026-10-18 · split out of [[F-20 PinCast & Nearby]] when the vault moved to layers
- 2026-11-23 · `tickets/backend/M-04-discovery/F-20-pincast/FR-20-accepted` · [[FR-20 PinCast & Nearby Frontend Requirements]] reviewed against [[S-45 PinCast & Nearby Story]] S1–S5 and N1–N12 and set `approved`; this note `in-progress`
- 2026-11-23 · code branch `BD-20/pincast/pincast-routes` (`ad6e30e`) · the story's *What the backend has to build* 1–8 written and unit-tested; `positionRefreshSeconds` 30 and the token's 30 days set here, as the story left to the backend
- 2026-11-23 · `docs/backend/M-04-discovery/F-20-pincast/BD-20-shipped` · **merged to backend `main` `ecd93c0`** (the merge of `BD-20/pincast/pincast-routes`, on top of F-19's search; 1163 specs green): the nine PinCast routes, `pincastToken` on Connect, relationship and Block, migration `20261123120000_pincast_routes`, codes `E_PINCAST_01`–`04`. This note `done`, [[BI-20 PinCast & Nearby Backend Integration]] written and `current`. FR-20's endpoint rows ✅; flagged FR-20 (the codes differ from the proposal: `E_RING_ACCESS_01` on the token routes, `E_PINCAST_04` on the results), [[FR-14 Connections Frontend Requirements]] (From PinCast ✅), [[FD-13 Connections Frontend Delivery]] (`pincastToken` on three routes, additive) and [[Frontend Contract]] (the endpoint table, its count, four codes); [[Frontend API Guide]] updated (a *PinCast* section, the Views and Connections rows, *Not yet available*)
- 2026-11-23 · flagged [[FR-20 PinCast & Nearby Frontend Requirements]]: on backend main ecd93c0: every endpoint row above is delivered (rows set ✅ by the backend, BI-20 is the guide). The codes are not as proposed: the card, connect, relationship and block by pincastToken answer the views one 404 E_RING_ACCESS_01 for an expired or unknown token too (no E_PINCAST_04 on the token), and the results answer E_PINCAST_04 (not E_PINCAST_05); E_PINCAST_01-03 as proposed. GET /pincasts/current wraps the PinCast in current, lastEnded is { id, endedAt, resultsUntil }, PincastEntity has startedAt, a result row carries requestId. The error table and the per-screen shapes are the frontend's to update (/frontend)
- 2026-11-23 · flagged [[FR-14 Connections Frontend Requirements]]: From PinCast is delivered on backend main ecd93c0: GET /views/pincast/:token and pincastToken on POST /connections/requests, GET /connections/relationship and POST /blocks (the line set ✅ by the backend); the app keeps { pincastToken } for a card opened from a PinCast row, as it keeps { qrToken } (/frontend)
- 2026-11-23 · flagged [[FD-13 Connections Frontend Delivery]]: backend main ecd93c0 adds pincastToken as a third key on POST /connections/requests, GET /connections/relationship and POST /blocks (exactly one of pinName, qrToken, pincastToken, plus againFor / userId where they exist); additive, nothing the app sends today changes. A card opened from a PinCast row sends it as it sends qrToken after a scan (/frontend)
- 2026-11-23 · flagged [[Frontend Contract]]: /frontend: nine more endpoints on backend main ecd93c0, eight under /pincasts and GET /views/pincast/:token (a PinCast section in the Frontend API Guide), pincastToken on POST /connections/requests, GET /connections/relationship and POST /blocks, and four new codes E_PINCAST_01 (409), E_PINCAST_02 (404), E_PINCAST_03 (400), E_PINCAST_04 (404). The endpoint table, its count, the code list and not yet available: PinCast are out of date
