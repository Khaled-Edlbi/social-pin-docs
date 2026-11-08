---
id: FD-10
type: frontend-delivery
module: identity
feature: ring-access
status: done
scope: feature
deployedTo: []
screens: [s16, s17, s44, s47, s62]
owner: "Omar Fostok"
depends: ["BI-05 Ring Access Engine Backend Integration"]
affects: []
related: ["FR-08 Ring Access Engine Frontend Requirements", "S-15 Ring Access Engine Story", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "FD-06 Counts Frontend Delivery", "FD-12 Rings Frontend Delivery", "S-18 Rings Story", "S-23 Connections Story", "S-31 Delegated Admins Story", "S-37 Badge & QR Story", "S-87 Error Contract Story"]
pending: []
created: 2026-11-08
updated: 2026-11-08
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Ring Access Engine · Frontend Delivery

**Feature:** [[F-08 Ring Access Engine]] · **Status:** Done · **Built from:** [[BI-05 Ring Access Engine Backend Integration]] · **Against:** [[S-15 Ring Access Engine Story]] · **Requirements:** [[FR-08 Ring Access Engine Frontend Requirements]] · **QA:** [[Ring Access Engine QA Frontend]]

The engine has no screen of its own: this note is where the client keeps its promises, on `social_pin` `rings/F-11/honest-rings` @ `2a10750` (2026-11-08), not on `main` yet. Shared with me as people (`1f3a88d`, 2026-11-01, on `main`); someone's card on the dark card (`eb9bdc4`, on `main`); the card read again when the app comes back (`2a10750`). The QA checklist for that last part is `test/features/rings/access_refresh_test.dart` in the client.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s17\|s17]] Shared with me | ✅ | **One row per person**, never a Ring, from the API's person rows (`GET /rings/shared-with-me`, since `bf5b5ae`): the name and photo their card shows me; no Ring name, colour, type or count ([[D-14 Shared with me lists people, never the Ring]]); no view call per row. The tab counts people ([[FD-06 Counts Frontend Delivery]]); coming back to the tab asks again. |
| Someone's card (from s17, "Shared with you") | ✅ | Their card as their Ring shows it to me, on the dark card; it never names the Ring. Read again whenever the app comes back to the foreground: access ended → "This profile isn't available to you.", one message for not shared any more, expired and blocked (S1, S2, S7). |
| [[Screen Index#s16\|s16]] My Rings | ✅ | An ended Ring shows "ended 16 Mar", a dated one "expires 16 Mar", computed from the owner's own `expiresAt`. The design's line "Membership is private to you…" is not on the screen. |
| [[Screen Index#s44\|s44]] Scanned Pin | ⬜ | Drawn, not read from the API (see *Not done yet*). |
| [[Screen Index#s47\|s47]] Connection detail | ⬜ | Drawn with sample values (see *Not done yet*). |
| [[Screen Index#s62\|s62]] Event ended | ✅ | Keep / Merge into… / Let it go on an ended event Ring, from DECIDE on My Rings; the owner still edits an ended Ring (S5). See [[FD-12 Rings Frontend Delivery]]. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings/shared-with-me` | s17 | The person rows as the API sends them (one per person); read again when the tab gains focus. |
| `GET /views/ring/:ringId` | someone's card | The server decides on every read; nothing about access is cached. 404 → "not available" on an open card. Read again on return to the foreground. |
| `POST /rings/:id/disposition` | s62 | [[FD-12 Rings Frontend Delivery]]. |
| `GET /rings/shared-with-me/count` | s16 / s17 tab | People, not Rings ([[FD-06 Counts Frontend Delivery]]). |

## State kept on the client

- No access cache: every answer is the server's, read again on focus and on return to the app.
- A 404 on a view is one state, never told apart; the copy never says expired, blocked or removed.

## Deviations from the story or the integration note

- **A 403 shows the generic error toast** ("You don't have access to this."), not a quiet hide of the editing controls ([[FR-08 Ring Access Engine Frontend Requirements]]). Only owners use the app's editing screens today, and no admin can be appointed ([[S-31 Delegated Admins Story]]), so no user reaches one yet.
- **Someone's card opens on the Ring I was put in first** when they share several with me, the one the API's person row names (D-15); the Ring is never shown.

## Not done yet

- [[Screen Index#s44\|s44]] from a real scan with `GET /views/pin/:pinName` and its one 404 → the reader is not wired ([[S-37 Badge & QR Story|Badge & QR · S13–S18]]).
- [[Screen Index#s47\|s47]]'s "IN RING — VISIBLE TO YOU ONLY" checklist, read from the API → [[S-23 Connections Story|Connections · S9]] and Ring Members.
- The Ring's access settings are shown and saved on Edit Ring ([[FD-12 Rings Frontend Delivery]]); four of them (who can request to join, approve each one, members can invite, save files) take effect only with invitations, join requests and saving files ([[S-33 Ring Invitations & Join Story]]).
- Ring names on Shared with me for a Ring joined knowingly ([[D-18 Ring names shown when joined knowingly]]) → invitations and codes, not in the app yet.
- Telling a suspended viewer apart, and branching on `E_RING_ACCESS_*` → [[S-87 Error Contract Story|Error Contract · S4–S8]] (the client shows one message either way).

## Log

- 2026-11-01 · `main` @ `1f3a88d` (social_pin) · s17 lists people, never the Ring; someone's card opens from it · flagged nothing
- 2026-11-04 · `main` @ `eb9bdc4` · someone's card and the scanned Pin on the dark card · flagged nothing
- 2026-11-08 · `rings/F-11/honest-rings` @ `2a10750` (social_pin, not on `main` yet) · an open card is read again on return to the app; access ended → "This profile isn't available to you." · flagged nothing
- 2026-11-08 · `rings/F-11/honest-rings` @ `bf5b5ae` · s17 from the API's person rows, no view call per row; s62 Keep / Merge / Let it go; the settings on Edit Ring ([[FD-12 Rings Frontend Delivery]]) · flagged nothing
