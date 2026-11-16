---
id: BI-19
type: backend-integration
module: discovery
feature: discover-hub
status: current
scope: feature
screens: [s38, s44]
depends: ["BD-19 Discover Hub & Search Backend Delivery", "BI-09 View As & Pin Views Backend Integration"]
affects: ["FD-18 Discover Hub & Search Frontend Delivery"]
related: ["FR-19 Discover Hub & Search Frontend Requirements", "S-42 Discover Hub & Search Story", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "D-15 Several Rings per connection, remove or disconnect", "BI-04 Profiles & Pin Name Backend Integration", "GET /views/pin/:pinName", "GET /profiles"]
pending: []
created: 2026-11-16
updated: 2026-11-16
tags: [backend-integration, backend-integration/current, module/discovery, layer/backend]
---

# 🔌 Discover Hub & Search · Backend Integration

**Feature:** [[F-19 Discover Hub & Search]] · **Backend:** [[BD-19 Discover Hub & Search Backend Delivery]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]], [[BI-09 View As & Pin Views Backend Integration]]

Written by the **backend** team for the frontend: how to call what the hub needs. In the MVP ([[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]], [[S-42 Discover Hub & Search Story|S-42]] S1–S3) the hub makes **one call of its own, and it is another feature's route**: `GET /views/pin/:pinName`, View As & Pin Views'. This note says how the hub uses it; the view's shape and rules stay in [[BI-09 View As & Pin Views Backend Integration|BI-09]] and are not repeated here. Matches backend `main` `3cef5d7`.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s38\|s38]] The hub | opens the tab | nothing: the tiles navigate to other features, recent searches are read from the phone |
| s38 → [[Screen Index#s44\|s44]] | submits an exact Pin name | `GET /views/pin/:pinName` |
| s38 | submits their own Pin name | no resolve: compare with `pinName` from `GET /profiles` ([[BI-04 Profiles & Pin Name Backend Integration\|BI-04]]) and open View as on the default Ring ([[BI-09 View As & Pin Views Backend Integration\|BI-09]], *Flow* 4) |
| s38 Recent searches | taps an entry | `GET /views/pin/:pinName` again, every time |

## Flow

1. **Normalise on the phone, then resolve.** Strip a leading `!` or `@`, trim, lowercase; send nothing when the result is empty. `GET /views/pin/:pinName` → 200 `RingProfileViewEntity`: what that person shares with the viewer. Open s44 with that body; do not fetch it again.
2. **Which Ring it is.** The perspective of the person's Ring the viewer was put in first, their oldest live membership in that person's Rings ([[D-15 Several Rings per connection, remove or disconnect|D-15]]; BI-09, *Flow* 1). The view never says which.
3. **Not available.** Unknown name, deleted account, nothing shared with the viewer and a block all answer the same 404 `E_RING_ACCESS_01`, with the same body.
4. **Recent searches.** No route: they stay on the phone, per signed-in user (D-37, S-42 S3). The backend stores nothing about what was looked up.

## Shapes that matter

`RingProfileViewEntity`, as in [[BI-09 View As & Pin Views Backend Integration#Shapes that matter|BI-09 · Shapes that matter]]. What the hub reads from it:

- `pinName` and `displayName`, for the recent-searches entry. **`displayName` may be `null`**: show the Pin name alone then.
- No Ring id, no user id and no owner id: a recent entry can only be kept by Pin name.

## State to keep on the client

- A resolved view by (viewer, Pin name), for the open s44 only. Never cache a 404.
- Recent searches by signed-in user, on the phone; re-resolve on every tap, because access is answered per request.

## Errors to handle

| Status | ErrorCode | Meaning | Show |
|---|---|---|---|
| 404 | `E_RING_ACCESS_01` | no such Pin name, or deleted, or not shared with you, or blocked | "This Pin isn't available to you" |
| 401 | `E_AUTH_04` | the session ended | sign in again |

There is **no 400** on this route today: the name's format is not validated, so a malformed name answers the 404 above. FR-19's 400 row shows the same line, so nothing changes for the app if validation is added later.

## Rules the UI must respect

- Call on submit only, never per keystroke: no autocomplete, no partial match. The route resolves an exact name and must not be used as a prefix probe.
- One message for every 404; never time or retry it to tell the cases apart (BI-09, *Errors to handle*).
- Never call `GET /profiles/pin-name/:pinName/availability` from the hub: it answers whether a name is taken, which the lookup deliberately does not.
- Never infer or show which Ring a result came from.

## Not available yet

Later, by [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]]; no route exists for any of them:

- Search by name (needs its own decision first).
- Ask Gemma ([[S-42 Discover Hub & Search Story|S-42]] S4, [[S-89 Gemma AI Story]]).
- Import contacts, matching the phone book (S-42 S5, after the privacy review).
- Knowing a Pin name is a business's, to open s55 ([[S-29 Companies Story#Open questions|S-29 · Open questions]]): every resolve lands on s44.

## Checklist

- [ ] Input normalised (strip `!` / `@`, trim, lowercase); submit only.
- [ ] s44 opens with the resolve's body, not re-fetched.
- [ ] One line for every 404; the text stays in the field.
- [ ] My own Pin name opens View as, with no resolve call.
- [ ] Recent searches on the phone, per user, keyed by Pin name; `displayName` `null` handled; a tap re-resolves.
- [ ] No call to the Pin-name availability route from this screen.

## Log

- 2026-11-16 · `docs/backend/M-04-discovery/F-19-discover-hub/BD-19-shipped` · written against backend `main` `3cef5d7` and the approved [[FR-19 Discover Hub & Search Frontend Requirements]]: the MVP's one call is View As & Pin Views' `GET /views/pin/:pinName` (shape and rules in [[BI-09 View As & Pin Views Backend Integration]]), plus `pinName` on `GET /profiles`; no route of this feature's own. Set `current` with [[BD-19 Discover Hub & Search Backend Delivery]] `done`
