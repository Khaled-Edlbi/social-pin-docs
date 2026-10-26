---
type: story
code: T-007
scope: task
feature: badge-qr
module: discovery
status: draft
screens: [s34]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
owner: "omar"
created: 2026-10-18
updated: 2026-10-26
tags: [story, story/draft, module/discovery, layer/business]
task: T-007
---

# T-007 · Issue and rotate the QR token for a Ring · User Story

**Task:** [[T-007 Issue and rotate the QR token for a Ring]] · **Feature:** [[Badge & QR]] · **Feature-level note:** [[Badge & QR Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-007 Frontend Requirements]] · **Backend Integration:** [[T-007 Backend Integration]] · **Verified by:** [[T-007 QA Backend]], [[T-007 QA Frontend]]

> Derived from the task [[T-007 Issue and rotate the QR token for a Ring]]; **not approved by product yet**. The feature-level story is [[Badge & QR Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

`POST /rings/:ringId/qr` returns an opaque token; previous token revoked; 24 h rotation. Permanent token behind the Pro gate (T-049).

## Persona

A Ring owner about to be scanned: at a meeting, a desk, an event, holding up the badge for the Ring this person should land in ("Clients", "Family"). They want the code to work now, to show the right Ring, and to stop working when they stop sharing it. This task is the presenter's side: getting a real code. Reading it is [[T-008 Resolve a scanned QR token]]; the scan count and share link are [[T-009 Scan counter and share link]].

## Stories

### S1 · My badge shows a real code for the Ring I chose ([[Screen Index#s34|s34]])

**As a** Ring owner **I want** my badge to show a working QR for the active Ring **so that** whoever scans it lands in that Ring.

Acceptance criteria:
- [ ] Opening the badge gets a token for the active Ring (`POST /rings/:ringId/qr`) and draws it as the QR.
- [ ] The token is opaque: it carries neither the Ring id nor my user id, and nothing can be read from it.
- [ ] The Ring's name and colour sit beside the code, as now.

### S2 · Switching Ring switches the code ([[Screen Index#s34|s34]])

**As a** Ring owner **I want** the code to change when I pick another Ring on the badge **so that** the next person lands where I meant.

Acceptance criteria:
- [ ] Choosing another Ring in the picker re-draws the badge with that Ring's token, in place.
- [ ] Each Ring has its own token; switching back to a Ring reuses its token while it's still valid.

### S3 · The code rotates every day ([[Screen Index#s34|s34]])

**As a** Ring owner **I want** my code to change every 24 hours **so that** a photo of my badge stops working.

Acceptance criteria:
- [ ] A token is valid for 24 h from `issuedAt`; the response says when it expires.
- [ ] Opening the badge with a token past its window fetches a new one before showing it.
- [ ] Getting a new token revokes the previous one for that Ring: scanning the old one answers the same neutral 404 as any unknown code.
- [ ] The "rotates every 24 h" line on the badge is true.

### S4 · Offline, the badge says so ([[Screen Index#s34|s34]])

**As a** Ring owner **I want** to know when the code I'm showing may be stale **so that** I don't hand someone a dead code.

Acceptance criteria:
- [ ] Offline with a token still in its window: the last token, with a *Refreshing* chip.
- [ ] Offline past the window: *Expired*; no QR is drawn.

### S5 · Only my Rings, only live ones

**As a** Ring owner **I want** codes only for Rings I own that are live **so that** nobody shows a code for a Ring that can't be seen.

Acceptance criteria:
- [ ] A token for a Ring that isn't mine: 404 `E_RING_02`. The app refetches my Rings and resets the active one.
- [ ] A token for an expired Ring: refused; the badge shows *No Ring* with a link to My Rings when none of my Rings is live.
- [ ] Deleting a Ring revokes its token.

### S6 · Pro keeps one code ([[Screen Index#s70|s70]])

**As a** Pro user **I want** a permanent code **so that** I print it once.

Acceptance criteria:
- [ ] Out of scope here: [[T-049 Subscription endpoints and a single Pro gate]]. A free account always gets the 24 h token; the badge shows *Get Pro* next to the "rotates daily" line.

## States and motion the design asks for

- Loading: the badge card with the code area in its ghost state until the token arrives.
- Ready: the QR, the Ring name and colour, "rotates every 24 h".
- *Refreshing* (offline, in window), *Expired* (offline, past window), *No Ring* (no live Ring).
- Motion: switching Ring re-composes the card in place; reduced motion crossfades.

## Rules the backend already enforces

- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]); a Ring's live window decides whether it can be shown.
- `GET /views/ring/:ringId` already renders a Ring for a viewer, with one 404 for missing, not shared and blocked; the token must resolve to the same body ([[T-008 Resolve a scanned QR token]]).
- The Ring id is not shown to viewers; the token must not leak it.

## Open questions

- **Get or rotate.** If every `POST` revokes the previous token, opening the badge twice (or on two phones) kills the code just shown. The app asks for: return the current token while it's in its window, and issue a new one only when it's past it or when the owner asks to reset it.
- **What the QR encodes.** A bare token only works inside the app. A URL carrying the token (for example `https://<domain>/q/<token>`) also opens the browser page for people without the app ([[T-010 Public browser page for viewers without the app]]) and lets the phone's own camera open the app. The app asks for the URL form, decided now so printed codes don't change later.
- **Response shape.** The app needs `{ token, issuedAt, expiresAt }` (and `url` if the URL form is chosen); `expiresAt` from the server, so the countdown doesn't trust the phone's clock.
