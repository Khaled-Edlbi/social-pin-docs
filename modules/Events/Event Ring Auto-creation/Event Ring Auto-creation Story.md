---
type: story
code: event-ring-auto
scope: feature
feature: event-ring-auto
module: events
status: draft
screens: [s52]
created: 2026-10-18
updated: 2026-10-18
tags: [story, story/draft, module/events, layer/business]
---

# Event Ring Auto-creation · User Story

**Feature:** [[Event Ring Auto-creation]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Event Ring Auto-creation Frontend Requirements]] · **API Integration:** not yet (backend not built)

A visitor has just paid for, or RSVP'd to, an event. The product promise is that registration does not end in a receipt but in an identity change: an Event Ring appears in their hub, and "entering" the event means switching to it. This story covers the moment the Ring is granted and the places it has to show up afterwards. The backend has the `EVENT` Ring type and the temporary-Ring lifecycle, but nothing creates the Ring yet ([[T-011 Create the Event Ring on registration]]).

## Persona

Visitor (User A) at the end of registration (s51 → s52). The exhibitor (User B) and organizer (User C) sides are membership rules the backend grants in the same transaction; they have no screen of their own here and are listed under open questions.

## Stories

### S1 · Event Ring granted ([[Screen Index#s52|s52]])

**As a** visitor who just completed registration, **I want** to see that an Event Ring was created for this event, **so that** I understand my ticket is now a perspective of my profile, not a PDF.

Acceptance criteria:
- [ ] The screen shows the event name and cover, the Ring's name as the backend set it, and the window (`startsAt` / `expiresAt` = event dates) with the temporary treatment ("ends after the event").
- [ ] Two CTAs only: "Enter event mode" → [[Screen Index#s53|s53]] and "See it in my Ring hub" → [[Screen Index#s16|s16]].
- [ ] The screen is reached only from a succeeded payment or a free RSVP on [[Screen Index#s51|s51]]; a pending or failed payment never lands here.
- [ ] If the Ring is not readable yet (payment confirmed by webhook, Ring still being written), the screen shows "Setting up your Ring…" and retries; it never renders empty.

### S2 · Ring joins the carousel ([[Screen Index#s16|s16]])

**As a** visitor, **I want** the new Event Ring to appear in My Rings with the event's dates, **so that** I can find it, preview it and manage its members like any other Ring.

Acceptance criteria:
- [ ] The Ring is listed by `GET /rings` with `type = EVENT`, `isTemporary = true` and the event window; it is not the default Ring.
- [ ] It is visually distinct from permanent Rings (dashed / temporary treatment, by structure, not colour).
- [ ] "View as" on it renders `GET /views/ring/:ringId` while the Ring is live; once `expiresAt` passes, the same call returns the expired 404 and the UI shows "This event has ended" with the disposition entry ([[Post-Event Story]]).

### S3 · Enter event mode ([[Screen Index#s53|s53]])

**As a** visitor, **I want** "Enter event mode" to switch my active Ring to the Event Ring, **so that** my badge, nearby-by-Ring and what I show are the event-scoped ones.

Acceptance criteria:
- [ ] The switch sets the client's active Ring id and plays the signature Ring re-compose motion; nothing is written to the server.
- [ ] The CTA is disabled, with the pending text from S1, until the Ring exists.
- [ ] "Exit" on s53 restores the previously active Ring and returns to [[Screen Index#s11|s11]].

### S4 · The pass is bound to the Ring ([[Screen Index#s56|s56]])

**As a** visitor, **I want** my event pass to be issued for the Event Ring, **so that** a scan at the door resolves to my event perspective and nothing else.

Acceptance criteria:
- [ ] The pass screen cannot open before the Ring exists; it shows the pending state instead.
- [ ] The rotating code is requested for the Event Ring's id, never for the default Ring ([[T-037 Event pass with a 60 s rotating code]] waits on T-011).

### S5 · Membership stays private ([[Screen Index#s53|s53]])

**As a** visitor in event mode, **I want** exhibitors and other attendees to see my event perspective without learning which Ring I put them in, **so that** the Ring model stays mine.

Acceptance criteria:
- [ ] Nothing the client renders for another attendee names a Ring id or a membership row; the exhibitor card is a Ring view, not a member list.
- [ ] Lists on s53 / s54 are scoped by the viewer's live membership of the Event Ring, resolved by the backend on every request; the client caches nothing across the event's `expiresAt`.

## States and motion the design asks for

- Motion: successful registration animates the **Event Ring joining the Ring carousel**, a continuous bridge from "event" to "identity" (brief §7.3, signature motion 8). Reduced-motion: a fade-in on the carousel item.
- Motion: entering event mode uses the **Ring re-compose** motion (brief §8.1).
- State: pending ("Setting up your Ring…"), granted, ended (after `expiresAt`, see [[Post-Event Story]]).
- State: the Event Ring carries the temporary treatment everywhere it is drawn (hub, switcher, badge).

## Rules the backend already enforces

- `POST /rings` rejects `type = EVENT` with 400 `E_RING_01`; the client must never create the Ring itself. Only the registration transaction will (T-011).
- Access is resolved on every request against `now`; both the Ring's window and the membership's are checked, and expiry is exclusive: the Ring is unreadable at its `expiresAt` instant ([[Ring Access Model]]).
- The owner's "View as" of an expired Ring is a 404 `E_RING_ACCESS_02`; the post-event screen must not rely on it to preview the Ring.
- Owner editing ignores expiry (`assertCanAdminister`), so the keep / merge / auto-delete choice stays possible after the event ([[Rings]]).
- A viewer never learns which Ring they are in; `RingProfileViewEntity` has no `ringId`.

## Open questions

- No decision note exists for this feature. Open points live in the tasks:
- [[T-011 Create the Event Ring on registration]] — who owns the Event Ring (the visitor, as the hub shows, or the organizer with the visitor as member) and what the organizer / exhibitor membership rules are. The feature note lists this as a gap; the story assumes the visitor sees it as their own Ring until decided.
- [[T-035 Registration transaction with order and payment]] — whether the Ring is created at order time or on webhook success decides how long S1's pending state can last.
