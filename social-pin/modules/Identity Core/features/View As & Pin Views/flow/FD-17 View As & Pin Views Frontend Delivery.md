---
id: FD-17
type: frontend-delivery
module: identity
feature: view-as
status: done
scope: feature
deployedTo: []
screens: [s10, s31, s44, s62, s17, s47]
owner: "Omar Fostok"
depends: ["BI-09 View As & Pin Views Backend Integration"]
affects: []
related: ["FR-12 View As & Pin Views Frontend Requirements", "S-19 View As & Pin Views Story", "BD-12 View As & Pin Views Backend Delivery", "BI-15 Badge & QR Backend Integration", "BI-07 Ring Projection Backend Integration", "FD-14 Ring Members Frontend Delivery", "D-15 Several Rings per connection, remove or disconnect", "D-16 Files load from signed links that expire in 15 minutes", "D-18 Ring names shown when joined knowingly", "S-20 Widgets Story", "S-37 Badge & QR Story", "GET /views/ring/:ringId", "GET /views/pin/:pinName", "GET /views/user/:userId/perspectives", "GET /views/qr/:token", "GET /rings", "GET /rings/:ringId/projection", "GET /connections"]
pending: ["[[S-19 View As & Pin Views Story]]: S3 each file's size beside its name (the view carries sizeBytes; the card shows the name only)", "[[S-19 View As & Pin Views Story]]: S2 Save contact and Connect drawn disabled on the audience face of s31", "[[S-19 View As & Pin Views Story]]: S6 View as on s14 offered on live Rings only (today an expired Ring opens it and reads This Ring has expired)", "[[S-19 View As & Pin Views Story]]: S7 the nickname as the contact's nickname", "[[S-20 Widgets Story]]: S7 the view's widgets drawn on the card (read, not drawn)"]
created: 2026-11-09
updated: 2026-11-09
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ View As & Pin Views · Frontend Delivery

**Feature:** [[F-12 View As & Pin Views]] · **Status:** Done · **Built from:** [[BI-09 View As & Pin Views Backend Integration]] · **Against:** [[S-19 View As & Pin Views Story]] · **Requirements:** [[FR-12 View As & Pin Views Frontend Requirements]] · **QA:** [[View As & Pin Views QA Frontend]]

What the client shipped for View as and the cards of other people, on `social_pin` `rings/F-11/honest-rings` @ `0005f00` (2026-11-09), with `f801aaa` (View as from the view, perspectives) and `dde0533` (s10 from the real view, samples removed); not on `main` yet. Built against backend `main` `d8267d3` (D-15's order, [[BD-12 View As & Pin Views Backend Delivery|BD-12]]). One card component, `RingViewCard`, draws every view: s31's audience face, the Person card (Shared with me, Connection detail, a Pin name) and s44. Unit and widget tests, plus a Maestro subflow for Save contact; not yet tried on a device.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s31\|s31]] View as, audience face | ✅ | "SEEN BY <RING>": `GET /views/ring/:ringId` with my own Ring id, read fresh on open, on every chip and on return from s24; "Preview: exactly what people in <Ring> get." The card as a member gets it: photo from `avatarUrl` over the initials, the name (`displayName`, else the Pin name), the headline, then role · company, then location (each only when shared), `!pinName`, "Goes by <nickname>" when set, the bio, then the shared rows: email, phone, birthdate, gender, marital status (only when not `null`), each link, each custom field, and **each file as its own row, opening on tap** (S2, S3). States: loading, shown, **expired** (404 `E_RING_ACCESS_02`, or a bare 404: "This Ring has expired"), failed + Try again, no Rings. Chips: my live Rings, plus the one opened when it isn't live. |
| s31 owner face | ✅ | "YOUR VIEW · OWNER": "All N fields · N Rings · N connections"; the chip's Ring **FIELDS** n/m, **SOCIALS** n/m, **BIO** Own / Inherited; **where each goes**, grouped About / Links / Custom fields / Files: every profile field (the name always "Every Ring"), every link and custom field of the library and every file, each with "Every Ring", a list ("Clients, Company"), "<Ring> only" or "Hidden"; what reaches no one is drawn without the brand. A row or **Edit what <Ring> sees** opens s24 for that Ring; back, the view is read again. Worked out on the phone from my Rings' projections (each item's `isVisible` per Ring, BD-10) and the connections count (S2). |
| [[Screen Index#s10\|s10]] View as teaser | ✅ | The new Ring's real `GET /views/ring/:ringId`, read once Create Ring has set up what it shows, on the same card, flipping to my side; the picker offers the new Ring and my default Ring; Got it → Home (S1). |
| Person card (from [[Screen Index#s17\|s17]], [[Screen Index#s47\|s47]], a Pin name) | ✅ | By Pin name `GET /views/pin/:pinName` (typed on the scanner; my own Pin name opens View as on my default Ring, S4); by user id from s47 and Requests `GET /views/user/:userId/perspectives`, a switcher **View 1 / View 2** by position, View 1 the Ring I was put in first (D-15, S5); a Shared with me row opens by Ring and, when the person is a connection holding several views for me, offers the same switch (the row's Ring first). "Nothing shared with you" for an empty array; one "This profile isn't available to you" for any 404. Read again when the app returns to the foreground. |
| [[Screen Index#s44\|s44]] Scanned Pin | ✅ | The card from `GET /views/qr/:token` ([[BI-15 Badge & QR Backend Integration\|BI-15]], F-18) on the same `RingViewCard`; the cards' S3 top and rows as above. |
| s44 and Person card · **Save contact** | ✅ | Beside *Save for later*, only when the card shares a phone number (S7, 2026-11-09). Opens the phone's own new-contact editor pre-filled with only what the card shows: name (split at the first space), phone and email (plus phone and email links), company and role (else the headline) as organisation and job title, web links as URLs (a WhatsApp link as `wa.me`), the photo read from `avatarUrl` within 4 s; never the Ring or an id. On the Person card, only the view that shares a phone offers it. No editor: a short message. |
| [[Screen Index#s62\|s62]] Post-event | ✅ | Calls no `/views/*` route (S6). |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /views/ring/:ringId` | s31, s10, Person card from a Shared with me row | Fresh on every open, chip, return and foreground; a slow answer for an earlier chip is dropped. 404 `E_RING_ACCESS_02` (or no code) is "expired" on View as only. |
| `GET /views/pin/:pinName` | Person card by Pin name | Sent without the `!`, URL-encoded. |
| `GET /views/user/:userId/perspectives` | Person card from s47 and Requests; a Shared with me row whose person is a connection | Indexed by position; a `{ data: [...] }` wrapper reads the same; `[]` is "Nothing shared with you". |
| `GET /views/qr/:token` | s44 | F-18's; the token is redacted in debug logs. |
| `GET /rings`, `GET /rings/:ringId/projection` | s31 chips and owner face | My Rings and their projections, as loaded app-wide. |
| `GET /connections` | Shared with me row → perspectives | Finds the person's user id by the card's Pin name; quiet when it fails. |
| a view's `avatarUrl`, `attachments[].url` | every card | Signed links (D-16), loaded with no bearer token; a file opens from its link while the read is under 15 minutes old, else from a fresh read; a photo that fails reads the view again once. |

## State kept on the client

- **No view is cached**: every card is read from the server on open and again on return or foreground. The read time is kept only to tell whether a file link is still fresh (15 minutes).
- On the Person card, the versions read last and which one is shown (a position); a version gone on a re-read falls back to View 1.
- The owner face is computed from my Rings' projections each time they load or are saved; nothing of it is stored.
- The user id found by Pin name for a Shared with me row, until the card closes.

## Deviations from the story or the integration note

- **Save contact asks for no contacts permission** (S7 asks for one): the app never writes a contact; the system's new-contact editor needs none on Android or iOS, so there is no permission screen and no "denied" state. On Android the pre-filled photo isn't shown (it would need `WRITE_CONTACTS`).
- **The audience face of s31 has no Save contact or Connect** (S2 asks for both, disabled): it is the members' `RingViewCard` with a preview note. Pending.
- **A file row shows its name, not its size** (S3: name and size). Pending.
- **View as opens on an expired Ring from s14** and reads "This Ring has expired" (S6: offered only on live Rings); the chips list live Rings only. Pending.
- **The contact carries no nickname** (S7: the nickname as the contact's nickname). Pending.
- **s10 stands in a card from sign-up** when the new Ring's view is slow or unreadable (only what sign-up asked for, said to be a preview), swapped for the real one when it arrives; my default Ring unreadable is a message and Try again, never a made-up card.
- A Person card opened from a Ring I **joined knowingly** names that Ring ([[D-18 Ring names shown when joined knowingly|D-18]]); the switcher itself never does.

## Not done yet

- File sizes on the card → [[S-19 View As & Pin Views Story]] S3.
- Disabled Save contact and Connect on s31's audience face → S2.
- View as offered on live Rings only → S6.
- The nickname on the saved contact → S7.
- Widgets on the card: read from the view, not drawn → [[S-20 Widgets Story|Widgets · S7]].

## Log

- 2026-11-09 · `rings/F-11/honest-rings` @ `0005f00` (with `f801aaa`, `dde0533`; social_pin, not on `main` yet) · S1 s10 from the new Ring's view; S2 s31 from `GET /views/ring` with the owner face listing every field, link, custom field and file per Ring, counts, expired state; S3/S4/S5 viewer cards with headline / role / company / location, each file its own row opening on tap, the perspectives switcher on the Person card, Connection detail and Shared with me rows; S6 s62 calls no view; S7 Save contact beside Save for later when a phone is shared · tests: `view_as_test`, `view_as_back_test`, `view_as_files_test`, `view_as_step_test`, `view_as_step_screen_test`, `perspectives_test`, `perspectives_screen_test`, `shared_with_me_test`, `save_contact_test` · flagged [[S-19 View As & Pin Views Story]] (deviations); cleared the settled flags on [[FR-12 View As & Pin Views Frontend Requirements]]
