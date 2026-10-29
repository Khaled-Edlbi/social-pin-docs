---
type: story
code: view-as
scope: feature
feature: view-as
module: identity
status: approved
screens: [s10, s31, s44, s62]
approvedBy: "Omar Fostok"
approvedAt: 2026-10-29
owner: "Omar Fostok"
related: ["D-14 Shared with me lists people, never the Ring", "D-16 Files load from signed links that expire in 15 minutes", "D-18 Ring names shown when joined knowingly", "ND-12 What the badge QR encodes", "ND-22 Public web page by Pin name", "S-14 Profiles & Pin Name Story", "S-17 Ring Projection Story", "S-23 Connections Story", "F-03 Counts"]
created: 2026-10-18
updated: 2026-10-29
tags: [story, story/approved, module/identity, layer/business]
---

# View As & Pin Views · User Story

**Feature:** [[F-12 View As & Pin Views]] · **Status:** Approved 2026-10-29 by Omar Fostok (first approved 2026-10-25 by khaled; reworked 2026-10-29 by the design review: S1, S2, S3, S7 changed) · **Frontend Requirements:** [[FR-12 View As & Pin Views Frontend Requirements]] · **Backend Integration:** [[BI-09 View As & Pin Views Backend Integration]]

Two people, one screen component. The owner flips to "View as" to see a Ring exactly as its members do: the "aha" that teaches the whole model. A viewer scans a badge or types a `!pinname` and gets the one perspective they are allowed, with no hint of which Ring that is or whether other Rings exist. Both render the same shape from the same route, which is what makes the preview trustworthy. Photos and files load from signed links that expire in 15 minutes ([[D-16 Files load from signed links that expire in 15 minutes]]).

## Persona

A Ring owner in onboarding ([[Screen Index#s10|s10]]) or on Ring data flipping to the audience view ([[Screen Index#s31|s31]]); and a viewer, member or stranger, who just scanned a badge or looked up a handle ([[Screen Index#s44|s44]]).

## Stories

### S1 · View as teaser ([[Screen Index#s10|s10]])

**As a** new user **I want** to see my first Ring the way its audience will, and the way I see it **so that** I understand what a Ring is before I reach Home.

Acceptance criteria:
- [ ] s10 appears after "Create Ring" on s09 ("Later" goes straight to Home). It is **s31's View as component** (S2), opened on the Ring just created: "See yourself the way they do. Every Ring gets its own version of you. Flip the card to switch between what you see and what they see."
- [ ] It opens on the **preview** ("PREVIEW — <RING> SEES", `GET /views/ring/:ringId` with the new Ring's id) with "Tap to flip ↻" to the owner's face ("YOUR VIEW — OWNER", S2).
- [ ] The Ring picker ("<Ring> ›") offers the new Ring and the **Public** Ring (the default), so the new user sees two versions of themselves.
- [ ] "Everything else is invisible to this Ring — including that this Ring exists."; **Got it** → Home; "You can open View as any time from a Ring."
- [ ] Works on a Ring with almost nothing set: the name from the profile and whatever s09 switched on; the rest absent.

### S2 · View as, the flip ([[Screen Index#s31|s31]])

**As a** Ring owner **I want** to flip from my editor to the audience view and back, and see where each field goes **so that** I trust a Ring before I share it.

Acceptance criteria:
- [ ] "View as <Ring>" on s14 invalidates the cached view and calls `GET /views/ring/:ringId` with the owner's own Ring id; the response is byte for byte what a member gets.
- [ ] The flip is a perspective transition between "your view" and "their view", continuous and reversible; the audience view is clearly marked as a preview. The Ring chips (my live Rings) stay put on both faces, so I step through audiences; an expired Ring reads "This Ring has expired" (404 `E_RING_ACCESS_02`) instead of a view.
- [ ] **The audience face** ("WHAT <RING> SEES") is the card (S3), with Save contact and Connect shown as the viewer sees them but **disabled** (it's me).
- [ ] **The owner face** ("YOUR VIEW · OWNER"):
  - my name, then "All N fields · N Rings · N connections" (my totals; counts are [[F-03 Counts]]');
  - **WHERE EACH FIELD GOES**: each field, link, custom field and file I have with the Rings that show it: "**Every Ring**", a list ("Clients, Company"), "**<Ring> only**", or "**Hidden**"; the name always reads "Every Ring"; what reaches no one is marked differently;
  - the three counts for the Ring on the chip: **FIELDS** n/m, **SOCIALS** n/m, **BIO** "Own" or "Inherited";
  - "**Edit what <Ring> sees**" → s24 for that Ring.
- [ ] The owner face is **worked out on the phone** from my Rings' projections (and the main profile); nothing new for the backend.
- [ ] Hidden rows and off switches are absent from the audience face; `null` reads "Not shared"; `displayName` is the Ring's or the profile's full name, never the nickname.

### S3 · Scanned Pin from a badge ([[Screen Index#s44|s44]])

**As a** viewer **I want** a scanned badge to become the person's card **so that** I see what they chose to share with me.

Acceptance criteria:
- [ ] The scan resolves to `GET /views/ring/:ringId` (today the QR can only carry a Ring id; what it should carry is [[ND-12 What the badge QR encodes]]) and the detected code animates into the resolved profile card.
- [ ] **The top of the card**: the name (`displayName`, never the nickname); the **nickname** in a lighter style, in quotes ("“Nono”"), only when this Ring shows one; the headline and company ("Partnerships lead · Vertex Labs") when the Ring shows them; `!pinname`.
- [ ] Under it, **my own context** ("Scanned just now · TechSummit '26"): when and where I scanned, kept on my phone by the scan ([[F-18 Badge & QR]]), never sent by the view.
- [ ] Then "WHAT <NAME> SHARES WITH YOU": the shared fields, links, custom fields, widgets, and the sensitive rows only when not `null`.
- [ ] **The photo** from the view's `avatarUrl`; **each attachment** with its name and size (no date: a file is never replaced), opening (PDF, image) or downloading from its `url`. Both are signed links valid 15 minutes ([[D-16 Files load from signed links that expire in 15 minutes]]): when one has expired, the app reads the view again; it never builds a link itself. Not available yet: the view doesn't carry the links until the backend ships D-16; until then, a placeholder and no download.
- [ ] Any 404 reads "This profile isn't available to you", with no cause given.
- [ ] **Save contact** and **Connect** (S7). Connect sends a request ([[S-23 Connections Story|Connections · S8–S12]], waiting on [[ND-10 How Connect addresses the scanned person]]); it is disabled until then. The prototype links it to s46, the owner's "accept" screen; that's a placeholder.
- [ ] The **⋯** menu holds **Block** ([[S-23 Connections Story|Connections · S25]]) and, later, Report; disabled until block exists.

### S4 · Open someone by Pin name ([[Screen Index#s44|s44]], reached from [[Screen Index#s38|s38]])

**As a** viewer **I want** to type `!sara` and get her profile **so that** I can find someone I met without a scan.

Acceptance criteria:
- [ ] `GET /views/pin/:pinName` without the `!`; the answer is the perspective of her default Ring if I am in it, else the oldest Ring of hers I can see.
- [ ] The same one-message 404 for "no such name", "not shared" and "blocked"; no retry hint differs by cause.
- [ ] My own handle renders my default Ring's view, which doubles as a quick self-check.
- [ ] A public web page by Pin name is a separate question: [[ND-22 Public web page by Pin name]].

### S5 · Flip between the perspectives I hold (journey, no prototype screen)

**As a** viewer in several of one person's Rings **I want** to flip between them **so that** I see each side they gave me.

Acceptance criteria:
- [ ] `GET /views/user/:userId/perspectives` returns an array in a stable order (default Ring first, then oldest); the switcher labels them "View 1 / View 2" or by `themeConfig`, never by a Ring name.
- [ ] An empty array renders "Nothing shared with you", not an error.
- [ ] The person's `userId` comes from a connection or a scan payload, never from a view.

### S6 · An expired Ring has no preview (journey, [[Screen Index#s62|s62]])

**As a** Ring owner **I want** the post-event sheet to avoid a broken preview **so that** I can decide keep / merge / delete without a 404.

Acceptance criteria:
- [ ] s62 does not call `GET /views/ring/:id` on an expired Ring; it uses the Ring row and the owner projection instead.
- [ ] The owner's View as is offered only on live Rings.

### S7 · After the card: Connect or save the contact (journey, [[Screen Index#s44|s44]])

**As a** viewer **I want** to ask for access or keep the person in my phone **so that** the encounter is not lost.

Acceptance criteria:
- [ ] **Save contact** (replacing "Save for later") opens the phone's own "new contact" screen, pre-filled with **only what this card shows me**: the name (the nickname as the contact's nickname), the headline and company, email, phone, the links (as URLs), and the photo (from `avatarUrl`, while its link is valid). No Ring, no owner id, no hidden field. I can edit it before saving.
- [ ] The app asks for the **contacts permission** the first time; denied: a short message with a link to the phone's settings, and nothing saved.
- [ ] "Connect" waits on [[S-23 Connections Story|Connections · S8–S12]].
- [ ] **For the designer:** s44's "Save for later" becomes "Save contact".

## States and motion the design asks for

- State ([[Wireframe Brief#QR scan|§4.5]]): scanning, no camera permission, invalid code, resolved profile; plus "not available" (one message), expired (owner only), preview frame, an expired photo or file link (refetched), contacts permission asked / denied.
- Motion: View as is a flip / perspective transition, continuous and reversible (signature motion 10); a scanned code animates into the resolved profile card (signature motion 5). Reduced motion: cross-fade.

## Rules the backend already enforces

- All three routes return `RingProfileViewEntity` and resolve access **first** through `RingAccessService`.
- `GET /views/pin/:pinName` looks up the normalised handle then `resolveDefaultAccess`: the owner's own Rings for the owner; otherwise, after the mutual-block check, the live Rings the viewer is a live member of, default first then oldest; the first is rendered. No profile, no live Ring or a block throw the **same** 404 `E_RING_ACCESS_01`, asserted by specs.
- `GET /views/ring/:ringId` uses `assertRingReadable`: not live is 404 `E_RING_ACCESS_02` (owner included); the owner passes; blocked or non-member gets the not-shared 404.
- `GET /views/user/:userId/perspectives` returns one projection per accessible Ring in order, an empty array when nothing is shared.
- Rendering goes through `selectRingProfileProjection` (hidden rows excluded) and `toView` (sensitive fields gated by `show*`). Nothing in the entity names the Ring, the owner's user id or the membership.

## Open questions

- No decision blocks the read path. What the badge QR carries is [[ND-12 What the badge QR encodes]] ([[S-37 Badge & QR Story|Badge & QR · S7–S12]], [[S-37 Badge & QR Story|Badge & QR · S13–S18]]); until then a Ring id in the QR is temporary.
- Decided: [[D-16 Files load from signed links that expire in 15 minutes]] (S3, S7: the photo and the files); building it is the backend's.
- Later, not in v1: a list of saved cards inside the app (S7 saves to the phone's contacts instead).
