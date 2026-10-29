---
id: FR-12
type: frontend-requirements
module: identity
feature: view-as
status: ready
scope: feature
screens: [s10, s31, s44, s62]
owner: "Omar Fostok"
depends: ["S-19 View As & Pin Views Story"]
affects: ["BD-12 View As & Pin Views Backend Delivery"]
related: ["BI-09 View As & Pin Views Backend Integration", "D-16 Files load from signed links that expire in 15 minutes", "ND-12 What the badge QR encodes", "ND-22 Public web page by Pin name", "ND-10 How Connect addresses the scanned person", "FR-07 Profiles & Pin Name Frontend Requirements", "FR-10 Ring Projection Frontend Requirements", "S-23 Connections Story", "S-37 Badge & QR Story", "S-20 Widgets Story", "S-87 Error Contract Story", "GET /views/pin/:pinName", "GET /views/ring/:ringId", "GET /views/user/:userId/perspectives", "GET /rings"]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/ready, module/identity, layer/frontend]
---

# View As & Pin Views · Frontend Requirements

**Feature:** [[F-12 View As & Pin Views]] · **Status:** 📨 Ready 2026-10-29, waiting on the backend's review · **Story:** [[S-19 View As & Pin Views Story]] · **Backend Integration:** [[BI-09 View As & Pin Views Backend Integration]]

What the client needs from the backend for every screen that renders another person, and for the owner's preview, and whether each need is met today. The viewer shape and the cache rule are in [[BI-09 View As & Pin Views Backend Integration]]. Photos and files load from signed links that expire in 15 minutes ([[D-16 Files load from signed links that expire in 15 minutes]]).

## Per screen

### [[Screen Index#s10|s10]] View as teaser (S1)

- The **View as component** (as s31), opened on the Ring just created, on the **preview** face, with "Tap to flip" to the owner face; the Ring picker offers the new Ring and the **Public** (default) Ring. Shown only after "Create Ring" on s09.
- Needs: the viewer shape of the new Ring and of the Public Ring; the owner face's data (as s31).
- Source today: `GET /views/ring/:ringId` with the owner's own Ring ids ✅.

### [[Screen Index#s31|s31]] View as (flip) (S2)

- **Audience face**: the card as the Ring's audience sees it (as s44), with Save contact and Connect **disabled** (it's me).
- **Owner face** ("YOUR VIEW · OWNER"): my totals ("All N fields · N Rings · N connections"); **where each field goes** (each field, link, custom field and file with the Rings that show it: "Every Ring", a list, "<Ring> only", "Hidden"); the three counts for the chip's Ring (FIELDS n/m, SOCIALS n/m, BIO Own / Inherited); "Edit what <Ring> sees" → s24.
- The Ring chips (my live Rings) stay put on both faces; an expired Ring reads "This Ring has expired".
- Needs: the viewer shape of the chip's Ring; for the owner face, **every one of my Rings' projections** (worked out on the phone), or [[FR-07 Profiles & Pin Name Frontend Requirements|FR-07]]'s "my Rings with their switches in one call" once it ships; the counts from [[F-03 Counts]].
- States: preview frame, flipping, expired, loading.
- Source today: `GET /views/ring/:ringId`; `GET /rings` and `GET /rings/:ringId/projection` each ✅. Nothing new for the backend.

### [[Screen Index#s44|s44]] Scanned Pin (S3, S4, S7)

- Top of the card: **name** (`displayName`, never the nickname); **nickname** in a lighter style, in quotes, only when not empty; **headline · company** when shown; **`!pinname`**.
- **My own scan context** ("Scanned just now · TechSummit '26"): kept on the phone by the scan ([[F-18 Badge & QR]]); never sent by the view.
- "WHAT <NAME> SHARES WITH YOU": the shared fields, links, custom fields, widgets; sensitive rows only when not `null`.
- **Photo** from `avatarUrl`; **attachments** with name and size (no date), opening (PDF, image) or downloading from each `url`.
- **Save contact**: the phone's "new contact" screen pre-filled with only what the card shows (name, nickname, headline and company, email, phone, links, the photo while its link is valid); contacts permission asked on first use. Replaces "Save for later".
- **Connect**: disabled until [[S-23 Connections Story|Connections · S8–S12]] ([[ND-10 How Connect addresses the scanned person]]); not the owner's s46.
- **⋯**: Block ([[S-23 Connections Story|Connections · S25]]), disabled until it exists.
- States: scanning, no camera permission, invalid code, resolved, not available, an expired photo or file link (refetched), contacts permission asked / denied.
- Source today: `GET /views/ring/:ringId` (a Ring id in the QR, temporary: [[ND-12 What the badge QR encodes]]), `GET /views/pin/:pinName`. Signed links, token resolve, Connect: not yet.

### Perspective switcher (S5, no prototype screen)

- Needs: every perspective I hold of one person, in a stable order, with no identifiers.
- Source today: `GET /views/user/:userId/perspectives`; the `userId` from a connection or a scan payload (not yet available in-app).

### [[Screen Index#s62|s62]] Post-event (S6)

- Needs: nothing from the views. s62 never calls `GET /views/ring/:id` on an expired Ring; it uses the Ring row and the owner projection ([[FR-11 Rings Frontend Requirements|FR-11]]).

## Field map

| Shown on the card | Source | Notes |
|---|---|---|
| Name | `displayName` | already falls back to the full name; never the nickname |
| Nickname | `nickname` | a lighter line under the name, in quotes; only when not empty |
| Headline · company | the Ring's main-profile fields ([[FR-10 Ring Projection Frontend Requirements\|FR-10]], S10) | when the Ring shows them |
| `!pinName`, bio | `pinName`, `bio` | |
| Photo | `avatarUrl` (signed, 15 minutes; D-16) | ❌ until the backend ships D-16; a placeholder until then |
| Theme | `themeConfig` | free-form JSON; also the switcher's label |
| Sensitive rows | `birthdate`, `gender`, `maritalStatus`, `email`, `phone` | shown only when not `null` |
| Links, fields | `links[]`, `infoBlocks[]` | visible rows only; no `isVisible` here |
| Files | `attachments[]` (`label`, `filename`, `mimeType`, `sizeBytes`, `url` signed 15 minutes) | name and size, no date; `url` ❌ until D-16 ships |
| Which Ring this is | — | never provided, by design |
| Where and when I scanned | the scan, on the phone | never from the view |

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Open a person by handle | `GET /views/pin/:pinName` | ✅ | S4 |
| Render one Ring (scan, View as, teaser) | `GET /views/ring/:ringId` | ✅ | S1, S2, S3 |
| All perspectives of one person | `GET /views/user/:userId/perspectives` | ✅ | S5 |
| My live Rings for the selector and the owner face | `GET /rings`, `GET /rings/:ringId/projection` | ✅ | S2 (listed under [[F-11 Rings]], [[F-10 Ring Projection]]) |
| **The photo and files on the view**: `avatarUrl` and a `url` per attachment, signed, valid 15 minutes, no file id | `GET /views/*` | ❌ | [[D-16 Files load from signed links that expire in 15 minutes]] (decided; the backend builds it) |
| Issue a rotating QR token for a Ring | — | ❌ | [[S-37 Badge & QR Story\|Badge & QR · S7–S12]], [[ND-12 What the badge QR encodes]] |
| Resolve a scanned token to a view | — | ❌ | [[S-37 Badge & QR Story\|Badge & QR · S13–S18]] |
| Connect after a scan | — | ❌ | [[S-23 Connections Story\|Connections · S8–S12]] |
| Block a person | — | ❌ | [[S-23 Connections Story\|Connections · S25]] |
| A `userId` to call `/perspectives` with | — | ❌ | [[S-23 Connections Story\|Connections · S19–S24]] |
| Browser page for viewers without the app | — | ❌ | [[S-37 Badge & QR Story\|Badge & QR · S20]], [[ND-22 Public web page by Pin name]] |
| Widgets rendered in the view | — | ❌ | [[S-20 Widgets Story\|Widgets · S7]] |

## Behaviour expectations

- Refetch / realtime: refetch any view on screen focus; the owner's View as refetches after every projection write (invalidate before the flip). No push.
- **Signed links:** load the photo and files only from `avatarUrl` and `url`; never build a link from an id. A link is valid 15 minutes: when one fails to load (expired) or the view is older than that, read the view again and use the new links. Never store a link beyond the session.
- Caching keys: `view:<viewerUserId>:pin:<pinName>`, `view:<viewerUserId>:ring:<ringId>`, `perspectives:<viewerUserId>:<targetUserId>`; short TTL (under 15 minutes, so links stay valid); never keyed by the target alone.
- Pagination / ordering: perspectives are an array, default Ring first then oldest, no identifiers: index by position. No pagination on views.
- One component: the same renderer for the three routes, View as and the teaser; the owner's preview adds only a frame, a selector and the owner face.
- Owner face: worked out on the phone from my own Rings' projections; it never reads another person's data.
- `null` rendering: "Not shared" or the row hidden; never "none" or "empty". A sensitive row is shown only when its value is not `null`.
- 404 rendering: one message, one layout, no cause-specific copy, retry or timing; `E_RING_ACCESS_02` differs only on the owner's own View as ("This Ring has expired").
- Handles: send `pinName` without the `!`; display it with the `!`.
- QR payload: until a token exists, the QR may carry a Ring id and the scanner calls `/views/ring/:ringId`; treat the encoding as temporary and isolate it behind one resolver function.
- Save contact: through the phone's contacts, with only what the card shows; nothing that identifies the Ring or the owner.
- Expired Rings: never call `/views/ring/:id` from s62; the owner's selector on s31 lists live Rings only (compute from `expiresAt`, then trust the server).

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | "This profile isn't available to you" |
| 404 | `E_RING_ACCESS_02` | same message to a viewer; "This Ring has expired" to the owner on View as |
| 400 | — (validation; malformed handle or id) | treat as the same "not available" message |
| 401 | `E_AUTH_04` | sign in again (the views are authenticated routes) |
| — | an expired signed link (the photo or a file fails to load) | read the view again; no error shown for a photo |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, the body carries no `ErrorCode`: branch on status and endpoint. The two 404 bodies on `/views/pin` are identical by design; do not try to tell them apart.

## Blocked by

- [[D-16 Files load from signed links that expire in 15 minutes]] (decided, not built) — the photo and attachment links on s10, s31 and s44.
- [[S-37 Badge & QR Story|Badge & QR · S7–S12]] and [[S-37 Badge & QR Story|Badge & QR · S13–S18]] — the real QR payload on s44 ([[ND-12 What the badge QR encodes]]); a Ring id in the QR is a stopgap.
- [[S-23 Connections Story|Connections · S8–S12]] and [[S-23 Connections Story|Connections · S25]] — Connect and Block on s44.
