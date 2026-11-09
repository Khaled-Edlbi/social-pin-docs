---
id: FD-09
type: frontend-delivery
module: identity
feature: profiles
status: done
scope: feature
deployedTo: []
screens: [s05b, s06, s68]
owner: "Omar Fostok"
depends: ["BI-04 Profiles & Pin Name Backend Integration"]
affects: []
related: ["FR-07 Profiles & Pin Name Frontend Requirements", "S-14 Profiles & Pin Name Story", "D-02 One main profile every Ring starts from", "D-05 Inherit per field, copy without members", "D-06 Yearly rename, old name freed, case-insensitive", "D-22 The public page only says the Pin exists", "FD-04 Account Frontend Delivery", "FD-05 Auth & Sign-up Frontend Delivery", "FD-08 Photo Library Frontend Delivery", "FD-11 Ring Projection Frontend Delivery", "F-10 Ring Projection"]
pending: []
created: 2026-11-06
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Profiles & Pin Name · Frontend Delivery

**Feature:** [[F-07 Profiles & Pin Name]] · **Status:** Done · **Built from:** [[BI-04 Profiles & Pin Name Backend Integration]] · **Against:** [[S-14 Profiles & Pin Name Story]] · **Requirements:** [[FR-07 Profiles & Pin Name Frontend Requirements]] · **QA:** [[Profiles & Pin Name QA Frontend]]

What the client shipped for the main profile, the profile editor, renaming the Pin name and the privacy rows, on `social_pin` `rings/F-11/honest-rings` @ `bf5088d` (2026-11-06), the per-Ring privacy switches, rename chips and copy @ `f9c19e3` and Clear-hides-first @ `0005f00` (2026-11-09), not on `main` yet. Claiming the Pin name at sign-up (s06) shipped with [[FD-05 Auth & Sign-up Frontend Delivery]]; the privacy rows on Me first shipped with [[FD-04 Account Frontend Delivery]]. The QA checklist is PF-01…PF-13 in the client's `docs/TEST_CASES_2026-10-18.md`.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s05b\|s05b]] Profile basics | ✅ | What was typed (headline, company, location, photo) is sent once the account exists, after `complete-registration`; if that fails it is kept on the phone and sent again at the next launch (S9). |
| [[Screen Index#s06\|s06]] Claim your Pin | ✅ | Shipped with [[FD-05 Auth & Sign-up Frontend Delivery]] (S1, S2, S13). |
| Profile editor (from the Me card, [[Screen Index#s68\|s68]]; no screen id) | ✅ | "Your profile": YOU (photo, name, nickname, Pin name), WORK (headline, role, company, location), ABOUT (bio). Each row shows its value ("Add" when empty) and opens a sheet for that one field, with Clear and the error under the field (S3, S10). Under the full name: "The same on every Ring. A Ring with no name of its own shows this one, never your nickname." (S3, `f9c19e3`). |
| Profile editor · Your photo | ✅ | The main photo: pick, take, choose from the library, or remove. Rings without their own photo show it (S10, [[D-02 One main profile every Ring starts from]]). |
| Profile editor · Pin name | ✅ | Live availability, 300 ms after typing stops; suggestion chips built from my own full name, each checked as free before it shows (none while only capitals may change); a rename beyond capitals once a year, with "You can change it again on <date>" from the profile; capitals any time; the full warning: "Your old Pin stops working right away and anyone can claim it. Nothing sends people on to your new name: a badge or link printed with the old one may later lead to someone else." The badge, Me and Home follow the new name (S12, [[D-06 Yearly rename, old name freed, case-insensitive]]; `f9c19e3`). |
| [[Screen Index#s68\|s68]] Me card and Home header | ✅ | The main photo, else the default Ring's, else initials. The card opens the editor. |
| [[Screen Index#s68\|s68]] Me · Privacy | ✅ | Birthdate, gender and marital status; the line under each says which Rings show it, from `GET /profiles/ring-privacy`. A row opens the value and "SHOWN ON": my Rings with a switch each (`PATCH /rings/:ringId/projection { show… }`, the switch shows the answer, not the tap; a field with no value can't be switched on; a Ring gone since is read again) (S4, [[S-17 Ring Projection Story\|Ring Projection · S4]]; `f9c19e3`). **Clear hides first** (S4, decided 2026-11-09; `0005f00`): the sheet says "Clearing it also hides it from every Ring that shows it."; Clear reads `GET /profiles/ring-privacy` again, sends `show…: false` to each Ring that shows the field, one after another, and only then `null` for the value; if a Ring fails, it stops, the value is kept, the Rings already switched off stay off and Me reads the Rings again. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /profiles` | startup, the editor, Me | `data[0]`, the main profile: the six main fields, nickname, the photo's `avatarUrl` (never saved) and `nextPinNameChangeAt`. |
| `PATCH /profiles/:id` | the editor, s05b, Me · Privacy | One field per save; `null` clears. The answer replaces the held profile. Lengths are checked on the phone first; a 400 shows under the field. |
| `GET /profiles/pin-name/:pinName/availability` | Pin name sheet | 300 ms after typing stops (400 ms until `f9c19e3`); each suggestion chip asked once, all at once; not asked when only capitals differ. If the check fails, Save is still allowed: the `PATCH` has the last word (409 `E_PROFILE_02` inline). |
| `POST /files` | the editor's photo, s05b | Then `PATCH /profiles/:id { avatarFileId }` ([[FD-08 Photo Library Frontend Delivery]] for the library). |
| `GET /profiles/ring-privacy` | Me · Privacy, Clear | Which Rings show each private field; read again at Clear (not what Me last showed) and after it. |
| `PATCH /rings/:ringId/projection` | Me · Privacy (a switch per Ring), Clear | `{ showBirthdate \| showGender \| showMaritalStatus }`, one Ring per request; at Clear, `false` on each Ring showing the field, stopping at the first failure, before the value is cleared. |

## State kept on the client

- The main profile in one app-wide holder, read at startup; photo links are never stored.
- The *Profile basics* not yet sent, on the phone, until they are sent; then removed.

## Deviations from the story or the integration note

- **The editor has Me's shape**, rows that each open a one-field sheet, because the design has no screen for it (S3 asks for a design).
- **Only the first profile is edited**: several profiles and choosing the default (S6) are not exposed in the app.
- **A Clear that fails says why, not on the field** (S4 "the field says so"): the reason the Ring's request failed shows as the app's error message over the sheet; the value stays and the row still shows it, but no line under the field says it was kept because a Ring could not be switched off.

## Not done yet

- The public page by Pin name with no sign-in → [[D-22 The public page only says the Pin exists]], not built on either side.

## Log

- 2026-11-06 · `rings/F-11/honest-rings` @ `bf5088d` (social_pin, not on `main` yet) · the main profile read and edited, the profile editor from the Me card, the main photo, Pin rename once a year, *Profile basics* sent after registering, Me · Privacy with Clear and ring-privacy; PF-01…PF-13 · flagged nothing
- 2026-11-09 · `rings/F-11/honest-rings` @ `f9c19e3`, `0005f00` (social_pin, not on `main` yet) · S4 Me privacy rows with the value and a switch per Ring; S4 Clear hides on every Ring first, then sends `null`, the value kept if a Ring fails (decided 2026-11-09); S12 rename suggestion chips from my own name checked as free, 300 ms, the full rename warning; S3 / S10 editor copy (the name's fallback line, "Add"); s68 and the profile editor · the S-14 flag cleared; a Ring's own headline, role, company and location shipped with [[FD-11 Ring Projection Frontend Delivery]] · flagged [[S-14 Profiles & Pin Name Story]] (a failed Clear says why as an error message, not under the field)
