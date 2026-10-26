---
type: story
code: events-during
scope: feature
feature: events-during
module: events
status: draft
screens: [s53, s54, s55, s56, s57, s58]
created: 2026-10-18
updated: 2026-10-26
tags: [story, story/draft, module/events, layer/business]
---

# Events During · User Story

**Feature:** [[Events During]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Events During Frontend Requirements]] · **API Integration:** not yet (backend not built)

The visitor is at the venue with the Event Ring active. They need the schedule, the floor map, the exhibitors, their pass at the door, and a way into lounges and upgrades. Every list in event mode is a question to the access engine: what may this attendee see of this event, right now? The schema for exhibitors, booths and mini-events exists; there is no products table and no endpoint.

## Persona

Visitor (User A) in event mode, from "Enter event mode" on s52 or s49 until "Exit". The exhibitor (User B) sees the same hub plus their own tools ([[Exhibitor Story]]).

## Stories

### S1 · Event mode hub ([[Screen Index#s53|s53]])

**As a** visitor, **I want** a hub that re-composes around the Event Ring, **so that** everything I need at the venue is one tap away.

Acceptance criteria:
- [ ] Entering plays the Ring re-compose motion; the badge and active-Ring chip show the Event Ring.
- [ ] Tiles: Your pass (with the level, e.g. "Full Access"), Schedule, Floor map, Catalogue, Exhibitors, Smart Match, Lounges, Nearby by Ring, My meetings today, Upgrade access, Get help (Gemma), Exit.
- [ ] Smart Match and any-lounge access tiles show a Pro lock for Free accounts and route to [[Screen Index#s70|s70]]; the lock state comes from the account, not from a client flag.
- [ ] "Nearby by Ring" lists only people whose Ring I am a live member of; coordinates never reach the client ([[PinCast & Nearby]]).
- [ ] Once the event's `expiresAt` passes, the hub closes and the post-event flow opens ([[Post-Event Story]]).

### S2 · Exhibitors list ([[Screen Index#s54|s54]])

**As a** visitor, **I want** to browse the exhibitors of this event with a search and a "Meet" shortcut, **so that** I can plan whom to visit.

Acceptance criteria:
- [ ] Cards show the business name, logo, booth code, tags; "Meet" opens [[Screen Index#s59|s59]] for that exhibitor.
- [ ] The list is scoped by my Event Ring membership on the server; an attendee whose Ring lapsed gets the same 404 as a non-attendee, and the client shows "Not available for this event".
- [ ] Search by name and tag, paginated; saved exhibitors ("Save" on s55) float to the top of the list.

### S3 · Exhibitor detail ([[Screen Index#s55|s55]])

**As a** visitor, **I want** an exhibitor's event perspective (about, video, gallery, documents, products, team on the stand), **so that** I can decide to request a meeting.

Acceptance criteria:
- [ ] The card is the exhibitor's business Ring rendered as a Ring view: nothing on it names a Ring id or membership.
- [ ] "Request a meeting" → s59 with the exhibitor pre-selected; "Save" returns to s54.
- [ ] Video clicks and Ring opens are reported as analytics events for the exhibitor's dashboard ([[Exhibitor Story]] S4), without identifying the viewer unless they are a connection.

### S4 · Event pass ([[Screen Index#s56|s56]])

**As a** visitor at the door, **I want** a pass with a code that rotates every 60 seconds, **so that** a screenshot cannot be reused.

Acceptance criteria:
- [ ] The code is bound to the Event Ring and carries the level; a countdown ring shows the seconds left and the client fetches the next code before the current one lapses.
- [ ] Offline: the last code is shown with "may be expired" after its window; no new code is fabricated locally.
- [ ] "Show my badge" opens the normal badge ([[Screen Index#s34|s34]]) for the same Ring; permanent QR is a Pro gate there, not here.

### S5 · Floor map and booths ([[Screen Index#s57|s57]])

**As a** visitor, **I want** the booths on a map with the exhibitors behind them, **so that** I can walk to one.

Acceptance criteria:
- [ ] The map asset and booth positions come from the backend; tapping a booth opens s55; "List" returns to s54.
- [ ] "Directions" from a meeting detail (s67) highlights the booth of that meeting's exhibitor.
- [ ] Scoped like S2: no Ring, no map.

### S6 · Catalogue ([[Screen Index#s58|s58]])

**As a** visitor, **I want** products and talks in one browsable catalogue, **so that** I find what to see.

Acceptance criteria:
- [ ] Products belong to an exhibitor and open s55; talks belong to a mini-event and show time, room and the access state from S7.
- [ ] Blocked until [[T-039 Catalogue products and talks (new table)]] decides the schema; the tile is hidden, not disabled, until then.

### S7 · Lounges and upgrades ([[Screen Index#s53|s53]])

**As a** visitor, **I want** to see which sub-events and lounges I can enter, buy or need an upgrade for, **so that** I never walk to a locked door.

Acceptance criteria:
- [ ] Each mini-event shows one of three states: owned (my package's `MINI_EVENT_ACCESS` entitlement or Pro any-lounge), purchasable (price), locked (needs Delegate / Sponsor / VIP upgrade or Pro).
- [ ] Upgrade during the event follows [[Payments & Orders Story]]; on success the state flips to owned without leaving s53.
- [ ] Pro any-lounge access is a server-side gate; the client only reads the state.

## States and motion the design asks for

- Motion: entering an event **switches the active Ring to the Event Ring** with the signature re-compose (brief §8.1).
- Motion: requesting a meeting from s55 **spawns a temporary Ring** ([[Meetings Story]]).
- State: lounge locked / owned / purchasable (brief §8.3); pass code countdown and expired; exhibitor list empty and "not available".
- State: Pro lock on Smart Match, any-lounge access and the Gemma assistant.

## Rules the backend already enforces

- Exhibitor lists, the floor map and the catalogue are scoped by Event Ring membership, resolved on every request against `now` ([[Ring Access Model]]).
- "Not shared", "blocked" and "no such thing" are one 404 body; the client must not distinguish them.
- A Ring view never carries `ringId`, the owner's user id or the membership.
- The pass reuses the badge token mechanism (`RingQrToken`: opaque, hashed, revocable) with a shorter window ([[Badge & QR]]).
- Package → mini-event entitlement is data (`PackageEntitlement.featureType = MINI_EVENT_ACCESS`), so lounge states are read, not computed, by the client.

## Open questions

- No decision note exists. Open points:
- [[T-039 Catalogue products and talks (new table)]] — schema for products and talks undecided; S6.
- [[T-049 Subscription endpoints and a single Pro gate]] — until the `ProGate` exists, S1 and S7 cannot show a truthful lock.
- [[T-052 Smart Match]] — Pro and Gemma; the tile exists on s53 but the feature is [[Gemma AI]]'s.
