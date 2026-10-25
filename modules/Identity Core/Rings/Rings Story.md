---
type: story
code: rings
scope: feature
feature: rings
module: identity
status: draft
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s62]
updated: 2026-10-25
owner: "omar"
related: ["DR-04 Ring settings at launch and their defaults", "DR-05 Inherit per field, copy without members", "DR-14 Shared with me lists people, never the Ring"]
tags: [story, story/draft, module/identity, layer/business]
---

# Rings · User Story

> ⚠ Affected by [[DR-18 Ring names shown when joined knowingly]] (2026-10-25): the one exception to DR-14: a Ring the member joined knowingly (invitation, code, work email) may show its name on Shared with me; one the owner placed them in never does. S3 changes.

**Feature:** [[Rings]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Rings Frontend Requirements]] · **Backend Integration:** [[Rings Backend Integration]]

A person has one profile and many audiences. A Ring is one audience bound to one perspective: Family, Clients, Company, a temporary Event Ring. The owner creates Rings, names and colours them, gives them a window, picks the default (what a scanned badge or a Pin-name lookup resolves to), and, when a temporary Ring lapses, decides whether to keep it, merge it into another, or let it go. Each Ring has a few settings (who it's for, who can join, approve each request, what members may do), all private by default ([[DR-04 Ring settings at launch and their defaults]]). Members see the people who share with them on a separate list, never a Ring's name or the owner's roster ([[DR-14 Shared with me lists people, never the Ring]]).

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

**As a** member **I want** to see everyone who shares with me **so that** I can open the card each of them gave me.

Acceptance criteria:
- [ ] `GET /rings/shared-with-me`, newest first; only access that is live right now; refetched on screen focus because it changes without any action of mine.
- [ ] Shared with me is **everyone who shares with me**, however I got in (accepted from a request, added by the owner, an invitation, a code, a company), one row per person ([[DR-14 Shared with me lists people, never the Ring]]).
- [ ] A row shows **the person** ("Sam's card": their name and photo from their projection), **never the Ring's name, colour or type**, and opens the owner's projection through `GET /views/ring/:id`; it never shows a roster or my own membership row. Not available yet: the endpoint returns the Ring's name, colour and type to members today; the app must not display them until it changes.
- [ ] Someone who shares several Rings with me is one row; it opens the version from the Ring I was put in first ([[DR-15 Several Rings per connection, remove or disconnect]]).
- [ ] "Review invite" and "Join with a code" are shown disabled until invitations exist.
- [ ] Empty state: "Nothing shared with you yet".

### S4 · New Ring wizard ([[Screen Index#s18|s18]] → [[Screen Index#s21|s21]])

**As a** Ring owner **I want** a four-step wizard, name → who is in it → what it shows → how you appear, **so that** a Ring is complete when I tap Create.

Acceptance criteria:
- [ ] Step 1 (s18): name (1–80, unique per owner), colour, type picker limited to `PERSONAL` / `CORPORATE`, temporary switch with `startsAt` / `expiresAt`. Next calls `POST /rings` so later steps have a Ring to write to.
- [ ] "Copy a Ring" on step 1 copies another of my Rings' fields, bio, photo, colour and settings, **never its members**; afterwards the two Rings are independent ([[DR-05 Inherit per field, copy without members]]). Not available yet: no copy endpoint; the action is shown disabled.
- [ ] Step 2 (s19): the launch settings with their defaults, as in S9; adding people goes through the roster once a `userId` source exists. Not available yet: the settings do not exist on a Ring.
- [ ] Step 3 (s20) and step 4 (s21) edit the projection ([[Ring Projection Story]]); "Create Ring" lands on s14.
- [ ] A 409 `E_RING_01` on the name is inline on step 1; Cancel deletes the Ring created in step 1.

### S5 · Edit name & purpose ([[Screen Index#s22|s22]])

**As a** Ring owner **I want** to rename and recolour a Ring **so that** the carousel stays legible.

Acceptance criteria:
- [ ] `PATCH /rings/:id { name?, colorHex?, style? }`; Save returns to s14 and the Ring re-composes with the new header.
- [ ] "Purpose" is the **who it's for** label ("Clients", "Investors"), empty by default ([[DR-04 Ring settings at launch and their defaults]]). Not available yet: shown as a placeholder until the setting exists.

### S6 · Edit access and expiry ([[Screen Index#s26|s26]])

**As a** Ring owner **I want** to set when a Ring starts and ends and to delete it **so that** an audience is time-boxed when it should be.

Acceptance criteria:
- [ ] `PATCH /rings/:id { startsAt?, expiresAt?, isTemporary? }`; `null` clears a bound; the copy explains expiry applies to every member at that instant.
- [ ] An expired Ring remains editable here; its members cannot read it.
- [ ] "Delete Ring" behind a confirmation; `DELETE /rings/:id`; 409 `E_RING_04` on the default reads "Choose another default first".
- [ ] Settings and Permissions (s27) are S9; until the settings exist and [[T-006 Delegated admin endpoints]] ships, they stay placeholders.

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

### S9 · Ring settings ([[Screen Index#s19|s19]], [[Screen Index#s26|s26]], [[Screen Index#s27|s27]])

**As a** Ring owner **I want** a short list of settings with safe defaults **so that** a Ring is private until I open it up ([[DR-04 Ring settings at launch and their defaults]]).

Acceptance criteria:
- [ ] Six settings at launch, with these defaults on a new Ring: **who it's for** (a label, empty), **who can request to join** (anyone who scans, only with a code, or only invited; default **only with a code or by invitation**), **approve each one** (on; off means auto-accept), **members can see each other** (off), **members can invite others** (off), **members can save attachments** (off).
- [ ] When "members can see each other" is on, members see each other's **full cards**, not just names; while it is off, only the owner sees who is in the Ring.
- [ ] **The owner and the Ring's admins** can change the settings ([[Delegated Admins Story]]); a member cannot.
- [ ] Not shown at launch: required work email domain (comes with [[Companies]]), members can message me (comes with messaging), see when I'm at an event (comes with events).
- [ ] Not available yet: none of these settings exist on a Ring.

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

- Decided: [[DR-04 Ring settings at launch and their defaults]] (S9, step 2, purpose), [[DR-05 Inherit per field, copy without members]] (Copy a Ring), [[DR-14 Shared with me lists people, never the Ring]] (S3). Building them is not ticketed yet.
- Whose card a member sees when members can see each other; whether an admin may change every setting (DR-04, *Still open*).
- Whether a copied Ring's fields keep inheriting where the source Ring inherited (DR-05, *Still open*).
- Whether a Ring joined openly (a company or event Ring) may show its name to members (DR-14, *Still open*).
