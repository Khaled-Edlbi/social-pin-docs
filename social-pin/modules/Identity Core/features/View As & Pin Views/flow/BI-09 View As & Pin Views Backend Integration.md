---
id: BI-09
type: backend-integration
module: identity
feature: view-as
status: current
scope: feature
screens: [s10, s31, s44]
related: ["D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "BI-07 Ring Projection Backend Integration", "D-16 Files load from signed links that expire in 15 minutes", "BI-03 Files Upload Backend Integration", "GET /files/content/:token"]
created: 2026-10-15
updated: 2026-11-08
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 View As & Pin Views · Backend Integration

> ⚠ Affected by [[S-23 Connections Story]] (2026-11-04): S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.

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
   - **A Ring just made renders from its first moment.** A Ring nobody has edited yet (made with `POST /rings`, its projection never opened) answers 200 with the empty projection, to its owner and to its members. That view has the Pin name, the name, the nickname, and the headline, role, company, location, bio and photo of the profile the Ring presents (a new Ring follows all six); every sensitive field `null`; and empty `links[]`, `infoBlocks[]`, `widgets[]` and `attachments[]`. It is the same view the Ring gives once its projection is opened and before anything is switched on (S-19 S1). It is never a 404.
3. **All perspectives.** `GET /views/user/:userId/perspectives` → 200 `RingProfileViewEntity[]`, default Ring first then oldest first; **empty** when nothing is shared (not a 404). A viewer in several Rings of one person gets several entries; the switcher indexes by position because the entries carry no identifier. A Ring just made is one of them, as its empty projection.
4. **View as (owner).** The owner calls `GET /views/ring/:ringId` on their own Ring and gets byte for byte what that audience gets: same code path, same gates. An **expired** Ring 404s here even for the owner (`E_RING_ACCESS_02`): "View as" is for live Rings.

## Shapes that matter

`RingProfileViewEntity`: `pinName`, `displayName`, `nickname`, **`headline`**, **`role`**, **`company`**, **`location`**, `bio`, **`avatarUrl`**, `themeConfig`, `birthdate`, `gender`, `maritalStatus`, `email`, `phone`, `links[]` (`id`, `type`, `label`, `value`, `sortOrder`), `infoBlocks[]` (`id`, `title`, `body`, `sortOrder`), `widgets[]`, `attachments[]` (`id`, `label`, `filename`, `mimeType`, `sizeBytes`, **`url`**).

- **`headline`, `role`, `company`, `location` are already resolved for this Ring** ([[S-17 Ring Projection Story|Ring Projection · S10]], [[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]): the Ring's own value when it set one, else the person's main-profile value (current: a change to the main profile shows at once), and `null` when the Ring hides the field or neither has a value. Render them as they come; the view carries no switch and no mode, and nothing tells a viewer whether a value is the Ring's own or the main one. `bio` and the photo resolve the same way, without a hide. Different perspectives of one person can show different values for the same field.
- **Show the photo from `avatarUrl` and open an attachment from its `url`**: signed links, valid 15 minutes, made only for what this viewer may see ([[D-16 Files load from signed links that expire in 15 minutes]]). Load them like any web image or download, with no bearer token. `avatarUrl` is the Ring's own photo, else the main profile's, and `null` when neither has one. When a link fails to load, read the view again for fresh links ([[BI-03 Files Upload Backend Integration]]).
- **A viewer never receives a file id** ([[D-16 Files load from signed links that expire in 15 minutes]]): the view has no `avatarFileId`, attachments carry no `fileId`, and the links name none. `avatarFileId` is the owner's field, on the projection only ([[BI-07 Ring Projection Backend Integration]]).

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

## Log

- 2026-11-05 · flagged [[FR-12 View As & Pin Views Frontend Requirements]]: avatarUrl and attachments[].url are on every /views/* response on backend main @ 80e7fa2 (rows flipped ✅). avatarFileId is still sent on the view, from before D-16 (viewers never receive a file id): stop reading it, use avatarUrl, then the backend removes it (/frontend)
- 2026-11-08 · matches backend `main` `e483d49`: [[B-17 A new Ring answers 404 to its own owner until its projection is opened]] is fixed (`90fc7b3`). A Ring with no projection yet renders as the empty projection on `/views/ring`, `/views/pin` and `/perspectives`, as *Flow* 2 now says. No shape or error changed. The [[QB-14 View As & Pin Views QA Backend]] flag is cleared: B-17 is `ready` for re-test.
- 2026-11-08 · matches backend `main` `cb95a39`: `FR-12/ring-profile/view-without-file-id` (`35fe046`) took `avatarFileId` off `RingProfileViewEntity`, so no `/views/*` response carries a file id (D-16). *Shapes that matter* updated: the view has `avatarUrl` and `attachments[].url` only; the owner's projection keeps `avatarFileId`. Logged on [[BD-12 View As & Pin Views Backend Delivery]], which flags FR-12 and QB-14.
- 2026-11-08 · `docs/backend/M-01-identity/F-12-view-as/BI-09-s10-resolved-fields` · matches backend `main` `cb95a39`: [[S-17 Ring Projection Story|Ring Projection · S10]] (`ffb05c8`, `7e99942`, logged on [[BD-10 Ring Projection Backend Delivery]]) adds `headline`, `role`, `company` and `location` to `RingProfileViewEntity` on every `/views/*` route, each resolved for the Ring (own, else the main profile's, `null` when hidden). *Shapes that matter* and *Flow* 2 updated. No route or error changed. This branch is stacked on `BI-09-view-without-file-id` (`73323e6`), which edits the same shape line.
