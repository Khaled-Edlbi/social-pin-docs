---
id: QB-07
type: qa-backend
module: identity
feature: counts
status: passing
scope: feature
screens: [s11, s12, s14, s16, s17, s68]
depends: ["BD-03 Counts Backend Delivery", "BI-14 Counts Backend Integration", "S-03 Counts Story"]
affects: ["S-03 Counts Story"]
related: ["FR-03 Counts Frontend Requirements", "BD-11 Rings Backend Delivery", "BD-35 Error Contract Backend Delivery", "D-14 Shared with me lists people, never the Ring", "GET /rings", "GET /rings/:id", "GET /rings/shared-with-me", "GET /rings/shared-with-me/count", "POST /rings/:ringId/members", "DELETE /rings/:ringId/members/:userId", "POST /rings/:ringId/members/:userId/reassign", E_RING_02]
pending: ["[[BD-03 Counts Backend Delivery]]: Counts · S11 (the connection count on Me) is not delivered yet; row B20 is not run and runs when it ships"]
unmet: []
created: 2026-11-05
updated: 2026-11-05
tags: [qa-backend, qa-backend/passing, module/identity, layer/qa]
---

# 🧪 Counts · QA Backend

> Blocked by default until [[BD-03 Counts Backend Delivery]] is `done` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-03 Counts]] · **Verifies:** [[BD-03 Counts Backend Delivery]] against [[S-03 Counts Story]] and [[FR-03 Counts Frontend Requirements]], with the shapes of [[BI-14 Counts Backend Integration]] · **Verdict:** Passing on backend `main` `f186ba1`, 2026-11-05; S11 not run (not delivered)

Expected behaviour of the API, as artefacts a person can check a build against: tables and diagrams, **not test code** (the specs live in the backend repo). `status: passing` or `failing` after a run; the verdict tells the PM whether the story can be fulfilled (passing with nothing pending or unmet). A failing row is one of two things: a story part the delivery does not fulfil (not built, or built other than the story says) goes in `unmet` and turns the story's badge ✕; a bug (built as asked, but it breaks) is filed against the Backend Integration and goes in `pending`, and leaves the story alone.

## Scope

**Covered:** the owner's live member count on `GET /rings` and `GET /rings/:id` ([[S-03 Counts Story|Counts · S6–S10]], and the API side of S1, S1b, S3, S5); the number of Rings owned (`meta.total`, S1, S2); the people count `GET /rings/shared-with-me/count` and the absence of `memberCount` on `GET /rings/shared-with-me` ([[S-03 Counts Story|Counts · S2]], S10); the live filters (removed, pending, not yet started, lapsed, expired Ring, blocks both ways); the 404 for a Ring that is not yours; no session.

**Not covered:** the connection count on Me ([[S-03 Counts Story|Counts · S11]]), not delivered (row B18, ⬜). Not asked by FR-03, so not checked: "N added today" and a member-side count (story open questions). The screens themselves are the QA Frontend's.

**How the run was made:** over HTTP against backend `main` `f186ba1`, started locally on a **disposable** database (migrated and seeded for the run, dropped after), signed in as the seeded users through the OTP flow. Rings and memberships were created through the API. A pending membership and the blocks were set directly in that database, because no route creates them yet. Time-bounded rows used real windows of a few seconds.

## Expected behaviour

The owner is Sara; Omar, the organizer and the admin are the members. "Count" is `memberCount` of the Ring as Sara reads it.

| # | Given | When | Then | Checked |
|---|---|---|---|---|
| B1 | Sara owns Rings with 3, 1, 1 and 0 live members | `GET /rings` | 200; every item has an integer `memberCount`; Family 3, Work 1, Expiring 1 | ✅ |
| B2 | a Ring with no member | `GET /rings` | its `memberCount` is `0`, a real zero | ✅ |
| B3 | the same owner | `GET /rings` | `meta.total` = the number of Rings Sara owns (S1 "All N", S2 "My Rings · N") | ✅ |
| B4 | Family has 3 live members | `GET /rings/:id` (Family) | 200, `memberCount` 3, the same number as the list | ✅ |
| B5 | a member removed with `DELETE /rings/:ringId/members/:userId` | `GET /rings/:id` | the count drops by one (removed is not counted) | ✅ |
| B6 | a member whose row is `PENDING` | `GET /rings/:id` | not counted | ✅ |
| B7 | a member added with `startsAt` tomorrow | `GET /rings/:id` | not counted until the window opens | ✅ |
| B8 | a member added with `expiresAt` a few seconds ahead | `GET /rings/:id` before, then after the instant | counted while open (2), not counted after (1) | ✅ |
| B9 | a Ring whose own `expiresAt` has passed, its member row still `ACTIVE` | `GET /rings/:id` and `GET /rings` | 200 for the owner; `memberCount` 0 on both | ✅ |
| B10 | Family 2, Empty 0 | `POST /rings/:ringId/members/:userId/reassign` Family → Empty, then refetch | Family 2 → 1, Empty 0 → 1 on the next fetch (S5) | ✅ |
| B11 | a Ring of Sara's | Omar calls `GET /rings/:id` on it, and on an id that does not exist | 404 both; the bodies are identical but for `path` and `timestamp`; no `memberCount` | ✅ |
| B12 | Omar is a live member of Sara's Rings | `GET /rings/shared-with-me` as Omar | 200; no item carries `memberCount` (S10) | ✅ |
| B13 | Omar is in three of Sara's Rings | `GET /rings/shared-with-me/count` as Omar | `{ "people": 1 }`: Sara once; the list's `meta.total` is 3 (Rings) | ✅ |
| B14 | — | the same call | the body has the one key `people`, nothing naming a Ring | ✅ |
| B15 | Sara has blocked Omar (then: Omar has blocked Sara) | the count, the list as Omar, and Family's count as Sara | Sara's Rings leave Omar's list, `people` drops to match the list, Omar leaves Family's count; the same in the other direction | ✅ |
| B16 | the block is lifted | `GET /rings/:id` | the count is back | ✅ |
| B17 | another user | `GET /rings/shared-with-me/count` | `people` = the distinct owners on that user's `GET /rings/shared-with-me` | ✅ |
| B18 | — | `GET /rings` / `GET /rings/:id` / the count with no bearer | 401 | ✅ |
| B19 | a member added to Empty | `GET /rings/:id` right after | the count is up by one on the next fetch (S9) | ✅ |
| B20 | a user with accepted connections | the connection count on Me (S11) | "N connections", one per person; hidden until connections exist | ⬜ not delivered |

## State diagram

When a member counts toward `memberCount` (both windows checked against `now` on every request):

```mermaid
stateDiagram-v2
  [*] --> NotCounted: added with startsAt in the future
  [*] --> Counted: added, window open
  NotCounted --> Counted: startsAt reached
  Counted --> NotCounted: membership expiresAt reached
  Counted --> NotCounted: removed / pending
  Counted --> NotCounted: the Ring expires, is archived or deleted
  Counted --> NotCounted: a block between member and owner
  NotCounted --> Counted: block lifted (windows still open)
  Counted --> CountedElsewhere: reassigned to another Ring of the owner
```

## Error matrix

| Situation | Status | ErrorCode | Same body as |
|---|---|---|---|
| `GET /rings/:id` on a Ring that is not yours | 404 | `E_RING_02` thrown; **not on the wire** (see below) | an id that does not exist |
| `GET /rings/:id` on an id that does not exist | 404 | `E_RING_02` thrown; not on the wire | a Ring that is not yours |
| any of the four routes with no session | 401 | — | — |

On `f186ba1` the 404 body is `{ statusCode, message: "Ring not found", error: "HttpException", path, timestamp }`, with no `ErrorCode` field. That is the known Error Contract gap ([[BD-35 Error Contract Backend Delivery]], [[S-87 Error Contract Story|Error Contract · S4–S8]]), not a Counts defect: the client branches on 404 and the endpoint. [[BI-14 Counts Backend Integration]]'s error table reads as if the code arrives; it is flagged.

## Privacy and access checks

- A member never sees a member count: `GET /rings/shared-with-me` carries none (B12), and `GET /rings/:id` on someone else's Ring is a 404 with no number (B11).
- "Not yours" and "does not exist" answer the same body (B11): the route is not an oracle for which Ring ids exist.
- The people count names no Ring (B14), and counts a person once however many of their Rings you are in (B13).
- A block hides both ways at once: the Ring leaves the list, the person leaves the people count, the member leaves the owner's count (B15).

## Verdict

- Run on: 2026-11-05 · build: backend `main` `f186ba1` · result: **passing**, B1–B19 as expected (23 checks), B20 not run · failing rows: none · story parts unmet: none · bugs: none
- Flagged: [[BI-14 Counts Backend Integration]], whose error table names `E_RING_02` as if it is in the body; on this build no error body carries `ErrorCode` ([[BD-35 Error Contract Backend Delivery]]).
- Not ready to fulfil: [[S-03 Counts Story]] waits on Counts · S11 (the connection count), which waits on [[F-14 Connections]]; this note stays Partial with B20 in `pending` until it ships and runs.

## Log

- 2026-11-05 · flagged [[BI-14 Counts Backend Integration]]: on backend main f186ba1 the 404 body for GET /rings/:id carries no ErrorCode (statusCode, message, error: HttpException, path, timestamp); the error table reads as if E_RING_02 arrives. Known Error Contract gap (BD-35): say the client branches on 404 + endpoint until S-87 S4–S8 ships
