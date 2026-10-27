---
type: story
code: badge-qr
scope: feature
feature: badge-qr
module: discovery
status: approved
screens: [s34, s43, s44, s56]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-27
tags: [story, story/approved, module/discovery, layer/business]
---

# Badge & QR · User Story

**Feature:** [[Badge & QR]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Badge & QR Frontend Requirements]] · **API Integration:** not yet (backend not built)

The badge is the centre tab and the physical moment of the product: two people face to face, one shows a code, the other scans it. The code is bound to the Ring the owner has active at that moment, so showing the badge is the same act as choosing which perspective the other person gets. The scanner's side turns a square of pixels into a person, and that person's view is whatever Ring the owner put them in.

**Task stories:** [[Badge & QR Story|Badge & QR · S7–S12]] (Badge & QR · S7–S12: the real, rotating code in S1) · [[Badge & QR Story|Badge & QR · S13–S18]] (Badge & QR · S13–S18: reading the code and the scanned Pin in S3 and S4). S5 waits on [[Badge & QR Story|Badge & QR · S19]] and [[Badge & QR Story|Badge & QR · S20]], still the empty template.

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
- [ ] Renders `RingProfileViewEntity` exactly as [[View As & Pin Views Backend Integration]] describes: `null` is "not shared", sensitive rows hidden when `null`, no Ring name anywhere.
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

### S7 · My badge shows a real code for the Ring I chose ([[Screen Index#s34|s34]])

*From T-007 Issue and rotate the QR token for a Ring (status then: To do), merged 2026-10-27.*

**As a** Ring owner **I want** my badge to show a working QR for the active Ring **so that** whoever scans it lands in that Ring.

Acceptance criteria:
- [ ] Opening the badge gets a token for the active Ring (`POST /rings/:ringId/qr`) and draws it as the QR.
- [ ] The token is opaque: it carries neither the Ring id nor my user id, and nothing can be read from it.
- [ ] The Ring's name and colour sit beside the code, as now.

### S8 · Switching Ring switches the code ([[Screen Index#s34|s34]])

**As a** Ring owner **I want** the code to change when I pick another Ring on the badge **so that** the next person lands where I meant.

Acceptance criteria:
- [ ] Choosing another Ring in the picker re-draws the badge with that Ring's token, in place.
- [ ] Each Ring has its own token; switching back to a Ring reuses its token while it's still valid.

### S9 · The code rotates every day ([[Screen Index#s34|s34]])

**As a** Ring owner **I want** my code to change every 24 hours **so that** a photo of my badge stops working.

Acceptance criteria:
- [ ] A token is valid for 24 h from `issuedAt`; the response says when it expires.
- [ ] Opening the badge with a token past its window fetches a new one before showing it.
- [ ] Getting a new token revokes the previous one for that Ring: scanning the old one answers the same neutral 404 as any unknown code.
- [ ] The "rotates every 24 h" line on the badge is true.

### S10 · Offline, the badge says so ([[Screen Index#s34|s34]])

**As a** Ring owner **I want** to know when the code I'm showing may be stale **so that** I don't hand someone a dead code.

Acceptance criteria:
- [ ] Offline with a token still in its window: the last token, with a *Refreshing* chip.
- [ ] Offline past the window: *Expired*; no QR is drawn.

### S11 · Only my Rings, only live ones

**As a** Ring owner **I want** codes only for Rings I own that are live **so that** nobody shows a code for a Ring that can't be seen.

Acceptance criteria:
- [ ] A token for a Ring that isn't mine: 404 `E_RING_02`. The app refetches my Rings and resets the active one.
- [ ] A token for an expired Ring: refused; the badge shows *No Ring* with a link to My Rings when none of my Rings is live.
- [ ] Deleting a Ring revokes its token.

### S12 · Pro keeps one code ([[Screen Index#s70|s70]])

**As a** Pro user **I want** a permanent code **so that** I print it once.

Acceptance criteria:
- [ ] Out of scope here: [[Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]]. A free account always gets the 24 h token; the badge shows *Get Pro* next to the "rotates daily" line.

### S13 · Scan a badge, see the card ([[Screen Index#s43|s43]] → [[Screen Index#s44|s44]])

*From T-008 Resolve a scanned QR token (status then: To do), merged 2026-10-27.*

**As a** scanner **I want** to point my camera at a badge and see that person's card **so that** I know who they are and what they share with me.

Acceptance criteria:
- [ ] The scanner reads the code and calls `GET /views/qr/:token`; while it waits, s43 shows "Checking which Ring they belong in".
- [ ] A valid token returns the same body as `GET /views/ring/:ringId` (`RingProfileViewEntity`); s44 renders it as [[View As & Pin Views Backend Integration]] describes: `null` is "not shared", no Ring name anywhere.
- [ ] The response never contains the Ring id; the app never shows or stores one.

### S14 · A dead code says nothing about why ([[Screen Index#s43|s43]])

**As a** presenter **I want** an old, revoked or wrong code to give nothing away **so that** nobody learns whether a Ring exists or that I blocked them.

Acceptance criteria:
- [ ] Unknown, rotated, revoked, expired-Ring, deleted-Ring, not-shared and blocked all answer one 404, the same body as `/views` ("This profile isn't available").
- [ ] The scanner keeps scanning after it; no retry loop.
- [ ] Response time doesn't tell the cases apart.

### S15 · Not our code ([[Screen Index#s43|s43]])

**As a** scanner **I want** a QR that isn't a Social Pin code to be ignored politely **so that** I don't wait on a menu or a Wi-Fi code.

Acceptance criteria:
- [ ] A code that isn't in Social Pin's format is rejected on the phone, without a request: "Not a Social Pin code", keep scanning.

### S16 · Scanning my own badge ([[Screen Index#s43|s43]])

**As a** Ring owner **I want** scanning my own badge to show me what others see **so that** I check it before an event.

Acceptance criteria:
- [ ] The resolve tells the app the presenter is the viewer (or returns enough for the app to know), and the app opens View as for that Ring, marked as a preview.

### S17 · The presenter's scan is counted ([[Screen Index#s34|s34]])

**As a** presenter **I want** each scan of my code counted **so that** the badge can show my reach later.

Acceptance criteria:
- [ ] Each successful resolve increments the Ring's scan counter once; a dead code doesn't.
- [ ] The scanner is never told it was counted. Showing the count is [[Badge & QR Story|Badge & QR · S19]].

### S18 · Then connect ([[Screen Index#s44|s44]])

**As a** scanner **I want** *Connect* on the card **so that** the presenter can add me to their Ring.

Acceptance criteria:
- [ ] The resolve returns what *Connect* needs to address the presenter (a user id or an opaque handle), since the view body has none today. The request itself is [[T-021 Connect request send, inbox, cancel]].

### S19 · Scan counter and share link

*From T-009 (status then: To do), merged 2026-10-27.*

Count per token and per Ring; share link is the public URL of Badge & QR · S20.

Screens: [[Screen Index#s34|s34]] Badge (flip)


### S20 · Public browser page for viewers without the app

*From T-010 (status then: Needs a decision), merged 2026-10-27.*

Needs a decision: which Ring content is shown to an anonymous browser viewer, and whether that is a 'PUBLIC' Ring type or the default Ring.

Screens: [[Screen Index#s34|s34]] Badge (flip)

## States and motion the design asks for

- State: Ring selected, no Ring, scanning, no camera permission, invalid code, resolved profile, refreshing token, offline.
- Motion: **rise + expand** from the centre tab into the badge sheet, reversible; **badge re-composes** on Ring change; flipping to the scanner is a continuous **card flip**; a detected code **animates into the resolved profile card** (the QR becomes the person); every one of these has a reduced-motion fallback.
- (Badge & QR · S7–S12) Loading: the badge card with the code area in its ghost state until the token arrives.
- (Badge & QR · S7–S12) Ready: the QR, the Ring name and colour, "rotates every 24 h".
- (Badge & QR · S7–S12) *Refreshing* (offline, in window), *Expired* (offline, past window), *No Ring* (no live Ring).
- (Badge & QR · S7–S12) Motion: switching Ring re-composes the card in place; reduced motion crossfades.
- (Badge & QR · S13–S18) Scanning: the viewfinder, a ghost code in the frame.
- (Badge & QR · S13–S18) Checking: "Checking which Ring they belong in" while resolving.
- (Badge & QR · S13–S18) Found: hand-off to s44.
- (Badge & QR · S13–S18) Not available (any 404), Not a Social Pin code, Camera permission denied (inline, *Open settings*), Offline ("You're offline", keep the camera running).
- (Badge & QR · S13–S18) Motion: the design's flip from the badge to the scanner; reduced motion crossfades.

## Rules the backend already enforces

- Rendering a scanned Ring is `GET /views/ring/:ringId` through `RingAccessService`: owner always, a live member while the Ring and the membership are live and no block exists; anything else is 404 `E_RING_ACCESS_01`, a non-live Ring 404 `E_RING_ACCESS_02` ([[View As & Pin Views]]).
- "Not shared", "blocked" and "no such pin" are one body; the resolve-by-token route of Badge & QR · S13–S18 returns the same.
- `RingQrToken` is opaque, hashed at rest and revocable; a rotated token stops resolving at rotation.
- `RingProfileViewEntity` carries no `ringId`, `userId` or owner id; the scanner cannot derive the Ring from the view.
- A permanent code is a Pro gate ([[Subscription (Free vs Pro)]]); the client must not keep reusing a token past 24 h on a free account.
- (Badge & QR · S7–S12) Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]); a Ring's live window decides whether it can be shown.
- (Badge & QR · S7–S12) `GET /views/ring/:ringId` already renders a Ring for a viewer, with one 404 for missing, not shared and blocked; the token must resolve to the same body ([[Badge & QR Story|Badge & QR · S13–S18]]).
- (Badge & QR · S7–S12) The Ring id is not shown to viewers; the token must not leak it.
- (Badge & QR · S13–S18) `GET /views/ring/:ringId` resolves through `RingAccessService` with one 404 for missing, not shared and blocked; the token route must reuse it so both stay identical.
- (Badge & QR · S13–S18) Sensitive fields are `null` unless the projection shows them; the view never names the Ring.
- (Badge & QR · S13–S18) Enumeration resistance is part of the error contract ([[Error Contract]]).

## Open questions

- [[Badge & QR Story|Badge & QR · S20]] — which Ring an anonymous visitor sees (a public Ring type or the default Ring); S5's link has no destination until decided.
- [[Badge & QR Story|Badge & QR · S13–S18]] — whether the resolved body carries the presenter's user id for *Connect*, which the view entity does not and must not.
- [[Badge & QR Story|Badge & QR · S7–S12]] — whether rotation is server-scheduled or on demand, which decides the client's refresh rule in S1.
- [[T-037 Event pass with a 60 s rotating code]] — the pass window and whether the client or the server drives the 60 s boundary.
- (Badge & QR · S7–S12) **Get or rotate.** If every `POST` revokes the previous token, opening the badge twice (or on two phones) kills the code just shown. The app asks for: return the current token while it's in its window, and issue a new one only when it's past it or when the owner asks to reset it.
- (Badge & QR · S7–S12) **What the QR encodes.** A bare token only works inside the app. A URL carrying the token (for example `https://<domain>/q/<token>`) also opens the browser page for people without the app ([[Badge & QR Story|Badge & QR · S20]]) and lets the phone's own camera open the app. The app asks for the URL form, decided now so printed codes don't change later.
- (Badge & QR · S7–S12) **Response shape.** The app needs `{ token, issuedAt, expiresAt }` (and `url` if the URL form is chosen); `expiresAt` from the server, so the countdown doesn't trust the phone's clock.
- (Badge & QR · S13–S18) **Signed in only, or anyone.** The app always calls it signed in. A browser page for people without the app needs it without a token ([[Badge & QR Story|Badge & QR · S20]]); the route shape should allow that later.
- (Badge & QR · S13–S18) **The presenter's id for Connect.** The view body has no user id today. Either the resolve response adds one (or an opaque handle), or *Connect* goes through the token.
- (Badge & QR · S13–S18) **Own badge.** How the app knows the scanned badge is the viewer's own: a flag on the response, or the presenter's id compared with the signed-in user.
- (Badge & QR · S13–S18) **Rate limit.** Scanning is the obvious place to guess codes; a per-viewer limit with a 429 the app can show as "Slow down".

