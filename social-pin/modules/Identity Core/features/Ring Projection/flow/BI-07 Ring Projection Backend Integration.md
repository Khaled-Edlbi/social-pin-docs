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
related: ["D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "BI-04 Profiles & Pin Name Backend Integration", "BI-09 View As & Pin Views Backend Integration", "D-03 Links entered once, switched on or off per Ring", "D-16 Files load from signed links that expire in 15 minutes", "BI-03 Files Upload Backend Integration", "GET /files/content/:token", "GET /rings/:ringId/projection", "PATCH /rings/:ringId/projection", "POST /rings/:ringId/projection/links", E_RING_05]
created: 2026-10-15
updated: 2026-11-08
tags: [backend-integration, backend-integration/current, module/identity, layer/backend]
---

# 🔌 Ring Projection · Backend Integration

**Feature:** [[F-10 Ring Projection]] · **Backend:** ✅ Done · **Read first:** [[Frontend Contract]], [[Ring Access Model]]

What the client builds: the owner's "what this Ring shows" editor: display name, nickname, the main-profile fields headline, role, company and location (each hidden, following the Pin or this Ring's own), bio, photo, theme, social and contact links, custom fields ("Add a field", info blocks), file attachments, and the five opt-ins for sensitive fields. Then "View as" to check the result ([[BI-09 View As & Pin Views Backend Integration]]).

> **The library and the five link types are on backend `main`** (`a249ab2`, [[S-17 Ring Projection Story|Ring Projection · S5, S9]]): drop the phone-side imitation. The routes, the request bodies and the response shapes are the ones of before; what changed is what an id names and what an edit reaches.
>
> **Per field, per Ring is on backend `main`** (`cb95a39`, [[S-17 Ring Projection Story|Ring Projection · S10]], [[D-02 One main profile every Ring starts from]], [[D-05 Inherit per field, copy without members]]): the s23 headline, role, company and location rows and their s24 switches work; drop "coming soon" on them. Same routes; new fields, *Flow* 2a.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s14\|s14]] Ring data | opens the editor | `GET /rings/:ringId/projection` (render only `isVisible: true` rows) |
| [[Screen Index#s23\|s23]], [[Screen Index#s29\|s29]] How you appear / Photo | edits nickname, bio, photo; per field "Inherit", "Write my own", "Reset to Pin" for headline, role, company, location | `PATCH /rings/:ringId/projection` (`headline`, `role`, `company`, `location`: a value, or `null` to follow) |
| [[Screen Index#s20\|s20]], [[Screen Index#s24\|s24]] What it shows | toggles headline, role & company, location (on by default) and birthdate, gender, marital status, phone, email (off by default) | `PATCH /rings/:ringId/projection` (`showHeadline`, `showRole`, `showCompany`, `showLocation`; the five sensitive `show*`) |
| s20, s24 | switches a custom field or link on or off for this Ring, "N of M on" | `PATCH …/info-blocks/:blockId` or `…/links/:linkId` `{ isVisible }` |
| [[Screen Index#s25\|s25]] Social profiles | adds, edits (everywhere), switches, reorders, deletes links | `POST / PATCH / DELETE …/projection/links[/:linkId]` |
| [[Screen Index#s36\|s36]], s20 Add to this Ring | adds a field | `POST …/projection/info-blocks`; edit / delete with `PATCH` / `DELETE …/info-blocks/:blockId` |
| s36, s14 | attaches a file | `POST /files` then `POST …/projection/attachments`; `DELETE …/attachments/:attachmentId` |

## Flow

1. **Read.** `GET /rings/:ringId/projection` → `RingProfileOwnerEntity`. The projection is created on first access, so a freshly created Ring works. Owner or a `CONTENT_MANAGER`+ admin; otherwise 403 `E_RING_05`. For the **owner**, `links[]` and `infoBlocks[]` hold **every** link and custom field of their library, each with this Ring's `isVisible` and `sortOrder`: that is the "N of M on" list (N = `isVisible: true`). Items this Ring never placed come last, `isVisible: false`, `sortOrder: 0`. A **delegated admin** gets only the items this Ring has (on or off).
2. **Edit the surface.** `PATCH /rings/:ringId/projection` with any subset of `displayName` (≤120), `nickname` (≤60), `bio` (≤2000), `avatarFileId`, `themeConfig` (JSON object), `showBirthdate`, `showGender`, `showMaritalStatus`, `showPhone`, `showEmail`. `null` clears a text or file field and falls back to the base profile (`displayName` → the profile's `fullName`, `nickname` → the profile's nickname). `avatarFileId` must be a file the caller uploaded (400 `E_FILE_04`).
2a. **The main-profile fields, per field (S10).** `headline` (≤120), `role` (≤80), `company` (≤120), `location` (≤120) are this Ring's own values, and `showHeadline`, `showRole`, `showCompany`, `showLocation` its switches. Each field is in one of three modes, and the response says which in a read-only `<field>Mode`:

   | Mode | What it means | How to set it | A viewer sees |
   |---|---|---|---|
   | `FOLLOW` ("Follows your Pin"), the default | on, no own value | `{ "<field>": null }` ("Inherit", "Reset to Pin") | the main profile's current value, `null` if it has none |
   | `OWN` ("Own for <Ring>") | on, with this Ring's value | `{ "<field>": "Dad of two" }` ("Write my own") | this Ring's value; a later main-profile change does not touch it |
   | `OFF` ("Hidden in <Ring>") | switched off on s24 | `{ "show<Field>": false }` | `null` |

   - Switching a field off keeps its own value: `{ "show<Field>": true }` brings it back as it was (`OWN` if it had one, else `FOLLOW`). The s23 row of a field that is `OFF` reads "Hidden in <Ring>" and links to s24.
   - A value is trimmed and must be at least 1 character after trimming: a blank value is a 400 (validation). To show nothing, switch the field off.
   - The **bio** and the **photo** follow the same rule without `OFF`: `bio` / `avatarFileId` `null` follows the main profile, a value is this Ring's own; `bioMode` and `photoMode` are `FOLLOW` or `OWN`. "Reset to Pin" on the photo is `{ "avatarFileId": null }`.
   - The **full name** has no per-Ring value (D-02); `displayName` is still accepted, but the editor does not send it (S-17 S3).
   - The value shown in a `FOLLOW` row is the main profile's, from `GET /profiles` ([[BI-04 Profiles & Pin Name Backend Integration]]); the projection does not repeat it. "View as" shows the resolved result.
   - Every Ring starts with all four on and following, including the Rings that existed before S10. A copied Ring (`POST /rings/:id/copy`) copies each mode as it is.
   - Never send a `<field>Mode`: it is read-only, and naming one in a `PATCH` is a 400 (unknown property).
3. **Links: one library, a switch per Ring** ([[D-03 Links entered once, switched on or off per Ring]]).
   - **Add:** `POST …/links` with `{ type, value, label?, sortOrder?, isVisible? }` → 201, the owner entity. The link goes into the owner's library and is switched on in this Ring (`isVisible` defaults to `true`). If the owner already has a link with the same `type` and `value`, that one is switched on here instead of a copy being made (its `label` is left as it is).
   - **Switch on / off, reorder, in this Ring:** `PATCH …/links/:linkId` with `{ isVisible }` and / or `{ sortOrder }`. Works on any link of the library, including one this Ring never had: that is how a link is switched on in a second Ring. Setting only `sortOrder` on a link this Ring never had places it, off.
   - **Edit, everywhere:** `PATCH …/links/:linkId` with `type`, `value` and / or `label` changes the link in **every** Ring that shows it. Owner only.
   - **Delete, everywhere:** `DELETE …/links/:linkId` deletes the link from the library, so from every Ring. Owner only. To take it off this Ring only, `PATCH { isVisible: false }`.
   - `:linkId` is the `id` from `links[]`: the library link's id, the same in every Ring of the owner.
   - Several links of one type are allowed; use `label` to tell them apart ("Work LinkedIn"). Two different values are two links. `value` is validated against `type`, see below.
   - `null` clears `label` and nothing else: `null` on `type`, `value`, `isVisible` or `sortOrder` is a 400 validation error, on `POST` and on `PATCH`. To leave a field as it is, leave it out.
4. **Custom fields (info blocks)**, the same rule: `POST …/info-blocks` with `{ title (≤120), body? (≤4000), sortOrder?, isVisible? }` adds to the library and switches on here (an identical `title` + `body` is reused); `PATCH …/info-blocks/:blockId` with `title` / `body` edits everywhere (owner only), with `isVisible` / `sortOrder` this Ring only; `DELETE` deletes everywhere (owner only). `null` clears `body` and nothing else: `null` on `title`, `isVisible` or `sortOrder` is a 400 validation error.
5. **Attachments.** Upload first ([[BI-03 Files Upload Backend Integration]]), then `POST …/attachments` with `{ fileId, label?, sortOrder?, isVisible? }` → 201. `DELETE …/attachments/:attachmentId` detaches (the file itself stays in the library). Files were already "upload once, attach per Ring"; nothing changed here.
6. **Preview.** `GET /views/ring/:ringId` as the owner returns exactly what a member of that Ring sees: that is the "View as" screen.

## Shapes that matter

`RingProfileOwnerEntity`: `id`, `ringId`, `profileId`, `displayName`, `nickname`, `bio`, `avatarFileId`, **`avatarUrl`**, **`headline`**, **`role`**, **`company`**, **`location`** (this Ring's own value, `null` when following), **`showHeadline`**, **`showRole`**, **`showCompany`**, **`showLocation`**, **`headlineMode`**, **`roleMode`**, **`companyMode`**, **`locationMode`** (`OFF` / `FOLLOW` / `OWN`), **`bioMode`**, **`photoMode`** (`FOLLOW` / `OWN`; enum `PROJECTION_FIELD_MODE`), `themeConfig`, the five sensitive `show*` booleans, `links[]`, `infoBlocks[]`, `widgets[]`, `attachments[]`, `createdAt`, `updatedAt`.

- `links[]`: `{ id, type, label, value, sortOrder, isVisible }`. `id` is the library link's id (the same in every Ring); `type`, `label`, `value` are the link's, the same in every Ring; `sortOrder` and `isVisible` are **this Ring's**.
- `infoBlocks[]`: `{ id, title, body, sortOrder, isVisible }`, the same way.
- `attachments[]`: `id`, `label`, `sortOrder`, `isVisible`, `fileId`, `filename`, `mimeType`, `sizeBytes` and **`url`**.
- The viewer's shape ([[BI-09 View As & Pin Views Backend Integration]]) carries `headline`, `role`, `company` and `location` as **resolved** for this Ring (S10; never a switch or a mode), and no file id. Its `links[]` `{ id, type, label, value, sortOrder }`, `infoBlocks[]` `{ id, title, body, sortOrder }`, only what is on. There, `id` is the Ring's own row id, not the library id: do not use a viewer id on an owner route.
- **`avatarUrl` and `attachments[].url` are signed links, valid 15 minutes** ([[D-16 Files load from signed links that expire in 15 minutes]]): load them like any web image or download, with no bearer token. `avatarUrl` is `null` when the Ring has no photo. Every attachment the owner sees has one, hidden rows included. When a link fails to load, `GET …/projection` again for fresh links; never build a URL from `avatarFileId` or `fileId` ([[BI-03 Files Upload Backend Integration]]).

**Link `value` by `type`** (`LINK_TYPE`, 20 values):

| Types | `value` must be |
|---|---|
| `FACEBOOK`, `FACEBOOK_PAGE`, `MESSENGER`, `LINKEDIN`, `INSTAGRAM`, `X`, `TIKTOK`, `TELEGRAM`, `WEBSITE`, `CUSTOM_URL`, **`BOOKING`**, **`BEHANCE`**, **`DRIBBBLE`**, **`GITHUB`**, **`YOUTUBE`** | an absolute `http(s)` URL (`javascript:` and `data:` are rejected) |
| `PHONE`, `WHATSAPP`, `WHATSAPP_BUSINESS` | E.164, e.g. `+971501234567` |
| `EMAIL` | an email address |
| `LOCATION` | `"latitude,longitude"` |

The five in bold are D-03's (S5): detect them from the pasted link (a booking page such as Calendly or cal.com, behance.net, dribbble.com, github.com, youtube.com / youtu.be) and send them as their own type rather than as labelled custom links. A mismatch is a 400 `E_RING_PROFILE_03` with a human message, also when only `type` changes (the stored value is checked against the new type). Validate on the client with the same rules so the user sees it before submitting.

- **The five sensitive `show*` default to `false`**; S10's `showHeadline`, `showRole`, `showCompany`, `showLocation` default to `true`. A new Ring shares no birthdate, gender, marital status, phone or email until the owner turns each on, for that Ring. Every `show*` and `isVisible` takes `true` / `false` only (the strings `"true"` / `"false"` are read the same); any other value is a 400, never a share. The values themselves live on the profile ([[BI-04 Profiles & Pin Name Backend Integration]]) and on the account (phone, email). If the base value is empty, turning the flag on shows `null` to the viewer.
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
| 400 | — (validation) | a `show*` or `isVisible` that is not `true` / `false` (`"yes"`, `"0"`, `null`) | a client bug: send a boolean |
| 400 | — (validation) | a blank `headline`, `role`, `company` or `location` (whitespace only), one over its limit, or a `<field>Mode` sent | send `null` to follow, switch the field off to hide it; never send a mode |
| 400 | — (validation) | `null` on a link's `type`, `value`, `isVisible` or `sortOrder`, or on a field's `title`, `isVisible` or `sortOrder` (only `label` and `body` take `null`) | a client bug: leave the field out instead |
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

- "Copy a Ring" (s28) for the bio and photo has no route of its own: read the other Ring's projection, `PATCH` this one (works today).
- Me's privacy rows (`GET /profiles/ring-privacy`) carry only the five sensitive switches, not S10's four.
- A route for the library on its own: it is read through any of the owner's Rings.
- Widgets (s37): [[S-20 Widgets Story|Widgets · S6]], [[S-20 Widgets Story|Widgets · S7]].

## Checklist

- [ ] Editor loads from `GET …/projection` and refetches after every write; s14 renders only `isVisible: true`.
- [ ] "N of M on" counts `links[]` / `infoBlocks[]` with `isVisible: true` against their length.
- [ ] Switching uses `PATCH { isVisible }`; a value is never copied into a second Ring.
- [ ] After an edit or a delete of a link or field, every cached projection and view of that owner is invalidated.
- [ ] `null` sent to clear text / file fields (on a link only `label`, on a field only `body`); a field left out when it is not changing, never `null`; `show*` sent as booleans.
- [ ] s23: each of headline, role, company, location shows its `<field>Mode` ("Follows your Pin" with the main value from `GET /profiles`, "Own for <Ring>", "Hidden in <Ring>"); "Write my own" sends the value, "Inherit" / "Reset to Pin" sends `null`; a blank value is never sent.
- [ ] s24: the headline, role & company, location switches send `showHeadline`, `showRole` + `showCompany`, `showLocation`, and read back from the response.
- [ ] Link editor validates `value` per `type` with the table above, the five new types included; labels for duplicates.
- [ ] Delegated admins see the switch, not edit or delete.
- [ ] "View as" calls `GET /views/ring/:ringId` after invalidating its cache.

## Log

- 2026-11-05 · describes backend branch `FR-10/ring-profile/library-and-link-types` (`b0c14f2`), **not merged**: [[S-17 Ring Projection Story|Ring Projection · S5, S9]] (the library, the five link types), as [[BD-10 Ring Projection Backend Delivery]] logs it. The routes and shapes did not change; what `:linkId` / `:blockId` name, what an edit reaches, and the delegated admin's 403 did. The [[D-03 Links entered once, switched on or off per Ring]] flag is cleared: this note now describes its work.
- 2026-11-05 · matches backend `main` `a249ab2`: the branch above is merged; S5 and S9 are live. With F-07's main profile fields merged before it, a viewer's `bio` and `avatarUrl` follow the main profile while the Ring's own are `null` ([[BI-04 Profiles & Pin Name Backend Integration]]).
- 2026-11-08 · matches backend `main` `e483d49`: [[B-12 Null on a link or custom field's required field answers 500]] is fixed (`52bb683`). `null` on a required field of a link or a custom field answers 400 (validation), not 500; `label` and `body` still take `null`. The rule is written in *Flow* 3 and 4, the *Errors* table and the *Checklist*. Routes and shapes are unchanged.
- 2026-11-08 · `docs/backend/M-01-identity/F-10-ring-projection/BD-10-b-11-fixed` · matches backend `main` `e483d49`: [[B-11 Projection switches read any string as true]] is fixed (`562368b`). `show*` and `isVisible` take `true` / `false` only, anything else a 400 (*Shapes that matter*, *Errors*). Routes and shapes unchanged. The [[QB-13 Ring Projection QA Backend]] flag under the H1 is cleared: B-11 and B-12 are both fixed on that build.
- 2026-11-08 · `docs/backend/M-01-identity/F-10-ring-projection/BI-07-s10-per-field` · matches backend `main` `cb95a39`: [[S-17 Ring Projection Story|Ring Projection · S10]] shipped (`ffb05c8`, `7e99942`), as [[BD-10 Ring Projection Backend Delivery]] logs it. New owner fields `headline`, `role`, `company`, `location`, `showHeadline`, `showRole`, `showCompany`, `showLocation` and the read-only modes `headlineMode` … `locationMode`, `bioMode`, `photoMode` (*Flow* 2a, *Shapes*, *Errors*, *Checklist*); the viewer's view gains the four resolved values. Routes unchanged; no new `ErrorCode`. The [[D-02 One main profile every Ring starts from]] and [[D-05 Inherit per field, copy without members]] flags are cleared: this note describes their work.
