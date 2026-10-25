---
type: backend-integration
code: ring-projection
scope: feature
feature: ring-projection
module: identity
status: current
screens: [s14, s20, s23, s24, s25, s29, s36]
updated: 2026-10-18
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Ring Projection · Backend Integration

> ⚠ Affected by [[DR-02 One main profile every Ring starts from]] (2026-10-25): D-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

> ⚠ Affected by [[DR-03 Links entered once, switched on or off per Ring]] (2026-10-25): D-03 decided, links are entered once and only switched on or off per Ring; booking, Behance, Dribbble, GitHub and YouTube join the types, detected from the pasted link.

> ⚠ Affected by [[DR-05 Inherit per field, copy without members]] (2026-10-25): D-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

**Feature:** [[Ring Projection]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]], [[Ring Access Model]]

What the client builds: the owner's "what this Ring shows" editor: display name, nickname, bio, photo, theme, social and contact links, info blocks ("Add a field"), file attachments, and the five opt-ins for sensitive fields. Then "View as" to check the result ([[View As & Pin Views Backend Integration]]).

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s14\|s14]] Ring data | opens the editor | `GET /rings/:ringId/projection` |
| [[Screen Index#s23\|s23]], [[Screen Index#s29\|s29]] How you appear / Photo | edits name, nickname, bio, photo, theme | `PATCH /rings/:ringId/projection` |
| [[Screen Index#s24\|s24]] What it shows | toggles birthdate, gender, marital status, phone, email | `PATCH /rings/:ringId/projection` (`show*`) |
| [[Screen Index#s25\|s25]] Social profiles | adds, edits, hides, reorders, removes links | `POST / PATCH / DELETE …/projection/links[/:linkId]` |
| [[Screen Index#s36\|s36]], [[Screen Index#s20\|s20]] Add to this Ring | adds a field | `POST / PATCH / DELETE …/projection/info-blocks[/:blockId]` |
| s36, s14 | attaches a file | `POST /files` then `POST …/projection/attachments`; `DELETE …/attachments/:attachmentId` |

## Flow

1. **Read.** `GET /rings/:ringId/projection` → `RingProfileOwnerEntity`. The projection is created on first access, so a freshly created Ring works. Owner or a `CONTENT_MANAGER`+ admin; otherwise 403 `E_RING_05`.
2. **Edit the surface.** `PATCH /rings/:ringId/projection` with any subset of `displayName` (≤120), `nickname` (≤60), `bio` (≤2000), `avatarFileId`, `themeConfig` (JSON object), `showBirthdate`, `showGender`, `showMaritalStatus`, `showPhone`, `showEmail`. `null` clears a text or file field and falls back to the base profile (`displayName` → the profile's `fullName`, `nickname` → the profile's nickname). `avatarFileId` must be a file the caller uploaded (400 `E_FILE_04`).
3. **Links.** `POST …/links` with `{ type, value, label?, sortOrder?, isVisible? }` → 201. `PATCH …/links/:linkId` with any subset; `DELETE …/links/:linkId`. Several links of one type are allowed; use `label` to tell them apart ("Work LinkedIn"). `value` is validated against `type`, see below.
4. **Info blocks.** `POST …/info-blocks` with `{ title (≤120), body? (≤4000), sortOrder?, isVisible? }`; `PATCH` / `DELETE` likewise.
5. **Attachments.** Upload first ([[Files Upload Backend Integration]]), then `POST …/attachments` with `{ fileId, label?, sortOrder?, isVisible? }` → 201. `DELETE …/attachments/:attachmentId` detaches (the file itself stays in the library).
6. **Preview.** `GET /views/ring/:ringId` as the owner returns exactly what a member of that Ring sees: that is the "View as" screen.

## Shapes that matter

`RingProfileOwnerEntity`: `id`, `ringId`, `profileId`, `displayName`, `nickname`, `bio`, `avatarFileId`, `themeConfig`, the five `show*` booleans, `links[]`, `infoBlocks[]`, `widgets[]`, `attachments[]`, `createdAt`, `updatedAt`. Child rows carry `isVisible` and `sortOrder`; attachments also `fileId`, `filename`, `mimeType`, `sizeBytes`.

**Link `value` by `type`** (`LINK_TYPE`, 15 values):

| Types | `value` must be |
|---|---|
| `FACEBOOK`, `FACEBOOK_PAGE`, `MESSENGER`, `LINKEDIN`, `INSTAGRAM`, `X`, `TIKTOK`, `TELEGRAM`, `WEBSITE`, `CUSTOM_URL` | an absolute `http(s)` URL (`javascript:` and `data:` are rejected) |
| `PHONE`, `WHATSAPP`, `WHATSAPP_BUSINESS` | E.164, e.g. `+971501234567` |
| `EMAIL` | an email address |
| `LOCATION` | `"latitude,longitude"` |

A mismatch is a 400 `E_RING_PROFILE_03` with a human message. Validate on the client with the same rules so the user sees it before submitting.

- **`show*` all default to `false`.** A new Ring shares no birthdate, gender, marital status, phone or email until the owner turns each on, for that Ring. The values themselves live on the profile ([[Profiles & Pin Name Backend Integration]]) and on the account (phone, email). If the base value is empty, turning the flag on shows `null` to the viewer.
- `isVisible: false` on a link, block or attachment hides it from **every** viewer response: the query excludes it. The owner entity still lists it (with the flag) so the editor can show it greyed out.
- `widgets[]` is read-only today: there are no widget endpoints ([[T-018 Widget CRUD on the projection]]).

## State to keep on the client

One editor state per Ring, refetched after every write (the server returns the full owner entity on `GET` and the updated row on each sub-resource write). Invalidate any cached `/views/ring/:ringId` of the same Ring after a write, so "View as" is never stale.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 403 | `E_RING_05` | not the owner nor a `CONTENT_MANAGER`+ admin | read-only |
| 404 | `E_RING_02` | Ring not found | missing |
| 400 | `E_RING_PROFILE_03` | link `value` does not match `type` | inline, message from the server |
| 404 | `E_RING_PROFILE_03` | link or info block not in this projection | refresh the editor |
| 404 | `E_RING_PROFILE_04` | attachment not in this projection | refresh the editor |
| 400 | `E_FILE_04` | `avatarFileId` or `fileId` is not a file the caller uploaded | pick from the library again |
| 409 | `E_PROFILE_01` | the Ring's profile is gone (deleted) | re-pick the profile on the Ring |

## Rules the UI must respect

- The sensitive-field gate is a per-Ring, per-field decision stored as data. Do not add a client-side "hide for everyone" switch; the owner chooses per Ring.
- Hidden rows are never in a viewer response, so the editor must not rely on the viewer shape to show them.
- Render link values as the backend returns them; it already refused unsafe URL schemes, but still open links with `rel="noopener"` semantics on web.

## Not available yet

- **No URL to display the photo or download an attachment.** `avatarFileId` and `attachments[].id` cannot be turned into bytes today: [[T-062 Serve uploaded file bytes by id]].
- One library of fields each Ring switches on or off ("4 of 7 on", s20 / s24): the backend stores a copy per Ring: [[D-03 Field library vs per-Ring copies]].
- "Inherit from your Pin" / "Reset to Pin" / "Copy another Ring" (s23, s28, s29): [[D-05 Copy or inherit]], [[D-02 Base profile work fields]].
- Widgets (s37): [[T-017 Extend WIDGET_TYPE to the design's list]], [[T-018 Widget CRUD on the projection]].

## Checklist

- [ ] Editor loads from `GET …/projection` and refetches after every write.
- [ ] `null` sent to clear text / file fields; `show*` sent as booleans.
- [ ] Link editor validates `value` per `type` with the table above; labels for duplicates.
- [ ] Hidden rows shown greyed in the editor, never relied on from the viewer shape.
- [ ] "View as" calls `GET /views/ring/:ringId` after invalidating its cache.
