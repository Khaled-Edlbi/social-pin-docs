---
id: BI-07
type: backend-integration
module: identity
feature: ring-projection
status: current
scope: feature
screens: [s14, s20, s23, s24, s25, s29, s36]
depends: ["BD-10 Ring Projection Backend Delivery"]
affects: ["FR-10 Ring Projection Frontend Requirements"]
related: ["D-03 Links entered once, switched on or off per Ring", "D-16 Files load from signed links that expire in 15 minutes", "BI-03 Files Upload Backend Integration", "GET /files/content/:token", "GET /rings/:ringId/projection", "PATCH /rings/:ringId/projection", "POST /rings/:ringId/projection/links", E_RING_05]
created: 2026-10-15
updated: 2026-11-05
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Ring Projection · Backend Integration

> ⚠ Affected by [[D-02 One main profile every Ring starts from]] (2026-10-25): ND-02 decided, one main profile (headline, role, company, location, photo, bio) every Ring starts from; a Ring may change all of them but the full name and keeps its own value when the main one changes.

> ⚠ Affected by [[D-05 Inherit per field, copy without members]] (2026-10-25): ND-05 decided, a Ring inherits the main profile field by field until it changes that field; copying a Ring copies fields, bio, photo, colour and settings, never members.

**Feature:** [[F-10 Ring Projection]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]], [[Ring Access Model]]

What the client builds: the owner's "what this Ring shows" editor: display name, nickname, bio, photo, theme, social and contact links, custom fields ("Add a field", info blocks), file attachments, and the five opt-ins for sensitive fields. Then "View as" to check the result ([[BI-09 View As & Pin Views Backend Integration]]).

> **This note describes the backend branch `FR-10/ring-profile/library-and-link-types`, not merged yet** ([[S-17 Ring Projection Story|Ring Projection · S5, S9]]). Until it is merged, `main` keeps a copy of each link and custom field per Ring (a change applies to that Ring only, and `:linkId` names the copy) and has 15 link types; keep the phone-side imitation until then. The routes, the request bodies and the response shapes are the same on both; what changes is what an id names and what an edit reaches.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s14\|s14]] Ring data | opens the editor | `GET /rings/:ringId/projection` (render only `isVisible: true` rows) |
| [[Screen Index#s23\|s23]], [[Screen Index#s29\|s29]] How you appear / Photo | edits nickname, bio, photo | `PATCH /rings/:ringId/projection` |
| [[Screen Index#s20\|s20]], [[Screen Index#s24\|s24]] What it shows | toggles birthdate, gender, marital status, phone, email | `PATCH /rings/:ringId/projection` (`show*`) |
| s20, s24 | switches a custom field or link on or off for this Ring, "N of M on" | `PATCH …/info-blocks/:blockId` or `…/links/:linkId` `{ isVisible }` |
| [[Screen Index#s25\|s25]] Social profiles | adds, edits (everywhere), switches, reorders, deletes links | `POST / PATCH / DELETE …/projection/links[/:linkId]` |
| [[Screen Index#s36\|s36]], s20 Add to this Ring | adds a field | `POST …/projection/info-blocks`; edit / delete with `PATCH` / `DELETE …/info-blocks/:blockId` |
| s36, s14 | attaches a file | `POST /files` then `POST …/projection/attachments`; `DELETE …/attachments/:attachmentId` |

## Flow

1. **Read.** `GET /rings/:ringId/projection` → `RingProfileOwnerEntity`. The projection is created on first access, so a freshly created Ring works. Owner or a `CONTENT_MANAGER`+ admin; otherwise 403 `E_RING_05`. For the **owner**, `links[]` and `infoBlocks[]` hold **every** link and custom field of their library, each with this Ring's `isVisible` and `sortOrder`: that is the "N of M on" list (N = `isVisible: true`). Items this Ring never placed come last, `isVisible: false`, `sortOrder: 0`. A **delegated admin** gets only the items this Ring has (on or off).
2. **Edit the surface.** `PATCH /rings/:ringId/projection` with any subset of `displayName` (≤120), `nickname` (≤60), `bio` (≤2000), `avatarFileId`, `themeConfig` (JSON object), `showBirthdate`, `showGender`, `showMaritalStatus`, `showPhone`, `showEmail`. `null` clears a text or file field and falls back to the base profile (`displayName` → the profile's `fullName`, `nickname` → the profile's nickname). `avatarFileId` must be a file the caller uploaded (400 `E_FILE_04`).
3. **Links: one library, a switch per Ring** ([[D-03 Links entered once, switched on or off per Ring]]).
   - **Add:** `POST …/links` with `{ type, value, label?, sortOrder?, isVisible? }` → 201, the owner entity. The link goes into the owner's library and is switched on in this Ring (`isVisible` defaults to `true`). If the owner already has a link with the same `type` and `value`, that one is switched on here instead of a copy being made (its `label` is left as it is).
   - **Switch on / off, reorder, in this Ring:** `PATCH …/links/:linkId` with `{ isVisible }` and / or `{ sortOrder }`. Works on any link of the library, including one this Ring never had: that is how a link is switched on in a second Ring. Setting only `sortOrder` on a link this Ring never had places it, off.
   - **Edit, everywhere:** `PATCH …/links/:linkId` with `type`, `value` and / or `label` changes the link in **every** Ring that shows it. Owner only.
   - **Delete, everywhere:** `DELETE …/links/:linkId` deletes the link from the library, so from every Ring. Owner only. To take it off this Ring only, `PATCH { isVisible: false }`.
   - `:linkId` is the `id` from `links[]`: the library link's id, the same in every Ring of the owner.
   - Several links of one type are allowed; use `label` to tell them apart ("Work LinkedIn"). Two different values are two links. `value` is validated against `type`, see below.
4. **Custom fields (info blocks)**, the same rule: `POST …/info-blocks` with `{ title (≤120), body? (≤4000), sortOrder?, isVisible? }` adds to the library and switches on here (an identical `title` + `body` is reused); `PATCH …/info-blocks/:blockId` with `title` / `body` edits everywhere (owner only), with `isVisible` / `sortOrder` this Ring only; `DELETE` deletes everywhere (owner only).
5. **Attachments.** Upload first ([[BI-03 Files Upload Backend Integration]]), then `POST …/attachments` with `{ fileId, label?, sortOrder?, isVisible? }` → 201. `DELETE …/attachments/:attachmentId` detaches (the file itself stays in the library). Files were already "upload once, attach per Ring"; nothing changed here.
6. **Preview.** `GET /views/ring/:ringId` as the owner returns exactly what a member of that Ring sees: that is the "View as" screen.

## Shapes that matter

`RingProfileOwnerEntity`: `id`, `ringId`, `profileId`, `displayName`, `nickname`, `bio`, `avatarFileId`, **`avatarUrl`**, `themeConfig`, the five `show*` booleans, `links[]`, `infoBlocks[]`, `widgets[]`, `attachments[]`, `createdAt`, `updatedAt`.

- `links[]`: `{ id, type, label, value, sortOrder, isVisible }`. `id` is the library link's id (the same in every Ring); `type`, `label`, `value` are the link's, the same in every Ring; `sortOrder` and `isVisible` are **this Ring's**.
- `infoBlocks[]`: `{ id, title, body, sortOrder, isVisible }`, the same way.
- `attachments[]`: `id`, `label`, `sortOrder`, `isVisible`, `fileId`, `filename`, `mimeType`, `sizeBytes` and **`url`**.
- The viewer's shape ([[BI-09 View As & Pin Views Backend Integration]]) is unchanged: `links[]` `{ id, type, label, value, sortOrder }`, `infoBlocks[]` `{ id, title, body, sortOrder }`, only what is on. There, `id` is the Ring's own row id, not the library id: do not use a viewer id on an owner route.
- **`avatarUrl` and `attachments[].url` are signed links, valid 15 minutes** ([[D-16 Files load from signed links that expire in 15 minutes]]): load them like any web image or download, with no bearer token. `avatarUrl` is `null` when the Ring has no photo. Every attachment the owner sees has one, hidden rows included. When a link fails to load, `GET …/projection` again for fresh links; never build a URL from `avatarFileId` or `fileId` ([[BI-03 Files Upload Backend Integration]]).

**Link `value` by `type`** (`LINK_TYPE`, 20 values):

| Types | `value` must be |
|---|---|
| `FACEBOOK`, `FACEBOOK_PAGE`, `MESSENGER`, `LINKEDIN`, `INSTAGRAM`, `X`, `TIKTOK`, `TELEGRAM`, `WEBSITE`, `CUSTOM_URL`, **`BOOKING`**, **`BEHANCE`**, **`DRIBBBLE`**, **`GITHUB`**, **`YOUTUBE`** | an absolute `http(s)` URL (`javascript:` and `data:` are rejected) |
| `PHONE`, `WHATSAPP`, `WHATSAPP_BUSINESS` | E.164, e.g. `+971501234567` |
| `EMAIL` | an email address |
| `LOCATION` | `"latitude,longitude"` |

The five in bold are D-03's (S5): detect them from the pasted link (a booking page such as Calendly or cal.com, behance.net, dribbble.com, github.com, youtube.com / youtu.be) and send them as their own type rather than as labelled custom links. A mismatch is a 400 `E_RING_PROFILE_03` with a human message, also when only `type` changes (the stored value is checked against the new type). Validate on the client with the same rules so the user sees it before submitting.

- **`show*` all default to `false`.** A new Ring shares no birthdate, gender, marital status, phone or email until the owner turns each on, for that Ring. The values themselves live on the profile ([[BI-04 Profiles & Pin Name Backend Integration]]) and on the account (phone, email). If the base value is empty, turning the flag on shows `null` to the viewer.
- `isVisible: false` on a link, field or attachment hides it from **every viewer of this Ring**: the query excludes it. The owner entity still lists it (with the flag) so the editor can show it as off; s14 does not render it.
- `widgets[]` is read-only today: there are no widget endpoints ([[S-20 Widgets Story|Widgets · S7]]).

## State to keep on the client

One editor state per Ring, refetched after every write (every write but `DELETE` returns the full owner entity). An edit to a link's or a field's value, or a delete, changes **every** Ring of the owner: invalidate every `projection:<ringId>` and `view:<viewer>:ring:<ringId>` you hold for that owner, not only this Ring's. A switch or a reorder changes this Ring only.

## Errors to handle

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 403 | `E_RING_05` | not the owner nor a `CONTENT_MANAGER`+ admin | read-only |
| 403 | `E_RING_05` | a delegated admin sends `type`, `value`, `label` (`title`, `body`) or a `DELETE` on a link or field: that would change the owner's other Rings | hide edit and delete for delegated admins; offer the switch |
| 404 | `E_RING_02` | Ring not found | missing |
| 400 | `E_RING_PROFILE_03` | link `value` does not match `type` | inline, message from the server |
| 404 | `E_RING_PROFILE_03` | link or field is not in the owner's library (or, for a delegated admin, not on this Ring); also an id taken from a viewer response | refresh the editor |
| 404 | `E_RING_PROFILE_04` | attachment not in this projection | refresh the editor |
| 400 | `E_FILE_04` | `avatarFileId` or `fileId` is not a file the caller uploaded | pick from the library again |
| 409 | `E_PROFILE_01` | the Ring's profile is gone (deleted) | re-pick the profile on the Ring |

## Rules the UI must respect

- The sensitive-field gate is a per-Ring, per-field decision stored as data. Do not add a client-side "hide for everyone" switch; the owner chooses per Ring.
- A link or field is one item: never copy a value into another Ring; switch the existing item on there (`PATCH { isVisible: true }`). Two different values are two items.
- Say on the edit sheet that a change applies to every Ring that shows the item; offer "switch off here" next to "delete everywhere".
- Hidden rows are never in a viewer response, so the editor must not rely on the viewer shape to show them.
- Render link values as the backend returns them; it already refused unsafe URL schemes, but still open links with `rel="noopener"` semantics on web.

## Not available yet

- Per field, per Ring (S10): "Follows your Pin" / "Own for <Ring>" / "Hidden in <Ring>" for headline, role, company and location, and "Reset to Pin" for the photo and the bio (s23, s24, s29): [[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]; needs the main profile fields ([[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]). "Copy a Ring" (s28) for the bio and photo works today: read the other Ring's projection, `PATCH` this one.
- A route for the library on its own: it is read through any of the owner's Rings.
- Widgets (s37): [[S-20 Widgets Story|Widgets · S6]], [[S-20 Widgets Story|Widgets · S7]].

## Checklist

- [ ] Editor loads from `GET …/projection` and refetches after every write; s14 renders only `isVisible: true`.
- [ ] "N of M on" counts `links[]` / `infoBlocks[]` with `isVisible: true` against their length.
- [ ] Switching uses `PATCH { isVisible }`; a value is never copied into a second Ring.
- [ ] After an edit or a delete of a link or field, every cached projection and view of that owner is invalidated.
- [ ] `null` sent to clear text / file fields; `show*` sent as booleans.
- [ ] Link editor validates `value` per `type` with the table above, the five new types included; labels for duplicates.
- [ ] Delegated admins see the switch, not edit or delete.
- [ ] "View as" calls `GET /views/ring/:ringId` after invalidating its cache.

## Log

- 2026-11-05 · describes backend branch `FR-10/ring-profile/library-and-link-types` (`b0c14f2`), **not merged**: [[S-17 Ring Projection Story|Ring Projection · S5, S9]] (the library, the five link types), as [[BD-10 Ring Projection Backend Delivery]] logs it. The routes and shapes did not change; what `:linkId` / `:blockId` name, what an edit reaches, and the delegated admin's 403 did. The [[D-03 Links entered once, switched on or off per Ring]] flag is cleared: this note now describes its work.
