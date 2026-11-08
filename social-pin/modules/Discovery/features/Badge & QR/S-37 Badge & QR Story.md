---
id: S-37
type: story
module: discovery
feature: badge-qr
status: approved
scope: feature
screens: [s34, s43, s44, s56]
approvedBy: "Omar Fostok"
approvedAt: 2026-11-08
owner: "Omar Fostok"
related: ["D-10 Connect sends what the requester already has", "D-11 The badge code stays the same for its day", "D-12 The badge QR is a socialpin.me link", "D-22 The public page only says the Pin exists", "D-28 Scan someone in is not in the MVP", "D-35 A join code can be shown as a QR", "ND-10 How Connect addresses the scanned person", "ND-11 Get or rotate the badge token", "ND-12 What the badge QR encodes", "S-19 View As & Pin Views Story", "S-23 Connections Story", "S-33 Ring Invitations & Join Story", "S-53 Events During Story", "S-71 Subscription (Free vs Pro) Story", "S-82 Devices & NFC Story", "BI-09 View As & Pin Views Backend Integration", "F-12 View As & Pin Views", "F-28 Subscription (Free vs Pro)"]
created: 2026-10-18
updated: 2026-11-08
tags: [story, story/approved, module/discovery, layer/business]
---

# Badge & QR · User Story

**Feature:** [[F-18 Badge & QR]] · **Status:** Approved (2026-11-08 by Omar Fostok) · **Frontend Requirements:** [[FR-18 Badge & QR Frontend Requirements]] · **API Integration:** not yet (backend not built)

> **Rewritten 2026-11-08** as one set of parts, in the order the moment happens, with [[D-10 Connect sends what the requester already has|D-10]], [[D-11 The badge code stays the same for its day|D-11]], [[D-12 The badge QR is a socialpin.me link|D-12]], [[D-22 The public page only says the Pin exists|D-22]], [[D-28 Scan someone in is not in the MVP|D-28]] and [[D-35 A join code can be shown as a QR|D-35]]. It replaces the old S1–S20, where S1–S6 and the merged tasks T-007 to T-010 (S7–S20) said the same things twice. The story was approved on 2026-10-25 (khaled) and goes back to draft for approval of the rewrite.

The badge is the centre tab and the physical moment of the product: two people face to face, one shows a code, the other scans it. The code belongs to the Ring the presenter picked on the badge, so showing it is the same act as choosing what the other person sees. The scanner's side turns a square of pixels into a person's card, and that card is whatever that Ring shows. **A scan only ever shows a card**: it never puts anyone into anyone's Ring ([[D-28 Scan someone in is not in the MVP|D-28]]); being added to a Ring is *Connect* and *Accept* ([[S-23 Connections Story]]), an invitation or a join code ([[S-33 Ring Invitations & Join Story]]).

**What exists today** (backend, per [[BD-18 Badge & QR Backend Delivery]]): the `RingQrToken` table (opaque, hashed at rest, revocable) and the card route `GET /views/ring/:ringId`; `GET /views/pin/:pinName` ([[BI-09 View As & Pin Views Backend Integration]]). No route issues, resets or resolves a code, and nothing counts scans. The `socialpin.me` domain and the app links are not set up.

## Persona

- **The presenter**: any signed-in user who taps the centre tab to show their badge ([[Screen Index#s34|s34]]), at a meetup, a desk or an event.
- **The scanner**: any signed-in user who flips the badge to the scanner ([[Screen Index#s43|s43]]) and reads someone else's code, then sees their card ([[Screen Index#s44|s44]]).
- **Someone without the app**: reaches nothing until the domain exists; then the [[D-22 The public page only says the Pin exists|D-22]] web page (name and Pin name only).

## Stories

### S1 · Show my badge ([[Screen Index#s34|s34]])

**As a** presenter **I want** the centre tab to rise into a large QR for the Ring I picked **so that** the person in front of me lands on the card I meant.

Acceptance criteria:
- [ ] Opening the badge asks for the picked Ring's code: `POST /rings/:ringId/qr` → `{ token, issuedAt, expiresAt, url }` ([[D-11 The badge code stays the same for its day|D-11]], [[D-12 The badge QR is a socialpin.me link|D-12]]). The QR is drawn from `url`, `https://socialpin.me/q/<token>`; the token is opaque (no Ring id, no user id).
- [ ] **The same code all day:** opening the badge again, or on a second phone, shows the same code while it is inside its window; a new one comes only once `expiresAt` has passed.
- [ ] Beside the QR: the Ring's name and colour, my display name and Pin name, and "Changes in {time}" counted from `expiresAt` (the server's time, not the phone's).
- [ ] **Switching Ring** in the picker re-draws the badge in place with that Ring's code; each Ring has its own code, and going back to a Ring shows its code again while it's valid.
- [ ] Loading: the card with the code area as a ghost until the code arrives.
- [ ] *No Ring*: when none of my Rings is live, explain it and link to My Rings.
- [ ] Not available yet: the code route.

### S2 · Reset my code ([[Screen Index#s34|s34]])

**As a** presenter **I want** to kill my code at once **so that** a photo or a screenshot I think was copied stops working.

Acceptance criteria:
- [ ] *Reset code* asks first ("Anyone holding the current code won't reach you with it"), then revokes the code and shows the new one ([[D-11 The badge code stays the same for its day|D-11]]; the backend chooses `{ reset: true }` or a reset route).
- [ ] The old code then answers the same neutral 404 as any unknown code (S6).
- [ ] Not available yet.

### S3 · Offline ([[Screen Index#s34|s34]])

**As a** presenter **I want** to know when the code I'm showing may be dead **so that** I don't hand someone a code that doesn't work.

Acceptance criteria:
- [ ] Offline, with the last code still inside its window: that code, with a *Refreshing* chip.
- [ ] Offline, past `expiresAt`: *Expired*, and no QR is drawn.

### S4 · Only my Rings, only live ones

**As a** presenter **I want** a code only for a Ring I own that is live **so that** nobody is shown a code that leads nowhere.

Acceptance criteria:
- [ ] A code asked for a Ring that isn't mine: 404 `E_RING_02`; the app reads my Rings again and resets the picked one.
- [ ] A Ring that has ended: refused; the badge picks another live Ring, or shows *No Ring*.
- [ ] Deleting a Ring revokes its code.

### S5 · Flip to the scanner ([[Screen Index#s34|s34]] → [[Screen Index#s43|s43]])

**As a** presenter who is also the one scanning **I want** to flip the badge to the camera **so that** both sides of the exchange live in one gesture.

Acceptance criteria:
- [ ] *Flip to scan* turns the card to the camera; flipping back shows the badge without asking for the code again.
- [ ] Camera permission denied: an inline state with *Open settings*; the badge side keeps working.
- [ ] Reduced motion: a crossfade instead of the flip.

### S6 · Reading a code ([[Screen Index#s43|s43]])

**As a** scanner **I want** a code to turn into the person behind it **so that** I see them the way they chose to show themselves to me.

Acceptance criteria:
- [ ] **The phone reads the link itself**, without a request ([[D-12 The badge QR is a socialpin.me link|D-12]]):
  - `https://socialpin.me/q/<token>` → a badge: resolve it (below);
  - a Ring's **join QR** → the join review of [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S9]] ([[D-35 A join code can be shown as a QR|D-35]]; how the two are told apart is in BD-17);
  - anything else (a menu, a Wi-Fi code): "Not a Social Pin code", and the camera keeps scanning.
- [ ] Works the same for a code picked **from photos**.
- [ ] One resolve per code per 5 s; while it waits, "Checking who this is".
- [ ] A badge resolves with `GET /views/qr/:token` → the person's card, the same body as `GET /views/ring/:ringId` (`RingProfileViewEntity`, [[BI-09 View As & Pin Views Backend Integration]]); never a Ring id or a user id. The answer also carries the code's `expiresAt`, for S8.
- [ ] **One neutral answer** for unknown, expired, reset, ended Ring, deleted Ring, not shared and blocked: 404, "This profile isn't available", keep scanning; the response time doesn't tell them apart.
- [ ] Too many scans in a short time: 429, "Slow down", keep the camera open (the numbers: `/backend` proposes them).
- [ ] Not available yet: the resolve route.

### S7 · Scanning my own badge ([[Screen Index#s43|s43]])

**As a** presenter **I want** scanning my own badge to show me what others see **so that** I check it before an event.

Acceptance criteria:
- [ ] The app knows its own current codes (S1): when the scanned token is one of them, it opens View as for that Ring, marked as a preview ([[S-19 View As & Pin Views Story|View As & Pin Views]]). No request and no backend change ([[D-10 Connect sends what the requester already has|D-10]] keeps the card without ids).
- [ ] A code of mine that has expired or been reset reads as any dead code (S6).

### S8 · The scanned card ([[Screen Index#s44|s44]])

**As a** scanner **I want** the card to lead somewhere **so that** a scan becomes a connection.

Acceptance criteria:
- [ ] Renders the card as [[BI-09 View As & Pin Views Backend Integration]] describes: `null` is "not shared", sensitive rows hidden when `null`, no Ring name anywhere.
- [ ] **Connect** sends the scanned code, `POST /connections/requests { qrToken }` ([[D-10 Connect sends what the requester already has|D-10]], [[S-23 Connections Story|Connections · S2]]).
- [ ] **Save for later** keeps the card, the scanned code and its `expiresAt` on this phone only (no server call), in a "Saved scans" list, and returns Home.
- [ ] From a saved scan, **Connect works until the code expires**; after `expiresAt` the saved card reads "This code has expired. Scan {name} again to connect.", and *Connect* is off. The saved card is the one seen at the scan, marked with its date; it is never read again from the server.
- [ ] A saved scan can be removed; nothing about it ever leaves the phone.
- [ ] Not available yet: Connect ([[S-23 Connections Story]]).

### S9 · Enter a Pin name ([[Screen Index#s43|s43]])

**As a** scanner whose camera can't read a code **I want** to type the person's Pin name **so that** I can still open their card.

Acceptance criteria:
- [ ] *Enter a Pin name* opens a field; `GET /views/pin/:pinName` (without the `!`) opens the card **if I am in one of their Rings**, else the same neutral "This profile isn't available" ([[BI-09 View As & Pin Views Backend Integration]], [[D-22 The public page only says the Pin exists|D-22]]). This exists today.
- [ ] Connect from that card sends `{ pinName }` (D-10).

### S10 · The scan is counted

**As a** presenter **I want** each scan of my code counted **so that** the badge can show my reach later.

Acceptance criteria:
- [ ] Each successful resolve counts once for that Ring; a dead code doesn't; the scanner is never told.
- [ ] Not available yet; showing the count is S13.

### S11 · What a scan never does

**As a** presenter **I want** a scan to show my card and nothing more **so that** nobody lands in one of my Rings because they pointed a camera at me.

Acceptance criteria:
- [ ] No "Accept scans automatically", no "Auto-accept until", and no "They will land in {Ring}" on the scanner: a scan never adds the scanner, or the scanned person, to a Ring ([[D-28 Scan someone in is not in the MVP|D-28]]).
- [ ] People reach my Rings through *Connect* and *Accept* ([[S-23 Connections Story]]), an invitation or a join code ([[S-33 Ring Invitations & Join Story]]).
- [ ] A badge never offers a Ring to join (D-35): joining by scan is only a Ring's join QR.

### S12 · Share link and Save image ([[Screen Index#s34|s34]])

**As a** presenter **I want** to send my badge to someone who isn't in front of me **so that** the badge works beyond face to face.

Acceptance criteria:
- [ ] **Save image** saves the badge (the QR with my name and the Ring's colour) to the phone's photos, with "Works until {time}" from `expiresAt`; someone with the app reads it with *From photos* (S6).
- [ ] **Share link** stays on the badge as "Not available yet" until `socialpin.me` and the app links work ([[D-12 The badge QR is a socialpin.me link|D-12]]); then it shares `url`, which opens the app where it is installed and the [[D-22 The public page only says the Pin exists|D-22]] page (name and Pin name, nothing from any Ring) where it isn't.
- [ ] **NFC tap**: "Not available yet" ([[S-82 Devices & NFC Story|Devices & NFC · S7]]).

### S13 · Scan count on the badge ([[Screen Index#s34|s34]])

**As a** presenter **I want** to see how often the picked Ring's code was scanned **so that** I know my reach.

Acceptance criteria:
- [ ] The count of scans for the picked Ring (S10), read when the badge opens; no polling.
- [ ] Not available yet: the count route. Until then nothing is shown (no made-up number).

### S14 · Pro keeps one code ([[Screen Index#s70|s70]])

- [ ] A Pro account can keep a permanent code to print once: [[S-71 Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]]. It waits until `socialpin.me` works ([[D-12 The badge QR is a socialpin.me link|D-12]]).
- [ ] A free account always gets the 24 h code; the badge shows "This code changes every 24 h" and *Get Pro*.

### S15 · Event pass ([[Screen Index#s56|s56]])

- [ ] The event pass is the same kind of code with a 60 s window: [[S-53 Events During Story|Events During · S9]]. It never shows the Event Ring's id.

## States and motion the design asks for

- Badge: loading (ghost code), ready, *Refreshing* (offline, in window), *Expired* (offline, past window), *No Ring*, reset confirm.
- Scanner: looking, checking, found (hand-off to s44), not available, not a Social Pin code, slow down, camera denied, offline ("You're offline", camera stays on).
- Card: from a scan, from a saved scan (date, live or expired code), from a Pin name.
- Motion: **rise + expand** from the centre tab into the badge, reversible; the badge **re-composes** on Ring change; the **card flip** to the scanner; a found code **animates into the card**. Each has a reduced-motion crossfade.

## Where the design and the app disagree (for the designer)

| Where | The design / the app today | The story |
|---|---|---|
| s34 | "Accept scans automatically" and "Auto-accept until 18:00" | Removed: a scan never adds anyone to a Ring (S11, D-28) |
| s43 | "They will land in {Ring}" with *Change* | Removed: the scanner sees the presenter's card, and lands nowhere (S11) |
| s34 | "Anyone without the app lands on your {ring} card in a browser" | Without the app: nothing until the domain; then the D-22 page, with no Ring (S12) |
| s34 | A fixed sample code "A-2213-7741" | The QR from `url`, with "Changes in {time}" (S1) |
| s34 | No *Reset code* | *Reset code* (S2) |
| s44 | *Save for later* with no limit | Connect from a saved scan until its code expires (S8) |

## What the backend has to build

1. **The code** ([[D-11 The badge code stays the same for its day|D-11]], [[D-12 The badge QR is a socialpin.me link|D-12]]): `POST /rings/:ringId/qr` → `{ token, issuedAt, expiresAt, url }`, the same token while in its 24 h window, a new one past it; `url` from a configured base `https://socialpin.me/q/`; reset; revoke on Ring delete; only my live Rings.
2. **The resolve**: `GET /views/qr/:token` → the card (`RingProfileViewEntity`) plus the code's `expiresAt`, one neutral 404 with even timing, a per-viewer rate limit (429), the scan counted once per success.
3. **Connect by code** shares the token lookup ([[D-10 Connect sends what the requester already has|D-10]], [[BD-14 Connections Backend Delivery]]).
4. **The scan count** read per Ring (S13).
5. **Later, with the domain:** the `/q/<token>` web route, the D-22 page and the app-link files.

## Rules the backend already enforces

- A card is rendered through `RingAccessService` ([[Ring Access Model]]): one 404 `E_RING_ACCESS_01` for missing, not shared and blocked; a Ring not live 404 `E_RING_ACCESS_02` ([[F-12 View As & Pin Views]]). The QR resolve must reuse it, so both answer alike.
- `RingProfileViewEntity` carries no Ring id, user id or owner id; sensitive fields are `null` unless the Ring shows them.
- `RingQrToken` is opaque, hashed at rest and revocable.
- `GET /views/pin/:pinName` answers only a viewer who is in one of the person's Rings.
- A permanent code is a Pro gate ([[F-28 Subscription (Free vs Pro)]]).

## Open questions

All the earlier questions are decided:

- What Connect addresses: [[D-10 Connect sends what the requester already has]] (the scanned code, or the Pin name).
- Get or rotate the code: [[D-11 The badge code stays the same for its day]] (the same code all day, a reset).
- What the QR carries: [[D-12 The badge QR is a socialpin.me link]] (a `socialpin.me` link, read by the app without the domain).
- What someone without the app sees: [[D-22 The public page only says the Pin exists]] (name and Pin name).
- Scanning someone into a Ring: [[D-28 Scan someone in is not in the MVP]] (not in the MVP).
- A join QR: [[D-35 A join code can be shown as a QR]] (a Ring's join code, never a badge).
- Scanning my own badge: answered here, by the app (S7).

Left, none blocking:

- The rate limit's numbers: `/backend` proposes them.
- When `socialpin.me` and the app links are set up: no date yet; Share link, the web page, deep links and Pro codes wait on it.

## Log

- 2026-10-25 · approved by khaled
- 2026-11-08 · `tickets/pm/M-04-discovery/F-18-badge-qr/S-37-rewrite` · rewritten as one set of parts (S1–S15) with D-10, D-11, D-12, D-22, D-28 and D-35, replacing the doubled S1–S20; a reset (S2); the scanner reads the link on the phone and sends a join QR to S-33 (S6); own badge known by the app (S7); Save for later connects until the code expires (S8); Pin name lookup, which exists (S9); what a scan never does (S11); Share link "Not available yet" until the domain, Save image kept (S12); the five flags cleared; back to draft for approval
- 2026-11-08 · flagged [[FR-18 Badge & QR Frontend Requirements]]: S-37 rewritten (S1–S15): the code with url, reset, offline, the link read on the phone with join QR to S-33, own badge by the app, Save for later until expiresAt, Pin name lookup, no auto-accept or "land in", Share link not available until the domain, Save image kept
- 2026-11-08 · flagged [[BD-18 Badge & QR Backend Delivery]]: S-37 rewritten (S1–S15): "What the backend has to build" lists the code route with url and reset, the resolve with expiresAt, a 429 rate limit and the scan count, Connect sharing the token lookup, and the domain routes later
- 2026-11-08 · `tickets/pm/M-04-discovery/F-18-badge-qr/S-37-approved` · approved by Omar Fostok; FR-18 continues
