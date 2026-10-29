---
id: S-18
type: story
module: identity
feature: rings
status: approved
scope: feature
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s27, s62]
approvedBy: "Omar Fostok"
approvedAt: 2026-10-29
owner: "Omar Fostok"
related: ["D-04 Ring settings at launch and their defaults", "D-05 Inherit per field, copy without members", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "S-15 Ring Access Engine Story", "S-16 Ring Members Story", "S-17 Ring Projection Story", "S-23 Connections Story", "S-33 Ring Invitations & Join Story", "S-89 Gemma AI Story"]
created: 2026-10-18
updated: 2026-10-29
tags: [story, story/approved, module/identity, layer/business]
---

# Rings · User Story

**Feature:** [[F-11 Rings]] · **Status:** Approved 2026-10-29 by Omar Fostok (first approved 2026-10-25 by khaled; reworked 2026-10-29 by the design review: S1, S2, S3, S4, S5, S6, S7, S9 changed) · **Frontend Requirements:** [[FR-11 Rings Frontend Requirements]] · **Backend Integration:** [[BI-08 Rings Backend Integration]]

A person has one profile and many audiences. A Ring is one audience bound to one perspective: Family, Clients, Company, a temporary Event Ring. The owner creates Rings, names and colours them, gives them a window, picks the default (what a scanned badge or a Pin-name lookup resolves to), and, when a temporary Ring lapses, decides whether to keep it, merge it into another, or let it go. Each Ring has a few settings (who it's for, who can join, approve each request, what members may do), all private by default ([[D-04 Ring settings at launch and their defaults]]). Members see the people who share with them on a separate list, never the owner's roster, and never a Ring's name unless they joined it knowingly ([[D-14 Shared with me lists people, never the Ring]], [[D-18 Ring names shown when joined knowingly]]).

## Persona

A Ring owner on My Rings ([[Screen Index#s16|s16]]), in the create wizard ([[Screen Index#s18|s18]] – [[Screen Index#s21|s21]]), on the edit screens, or on the post-event sheet ([[Screen Index#s62|s62]]); and a member on Shared with me ([[Screen Index#s17|s17]]).

## Stories

### S1 · First Ring ([[Screen Index#s08|s08]], [[Screen Index#s09|s09]])

**As a** new user **I want** to see my default Ring and create a first real one from a template **so that** I learn Rings by doing.

Acceptance criteria:
- [ ] s08 reads `GET /rings`: "Your Pin is live. Right now everyone who scans you sees your **Public Ring**. Add your first real Ring to control the rest." (the default Ring created at registration).
- [ ] s08 offers three **templates**, which only pre-fill s09 (nothing is sent until "Create Ring"):

  | Template | Name | What it shows (on) | Window |
  |---|---|---|---|
  | **Work** (picked by default) | "Work" | Headline, Role & company, Booking link, Email | none |
  | **Events** | "Event" | Headline, Role & company, Email | temporary, ends in 7 days |
  | **Personal** | "Personal" | Phone, the photo | none |

  A field that can't be switched on yet (headline, role & company before [[S-14 Profiles & Pin Name Story|Profiles & Pin Name · S9–S11]]) is left off. "Create my first Ring" → s09; "Take me to the app" → Home, nothing created.
- [ ] s09, top to bottom: **Ring name** (1–24, with chips Clients · Family · Company · Close friends · + Type your own) and "**Only you see this name, unless someone joins it with an invitation or a code.**"; **Colour** (the s18 swatches, colour only; pre-selected: the template's colour, or the first one no other Ring of mine uses); **What this Ring exposes · N of M on** (the s24 rows, [[S-17 Ring Projection Story|Ring Projection · S4]]); **Expiry** (optional: none, 7 days, 30 days, a date; on for Events); **Later** (→ Home) and **Create Ring**.
- [ ] "Create Ring" sends `POST /rings { name, colorHex, isTemporary?, startsAt?, expiresAt? }`, then switches on what was ticked (the projection writes), then continues to the View as teaser (s10).
- [ ] A new Ring animates as a ring forming and taking its place in the carousel.
- [ ] **For the designer:** s09's Colour section is not drawn (between the name and "What this Ring exposes").

### S2 · My Rings ([[Screen Index#s16|s16]])

**As a** Ring owner **I want** my Rings listed with the default first **so that** I can open one and start a new one.

Acceptance criteria:
- [ ] `GET /rings?limit=20&skip=0`, default first then newest; `meta.total` on the "My Rings · N" chip.
- [ ] Each row: name, colour, the purpose or what it shows in a few words ("deck & metrics"), a "DEFAULT" mark on the default, an "EVENT" badge on a temporary Ring with "expires 16 Mar", an "expired" chip computed from `expiresAt` in the past; "**N people**" (not "connections") once counts exist ([[F-03 Counts]]).
- [ ] "+ New" and "Create a Ring" open s18; "Join" opens s74 (not available yet); a row opens s14.
- [ ] No make-default or delete on the list: both are on the Ring's Access screen (S6, S7).

### S3 · Shared with me ([[Screen Index#s17|s17]])

**As a** member **I want** to see everyone who shares with me **so that** I can open the card each of them gave me.

Acceptance criteria:
- [ ] `GET /rings/shared-with-me`, newest first; only access that is live right now; refetched on screen focus because it changes without any action of mine.
- [ ] **One row per person** who shares with me, however I got in ([[D-14 Shared with me lists people, never the Ring]]):
  - a Ring the owner **placed** me in (accepted my request into it, added me, moved me into it): the row is **the person** (their name and photo from the card they share with me); no Ring name, colour or type;
  - a Ring I **joined knowingly** (an invitation I accepted, a code, my verified work email): the row may carry **the Ring's name and who shared it** ("Acme Team · Shared by Acme Studio") ([[D-18 Ring names shown when joined knowingly]]);
  - several Rings from one person: one row, the version from the Ring I was put in first ([[D-15 Several Rings per connection, remove or disconnect]]).
- [ ] A **member count** ("· N people") only on a named-Ring row, and only when that Ring's "members can see each other" is on; never on a person row ([[S-15 Ring Access Engine Story|Ring Access Engine · S1]]).
- [ ] Tapping a row opens the person's card (`GET /views/ring/:id`), never the owner's Ring data (s14); it never shows a roster or my own membership row.
- [ ] Not available yet: the endpoint returns the Ring's name, colour and type to every member today and does not know how a membership was created; **until it does, every row is shown as the person, with no Ring name and no count**.
- [ ] "Review invite" and "Join with a code" are shown disabled until invitations exist ([[S-33 Ring Invitations & Join Story]]); an invitation names its Ring (D-18).
- [ ] Empty state: "Nothing shared with you yet".

### S4 · New Ring wizard ([[Screen Index#s18|s18]] → [[Screen Index#s21|s21]])

**As a** Ring owner **I want** a four-step wizard, name → who is in it → what it shows → how you appear, **so that** a Ring is complete when I tap Create.

Acceptance criteria:
- [ ] **Step 1 · Name it (s18):**
  - **Ring name**, 1–24 characters in the app (the counter reads /24; the server allows up to 80), unique per owner (409 `E_RING_01` inline), with suggestion chips; "Gemma: suggest" is [[S-89 Gemma AI Story]]'s and not shown until Gemma is built.
  - **Colour & icon**: `colorHex`; the icon is kept in `style` (the backend stores it as-is). "Only you see it — it tells your Rings apart at a glance."
  - **Who is it for**: the purpose (S5, S9).
  - **Start from**: **Blank Ring** (default); **Copy an existing Ring** (pick one of mine; the new Ring gets its settings, what it shows, bio, photo and colour, **never its members**, [[D-05 Inherit per field, copy without members]]; not available yet: no copy endpoint, shown disabled with "coming soon"); **Event Ring** (a temporary Ring: picking it shows start and end date-time pickers, end required).
  - **No type picker**: every Ring made here is `PERSONAL` (an Event Ring is `PERSONAL` with `isTemporary`; the `EVENT` type is only for Rings an event creates, [[F-21 Event Ring Auto-creation]]; a `CORPORATE` Ring is made through [[F-15 Companies]]).
  - "Next · who is in it" calls `POST /rings { name, colorHex, style?, isTemporary?, startsAt?, expiresAt? }` so later steps have a Ring to write to.
- [ ] **Step 2 · Who is in it (s19):** search my connections; picked people show as chips (× to unpick); filters **All** and **No Ring yet** (connections in none of my Rings); each picked person is added with `POST /rings/:ringId/members { userId }` (placed by me, never told the Ring's name, D-18). "Met this month" is later (no "last met" date); "Suggested by Gemma" is hidden until Gemma; "Invite" is [[S-33 Ring Invitations & Join Story]]'s (disabled until invitations exist). "You can create the Ring empty and add people later by scanning them in." The step can be skipped. Not available yet: my connections list ([[S-23 Connections Story|Connections · S19–S24]]); until it exists the step shows only that sentence and Next.
- [ ] **Step 3 · What it shows (s20):** [[S-17 Ring Projection Story|Ring Projection · S2]].
- [ ] **Step 4 · How you appear (s21):** photo and bio ([[S-17 Ring Projection Story|Ring Projection · S3]]); **Access**: Expiry, Who can request to join, Members see each other (three of S9's settings, with their defaults; the rest keep their defaults and are changed on s26 / s27); **Summary**: People N added, Exposes N fields · N socials, Photo & bio Inherited / Own. "Create Ring" lands on s14.
- [ ] Cancel deletes the Ring created in step 1.
- [ ] **For the designer:** the start / end pickers under "Event Ring" on s18 are not drawn.

### S5 · Edit name & purpose ([[Screen Index#s22|s22]])

**As a** Ring owner **I want** to rename and recolour a Ring and say who it's for **so that** the carousel stays legible.

Acceptance criteria:
- [ ] `PATCH /rings/:id { name?, colorHex?, style? }`; name 1–24 in the app; Save returns to s14 and the Ring re-composes with the new header.
- [ ] Under the name: "**Only you see this name, unless someone joins it with an invitation or a code.**"
- [ ] **Who this Ring is for**: a short description, a few words or a sentence ("People who hire or brief me. Sees work identity only."); "Gemma: rewrite" hidden until Gemma. Not available yet: shown as a placeholder until the setting exists (S9).

### S6 · Edit access and expiry ([[Screen Index#s26|s26]])

**As a** Ring owner **I want** to set when a Ring starts and ends, choose my default and delete a Ring **so that** an audience is time-boxed when it should be.

Acceptance criteria:
- [ ] `PATCH /rings/:id { startsAt?, expiresAt?, isTemporary? }`; `null` clears a bound; the copy explains expiry applies to every member at that instant.
- [ ] An expired Ring remains editable here; its members cannot read it.
- [ ] **Make this my default Ring** (S7) is a row on this screen.
- [ ] "Delete Ring" behind a confirmation ("Deleting removes the Ring for everyone in it. The connections stay in your contacts."); `DELETE /rings/:id`; on the default Ring it's disabled with "Choose another default first" (409 `E_RING_04`).
- [ ] Settings and Permissions (s27) are S9; delegated admins are [[S-31 Delegated Admins Story|Delegated Admins · S6]].

### S7 · Make a Ring the default ([[Screen Index#s26|s26]])

**As a** Ring owner **I want** to choose which Ring strangers get **so that** a scanned badge resolves to the right me.

Acceptance criteria:
- [ ] On s26 of a Ring that isn't the default: "**Make this my default Ring**", with "This is what someone sees when they scan you and they're in no other Ring of yours." Tapping it confirms ("Strangers who scan you will see <Ring> instead of <current default>."), then `POST /rings/:id/default`; the previous default is demoted in the same transaction.
- [ ] On the default Ring: "**This is your default Ring**", with the same sentence and no action.
- [ ] **A temporary Ring can't be the default**: the row is disabled with "A temporary Ring can't be your default." The app checks `isTemporary`; not available yet: the backend doesn't refuse it.
- [ ] s16 keeps the "DEFAULT" mark; there's no make-default action on the list.
- [ ] **For the designer:** the row, its confirmation and its "This is your default Ring" state are not drawn.

### S8 · After the event: keep, merge or let it go ([[Screen Index#s62|s62]])

**As a** Ring owner **I want** an explicit choice when a temporary Ring lapses **so that** event contacts end up where I want them.

Acceptance criteria:
- [ ] The sheet appears when `isTemporary`, `disposition === "UNDECIDED"` and `expiresAt` is past.
- [ ] `POST /rings/:id/disposition { disposition, mergedIntoRingId? }`: KEEP makes it permanent; MERGE needs a picker of my other Rings and moves every active member with their window; AUTO_DELETE archives it and expires it now, with "You can still change your mind until it is purged".
- [ ] Motion: keep stays, merge shows two Rings combining, delete collapses out.
- [ ] The preview on this sheet must not use `GET /views/ring/:id`, which is a 404 for an expired Ring.

### S9 · Ring settings ([[Screen Index#s19|s19]], [[Screen Index#s21|s21]], [[Screen Index#s26|s26]], [[Screen Index#s27|s27]])

**As a** Ring owner **I want** a short list of settings with safe defaults **so that** a Ring is private until I open it up ([[D-04 Ring settings at launch and their defaults]]).

Acceptance criteria:
- [ ] Six settings at launch, with these defaults on a new Ring: **who it's for** (a short description, empty), **who can request to join** (D-04's three choices: **anyone who scans**, **only with a code**, **only invited**; default **only with a code or by invitation**; not "Contacts of members"), **approve each one** (on; off means auto-accept), **members can see each other** (off), **members can invite others** (off), **members can save attachments** (off).
- [ ] The wizard's step 4 (s21) shows three of them (Expiry, Who can request to join, Members see each other); all six are on s26 / s27.
- [ ] When "members can see each other" is on, members see each other's **full cards**, not just names; while it is off, only the owner sees who is in the Ring ([[S-16 Ring Members Story|Ring Members · S8]]).
- [ ] **The owner and the Ring's admins** can change the settings ([[S-31 Delegated Admins Story]]); a member cannot.
- [ ] **Not shown in v1** (no switch that saves nothing): required work email domain (comes with [[F-15 Companies]]), members can message me (comes with messaging), see when I'm at an event (comes with events).
- [ ] The engine enforces them ([[S-15 Ring Access Engine Story|Ring Access Engine · S8]]).
- [ ] Not available yet: none of these settings exist on a Ring.

## States and motion the design asks for

- State: default mark, temporary / EVENT badge, expired chip, archived, disposition pending, empty lists, read-only (403), name clash, template picked, "coming soon" on Copy a Ring, temporary Ring can't be default.
- Motion: a new Ring forms and takes its place in the carousel; deleting collapses it out; switching Rings re-composes the profile; the lifecycle choice animates keep / merge / delete. Reduced motion: fades.

## Rules the backend already enforces

- `POST /rings` defaults to `PERSONAL`, rejects `EVENT` / `MINI_EVENT` / `MEETING` (400 `E_RING_01`), checks the per-owner name clash in one transaction (409 `E_RING_01`), names up to 80 characters, requires `parentRingId` / `profileId` to be the caller's (400 `E_RING_06` / `E_RING_08`), falls back to the default profile; `style` is stored as-is.
- `GET /rings` filters `name`, `type`, `status`, `isTemporary` (`false` is a real filter), default first then newest; `GET /rings/shared-with-me` applies both live filters, newest first.
- `PATCH /rings/:id` passes `assertCanAdminister(…, 'CONTENT_MANAGER')`, which ignores expiry, so an expired Ring stays editable.
- One default per owner (partial unique index); `POST …/default` demotes then promotes in one transaction; `DELETE` refuses the default (409 `E_RING_04`) and is a soft delete.
- Disposition runs `UNDECIDED → KEEP | MERGE | AUTO_DELETE`; MERGE needs a Ring of the same owner (400 `E_RING_07`), reactivates lapsed rows in the target, archives the source with `mergedIntoRingId`; AUTO_DELETE archives and sets `expiresAt` to now, leaving the purge to a job that is not written.
- `RING_STATUS.EXPIRED` is never written; expiry is evaluated live.

## Open questions

- Decided: [[D-04 Ring settings at launch and their defaults]] (S9, built in this story), [[D-05 Inherit per field, copy without members]] (Copy a Ring, S4; needs a copy endpoint), [[D-14 Shared with me lists people, never the Ring]] and [[D-18 Ring names shown when joined knowingly]] (S3; the membership's origin is [[S-15 Ring Access Engine Story|Ring Access Engine · S1]]).
- Whose card a member sees when members can see each other; whether an admin may change every setting (D-04, *Still open*).
- Whether a copied Ring's fields keep following the Pin where the source Ring followed it (D-05, *Still open*).
- The default Ring created at registration is called "**Public**" in the design (s08, s16); to confirm with the backend what name registration gives it.
