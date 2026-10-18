---
type: story
code: rings
scope: feature
feature: rings
module: identity
status: draft
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62]
updated: 2026-10-18
tags: [story, story/draft, module/identity, layer/business]
---

# Rings · User Story

**Feature:** [[Rings]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Rings Frontend Requirements]] · **Backend Integration:** [[Rings Backend Integration]]

A person has one profile and many audiences. A Ring is one audience bound to one perspective: Family, Clients, Company, a temporary Event Ring. The owner creates Rings, names and colours them, gives them a window, picks the default (what a scanned badge or a Pin-name lookup resolves to), and, when a temporary Ring lapses, decides whether to keep it, merge it into another, or let it go. Members see the Rings shared with them on a separate list and never the owner's roster.

## Persona

A Ring owner on My Rings ([[Screen Index#s16|s16]]), in the create wizard ([[Screen Index#s18|s18]] – [[Screen Index#s21|s21]]), on the edit screens, or on the post-event sheet ([[Screen Index#s62|s62]]); and a member on Shared with me ([[Screen Index#s17|s17]]).

## Stories

### S1 · First Ring ([[Screen Index#s08|s08]], [[Screen Index#s09|s09]])

**As a** new user **I want** to see my default Ring and optionally create a second one in onboarding **so that** I learn Rings by doing.

Acceptance criteria:
- [ ] s08 reads `GET /rings` and shows the default Ring created at registration; "Take me to the app" goes to Home with it active.
- [ ] s09 offers suggested names (Family / Clients / Company) and a colour; "Create Ring" calls `POST /rings { name, colorHex }` and continues to the View as teaser (s10); "Later" goes to Home.
- [ ] A new Ring animates as a ring forming and taking its place in the carousel.

### S2 · My Rings ([[Screen Index#s16|s16]])

**As a** Ring owner **I want** my Rings listed with the default first **so that** I can open, reorder my attention and start a new one.

Acceptance criteria:
- [ ] `GET /rings?limit=20&skip=0`, default first then newest; `meta.total` on the "My Rings · N" chip.
- [ ] Each row: name, colour, type, temporary badge from `isTemporary`, an "expired" chip computed from `expiresAt` in the past, a default star; "N people" absent until counts exist.
- [ ] "+ New" and "Create a Ring" open s18; "Join" opens s74 (not available yet); a row opens s14.
- [ ] Make default and delete are row actions; delete is disabled on the default with "Choose another default first".

### S3 · Shared with me ([[Screen Index#s17|s17]])

**As a** member **I want** to see the Rings others shared with me **so that** I can open the perspective they gave me.

Acceptance criteria:
- [ ] `GET /rings/shared-with-me`, newest first; only Rings whose access is live right now; refetched on screen focus because it changes without any action of mine.
- [ ] A row shows the Ring's name and colour and opens the owner's projection through `GET /views/ring/:id`; it never shows a roster or my own membership row.
- [ ] "Review invite" and "Join with a code" are shown disabled until invitations exist.
- [ ] Empty state: "Nothing shared with you yet".

### S4 · New Ring wizard ([[Screen Index#s18|s18]] → [[Screen Index#s21|s21]])

**As a** Ring owner **I want** a four-step wizard, name → who is in it → what it shows → how you appear, **so that** a Ring is complete when I tap Create.

Acceptance criteria:
- [ ] Step 1 (s18): name (1–80, unique per owner), colour, type picker limited to `PERSONAL` / `CORPORATE`, temporary switch with `startsAt` / `expiresAt`; "Copy a Ring" disabled until [[D-05 Copy or inherit]]. Next calls `POST /rings` so later steps have a Ring to write to.
- [ ] Step 2 (s19): the audience settings the design shows are placeholders until [[D-04 Ring settings]]; adding people goes through the roster once a `userId` source exists.
- [ ] Step 3 (s20) and step 4 (s21) edit the projection ([[Ring Projection Story]]); "Create Ring" lands on s14.
- [ ] A 409 `E_RING_01` on the name is inline on step 1; Cancel deletes the Ring created in step 1.

### S5 · Edit name & purpose ([[Screen Index#s22|s22]])

**As a** Ring owner **I want** to rename and recolour a Ring **so that** the carousel stays legible.

Acceptance criteria:
- [ ] `PATCH /rings/:id { name?, colorHex?, style? }`; Save returns to s14 and the Ring re-composes with the new header.
- [ ] "Purpose" is a placeholder until [[D-04 Ring settings]].

### S6 · Edit access and expiry ([[Screen Index#s26|s26]])

**As a** Ring owner **I want** to set when a Ring starts and ends and to delete it **so that** an audience is time-boxed when it should be.

Acceptance criteria:
- [ ] `PATCH /rings/:id { startsAt?, expiresAt?, isTemporary? }`; `null` clears a bound; the copy explains expiry applies to every member at that instant.
- [ ] An expired Ring remains editable here; its members cannot read it.
- [ ] "Delete Ring" behind a confirmation; `DELETE /rings/:id`; 409 `E_RING_04` on the default reads "Choose another default first".
- [ ] Settings and Permissions (s27) are placeholders until [[D-04 Ring settings]] and [[T-006 Delegated admin endpoints]].

### S7 · Make a Ring the default ([[Screen Index#s16|s16]])

**As a** Ring owner **I want** to choose which Ring strangers get **so that** a scanned badge resolves to the right me.

Acceptance criteria:
- [ ] `POST /rings/:id/default`; the star moves on refetch; the previous default is demoted in the same transaction.
- [ ] The copy says: this is what a scanned QR or a Pin-name lookup resolves to for someone in no other Ring of mine.

### S8 · After the event: keep, merge or let it go ([[Screen Index#s62|s62]])

**As a** Ring owner **I want** an explicit choice when a temporary Ring lapses **so that** event contacts end up where I want them.

Acceptance criteria:
- [ ] The sheet appears when `isTemporary`, `disposition === "UNDECIDED"` and `expiresAt` is past.
- [ ] `POST /rings/:id/disposition { disposition, mergedIntoRingId? }`: KEEP makes it permanent; MERGE needs a picker of my other Rings and moves every active member with their window; AUTO_DELETE archives it and expires it now, with "You can still change your mind until it is purged".
- [ ] Motion: keep stays, merge shows two Rings combining, delete collapses out.
- [ ] The preview on this sheet must not use `GET /views/ring/:id`, which is a 404 for an expired Ring.

## States and motion the design asks for

- State: default star, temporary badge, expired chip, archived, disposition pending, empty lists, read-only (403), name clash.
- Motion: a new Ring forms and takes its place in the carousel; deleting collapses it out; switching Rings re-composes the profile; the lifecycle choice animates keep / merge / delete. Reduced motion: fades.

## Rules the backend already enforces

- `POST /rings` defaults to `PERSONAL`, rejects `EVENT` / `MINI_EVENT` / `MEETING` (400 `E_RING_01`), checks the per-owner name clash in one transaction (409 `E_RING_01`), requires `parentRingId` / `profileId` to be the caller's (400 `E_RING_06` / `E_RING_08`), falls back to the default profile.
- `GET /rings` filters `name`, `type`, `status`, `isTemporary` (`false` is a real filter), default first then newest; `GET /rings/shared-with-me` applies both live filters, newest first.
- `PATCH /rings/:id` passes `assertCanAdminister(…, 'CONTENT_MANAGER')`, which ignores expiry, so an expired Ring stays editable.
- One default per owner (partial unique index); `POST …/default` demotes then promotes in one transaction; `DELETE` refuses the default (409 `E_RING_04`) and is a soft delete.
- Disposition runs `UNDECIDED → KEEP | MERGE | AUTO_DELETE`; MERGE needs a Ring of the same owner (400 `E_RING_07`), reactivates lapsed rows in the target, archives the source with `mergedIntoRingId`; AUTO_DELETE archives and sets `expiresAt` to now, leaving the purge to a job that is not written.
- `RING_STATUS.EXPIRED` is never written; expiry is evaluated live.

## Open questions

- [[D-04 Ring settings]] — who the Ring is for, join policy, members can see each other, required email domain (s19, s22, s26, s27). Blocks step 2 and the access / permissions screens.
- [[D-05 Copy or inherit]] — "Copy a Ring" on s18.
