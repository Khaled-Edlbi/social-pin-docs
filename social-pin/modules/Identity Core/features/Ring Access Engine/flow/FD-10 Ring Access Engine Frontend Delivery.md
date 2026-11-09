---
id: FD-10
type: frontend-delivery
module: identity
feature: ring-access
status: done
scope: feature
deployedTo: []
screens: [s16, s17, s31, s44, s47, s62]
owner: "Omar Fostok"
depends: ["BI-05 Ring Access Engine Backend Integration"]
affects: []
related: ["FR-08 Ring Access Engine Frontend Requirements", "S-15 Ring Access Engine Story", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "FD-06 Counts Frontend Delivery", "FD-12 Rings Frontend Delivery", "S-18 Rings Story", "S-23 Connections Story", "S-31 Delegated Admins Story", "S-37 Badge & QR Story", "S-87 Error Contract Story", "S-19 View As & Pin Views Story", "S-33 Ring Invitations & Join Story"]
pending: []
created: 2026-11-08
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Ring Access Engine · Frontend Delivery

**Feature:** [[F-08 Ring Access Engine]] · **Status:** Done · **Built from:** [[BI-05 Ring Access Engine Backend Integration]] · **Against:** [[S-15 Ring Access Engine Story]] · **Requirements:** [[FR-08 Ring Access Engine Frontend Requirements]] · **QA:** [[Ring Access Engine QA Frontend]]

The engine has no screen of its own: this note is where the client keeps its promises, on `social_pin` `rings/F-11/honest-rings` @ `0005f00` (2026-11-09), not on `main` yet. Shared with me as people (`1f3a88d`, 2026-11-01, on `main`); someone's card on the dark card (`eb9bdc4`, on `main`); the card read again when the app comes back (`2a10750`); View as from the view route with its expired state (`f801aaa`). The QA checklist is `test/features/rings/access_refresh_test.dart` and `test/features/ring_detail/view_as_test.dart` in the client.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s17\|s17]] Shared with me | ✅ | **One row per person**, never a Ring you were placed in, from the API's person rows (`GET /rings/shared-with-me`, since `bf5b5ae`): the name and photo their card shows me; no Ring name, colour, type or count ([[D-14 Shared with me lists people, never the Ring]]); no view call per row. A row for a Ring I joined knowingly (invitation, code, approved request) carries its name, its count only when members see each other, and "Your card here" ([[D-18 Ring names shown when joined knowingly]], `f801aaa`, `0005f00`). The tab counts people ([[FD-06 Counts Frontend Delivery]]); coming back to the tab asks again. |
| Someone's card (from s17, "Shared with you") | ✅ | Their card as their Ring shows it to me, on the dark card; it never names a Ring I was placed in. Read again whenever the app comes back to the foreground: access ended → "This profile isn't available to you.", one message for not shared any more, expired and blocked (S1, S2, S7). |
| [[Screen Index#s31\|s31]] View as | ✅ | The owner's own Ring through `GET /views/ring/:ringId`, the member's code path, read fresh for each Ring picked; a Ring that is not live (404 `E_RING_ACCESS_02`, or a bare 404, since your own Ring is never "not shared with you") shows "This Ring has expired", to the owner only (S5, S7, `f801aaa`). The chips are your live Rings; an expired one opened keeps its own chip. |
| [[Screen Index#s16\|s16]] My Rings | ✅ | An ended Ring shows "ended 16 Mar", a dated one "expires 16 Mar", computed from the owner's own `expiresAt`. The design's line "Membership is private to you…" is not on the screen. |
| [[Screen Index#s44\|s44]] Scanned Pin | ✅ | From a real scan through `GET /views/qr/:token` (`875d8ee`, `d4cbd1f`): one 404 for every refused case (unknown, expired, reset, ended, not shared, blocked), "This profile isn't available", never which ([[S-37 Badge & QR Story]]). |
| [[Screen Index#s47\|s47]] Connection detail | ✅ | "IN RING (visible to you only)" from the API: my live Rings, ticked where they are, a tick adds, an untick removes, each window under it; the mutual count when it is above 0 (`f70c791`, `0005f00`, [[S-23 Connections Story]]). |
| [[Screen Index#s62\|s62]] Event ended | ✅ | Keep / Merge into… / Let it go on an ended event Ring, from DECIDE on My Rings; the owner still edits an ended Ring, never previewed with the view route (S5). See [[FD-12 Rings Frontend Delivery]]. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings/shared-with-me` | s17 | The person rows as the API sends them (one per person); read again when the tab gains focus and after joining or leaving. |
| `GET /views/ring/:ringId` | someone's card, s31 | The server decides on every read; nothing about access is cached. 404 → "not available" on an open card; on s31 → "This Ring has expired". Read again on return to the foreground (the card) and on each Ring picked (s31). |
| `GET /views/qr/:token` | s44 | One 404, one message. |
| `POST /rings/:id/disposition` | s62 | [[FD-12 Rings Frontend Delivery]]. |
| `GET /rings/shared-with-me/count` | s16 / s17 tab | People, not Rings ([[FD-06 Counts Frontend Delivery]]). |

## State kept on the client

- No access cache: every answer is the server's, read again on focus and on return to the app.
- A 404 on a view is one state, never told apart; the copy never says expired, blocked or removed to a viewer. Only the owner's own View as says "expired".

## Deviations from the story or the integration note

- **A 403 shows the generic error toast** ("You don't have access to this."), not a quiet hide of the editing controls ([[FR-08 Ring Access Engine Frontend Requirements]]). Only owners use the app's editing screens today, and no admin can be appointed ([[S-31 Delegated Admins Story]]), so no user reaches one yet.
- **Someone's card opens on the Ring I was put in first** when they share several with me, the one the API's person row names (D-15); a Ring I was placed in is never shown.

## Not done yet

- The Ring's access settings are shown and saved on Edit Ring ([[FD-12 Rings Frontend Delivery]]); joining by code or invitation, join requests and member invitations are in the app now (`f801aaa`, `0005f00`, [[S-33 Ring Invitations & Join Story]]); saving files has no flow yet.
- Telling a suspended viewer apart, and branching on `E_RING_ACCESS_*` → [[S-87 Error Contract Story|Error Contract · S4–S8]] (the client shows one message either way).
- On `main` with `rings/F-11/honest-rings`.

## Log

- 2026-11-01 · `main` @ `1f3a88d` (social_pin) · s17 lists people, never the Ring; someone's card opens from it · flagged nothing
- 2026-11-04 · `main` @ `eb9bdc4` · someone's card and the scanned Pin on the dark card · flagged nothing
- 2026-11-08 · `rings/F-11/honest-rings` @ `2a10750` (social_pin, not on `main` yet) · an open card is read again on return to the app; access ended → "This profile isn't available to you." · flagged nothing
- 2026-11-08 · `rings/F-11/honest-rings` @ `bf5b5ae` · s17 from the API's person rows, no view call per row; s62 Keep / Merge / Let it go; the settings on Edit Ring ([[FD-12 Rings Frontend Delivery]]) · flagged nothing
- 2026-11-09 · app branch `rings/F-11/honest-rings` @ `dde0533`, `f801aaa`, `0005f00` (with `875d8ee`, `d4cbd1f`, `f70c791`; not on `main` yet) · S1, S2, S5, S7 · s31 View as on `GET /views/ring/:ringId` with "This Ring has expired" for the owner; s17 named rows for a Ring joined knowingly (D-18); s44 from a real scan with its one 404; s47 IN RING from the API; [[FR-08 Ring Access Engine Frontend Requirements]] source lines updated, its [[BD-11 Rings Backend Delivery]] and [[BD-14 Connections Backend Delivery]] flags cleared · flagged nothing
