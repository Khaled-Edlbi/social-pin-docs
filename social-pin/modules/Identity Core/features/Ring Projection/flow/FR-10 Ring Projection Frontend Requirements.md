---
type: frontend-requirements
code: ring-projection
scope: feature
feature: ring-projection
module: identity
status: draft
screens: [s14, s20, s23, s24, s25, s28, s29, s30, s36, s37, s68]
depends: ["S-17 Ring Projection Story"]
affects: ["BD-10 Ring Projection Backend Delivery"]
related: ["BI-07 Ring Projection Backend Integration", "D-02 One main profile every Ring starts from", "D-03 Links entered once, switched on or off per Ring", "D-05 Inherit per field, copy without members", "ND-16 Viewer access to file bytes", "FR-04 Files Upload Frontend Requirements", "FR-06 Photo Library Frontend Requirements", "FR-07 Profiles & Pin Name Frontend Requirements", "S-14 Profiles & Pin Name Story", "S-20 Widgets Story", "S-89 Gemma AI Story", "S-87 Error Contract Story", "GET /rings/:ringId/projection", "PATCH /rings/:ringId/projection", "GET /views/ring/:ringId", "GET /profiles", E_RING_05, E_RING_02, E_FILE_04]
created: 2026-10-18
updated: 2026-10-29
owner: "Omar Fostok"
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Ring Projection · Frontend Requirements

**Feature:** [[F-10 Ring Projection]] · **Status:** Draft · **Story:** [[S-17 Ring Projection Story]] · **Backend Integration:** [[BI-07 Ring Projection Backend Integration]]

What the client needs from the backend to build the "what this Ring shows" editor across its screens, and whether each need is met today. Shapes, the link-type table and field limits are in [[BI-07 Ring Projection Backend Integration]]. Today each Ring holds **its own copies** of links and custom fields, and main-profile fields have nowhere to live; the app imitates the library on the phone (`save_ring_exposure_use_case.dart`) until S9 and S10 ship.

## Per screen

### [[Screen Index#s14|s14]] Ring data (S1)

- Needs: the owner entity in one call (`displayName`, `nickname`, `bio`, `avatarFileId`, five `show*`, `links[]`, `infoBlocks[]`, `attachments[]`, `widgets[]`, each child with `isVisible` and `sortOrder`); the member count; entry points.
- Renders **only what's on**: "What this Ring shows" (fields on, by name), "Social profiles · N" (links on), "Attachments & links" (chips, [[FR-04 Files Upload Frontend Requirements|FR-04]]); nothing off, greyed or not. An empty section shows only "+ Add" (→ s36). Sections open s24 (fields, files) or s25 (socials).
- States: loading, empty, a section with nothing on, read-only (403).
- Source today: `GET /rings/:ringId/projection`. Member count: not yet ([[S-03 Counts Story|Counts · S6–S10]]). Photo bytes: [[ND-16 Viewer access to file bytes]].

### [[Screen Index#s20|s20]] New Ring · step 3 · [[Screen Index#s24|s24]] Edit · what it shows (S2, S4)

- **Rows, each with a switch**, "N of M on":
  - **Headline**, **Role & company**, **Location** (on by default; S10). No row for the name (always shown). Not available yet.
  - **Phone**, **Email**, **Birthdate**, **Gender**, **Marital status** (`show*`, off by default), each with the value that would be shared ("12 May 1994", "not set"); a field with no value can't be switched on ("Set it on Me first").
  - my custom fields and files (S9; files: [[FR-04 Files Upload Frontend Requirements|FR-04]]).
- "+ Add a field, link or file": Field (the "Add a field" sheet), Social profile (s25's sheet), File (the picker).
- Writes: each switch saved on its own `PATCH`; the switch reflects the response. s20 writes to the Ring created in step 1.
- Off today: a link or custom field via `isVisible`; a file by detaching it. With S9: "not switched on for this Ring".
- Source today: `PATCH …/projection` for `show*`; `PATCH …/links/:linkId`, `…/info-blocks/:blockId` for `isVisible`; previews from `GET /profiles` (`birthdate`, `gender`, `maritalStatus`) and `GET /users/me` (`email`, `phone`). Main-profile field switches and the library: not yet.

### "Add a field" sheet (from [[Screen Index#s36|s36]] and s24) (S7)

- Quick picks: **Phone** / **Email** (switch `showPhone` / `showEmail` on; nothing typed); **Address** (a field titled "Address"); **Custom** (title ≤ 120, value ≤ 4000). Save adds it to this Ring, switched on. Edit / Delete from its row on s24.
- Source today: `POST …/info-blocks { title, body }`, `PATCH` / `DELETE …/info-blocks/:blockId`, `PATCH …/projection { showPhone | showEmail }`. Until S9 a custom field belongs to this Ring only.

### [[Screen Index#s23|s23]] Edit · how you appear (S3)

- Rows: **Full name** (read-only); **Photo** (Change → s29, Inherit, Copy a Ring → s28, Upload → s30); **Headline**, **Role**, **Company**, **Location** (each: the value shown, "Follows your Pin" / "Own for <Ring>" / "Hidden in <Ring>", Inherit, Write my own, Reset to Pin); **Nickname** (same pattern); **Bio** (Reset, Write my own, Inherit, Copy a Ring). No theme row. "Gemma: rewrite" hidden until [[S-89 Gemma AI Story]].
- Needs: per field, the value this Ring shows and whether it follows the Pin or is its own; set and reset each.
- Source today: `PATCH …/projection` for `nickname` (≤ 60), `bio` (≤ 2000), `avatarFileId`; `null` follows the profile ✅. Headline, role, company, location per Ring: not yet (S10, [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]); their rows show "coming soon".

### [[Screen Index#s28|s28]] Copy from a Ring (S3)

- Needs: my other Rings with their bio (and photo) for the preview; copy once (a snapshot).
- Source today: `GET /rings` and `GET /rings/:id/projection` for the source, then `PATCH …/projection { bio }` (or `{ avatarFileId }`) on this Ring ✅. **Works today.**

### [[Screen Index#s25|s25]] Edit · social profiles (S5)

- List: my links, "N of M on", each with a switch.
- "**+ Add a social profile**" sheet: paste a link (or a number, a handle); the type is detected from today's 15 `LINK_TYPE` values, anything else a website link; an optional label; Save adds it on. The five D-03 types (booking, Behance, Dribbble, GitHub, YouTube) are saved as labelled custom links until the backend has them. No sign-in.
- Validation: per type on the client (`http(s)` URL, E.164, email, `lat,lng`); a 400 `E_RING_PROFILE_03` shows the server message.
- Today (copies per Ring): edit, switch off (`isVisible`), reorder (`sortOrder`), remove; the screen says a change applies to this Ring only until S9.
- Source today: `POST / PATCH / DELETE …/links[/:linkId]`; `LINK_TYPE` from `/docs`.

### [[Screen Index#s29|s29]] Photo for this Ring · [[Screen Index#s30|s30]] Photo library (S6)

- Needs: set `avatarFileId` from an upload or a library photo; clear it to follow the main photo. The picker is [[FR-06 Photo Library Frontend Requirements|FR-06]]'s.
- Source today: `POST /files` then `PATCH …/projection`. Display: [[ND-16 Viewer access to file bytes]]. Main photo: [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]].

### [[Screen Index#s36|s36]] Add to this Ring · [[Screen Index#s37|s37]] Widgets (S7)

- Field → the "Add a field" sheet; Social profile → s25's sheet; File → the picker; Widget → s37 ([[S-20 Widgets Story]], not available yet).

### [[Screen Index#s68|s68]] Me: the private fields per Ring (S4)

- The same `showBirthdate` / `showGender` / `showMaritalStatus` switches as s24, listed per field across my Rings; asked in [[FR-07 Profiles & Pin Name Frontend Requirements|FR-07]].

## Endpoints required

| Need | Endpoint | Available | Story part / decision |
|---|---|---|---|
| Read the owner's projection | `GET /rings/:ringId/projection` | ✅ | S1 |
| Edit nickname, bio, photo and the five `show*` switches | `PATCH /rings/:ringId/projection` | ✅ | S3, S4 |
| Add / edit / switch off / reorder / remove a link | `POST`, `PATCH`, `DELETE …/links[/:linkId]` | ✅ | S5 |
| Add / edit / switch off / remove a custom field | `POST`, `PATCH`, `DELETE …/info-blocks[/:blockId]` | ✅ | S7 |
| Attach / detach a file | `POST …/attachments`, `DELETE …/attachments/:attachmentId` | ✅ | S4 ([[FR-04 Files Upload Frontend Requirements\|FR-04]]) |
| Copy another Ring's bio or photo | `GET …/projection` (source), `PATCH …/projection` (this Ring) | ✅ | S3 |
| Preview as the audience | `GET /views/ring/:ringId` | ✅ | S8 (listed under [[F-12 View As & Pin Views]]) |
| **The library**: my links and custom fields as items of mine, each switched on or off per Ring; editing one changes it everywhere; today's per-Ring copies merged once (identical type and value → one item) | — | ❌ | [[S-17 Ring Projection Story\|Ring Projection · S9]] (D-03) |
| **Per field, per Ring**: off / follow the Pin / own value for headline, role, company, location; follow / own for photo and bio | — | ❌ | [[S-17 Ring Projection Story\|Ring Projection · S10]] (D-05; needs [[S-14 Profiles & Pin Name Story\|Profiles & Pin Name · S9–S11]]) |
| The five link types D-03 added (booking, Behance, Dribbble, GitHub, YouTube) in `LINK_TYPE` | — | ❌ | S5 (D-03) |
| Display the photo and attachments | — | ❌ | [[ND-16 Viewer access to file bytes]] |
| Widgets add / edit / remove | — | ❌ | [[S-20 Widgets Story\|Widgets · S6]], [[S-20 Widgets Story\|Widgets · S7]] |
| Member count on s14 | — | ❌ | [[S-03 Counts Story\|Counts · S6–S10]] |

## Behaviour expectations

- Refetch / realtime: one editor state per Ring, refetched after every write (the sub-resource writes return the updated row; `GET` returns the whole entity). After any write, invalidate `view:<viewer>:ring:<ringId>` so View as is never stale.
- Caching keys: `projection:<ringId>` (owner entity); `profiles:<userId>` and `account:<userId>` for the value previews.
- Pagination / ordering: none; render children by `sortOrder`. Reorder by sending the new `sortOrder` on each moved row; the server does not renumber. Each Ring keeps its own order.
- Write semantics: send only changed keys; `null` clears a text or file field (falls back to the profile); `show*` as booleans; `isVisible` as a boolean on the child row.
- s14 never renders a row that's off (`isVisible: false`, a `show*` off); the editors do.
- Link validation: mirror the per-type rule on the client and still show the server's 400 message when it disagrees. Type detection from the pasted link is on the client.
- Value preview: show the stored value next to each contact and private switch; when it is empty, "not set", and the switch can't be turned on.
- Photo: keep the local image for the session; placeholder after relaunch; never build a URL from `avatarFileId`.
- Until S9: the phone-side imitation copies a value from another Ring when a link is switched on in a Ring that lacks it; the screens say a change applies to this Ring only.
- Create wizard: write to the Ring created in step 1; on Cancel, delete the Ring (`DELETE /rings/:id`) so an abandoned wizard leaves nothing behind (not allowed on the default Ring).

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| 403 | `E_RING_05` | read-only editor (not owner nor `CONTENT_MANAGER`+) |
| 404 | `E_RING_02` | Ring not found: back to My Rings |
| 400 | `E_RING_PROFILE_03` | link `value` does not match `type`: inline, server message |
| 404 | `E_RING_PROFILE_03` | link or block not in this projection: refetch the editor |
| 404 | `E_RING_PROFILE_04` | attachment not in this projection: refetch the editor |
| 400 | `E_FILE_04` | `avatarFileId` / `fileId` is not the caller's file: pick again |
| 409 | `E_PROFILE_01` | the Ring's profile is gone: re-pick the profile on the Ring |
| 400 | — (validation; `message` is a string array) | inline on the field (lengths, enum, JSON) |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[S-17 Ring Projection Story|Ring Projection · S9]]: one library switched on per Ring (s20, s24, s25); the phone-side imitation until then.
- [[S-17 Ring Projection Story|Ring Projection · S10]] and [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]: headline, role, company, location per Ring (s23, s24), and "Reset to Pin" on the photo (s29).
- [[ND-16 Viewer access to file bytes]]: every photo and attachment preview.
