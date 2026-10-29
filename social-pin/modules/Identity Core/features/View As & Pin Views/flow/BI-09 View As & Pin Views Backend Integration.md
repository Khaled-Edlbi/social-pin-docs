---
id: BI-09
type: backend-integration
module: identity
feature: view-as
status: current
scope: feature
screens: [s10, s31, s44]
created: 2026-10-15
updated: 2026-10-29
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 View As & Pin Views · Backend Integration

> ⚠ Affected by [[D-16 Files load from signed links that expire in 15 minutes]] (2026-10-29): the viewer's view will carry `avatarUrl` and a `url` per attachment, signed, valid 15 minutes, and still no file id. For `/backend`.

**Feature:** [[F-12 View As & Pin Views]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]], [[Ring Access Model]]

What the client builds: every screen that shows **another person**: the scanned Pin, the `!pinname` lookup, the perspective switcher, and the owner's own "View as" preview. All of them render one shape, `RingProfileViewEntity`, which is the perspective of whichever Ring the viewer is in.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s44\|s44]] Scanned Pin | opens someone by handle | `GET /views/pin/:pinName` |
| s44 (from a QR) | scans a badge | `GET /views/ring/:ringId` |
| Perspective switcher | flips between the Rings they are in | `GET /views/user/:userId/perspectives` |
| [[Screen Index#s10\|s10]], [[Screen Index#s31\|s31]] View as | previews their own Ring | `GET /views/ring/:ringId` with their own Ring id |

## Flow

1. **By Pin name.** `GET /views/pin/:pinName` (without the `!`) → 200 `RingProfileViewEntity`: the perspective of the person's **default Ring if the viewer is in it, else the oldest Ring they can see**. 404 `E_RING_ACCESS_01` otherwise, see below.
2. **By Ring.** `GET /views/ring/:ringId` → the projection of that one Ring, if the viewer may see it: the owner always, a member while the Ring and the membership are both live and no block exists. 404 `E_RING_ACCESS_02` when the Ring is not live (expired, archived, deleted, not started), 404 `E_RING_ACCESS_01` when the viewer is not in it or is blocked.
3. **All perspectives.** `GET /views/user/:userId/perspectives` → 200 `RingProfileViewEntity[]`, default Ring first then oldest first; **empty** when nothing is shared (not a 404). A viewer in several Rings of one person gets several entries; the switcher indexes by position because the entries carry no identifier.
4. **View as (owner).** The owner calls `GET /views/ring/:ringId` on their own Ring and gets byte for byte what that audience gets: same code path, same gates. An **expired** Ring 404s here even for the owner (`E_RING_ACCESS_02`): "View as" is for live Rings.

## Shapes that matter

`RingProfileViewEntity`: `pinName`, `displayName`, `nickname`, `bio`, `avatarFileId`, `themeConfig`, `birthdate`, `gender`, `maritalStatus`, `email`, `phone`, `links[]` (`id`, `type`, `label`, `value`, `sortOrder`), `infoBlocks[]` (`id`, `title`, `body`, `sortOrder`), `widgets[]`, `attachments[]` (`id`, `label`, `filename`, `mimeType`, `sizeBytes`).

- **There is no `ringId`, no `userId` and no owner id** in this entity, on purpose. To call `/perspectives` you need the person's user id from somewhere else (a connection, a scan payload); the view itself will never hand it to you.
- **`null` means "not shared with you"**, not "empty". Render "not shared" or hide the row; never "none".
- The five sensitive fields are `null` unless *that Ring* opted in; everyone in the Ring gets the same answer.
- `links`, `infoBlocks` and `attachments` contain only visible rows. There is no `isVisible` here.

## State to keep on the client

Cache a view by **(viewer, person or Ring)**, never by the person alone: the same handle returns different bodies to different viewers, and to the same viewer after a reassign. Keep the cache short-lived and refetch on screen focus: access is resolved per request against `now`, and the backend has nothing to invalidate.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 404 | `E_RING_ACCESS_01` | no such Pin name **or** not shared with you **or** blocked | one message: "This profile isn't available to you" |
| 404 | `E_RING_ACCESS_02` | the named Ring is not live (expired, archived, not yet started, deleted) | the same message to a viewer; "This Ring has expired" to the owner on View as |

Do **not** try to tell the `E_RING_ACCESS_01` cases apart, from timing or from anything else. The identical body is a deliberate privacy property with specs behind it.

## Rules the UI must respect

- Never build UI that implies which Ring the viewer is in ("you're in her Clients Ring"). The field will not appear later.
- A perspective switcher shows "View 1 / View 2", a colour or the `themeConfig`, never a Ring name: the view does not carry one.
- Use the owner's own name fields: `displayName` already falls back to the profile's full name; do not fall back to `nickname` yourself.

## Not available yet

- **The photo and the attachments cannot be fetched**: `avatarFileId` and `attachments[].id` have no download URL yet: [[S-06 Files Upload Story|Files Upload · showing files]]. Render a placeholder avatar and list attachments without a download action.
- **QR payload.** Scanning is meant to resolve a rotating **token**, not a Ring id ([[S-37 Badge & QR Story|Badge & QR · S7–S12]], [[S-37 Badge & QR Story|Badge & QR · S13–S18]]). Until then the only thing a QR can carry that the API resolves is the Ring id; treat any such encoding as temporary.
- Connect after a scan (s44 bottom): [[S-23 Connections Story|Connections · S8–S12]].
- A browser page for viewers without the app: [[S-37 Badge & QR Story|Badge & QR · S20]].

## Checklist

- [ ] One screen component renders `RingProfileViewEntity` for all three routes.
- [ ] `null` rendered as "not shared", sensitive rows hidden when `null`.
- [ ] One 404 message; no differentiation by cause.
- [ ] Cache keyed by (viewer, target); refetch on focus.
- [ ] Switcher indexes by position; no Ring names.
- [ ] Owner's View as calls the same route with their own Ring id.
