---
type: requirements
id: pincast
feature: pincast
status: draft
domain: discovery
screens: [s11, s39, s40, s41, s42]
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/discovery]
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
- Source today: not yet. Connect: [[Connections Requirements]].

### Nearby by Ring (no prototype screen)

- Needs: broadcasters near my position who are in a Ring I am a live member of, filtered by Ring, with no coordinates in the response.
- Source today: not yet.

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Rings for the picker | `GET /rings` | ✅ | — |
| What a reached person shares with me | `GET /views/user/:userId/perspectives` | ✅ | — |
| Allowed distance and duration steps | — | ❌ | [[T-032 PinCast setup, start, stop, results]] |
| Start a PinCast with Ring, radius, duration, position | — | ❌ | [[T-032 PinCast setup, start, stop, results]] |
| Current PinCast with server end time | — | ❌ | [[T-032 PinCast setup, start, stop, results]] |
| Report my position while live | — | ❌ | [[T-032 PinCast setup, start, stop, results]] |
| Stop | — | ❌ | [[T-032 PinCast setup, start, stop, results]] |
| Recipients so far and final results, no coordinates | — | ❌ | [[T-032 PinCast setup, start, stop, results]] |
| Nearby by Ring through the access engine | — | ❌ | [[T-032 PinCast setup, start, stop, results]] |
| Connect / accept from a result row | — | ❌ | [[T-021 Connect request send, inbox, cancel]] |
| "PinCast ended" and "pins nearby" notifications | — | ❌ | [[T-045 NotificationService.emit and the inbox]] |
| Push instead of polling on s40 | — | ❌ | [[T-046 Push delivery and preferences]] |
| Recipient purge that bounds how long s42 stays complete | — | ❌ | [[T-054 Cleanup jobs]] |
| Avatars on recipient rows | — | ❌ | [[T-062 Serve uploaded file bytes by id]] |

## Behaviour expectations

- Refetch / realtime: while live, poll the recipients list every 10 s and the Home chip every 30 s; stop polling on end. Position reports at the interval the backend returns, foreground only until a background policy is decided. Switch to push when T-046 lands. s42 loads once and refetches on focus.
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
| — | PinCast-specific codes | to be defined by T-032 (already live, Ring not live, position missing); branch on `statusCode` until [[T-063 Put the ErrorCode on the error body]] |
| client | location permission denied | inline state on s39 / s41 with *Open settings*; the Nearby radar shows "permission needed" |

## Blocked by

- [[T-032 PinCast setup, start, stop, results]] — every ❌ row; the allowed steps, the position-reporting rule and the "reached versus see" rule are design inputs the client needs before layout is final.
- [[T-045 NotificationService.emit and the inbox]] and [[T-046 Push delivery and preferences]] — s42 reached by notification; polling on s40 until then.
- [[T-054 Cleanup jobs]] — how long results stay complete.
- [[T-063 Put the ErrorCode on the error body]] — the error table is by status until then.
