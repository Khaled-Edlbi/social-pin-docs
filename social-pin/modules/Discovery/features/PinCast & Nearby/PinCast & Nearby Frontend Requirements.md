---
type: frontend-requirements
code: pincast
scope: feature
feature: pincast
module: discovery
status: draft
screens: [s11, s39, s40, s41, s42]
created: 2026-10-18
updated: 2026-10-27
tags: [frontend-requirements, frontend-requirements/draft, module/discovery, layer/frontend]
---

# PinCast & Nearby · Frontend Requirements

**Feature:** [[PinCast & Nearby]] · **Status:** Draft · **Story:** [[PinCast & Nearby Story]] · **API Integration:** not yet (backend not built)

What the client needs from the backend to build the screens in [[PinCast & Nearby Story]], and whether each need is met today. The geo column, trigger and index exist; no endpoint does. Only the Ring picker and opening a reached person work today.

## Per screen

### [[Screen Index#s39|s39]] PinCast · hidden

- Needs: whether I have a live PinCast (to route to s40 instead), my last settings (Ring, distance, duration), the allowed steps.
- Source today: not yet. Last settings can be kept on the device until the backend returns them.

### [[Screen Index#s41|s41]] PinCast setup

- Needs: my live Rings (done), the allowed distance and duration values, start with `{ ringId, radius, duration, lat, lng }`, restart with new settings.
- Source today: `GET /rings` for the picker (drop Rings whose `expiresAt` is past). Start, restart, allowed values: not yet.

### [[Screen Index#s40|s40]] PinCast · live

- Needs: the current PinCast with its server-side end time, the recipients so far (user id, display name, Pin name, avatar id, detected-at), position updates, stop.
- Source today: not yet. Opening a recipient: `GET /views/user/:userId/perspectives` ✅.

### [[Screen Index#s11|s11]] Home · Broadcasting

- Needs: the live PinCast summary (Ring name, end time) and stop.
- Source today: not yet.

### [[Screen Index#s42|s42]] PinCast results

- Needs: a finished PinCast with its window, count and recipients; whether each recipient already has a pending request to me; connect.
- Source today: not yet. Connect: [[Connections Frontend Requirements]].

### Nearby by Ring (no prototype screen)

- Needs: broadcasters near my position who are in a Ring I am a live member of, filtered by Ring, with no coordinates in the response.
- Source today: not yet.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Rings for the picker | `GET /rings` | ✅ | — |
| What a reached person shares with me | `GET /views/user/:userId/perspectives` | ✅ | — |
| Allowed distance and duration steps | — | ❌ | [[PinCast & Nearby Story|PinCast & Nearby · S7]] |
| Start a PinCast with Ring, radius, duration, position | — | ❌ | [[PinCast & Nearby Story|PinCast & Nearby · S7]] |
| Current PinCast with server end time | — | ❌ | [[PinCast & Nearby Story|PinCast & Nearby · S7]] |
| Report my position while live | — | ❌ | [[PinCast & Nearby Story|PinCast & Nearby · S7]] |
| Stop | — | ❌ | [[PinCast & Nearby Story|PinCast & Nearby · S7]] |
| Recipients so far and final results, no coordinates | — | ❌ | [[PinCast & Nearby Story|PinCast & Nearby · S7]] |
| Nearby by Ring through the access engine | — | ❌ | [[PinCast & Nearby Story|PinCast & Nearby · S7]] |
| Connect / accept from a result row | — | ❌ | [[Connections Story|Connections · S8–S12]] |
| "PinCast ended" and "pins nearby" notifications | — | ❌ | [[Notifications Story|Notifications · S7]] |
| Push instead of polling on s40 | — | ❌ | [[Notifications Story|Notifications · S8]] |
| Recipient purge that bounds how long s42 stays complete | — | ❌ | [[Cleanup Jobs Story|Cleanup Jobs · S4]] |
| Avatars on recipient rows | — | ❌ | [[Files Upload Story|Files Upload · showing files]] |

## Behaviour expectations

- Refetch / realtime: while live, poll the recipients list every 10 s and the Home chip every 30 s; stop polling on end. Position reports at the interval the backend returns, foreground only until a background policy is decided. Switch to push when Notifications · S8 lands. s42 loads once and refetches on focus.
- Countdown: computed on the client from the server's end time and a server-time offset taken from the start response; never from the device clock alone.
- Caching keys: current PinCast by (signed-in user); recipients by (pincast id); results by (pincast id); a reached person's perspectives by (viewer, user id). Invalidate the current PinCast on start, restart, stop and on end time passing.
- Pagination / ordering: recipients newest-detected first, `{ data, meta: { total } }`, `limit` ≤ 50, paged on s42, first page only on s40.
- Privacy on the client: never render a map, a distance or a bearing from any field the backend might add later; store the device position in memory only; log nothing about positions.
- Nearby: the Ring filter lists Rings I am a member of from `GET /rings/shared-with-me`; the query sends my position and a ring id, and the response is a list of views, not points.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | opening a reached person who shares nothing with me: show the name from the result row and "No shared profile"; the perspectives call returns `[]` rather than a 404 in that case |
| 404 | `E_RING_02` | the picked Ring is not mine or is gone: refetch `GET /rings` |
| 401 | `E_AUTH_04` | sign in again |
| 400 | — | radius or duration outside the allowed steps: should not happen if the UI uses the returned steps; inline |
| — | PinCast-specific codes | to be defined by PinCast & Nearby · S7 (already live, Ring not live, position missing); branch on `statusCode` until [[Error Contract Story|Error Contract · S4–S8]] |
| client | location permission denied | inline state on s39 / s41 with *Open settings*; the Nearby radar shows "permission needed" |

## Blocked by

- [[PinCast & Nearby Story|PinCast & Nearby · S7]] — every ❌ row; the allowed steps, the position-reporting rule and the "reached versus see" rule are design inputs the client needs before layout is final.
- [[Notifications Story|Notifications · S7]] and [[Notifications Story|Notifications · S8]] — s42 reached by notification; polling on s40 until then.
- [[Cleanup Jobs Story|Cleanup Jobs · S4]] — how long results stay complete.
- [[Error Contract Story|Error Contract · S4–S8]] — the error table is by status until then.
