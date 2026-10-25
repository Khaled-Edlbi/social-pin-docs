---
type: story
code: T-008
scope: task
feature: badge-qr
module: discovery
status: draft
screens: [s43, s44]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
owner: "omar"
created: 2026-10-18
updated: 2026-10-25
tags: [story, story/draft, module/discovery, layer/business]
task: T-008
---

# T-008 · Resolve a scanned QR token · User Story

**Task:** [[T-008 Resolve a scanned QR token]] · **Feature:** [[Badge & QR]] · **Feature-level note:** [[Badge & QR Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-008 Frontend Requirements]] · **Backend Integration:** [[T-008 Backend Integration]] · **Verified by:** [[T-008 QA Backend]], [[T-008 QA Frontend]]

> Derived from the task [[T-008 Resolve a scanned QR token]]; **not approved by product yet**. The feature-level story is [[Badge & QR Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

`GET /views/qr/:token` → same body as `GET /views/ring/:ringId`, same single 404. Increments the scan counter. Never returns the ring id.

## Persona

The **scanner**: someone holding up their phone to another person's badge, at a meeting or an event, who wants to see that person's card a second later. Behind them, the **presenter**, whose code must only ever show the Ring they chose, and who must not be discoverable by guessing codes. Issuing the code is [[T-007 Issue and rotate the QR token for a Ring]]; *Connect* on the result is [[T-021 Connect request send, inbox, cancel]].

## Stories

### S1 · Scan a badge, see the card ([[Screen Index#s43|s43]] → [[Screen Index#s44|s44]])

**As a** scanner **I want** to point my camera at a badge and see that person's card **so that** I know who they are and what they share with me.

Acceptance criteria:
- [ ] The scanner reads the code and calls `GET /views/qr/:token`; while it waits, s43 shows "Checking which Ring they belong in".
- [ ] A valid token returns the same body as `GET /views/ring/:ringId` (`RingProfileViewEntity`); s44 renders it as [[View As & Pin Views Backend Integration]] describes: `null` is "not shared", no Ring name anywhere.
- [ ] The response never contains the Ring id; the app never shows or stores one.

### S2 · A dead code says nothing about why ([[Screen Index#s43|s43]])

**As a** presenter **I want** an old, revoked or wrong code to give nothing away **so that** nobody learns whether a Ring exists or that I blocked them.

Acceptance criteria:
- [ ] Unknown, rotated, revoked, expired-Ring, deleted-Ring, not-shared and blocked all answer one 404, the same body as `/views` ("This profile isn't available").
- [ ] The scanner keeps scanning after it; no retry loop.
- [ ] Response time doesn't tell the cases apart.

### S3 · Not our code ([[Screen Index#s43|s43]])

**As a** scanner **I want** a QR that isn't a Social Pin code to be ignored politely **so that** I don't wait on a menu or a Wi-Fi code.

Acceptance criteria:
- [ ] A code that isn't in Social Pin's format is rejected on the phone, without a request: "Not a Social Pin code", keep scanning.

### S4 · Scanning my own badge ([[Screen Index#s43|s43]])

**As a** Ring owner **I want** scanning my own badge to show me what others see **so that** I check it before an event.

Acceptance criteria:
- [ ] The resolve tells the app the presenter is the viewer (or returns enough for the app to know), and the app opens View as for that Ring, marked as a preview.

### S5 · The presenter's scan is counted ([[Screen Index#s34|s34]])

**As a** presenter **I want** each scan of my code counted **so that** the badge can show my reach later.

Acceptance criteria:
- [ ] Each successful resolve increments the Ring's scan counter once; a dead code doesn't.
- [ ] The scanner is never told it was counted. Showing the count is [[T-009 Scan counter and share link]].

### S6 · Then connect ([[Screen Index#s44|s44]])

**As a** scanner **I want** *Connect* on the card **so that** the presenter can add me to their Ring.

Acceptance criteria:
- [ ] The resolve returns what *Connect* needs to address the presenter (a user id or an opaque handle), since the view body has none today. The request itself is [[T-021 Connect request send, inbox, cancel]].

## States and motion the design asks for

- Scanning: the viewfinder, a ghost code in the frame.
- Checking: "Checking which Ring they belong in" while resolving.
- Found: hand-off to s44.
- Not available (any 404), Not a Social Pin code, Camera permission denied (inline, *Open settings*), Offline ("You're offline", keep the camera running).
- Motion: the design's flip from the badge to the scanner; reduced motion crossfades.

## Rules the backend already enforces

- `GET /views/ring/:ringId` resolves through `RingAccessService` with one 404 for missing, not shared and blocked; the token route must reuse it so both stay identical.
- Sensitive fields are `null` unless the projection shows them; the view never names the Ring.
- Enumeration resistance is part of the error contract ([[Error Contract]]).

## Open questions

- **Signed in only, or anyone.** The app always calls it signed in. A browser page for people without the app needs it without a token ([[T-010 Public browser page for viewers without the app]]); the route shape should allow that later.
- **The presenter's id for Connect.** The view body has no user id today. Either the resolve response adds one (or an opaque handle), or *Connect* goes through the token.
- **Own badge.** How the app knows the scanned badge is the viewer's own: a flag on the response, or the presenter's id compared with the signed-in user.
- **Rate limit.** Scanning is the obvious place to guess codes; a per-viewer limit with a 429 the app can show as "Slow down".
