---
id: FD-11
type: frontend-delivery
module: identity
feature: ring-projection
status: done
scope: feature
deployedTo: []
screens: [s14, s20, s23, s24, s25, s29, s31, s36]
owner: "Omar Fostok"
depends: ["BI-07 Ring Projection Backend Integration"]
affects: []
related: ["FR-10 Ring Projection Frontend Requirements", "S-17 Ring Projection Story", "D-03 Links entered once, switched on or off per Ring", "D-05 Inherit per field, copy without members", "FD-07 Files Upload Frontend Delivery", "FD-08 Photo Library Frontend Delivery", "FD-09 Profiles & Pin Name Frontend Delivery", "S-20 Widgets Story", "S-89 Gemma AI Story"]
pending: []
created: 2026-11-08
updated: 2026-11-08
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Ring Projection · Frontend Delivery

**Feature:** [[F-10 Ring Projection]] · **Status:** Done · **Built from:** [[BI-07 Ring Projection Backend Integration]] · **Against:** [[S-17 Ring Projection Story]] · **Requirements:** [[FR-10 Ring Projection Frontend Requirements]] · **QA:** [[Ring Projection QA Frontend]]

What the client shipped for what each Ring shows. On `social_pin` `main`: what a Ring shows saved to the API (`bdc8d18`, 2026-10-21), custom fields and s24 redrawn (`4887fcb`), links (`678e545`), a nickname per Ring (`ed3a763`). On `rings/F-11/honest-rings` @ `461673e` (2026-11-08), not on `main` yet: one library of links and fields switched per Ring, and five new link types. The files on a Ring are in [[FD-07 Files Upload Frontend Delivery]], its photo in [[FD-08 Photo Library Frontend Delivery]]. The QA checklist for the library is LK-01…LK-08 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s14\|s14]] Ring data | ✅ | The Ring's real content from its projection, only what is on: fields, links, custom fields, files, bio, nickname ("Goes by …"). |
| [[Screen Index#s23\|s23]] How you appear → Edit Ring · *Appear* | 🟡 | One Edit Ring screen: the nickname (cleared with `null`, so the card falls back to the profile), the bio, and the photo row to [[Screen Index#s29\|s29]]. Headline, role, company and location per Ring are not here (see *Not done yet*). |
| [[Screen Index#s24\|s24]] What it shows | ✅ | Sections About you, Contact, Files, Your own fields, Social profiles. **Every link and custom field I have** is listed, switched on or off for this Ring (`isVisible`), nothing copied; "N of M on" counts the library. Editing or deleting asks **Switch off here** or **Delete everywhere**; every Ring is read again after. Save counts the changes; Preview draws the card before saving. |
| [[Screen Index#s25\|s25]] Social profiles → s24 · *Social profiles* | ✅ | Paste a link (a number for WhatsApp, a handle for X or Instagram): the type is detected, including **booking, Behance, Dribbble, GitHub and YouTube**, now sent as their own type; old labelled links still read. Value errors show under the field. |
| [[Screen Index#s20\|s20]] New Ring · what it shows | ✅ | The same library, each item off until switched on. |
| [[Screen Index#s36\|s36]] Add to this Ring | ✅ | A field (standard or your own), a link, a file ([[FD-07 Files Upload Frontend Delivery]]). |
| [[Screen Index#s31\|s31]] View as | ✅ | The card the Ring receives, with the nickname, links, custom fields and files that are on. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings/:ringId/projection` | s14, s24, s31, Edit Ring | Read again after every save; after an edit or delete that reaches every Ring, every Ring's projection is read again. |
| `PATCH /rings/:ringId/projection` | Edit Ring, s24 | Nickname, bio, photo (`avatarFileId`) and the `show*` switches, only what changed, `null` to clear. |
| `POST / PATCH / DELETE …/projection/links[/:linkId]` | s24, s36, s20 | `PATCH { isVisible }` to switch; a value change reaches every Ring that shows the link. |
| `POST / PATCH / DELETE …/projection/info-blocks[/:blockId]` | s24, s36, s20 | The same for custom fields. |
| `…/projection/attachments` | s24, s36, s20 | [[FD-07 Files Upload Frontend Delivery]]. |

## State kept on the client

- The library is read through the Ring being edited (there is no route for it alone); the draft of s24 lives on the screen until Save.
- A changed item is read again with a short message when the answer differs from what was sent.

## Deviations from the story or the integration note

- **s23 and s25 are not screens of their own**: s23 is the *Appear* section of the one Edit Ring screen (nickname, bio, photo), s25 is the *Social profiles* section of s24.
- **No reordering of links** on a Ring (S5's `sortOrder`): each Ring keeps the order the API sends.
- **Copy a Ring's photo and bio (s28)** is not offered (S3).

## Not done yet

- Per field, per Ring: off / follows the Pin / own value for headline, role, company and location, and "Reset to Pin" for the photo and the bio → [[S-17 Ring Projection Story|Ring Projection · S10]] ([[D-05 Inherit per field, copy without members]]); [[BD-10 Ring Projection Backend Delivery]] keeps it pending.
- Widgets (s37) → [[S-20 Widgets Story]]; "Gemma: rewrite" → [[S-89 Gemma AI Story]].

## Log

- 2026-10-21 · `main` @ `bdc8d18` (social_pin) · what each Ring shows and its bio saved to the API; Ring data, View as and the card show the real content · flagged nothing
- 2026-11-03 · `main` @ `4887fcb` · custom fields; s24 redrawn in sections with Preview · flagged nothing
- 2026-11-04 · `main` @ `678e545` · links on a Ring; `ed3a763` a nickname per Ring, "Goes by …" · flagged nothing
- 2026-11-08 · `rings/F-11/honest-rings` @ `461673e` (social_pin, not on `main` yet) · one library of links and fields switched per Ring; Switch off here / Delete everywhere; booking, Behance, Dribbble, GitHub, YouTube as their own types; LK-01…LK-08 · flagged nothing
