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
related: ["BI-09 View As & Pin Views Backend Integration", "D-16 Files load from signed links that expire in 15 minutes", "ND-12 What the badge QR encodes", "ND-22 Public web page by Pin name", "ND-10 How Connect addresses the scanned person", "FR-07 Profiles & Pin Name Frontend Requirements", "FR-10 Ring Projection Frontend Requirements", "S-23 Connections Story", "S-37 Badge & QR Story", "S-20 Widgets Story", "S-87 Error Contract Story", "GET /views/pin/:pinName", "GET /views/ring/:ringId", "GET /views/user/:userId/perspectives", "GET /rings", "BD-10 Ring Projection Backend Delivery", "BI-15 Badge & QR Backend Integration", "D-15 Several Rings per connection, remove or disconnect", "FD-17 View As & Pin Views Frontend Delivery", "GET /views/qr/:token", "BI-16 Connections Backend Integration", "D-10 Connect sends what the requester already has", "E_AUTH_03", "E_AUTH_04", "E_USER_01"]
created: 2026-10-18
updated: 2026-11-15
tags: [frontend-requirements, frontend-requirements/ready, module/identity, layer/frontend]
---

# 📨 View As & Pin Views · Frontend Requirements

**Feature:** [[F-12 View As & Pin Views]] · **Status:** Ready, 2026-11-15 (the backend's four review points of 2026-11-05 answered) · **Story:** [[S-19 View As & Pin Views Story]] · **Backend Integration:** [[BI-09 View As & Pin Views Backend Integration]]

> **The backend's review of 2026-11-05 (backend `main` f186ba1), answered 2026-11-15.** (1) 401: the plain 401 with no code, `E_AUTH_04` (wrong scope), `E_AUTH_03` (suspended) and `E_USER_01` (deleted) are rows in *Error states*. (2) 400: a malformed Pin name answers the same 404 as an unknown one; only a malformed `ringId` or `userId` is a 400. (3) The photo row: the view carries no `avatarFileId` since backend `main` `cb95a39` (2026-11-08). (4) The S-23 links point at Connections · S2–S4 (Connect), S13 (Block) and S8–S12 (Shared with me); *Blocked by* says the signed links are built. The screens below are also brought to the app as built (social_pin `rings/F-11/honest-rings` @ `778d9b4`, [[FD-17 View As & Pin Views Frontend Delivery]]).

What the client needs from the backend for every screen that renders another person, and for the owner's preview, and whether each need is met today. The viewer shape and the cache rule are in [[BI-09 View As & Pin Views Backend Integration]]. Photos and files load from signed links that expire in 15 minutes ([[D-16 Files load from signed links that expire in 15 minutes]]).

## Per screen

### [[Screen Index#s10|s10]] View as teaser (S1)

- Shown only after Create on s09: "{ring} is ready", "This is what {ring} sees" over the **labelled card** (as s31's audience face, with my tags and HIDDEN IN <Ring>), "Members of {ring} see this card.", and **Go to the app**. No flip and no Ring picker.
- While the view is slow: a preview from what was entered on s09, said to be a preview, swapped for the real one when it arrives. When part of the Ring didn't save: "Finish it in {ring}: open it from the Rings tab, then What they see." and Try again.
- Needs: the viewer shape of the new Ring; its projection (for the tags and the hidden list).
- Source today: `GET /views/ring/:ringId` with the new Ring's id ✅; `GET /rings/:ringId/projection` ✅.

### [[Screen Index#s31|s31]] View as (flip) (S2)

- **Audience face**: the card as the Ring's audience sees it (as s44), with Save contact and Connect **drawn off** (it's me); my card's tags ("Own here", "Follows your Pin") and, under it, **HIDDEN IN <Ring>** (what the Ring leaves out, as chips, with "Change what <Ring> shows ›" to s24), both only for me and worked out from the Ring's projection.
- **Owner face** ("YOUR VIEW · OWNER"): my totals ("All N fields · N Rings · N connections"); **where each field goes** (each field, link, custom field and file with the Rings that show it: "Every Ring", a list, "<Ring> only", "Hidden"); the three counts for the chip's Ring (FIELDS n/m, SOCIALS n/m, BIO Own / Inherited); "Edit what <Ring> sees" → s24.
- The Ring chips (my **live** Rings only) stay put on both faces; View as is not offered on a Ring that hasn't started or has ended; a Ring that ends while open reads "This Ring has expired".
- Needs: the viewer shape of the chip's Ring; for the owner face, **every one of my Rings' projections** (worked out on the phone: links and custom fields are one library per account, each with its `isVisible` per Ring, [[BD-10 Ring Projection Backend Delivery|BD-10]]), or [[FR-07 Profiles & Pin Name Frontend Requirements|FR-07]]'s "my Rings with their switches in one call" once it ships; the counts from [[F-03 Counts]].
- States: preview frame, flipping, expired, loading.
- Source today: `GET /views/ring/:ringId`; `GET /rings` and `GET /rings/:ringId/projection` each ✅. Nothing new for the backend.

### [[Screen Index#s44|s44]] Scanned Pin (S3, S4, S7)

- Top of the card: **name** (`displayName`, never the nickname); **nickname** in a lighter style, in quotes, only when not empty; **headline · company** when shown; **`!pinname`**.
- **My own scan context** ("Scanned just now · TechSummit '26"): kept on the phone by the scan ([[F-18 Badge & QR]]); never sent by the view.
- "WHAT <NAME> SHARES WITH YOU": the shared fields, links, custom fields, widgets; sensitive rows only when not `null`.
- **Photo** from `avatarUrl`; **attachments** as rows "name · size" (Portfolio.pdf · 2.4 MB, from `sizeBytes`; no date), opening (PDF, image) or downloading from each `url`.
- **Save contact**: the phone's own new-contact editor pre-filled with only what the card shows (name, nickname as the contact's nickname, company and role or the headline, email, phone, links, the photo while its link is valid); the editor needs no contacts permission, so none is asked. It sits **next to** "Save for later" ([[S-37 Badge & QR Story|Badge & QR · S8]]), not instead of it, and only when the card shares a phone number (S-19 S7).
- **Connect**: by Pin name `POST /connections/requests { pinName }`, or after a scan `{ qrToken }` ([[D-10 Connect sends what the requester already has|D-10]], [[BI-16 Connections Backend Integration|BI-16]]); the button from `GET /connections/relationship` ([[S-23 Connections Story|Connections · S2–S4]]); not the owner's s46.
- **⋯**: Block, `POST /blocks { pinName }` or `{ qrToken }` ([[S-23 Connections Story|Connections · S13]]).
- States: scanning, no camera permission, invalid code, resolved, not available, an expired photo or file link (refetched), no contacts editor on the phone (a short message).
- Source today: a scan resolves with `GET /views/qr/:token` (the QR carries `https://socialpin.me/q/<token>`, never a Ring id; [[BI-15 Badge & QR Backend Integration|BI-15]]), a handle with `GET /views/pin/:pinName`; the photo and files from the view's signed links (no file id on any `/views/*` route).

### Perspective switcher (S5, no prototype screen)

- Needs: every perspective I hold of one person, in a stable order, with no identifiers; View 1 is the Ring I was put in first, the one `GET /views/pin` shows ([[D-15 Several Rings per connection, remove or disconnect|D-15]]).
- Source today: `GET /views/user/:userId/perspectives`; the `userId` from my connections (`GET /connections`, [[S-23 Connections Story|Connections · S8–S12]]).

### [[Screen Index#s62|s62]] Post-event (S6)

- Needs: nothing from the views. s62 never calls `GET /views/ring/:id` on an expired Ring; it uses the Ring row and the owner projection ([[FR-11 Rings Frontend Requirements|FR-11]]).

## Field map

| Shown on the card | Source | Notes |
|---|---|---|
| Name | `displayName` | already falls back to the full name; never the nickname |
| Nickname | `nickname` | a lighter line under the name, in quotes; only when not empty |
| Headline · company | the Ring's main-profile fields ([[FR-10 Ring Projection Frontend Requirements\|FR-10]], S10) | when the Ring shows them |
| `!pinName`, bio | `pinName`, `bio` | |
| Photo | `avatarUrl` (signed, 15 minutes; D-16) | ✅ `avatarUrl` on `GET /views/*` (2026-11-05); a placeholder when it is `null`; the view carries no `avatarFileId` (backend `main` `cb95a39`) |
| Theme | `themeConfig` | free-form JSON; also the switcher's label |
| Sensitive rows | `birthdate`, `gender`, `maritalStatus`, `email`, `phone` | shown only when not `null` |
| Links, fields | `links[]`, `infoBlocks[]` | visible rows only; no `isVisible` here |
| Files | `attachments[]` (`label`, `filename`, `mimeType`, `sizeBytes`, `url` signed 15 minutes) | "name · size", no date; `url` ✅ on `GET /views/*` (2026-11-05) |
| Which Ring this is | — | never provided, by design |
| Where and when I scanned | the scan, on the phone | never from the view |

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Open a person by handle | `GET /views/pin/:pinName` | ✅ | S4 |
| Render one Ring (scan, View as, teaser) | `GET /views/ring/:ringId` | ✅ | S1, S2, S3 |
| All perspectives of one person | `GET /views/user/:userId/perspectives` | ✅ | S5 |
| My live Rings for the selector and the owner face | `GET /rings`, `GET /rings/:ringId/projection` | ✅ | S2 (listed under [[F-11 Rings]], [[F-10 Ring Projection]]) |
| **The photo and files on the view**: `avatarUrl` and a `url` per attachment, signed, valid 15 minutes, no file id | `GET /views/*` | ✅ `avatarUrl`, `attachments[].url`, served by `GET /files/content/:token` (2026-11-05) | [[D-16 Files load from signed links that expire in 15 minutes]] (decided; the backend builds it) |
| Issue a rotating QR token for a Ring | `POST /rings/:ringId/qr` | ✅ (2026-11-08, [[BI-15 Badge & QR Backend Integration\|BI-15]]) | [[S-37 Badge & QR Story\|Badge & QR · S1–S2]], [[D-12 The badge QR is a socialpin.me link]] |
| Resolve a scanned token to a view | `GET /views/qr/:token` | ✅ (2026-11-08, this view + `expiresAt`) | [[S-37 Badge & QR Story\|Badge & QR · S6]] |
| Connect by Pin name | `POST /connections/requests { pinName }`, `GET /connections/relationship` | ✅ (backend `main` `1c460b0`) | [[S-23 Connections Story\|Connections · S2–S4]] |
| Connect after a scan | `POST /connections/requests { qrToken }`, `GET /connections/relationship?qrToken=` | ✅ ([[BI-16 Connections Backend Integration\|BI-16]]) | [[S-23 Connections Story\|Connections · S2–S4]], [[D-10 Connect sends what the requester already has]] |
| Block a person | `POST /blocks { pinName }` or `{ qrToken }` | ✅ (backend `main` `1c460b0`; `qrToken` [[BI-16 Connections Backend Integration\|BI-16]]) | [[S-23 Connections Story\|Connections · S13]] |
| A `userId` to call `/perspectives` with | `GET /connections` | ✅ | [[S-23 Connections Story\|Connections · S8–S12]] |
| Browser page for viewers without the app | — | ❌ | [[S-37 Badge & QR Story\|Badge & QR · S20]], [[ND-22 Public web page by Pin name]] |
| Widgets rendered in the view | — | ❌ | [[S-20 Widgets Story\|Widgets · S7]] |

## Behaviour expectations

- Refetch / realtime: refetch any view on screen focus; the owner's View as refetches after every projection write (invalidate before the flip). No push.
- **Signed links:** load the photo and files only from `avatarUrl` and `url`; never build a link from an id. A link is valid 15 minutes: when one fails to load (expired) or the view is older than that, read the view again and use the new links. Never store a link beyond the session.
- Caching keys: `view:<viewerUserId>:pin:<pinName>`, `view:<viewerUserId>:ring:<ringId>`, `perspectives:<viewerUserId>:<targetUserId>`; short TTL (under 15 minutes, so links stay valid); never keyed by the target alone.
- Pagination / ordering: perspectives are an array in the order I was put in the person's Rings, the first one first ([[D-15 Several Rings per connection, remove or disconnect|D-15]]; my own: my default Ring first), no identifiers: index by position. No pagination on views.
- One component: the same renderer for the three routes, View as and the teaser; the owner's preview adds only a frame, a selector and the owner face.
- Owner face: worked out on the phone from my own Rings' projections; it never reads another person's data.
- `null` rendering: "Not shared" or the row hidden; never "none" or "empty". A sensitive row is shown only when its value is not `null`.
- 404 rendering: one message, one layout, no cause-specific copy, retry or timing; `E_RING_ACCESS_02` differs only on the owner's own View as ("This Ring has expired").
- Handles: send `pinName` without the `!`; display it with the `!`.
- QR payload: `https://socialpin.me/q/<token>`, resolved with `GET /views/qr/:token`; never a Ring id in a QR ([[BI-15 Badge & QR Backend Integration|BI-15]]).
- Save contact: through the phone's own new-contact editor, with only what the card shows; nothing that identifies the Ring or the owner; no contacts permission.
- Expired Rings: never call `/views/ring/:id` from s62; the owner's selector on s31 and View as from s14 offer live Rings only (started and not ended: compute from `startsAt` / `expiresAt`, then trust the server).

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | "This profile isn't available to you" |
| 404 | `E_RING_ACCESS_02` | same message to a viewer; "This Ring has expired" to the owner on View as |
| 404 | — (a malformed Pin name) | the same "This profile isn't available to you": `GET /views/pin/:pinName` only trims and lowercases, so a bad Pin name answers like an unknown one |
| 400 | — (validation; a malformed `ringId` or `userId`, not a UUID) | treat as the same "not available" message |
| 401 | — (no code: a missing or expired access token) | refresh once, then sign in again |
| 401 | `E_AUTH_04` | a token of the wrong scope: sign in again |
| 401 | `E_AUTH_03` | the account is suspended: sign in again, then the suspended message |
| 404 | `E_USER_01` | the signed-in account is deleted: signed out, "this account is gone" |
| — | an expired signed link (the photo or a file fails to load) | read the view again; no error shown for a photo |

Branch on `ErrorCode` where the body carries one, else on status and endpoint ([[S-87 Error Contract Story|Error Contract]]). The two 404 bodies on `/views/pin` are identical by design; do not try to tell them apart.

## Blocked by

- Nothing: [[D-16 Files load from signed links that expire in 15 minutes|D-16]]'s links are built, the QR resolves by token ([[BI-15 Badge & QR Backend Integration|BI-15]]), Connect and Block by Pin name or by `{ qrToken }` exist ([[D-10 Connect sends what the requester already has|D-10]], [[BI-16 Connections Backend Integration|BI-16]]).
- Still open on the backend: whether a non-member asking `GET /views/ring/:ringId` for an expired Ring gets the expired body or the not-shared one (pending on [[BD-12 View As & Pin Views Backend Delivery]]).
- Not built: the browser page ([[ND-22 Public web page by Pin name]]) and widgets on the view ([[S-20 Widgets Story|Widgets · S7]]).
