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
pending: ["[[S-17 Ring Projection Story]]: S3 / S10 the bio's Inherit and Reset to Pin on a Ring (the bio field edits the Ring's own bio only)"]
created: 2026-11-08
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Ring Projection · Frontend Delivery

**Feature:** [[F-10 Ring Projection]] · **Status:** Done · **Built from:** [[BI-07 Ring Projection Backend Integration]] · **Against:** [[S-17 Ring Projection Story]] · **Requirements:** [[FR-10 Ring Projection Frontend Requirements]] · **QA:** [[Ring Projection QA Frontend]]

What the client shipped for what each Ring shows. On `social_pin` `main`: what a Ring shows saved to the API (`bdc8d18`, 2026-10-21), custom fields and s24 redrawn (`4887fcb`), links (`678e545`), a nickname per Ring (`ed3a763`). On `rings/F-11/honest-rings` @ `461673e` (2026-11-08), not on `main` yet: one library of links and fields switched per Ring, and five new link types; @ `f801aaa` (2026-11-09): headline, role, company and location per Ring, and Copy from a Ring. The files on a Ring are in [[FD-07 Files Upload Frontend Delivery]], its photo in [[FD-08 Photo Library Frontend Delivery]]. The QA checklist for the library is LK-01…LK-08 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s14\|s14]] Ring data | ✅ | The Ring's real content from its projection, only what is on: fields, links, custom fields, files, bio, nickname ("Goes by …"). |
| [[Screen Index#s23\|s23]] How you appear → Edit Ring · *Appear* | 🟡 | One Edit Ring screen: the nickname (cleared with `null`, so the card falls back to the profile), the bio, the photo row to [[Screen Index#s29\|s29]] and "Copy from another Ring" to s28. Headline, role, company and location per Ring are on s24's *How you appear in <Ring>* section (see the next rows). The bio has no Inherit or Reset to Pin (*Not done yet*). |
| [[Screen Index#s28\|s28]] Copy from a Ring | ✅ | `f801aaa`: my other Rings that have a bio or a photo **of their own** (one that follows the Pin has nothing to copy), a Bio / Photo choice, a preview ("<Ring> would read / would show"), "Use this bio" / "Use this photo", "A snapshot: later changes to either Ring stay apart."; saved with `PATCH /rings/:ringId/projection { bio \| avatarFileId }` on this Ring; empty: "None of your other Rings has a bio or photo of its own yet." (S3, [[D-05 Inherit per field, copy without members]]). |
| [[Screen Index#s24\|s24]] · *How you appear in <Ring>* | ✅ | `f801aaa`, S10: headline, role, company and location, each with the value the Ring shows and its state, "Follows your Pin", "Own for <Ring>" or "Hidden in <Ring>. Switch it on under About you to show it."; tapping opens a sheet ("Your Pin says …") with **Write my own** (trimmed, never blank, within 120 / 80 / 120 / 120) and **Inherit from your Pin**, or **Reset to Pin** when it has its own; "Inherit stays in sync with your Pin. Copy takes a snapshot." The switches are in About you: headline and location their own, role and company with Company & role. View as and the viewer's cards show the four as resolved (S8). |
| [[Screen Index#s24\|s24]] What it shows | ✅ | Sections About you, Contact, Files, Your own fields, Social profiles. **Every link and custom field I have** is listed, switched on or off for this Ring (`isVisible`), nothing copied; "N of M on" counts the library. Editing or deleting asks **Switch off here** or **Delete everywhere**; every Ring is read again after. Save counts the changes; Preview draws the card before saving. |
| [[Screen Index#s25\|s25]] Social profiles → s24 · *Social profiles* | ✅ | Paste a link (a number for WhatsApp, a handle for X or Instagram): the type is detected, including **booking, Behance, Dribbble, GitHub and YouTube**, now sent as their own type; old labelled links still read. Value errors show under the field. |
| [[Screen Index#s20\|s20]] New Ring · what it shows | ✅ | The same library, each item off until switched on. |
| [[Screen Index#s36\|s36]] Add to this Ring | ✅ | A field (standard or your own), a link, a file ([[FD-07 Files Upload Frontend Delivery]]). |
| [[Screen Index#s31\|s31]] View as | ✅ | The card the Ring receives, with the nickname, links, custom fields and files that are on. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings/:ringId/projection` | s14, s24, s31, Edit Ring | Read again after every save; after an edit or delete that reaches every Ring, every Ring's projection is read again. |
| `PATCH /rings/:ringId/projection` | Edit Ring, s24, s28 | Nickname, bio, photo (`avatarFileId`) and the `show*` switches, only what changed, `null` to clear; from `f801aaa` also `headline`, `role`, `company`, `location` (a value, or `null` to follow the Pin) and `showHeadline`, `showRole`, `showCompany`, `showLocation`, sent with s24's Save; the read-only `<field>Mode` is read, never sent. s28 sends the copied `bio` or `avatarFileId` once. |
| `POST / PATCH / DELETE …/projection/links[/:linkId]` | s24, s36, s20 | `PATCH { isVisible }` to switch; a value change reaches every Ring that shows the link. |
| `POST / PATCH / DELETE …/projection/info-blocks[/:blockId]` | s24, s36, s20 | The same for custom fields. |
| `…/projection/attachments` | s24, s36, s20 | [[FD-07 Files Upload Frontend Delivery]]. |

## State kept on the client

- The library is read through the Ring being edited (there is no route for it alone); the draft of s24 lives on the screen until Save.
- A changed item is read again with a short message when the answer differs from what was sent.

## Deviations from the story or the integration note

- **s23 and s25 are not screens of their own**: s23 is the *Appear* section of the one Edit Ring screen (nickname, bio, photo), s25 is the *Social profiles* section of s24.
- **No reordering of links** on a Ring (S5's `sortOrder`): each Ring keeps the order the API sends.
- **The four per-field rows are on s24, not s23** (S3, S10): *How you appear in <Ring>* is a section of What it shows, below About you where their switches are, and is saved with s24's Save; s23 (the Edit Ring screen) keeps the nickname, the bio and the photo.
- **s28 lists only Rings with a bio or photo of their own**: a Ring that follows the Pin has nothing to copy, so it is not offered.

## Not done yet

- The bio's **Inherit** and **Reset to Pin** on a Ring (S3, S10): the bio field edits this Ring's own bio, with no way to follow the Pin again from the app. The photo's Reset to Pin shipped in [[FD-08 Photo Library Frontend Delivery]].
- Widgets (s37) → [[S-20 Widgets Story]]; "Gemma: rewrite" → [[S-89 Gemma AI Story]].

## Log

- 2026-10-21 · `main` @ `bdc8d18` (social_pin) · what each Ring shows and its bio saved to the API; Ring data, View as and the card show the real content · flagged nothing
- 2026-11-03 · `main` @ `4887fcb` · custom fields; s24 redrawn in sections with Preview · flagged nothing
- 2026-11-04 · `main` @ `678e545` · links on a Ring; `ed3a763` a nickname per Ring, "Goes by …" · flagged nothing
- 2026-11-08 · `rings/F-11/honest-rings` @ `461673e` (social_pin, not on `main` yet) · one library of links and fields switched per Ring; Switch off here / Delete everywhere; booking, Behance, Dribbble, GitHub, YouTube as their own types; LK-01…LK-08 · flagged nothing
- 2026-11-09 · `rings/F-11/honest-rings` @ `f801aaa` (social_pin, not on `main` yet) · S10 headline, role, company and location per Ring (follows / own / hidden, Write my own, Inherit, Reset to Pin), their s24 switches, the viewer's cards and View as showing them; S3 Copy from a Ring (s28) for the bio or the photo, real; s24, s28, s31 · the bio's Inherit / Reset to Pin left pending · flagged [[S-17 Ring Projection Story]] (the four rows on s24, not s23; no bio Inherit / Reset to Pin)
