---
id: FD-11
type: frontend-delivery
module: identity
feature: ring-projection
status: done
scope: feature
deployedTo: []
screens: [s14, s20, s23, s24, s25, s28, s29, s31, s36]
owner: "Omar Fostok"
depends: ["BI-07 Ring Projection Backend Integration"]
affects: []
related: ["FR-10 Ring Projection Frontend Requirements", "S-17 Ring Projection Story", "D-03 Links entered once, switched on or off per Ring", "D-05 Inherit per field, copy without members", "FD-07 Files Upload Frontend Delivery", "FD-08 Photo Library Frontend Delivery", "FD-09 Profiles & Pin Name Frontend Delivery", "S-20 Widgets Story", "S-89 Gemma AI Story"]
created: 2026-11-08
updated: 2026-11-24
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Ring Projection · Frontend Delivery

> ⚠ Affected by [[S-17 Ring Projection Story]] (2026-11-12): S10 and S3 now describe app 778d9b4 (Your Pin / Own here / Hidden, the bio as a Your Pin / Own here row, reorder per Ring); the pending item about the bio's Inherit / Reset to Pin can be checked against them

**Feature:** [[F-10 Ring Projection]] · **Status:** Done · **Built from:** [[BI-07 Ring Projection Backend Integration]] · **Against:** [[S-17 Ring Projection Story]] · **Requirements:** [[FR-10 Ring Projection Frontend Requirements]] · **QA:** [[Ring Projection QA Frontend]]

What the client shipped for what each Ring shows. On `social_pin` `main`: what a Ring shows saved to the API (`bdc8d18`, 2026-10-21), custom fields and s24 redrawn (`4887fcb`), links (`678e545`), a nickname per Ring (`ed3a763`). On `rings/F-11/honest-rings` @ `461673e` (2026-11-08), on `main` since 2026-11-24 at `866240a`: one library of links and fields switched per Ring, and five new link types; @ `f801aaa` (2026-11-09): headline, role, company and location per Ring, and Copy from a Ring; @ `5cb24ae` … `778d9b4` (2026-11-10/11): one **Your Pin / Own here / Hidden** control per field, the photo, bio and nickname as Your Pin / Own here, links and fields dragged into order, Ring detail (s14) with *What they see* and *People · N* tabs, the appearance rows moved onto s24, and Copy from a Ring (s28) from New Ring step 3. Checks at `778d9b4`: `dart analyze` 0 errors, `flutter test` 1752 passed. The files on a Ring are in [[FD-07 Files Upload Frontend Delivery]], its photo in [[FD-08 Photo Library Frontend Delivery]]. The QA checklist for the library is LK-01…LK-08 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s14\|s14]] Ring detail | ✅ | `4aac99d`: two tabs, **What they see** (the Ring's real content from its projection, only what is on: fields, links, custom fields, files, bio, nickname "Goes by …"; headline, location and private fields listed, `5cb24ae`) and **People · N**. Each section's pencil opens s24 or Edit Ring scrolled to that section (`4350611`). Load and error states, `E_PROFILE_01` (`c1f152c`). View as is off on a Ring that isn't live (`5cb24ae`). |
| [[Screen Index#s23\|s23]] How you appear | — | **Gone as a screen** (`4aac99d`). Edit Ring keeps the Ring itself (name, colour, icon, the note only you see, when it's open, who can join, what members can do); the photo, bio, nickname and the four profile fields are on s24's ABOUT YOU. |
| [[Screen Index#s28\|s28]] Copy from a Ring | ✅ | Reached from **New Ring step 3** (*What it shows*, under ABOUT YOU: "Copy from another Ring", `778d9b4`); the bio or photo picked becomes the new Ring's own in the draft. Lists my other Rings with a bio or photo **of their own**, a Bio / Photo choice, a preview, "Use this bio" / "Use this photo", "A snapshot: later changes to either Ring stay apart."; empty: "None of your other Rings has a bio or photo of its own yet." (S3, [[D-05 Inherit per field, copy without members]]). Not offered from s24 on an existing Ring. |
| [[Screen Index#s24\|s24]] What it shows · ABOUT YOU | ✅ | `4aac99d`, S10: the name (always shown), then the photo, headline, role, company, location, bio and nickname, each with its value and where it stands. One sheet (`field_mode_sheet`) per field: **Your Pin** ("\"{value}\". Changes when your Pin does."), **Own here** ("Write one only {ring} sees. Your Pin stays as it is.", trimmed, never blank, within the API's limit) and **Hidden** ("{ring} doesn't see it."). Picking Your Pin follows again; there is no Reset to Pin. The **photo, bio and nickname** have no Hidden (the API never hides them): Your Pin / Own here, `null` follows. The same sheet, words and order serve New Ring step 3 and s09. |
| [[Screen Index#s24\|s24]] What it shows | ✅ | One Save for everything, adds and deletes too (NEW, or struck through with Undo); a new file uploads at once and is attached on Save; Preview draws the card from the draft. CONTACT AND PRIVATE: email and phone shown or not, and one row to Me › Privacy for birthday, gender and marital status. SOCIALS AND LINKS, FILES AND YOUR OWN FIELDS: **every link, custom field and document I have**, a switch per row; the pencil changes or deletes one (**Switch off here** / **Delete everywhere**). Links and custom fields are **dragged into order** ("Drag to reorder"), sent with Save as each row's `sortOrder` (`c1f152c`, S5). A second LinkedIn or booking page is its own row. A document deleted from the library comes off every Ring first (`c1f152c`). |
| [[Screen Index#s25\|s25]] Social profiles → s24 · *Social profiles* | ✅ | Paste a link (a number for WhatsApp, a handle for X or Instagram): the type is detected, including **booking, Behance, Dribbble, GitHub and YouTube**, now sent as their own type; old labelled links still read. Value errors show under the field. |
| [[Screen Index#s20\|s20]] New Ring step 3 · what it shows | ✅ | The same library, each item off until switched on, and the same Your Pin / Own here / Hidden sheet per field; Copy from another Ring (s28) for the bio or photo (`778d9b4`). |
| [[Screen Index#s36\|s36]] Add to this Ring | ✅ | A field (standard or your own), a link, a file ([[FD-07 Files Upload Frontend Delivery]]). |
| [[Screen Index#s31\|s31]] View as | ✅ | The card the Ring receives, with the nickname, links, custom fields and files that are on. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings/:ringId/projection` | s14, s24, s31, New Ring step 3 (s28's list) | Read again after every save; after an edit or delete that reaches every Ring, every Ring's projection is read again. |
| `PATCH /rings/:ringId/projection` | s24, New Ring (after Create) | Nickname, bio, photo (`avatarFileId`), `headline`, `role`, `company`, `location` (a value, or `null` to follow the Pin) and the `show*` switches, only what changed, sent with s24's Save; an emptied bio is sent as `null` (`5cb24ae`); the read-only `<field>Mode` is read, never sent. A bio or photo copied with s28 in the wizard is sent with the new Ring's projection after Create. |
| `POST / PATCH / DELETE …/projection/links[/:linkId]` | s24, s36, s20 | `PATCH { isVisible }` to switch, `{ sortOrder }` after a drag; a value change reaches every Ring that shows the link. |
| `POST / PATCH / DELETE …/projection/info-blocks[/:blockId]` | s24, s36, s20 | The same for custom fields, `sortOrder` included. |
| `…/projection/attachments` | s24, s36, s20 | [[FD-07 Files Upload Frontend Delivery]]. |

## State kept on the client

- The library is read through the Ring being edited (there is no route for it alone); the draft of s24 lives on the screen until Save.
- A changed item is read again with a short message when the answer differs from what was sent.

## Deviations from the story or the integration note

- **s23 is not a screen any more, and s25 is not a screen of its own** (S3): the photo, bio, nickname and the four profile fields are ABOUT YOU on s24; s25 is the *Social profiles* section of s24. S3 still describes s23 holding the photo, nickname and bio (flagged).
- **s28 is reached from New Ring step 3 only**, not from s24 on an existing Ring (S3 says "Copy a Ring" on the editor).
- **s28 lists only Rings with a bio or photo of their own**: a Ring that follows the Pin has nothing to copy, so it is not offered.
- **The order of links and fields** is sent as the row's `sortOrder`; whether that order is this Ring's own or shared by every Ring showing the link depends on the API (D-03 lists it as open).

## Not done yet

- Widgets (s37) → [[S-20 Widgets Story]]; "Gemma: rewrite" → [[S-89 Gemma AI Story]].

## Log

- 2026-10-21 · `main` @ `bdc8d18` (social_pin) · what each Ring shows and its bio saved to the API; Ring data, View as and the card show the real content · flagged nothing
- 2026-11-03 · `main` @ `4887fcb` · custom fields; s24 redrawn in sections with Preview · flagged nothing
- 2026-11-04 · `main` @ `678e545` · links on a Ring; `ed3a763` a nickname per Ring, "Goes by …" · flagged nothing
- 2026-11-08 · `rings/F-11/honest-rings` @ `461673e` (social_pin, on `main` since 2026-11-24 at `866240a`) · one library of links and fields switched per Ring; Switch off here / Delete everywhere; booking, Behance, Dribbble, GitHub, YouTube as their own types; LK-01…LK-08 · flagged nothing
- 2026-11-09 · `rings/F-11/honest-rings` @ `f801aaa` (social_pin, on `main` since 2026-11-24 at `866240a`) · S10 headline, role, company and location per Ring (follows / own / hidden, Write my own, Inherit, Reset to Pin), their s24 switches, the viewer's cards and View as showing them; S3 Copy from a Ring (s28) for the bio or the photo, real; s24, s28, s31 · the bio's Inherit / Reset to Pin left pending · flagged [[S-17 Ring Projection Story]] (the four rows on s24, not s23; no bio Inherit / Reset to Pin)
- 2026-11-15 · `rings/F-11/honest-rings` @ `5cb24ae`, `c1f152c`, `4350611`, `4aac99d`, `45bd74b`, `778d9b4` (social_pin, on `main` since 2026-11-24 at `866240a`; `dart analyze` 0 errors, `flutter test` 1752 passed) · S3, S4, S5, S10 · s14 with *What they see* and *People · N*; s24 ABOUT YOU with one Your Pin / Own here / Hidden sheet per field (photo, bio, nickname without Hidden), no Reset to Pin; links and fields dragged into order (`sortOrder`); s23 gone as a screen; s28 from New Ring step 3; the bio's pending item cleared · flagged [[S-17 Ring Projection Story]] (S3 still puts the photo, nickname, bio and Copy a Ring on s23)
