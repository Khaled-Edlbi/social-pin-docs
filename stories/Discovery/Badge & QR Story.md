---
type: story
id: badge-qr
feature: badge-qr
status: draft
domain: discovery
screens: [s34, s43, s44, s56]
updated: 2026-10-18
tags: [story, story/draft, domain/discovery]
---

# Badge & QR · User Story

**Feature:** [[Badge & QR]] · **Status:** Draft (awaiting product sign-off) · **Requirements:** [[Badge & QR Requirements]] · **API Integration:** not yet (backend not built)

The badge is the centre tab and the physical moment of the product: two people face to face, one shows a code, the other scans it. The code is bound to the Ring the owner has active at that moment, so showing the badge is the same act as choosing which perspective the other person gets. The scanner's side turns a square of pixels into a person, and that person's view is whatever Ring the owner put them in.

## Persona

The **presenter**: any user who taps the centre tab to show their badge (s34), at a meetup, a desk or an event (s56). The **scanner**: any user who flips the badge to the scanner (s43) and reads someone else's code; they have an account and are signed in. The visitor without the app who opens the share link is a third, undecided persona.

## Stories

### S1 · Show my badge for the active Ring ([[Screen Index#s34|s34]])

**As a** presenter, **I want** the centre tab to rise into a large QR labelled with my active Ring, **so that** the person in front of me scans the right perspective.

Acceptance criteria:
- [ ] The badge shows a QR, the active Ring's name and colour, my display name and Pin name; the QR encodes an opaque token for that Ring, never the Ring id or my user id in the clear.
- [ ] Changing the active Ring while the badge is open re-composes the badge (label, colour, QR) in place.
- [ ] The token is refreshed at least every 24 h; a badge opened with a token older than that fetches a new one before showing it, and shows the last one in a *Refreshing* state only when offline.
- [ ] *No Ring* state when the user has no live Ring to present (all expired): explain and link to My Rings.
- [ ] *Get Pro* (s70) is shown next to a "rotates daily" hint; a Pro account can keep a permanent code.

### S2 · Flip to the scanner ([[Screen Index#s34|s34]] → [[Screen Index#s43|s43]])

**As a** presenter who is also the one scanning, **I want** to flip the badge card to the camera, **so that** both sides of the exchange live in one gesture.

Acceptance criteria:
- [ ] A *Scan* toggle flips the card to the camera; flipping back restores the badge without re-fetching.
- [ ] Camera permission denied: an inline state with *Open settings*; the badge side keeps working.
- [ ] A reduced-motion setting replaces the flip with a crossfade.

### S3 · Reading the code ([[Screen Index#s43|s43]])

**As a** scanner, **I want** a detected code to resolve into the person behind it, **so that** I see them the way they chose to show themselves to me.

Acceptance criteria:
- [ ] Detection is debounced: one resolve per distinct token per 5 s; the viewfinder shows "Checking which Ring they belong in" while resolving.
- [ ] A valid token renders the Ring view (s44); the response never contains a Ring id, and the UI never shows one.
- [ ] A code that is not a Social Pin token: "Not a Social Pin code", keep scanning. A token that no longer resolves (rotated, revoked, blocked, Ring gone, not shared): one neutral "This profile isn't available", keep scanning.
- [ ] Scanning my own badge opens my own View as of that Ring, marked as a preview.

### S4 · Scanned Pin ([[Screen Index#s44|s44]])

**As a** scanner, **I want** the resolved view to be a full profile card I can connect from, **so that** the scan leads somewhere.

Acceptance criteria:
- [ ] Renders `RingProfileViewEntity` exactly as [[View As & Pin Views Frontend]] describes: `null` is "not shared", sensitive rows hidden when `null`, no Ring name anywhere.
- [ ] *Connect* leads into [[Connections Story]]; *Save for later* returns Home and keeps the scan in a local "recent scans" list (device only, no server call).
- [ ] The presenter's scan counter increments once per resolve; the scanner is never told that it did.

### S5 · Share link and scan counter ([[Screen Index#s34|s34]])

**As a** presenter, **I want** a link I can send and a count of how often my badge was scanned, **so that** the badge works beyond face to face.

Acceptance criteria:
- [ ] *Share* offers copy link, system share and save image; the link opens the app for users who have it and a browser page for those who do not.
- [ ] The counter on the badge shows scans for the active Ring since its token was first issued, refreshed on open.
- [ ] Both are rendered disabled with "not available yet" until the counter and the public page exist.

### S6 · Event pass ([[Screen Index#s56|s56]])

**As a** registered visitor inside an event, **I want** my event pass to be a code that rotates every 60 s, **so that** a screenshot cannot be reused at the door.

Acceptance criteria:
- [ ] The pass shows the Event Ring's name, the event, a code with a visible countdown ring, and *Show my badge* to s34.
- [ ] The code refreshes on the client at the window boundary without a user action; offline shows the last code with its remaining seconds, then an *Expired* state.
- [ ] The mechanism is the same token as S1 with a shorter window; the pass never reveals the Event Ring's id.

## States and motion the design asks for

- State: Ring selected, no Ring, scanning, no camera permission, invalid code, resolved profile, refreshing token, offline.
- Motion: **rise + expand** from the centre tab into the badge sheet, reversible; **badge re-composes** on Ring change; flipping to the scanner is a continuous **card flip**; a detected code **animates into the resolved profile card** (the QR becomes the person); every one of these has a reduced-motion fallback.

## Rules the backend already enforces

- Rendering a scanned Ring is `GET /views/ring/:ringId` through `RingAccessService`: owner always, a live member while the Ring and the membership are live and no block exists; anything else is 404 `E_RING_ACCESS_01`, a non-live Ring 404 `E_RING_ACCESS_02` ([[View As & Pin Views]]).
- "Not shared", "blocked" and "no such pin" are one body; the resolve-by-token route of T-008 returns the same.
- `RingQrToken` is opaque, hashed at rest and revocable; a rotated token stops resolving at rotation.
- `RingProfileViewEntity` carries no `ringId`, `userId` or owner id; the scanner cannot derive the Ring from the view.
- A permanent code is a Pro gate ([[Subscription (Free vs Pro)]]); the client must not keep reusing a token past 24 h on a free account.

## Open questions

- [[T-010 Public browser page for viewers without the app]] — which Ring an anonymous visitor sees (a public Ring type or the default Ring); S5's link has no destination until decided.
- [[T-008 Resolve a scanned QR token]] — whether the resolved body carries the presenter's user id for *Connect*, which the view entity does not and must not.
- [[T-007 Issue and rotate the QR token for a Ring]] — whether rotation is server-scheduled or on demand, which decides the client's refresh rule in S1.
- [[T-037 Event pass with a 60 s rotating code]] — the pass window and whether the client or the server drives the 60 s boundary.
