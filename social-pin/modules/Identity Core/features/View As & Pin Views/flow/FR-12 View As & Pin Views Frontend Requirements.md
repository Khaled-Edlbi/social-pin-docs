---
type: frontend-requirements
code: view-as
scope: feature
feature: view-as
module: identity
status: draft
screens: [s10, s31, s44]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# View As & Pin Views · Frontend Requirements

> ⚠ Affected by [[D-16 Files load from signed links that expire in 15 minutes]] (2026-10-29): the pin view shows photos and files from `avatarUrl` and `url`, signed, valid 15 minutes. For `/frontend`.

**Feature:** [[F-12 View As & Pin Views]] · **Status:** Draft · **Story:** [[S-19 View As & Pin Views Story]] · **Backend Integration:** [[BI-09 View As & Pin Views Backend Integration]]

What the client needs from the backend for every screen that renders another person, and for the owner's preview, and whether each need is met today. The viewer shape and the cache rule are in [[BI-09 View As & Pin Views Backend Integration]]; the guarantees behind the answers are in [[FR-08 Ring Access Engine Frontend Requirements]].

## Per screen

### [[Screen Index#s10|s10]] View as teaser

- Needs: the viewer shape of the Ring just created.
- Source today: `GET /views/ring/:ringId` with the owner's own Ring id.

### [[Screen Index#s31|s31]] View as (flip)

- Needs: the viewer shape of any of my live Rings; a Ring selector; an "expired" state for me only.
- States: preview frame, flipping, expired, loading.
- Source today: `GET /views/ring/:ringId`; the selector from `GET /rings`.

### [[Screen Index#s44|s44]] Scanned Pin

- Needs: resolve a scan to a view; resolve a handle to a view; one 404 message; Connect; Save for later.
- Fields shown: `pinName`, `displayName`, `nickname`, `bio`, `avatarFileId` (placeholder), `themeConfig`, `birthdate`, `gender`, `maritalStatus`, `email`, `phone` (each only when not `null`), `links[]`, `infoBlocks[]`, `widgets[]`, `attachments[]`.
- States: scanning, no camera permission, invalid code, resolved, not available.
- Source today: `GET /views/ring/:ringId` (Ring id in the QR, temporary), `GET /views/pin/:pinName`. Token resolve, Connect: not yet.

### Perspective switcher (no prototype screen)

- Needs: every perspective I hold of one person, in a stable order, with no identifiers.
- Source today: `GET /views/user/:userId/perspectives`; the `userId` from a connection or a scan payload (not yet available in-app).

## Field map

| Shown on the card | Source | Notes |
|---|---|---|
| `!pinName`, name, nickname, bio | `pinName`, `displayName`, `nickname`, `bio` | `displayName` already falls back to the full name |
| Photo | `avatarFileId` | placeholder until [[S-06 Files Upload Story|Files Upload · showing files]] |
| Theme | `themeConfig` | free-form JSON; also the switcher's label |
| Sensitive rows | `birthdate`, `gender`, `maritalStatus`, `email`, `phone` | shown only when not `null` |
| Links, fields, files | `links[]`, `infoBlocks[]`, `attachments[]` | visible rows only; no `isVisible` here |
| Which Ring this is | — | never provided, by design |

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Open a person by handle | `GET /views/pin/:pinName` | ✅ | — |
| Render one Ring (scan, View as) | `GET /views/ring/:ringId` | ✅ | — |
| All perspectives of one person | `GET /views/user/:userId/perspectives` | ✅ | — |
| My live Rings for the View as selector | `GET /rings` | ✅ | — (listed under [[F-11 Rings]]) |
| Photo and attachment bytes | — | ❌ | [[S-06 Files Upload Story|Files Upload · showing files]] |
| Issue a rotating QR token for a Ring | — | ❌ | [[S-37 Badge & QR Story|Badge & QR · S7–S12]] |
| Resolve a scanned token to a view | — | ❌ | [[S-37 Badge & QR Story|Badge & QR · S13–S18]] |
| Connect after a scan | — | ❌ | [[S-23 Connections Story|Connections · S8–S12]] |
| A `userId` to call `/perspectives` with | — | ❌ | [[S-23 Connections Story|Connections · S19–S24]] |
| Browser page for viewers without the app | — | ❌ | [[S-37 Badge & QR Story|Badge & QR · S20]] |
| Widgets rendered in the view | — | ❌ | [[S-20 Widgets Story|Widgets · S7]] |

## Behaviour expectations

- Refetch / realtime: refetch any view on screen focus; the owner's View as refetches after every projection write (invalidate before the flip). No push.
- Caching keys: `view:<viewerUserId>:pin:<pinName>`, `view:<viewerUserId>:ring:<ringId>`, `perspectives:<viewerUserId>:<targetUserId>`; short TTL; never keyed by the target alone.
- Pagination / ordering: perspectives are an array, default Ring first then oldest, no identifiers: index by position. No pagination on views.
- One component: the same renderer for the three routes and for View as; the owner's preview adds only a frame and a selector.
- `null` rendering: "Not shared" or the row hidden; never "none" or "empty". A sensitive row is shown only when its value is not `null`.
- 404 rendering: one message, one layout, no cause-specific copy, retry or timing; `E_RING_ACCESS_02` differs only on the owner's own View as ("This Ring has expired").
- Handles: send `pinName` without the `!`; display it with the `!`.
- QR payload: until a token exists, the QR may carry a Ring id and the scanner calls `/views/ring/:ringId`; treat the encoding as temporary and isolate it behind one resolver function.
- Save for later: store the handle only; nothing in a view identifies the Ring or the owner.
- Expired Rings: never call `/views/ring/:id` from s62; the owner's selector on s31 lists live Rings only (compute from `expiresAt`, then trust the server).

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 404 | `E_RING_ACCESS_01` | "This profile isn't available to you" |
| 404 | `E_RING_ACCESS_02` | same message to a viewer; "This Ring has expired" to the owner on View as |
| 400 | — (validation; malformed handle or id) | treat as the same "not available" message |
| 401 | `E_AUTH_04` | sign in again (the views are authenticated routes) |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, the body carries no `ErrorCode`: branch on status and endpoint. The two 404 bodies on `/views/pin` are identical by design; do not try to tell them apart.

## Blocked by

- [[S-06 Files Upload Story|Files Upload · showing files]] — the photo and attachment downloads on s31 and s44.
- [[S-37 Badge & QR Story|Badge & QR · S7–S12]] and [[S-37 Badge & QR Story|Badge & QR · S13–S18]] — the real QR payload on s44; a Ring id in the QR is a stopgap.
- [[S-23 Connections Story|Connections · S8–S12]] — the Connect action on s44.
