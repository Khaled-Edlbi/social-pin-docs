---
type: story
code: events-before
scope: feature
feature: events-before
module: events
status: draft
screens: [s48, s49, s50, s51, s52]
depends: ["D-07 Payment provider", "D-08 Payment methods and gateways on s51"]
related: ["Pay for an order", "Payments & Orders", "Event Ring Auto-creation", "DR-08 Stripe card checkout only"]
owner: "khaled"
updated: 2026-10-25
tags: [story, story/draft, module/events, layer/business]
---

# Events Before · User Story

**Feature:** [[Events Before]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Events Before Frontend Requirements]] · **API Integration:** not yet (backend not built)

A visitor browses upcoming events, opens one, picks a ticket or package, pays or RSVPs, and ends with an Event Ring in their hub. The schema for events, packages, entitlements and mini-events exists; no endpoint does yet. Everything below is the visitor's path from "I heard about this event" to "I am registered".

## Persona

Visitor (User A) before the event: discovering, deciding, registering. An exhibitor (User B) takes the same path and branches at s50 ("Set up" → business account, [[Exhibitor Story]]). The organizer (User C) publishes events on the web and is not on these screens.

## Stories

### S1 · Events tab ([[Screen Index#s48|s48]])

**As a** visitor, **I want** to browse upcoming events and see which I already joined, **so that** I can decide where to go and jump back into my own events.

Acceptance criteria:
- [ ] Two sections: "My events" (events I have a participant row for) and "Discover" (public upcoming events), each a card with name, cover, date, location.
- [ ] Filters: date range, location / city, "your contacts are going" (count and up to three avatars of my connections registered there, computed from what I may see, never from membership rows).
- [ ] Past events drop out of Discover and move to the bottom of My events with a "Past" marker.
- [ ] Empty state for each section; the tab bar stays reachable.

### S2 · Event landing ([[Screen Index#s49|s49]])

**As a** visitor, **I want** one page with the event's essentials, **so that** I can decide to register without leaving it.

Acceptance criteria:
- [ ] Shows name, cover, location with map, date and time in the event's timezone, schedule, exhibitor list, mini-events, lounges, Gemma entry, and one primary CTA.
- [ ] Primary CTA reads "RSVP" for free events, "Register" or "Get tickets" for paid ones, "Registered · Enter event mode" when I hold a participant row, "Sold out" when no package has capacity.
- [ ] Exhibitors, floor map and catalogue links open the in-event screens read-only before the event; the scoped versions need the Event Ring ([[Events During Story]]).

### S3 · Tickets, packages and levels ([[Screen Index#s50|s50]])

**As a** visitor, **I want** to compare packages and visitor levels and see what each unlocks, **so that** I pick the right access before paying.

Acceptance criteria:
- [ ] Each package shows name, price, level (Visitor, Sponsor, VIP, Exhibitor, Staff), the sub-events / lounges it entitles (`PackageEntitlement` rows with `MINI_EVENT_ACCESS`), remaining capacity or "Sold out".
- [ ] A sold-out or unavailable tier is visible but not selectable; the reason is shown ("Sold out", "Not available for your account type").
- [ ] "Continue · $160" reflects the selected package's price snapshot; the total is recomputed on the server at order time, never trusted from the client.
- [ ] The Exhibitor level routes to "Set up" → [[Screen Index#s63|s63]] instead of payment.

### S4 · RSVP and registration form ([[Screen Index#s50|s50]])

**As a** visitor, **I want** the registration form pre-filled from my account, **so that** registering takes seconds.

Acceptance criteria:
- [ ] Name, email, phone and company pre-fill from the base profile; the user can edit them for this registration only.
- [ ] A free package skips s51 and goes straight to s52 after one call.
- [ ] Submitting twice does not create two participants; the client sends one idempotency key per attempt.

### S5 · Payment ([[Screen Index#s51|s51]])

**As a** visitor, **I want** to pay for what I chose and see a clear result, **so that** I know whether I am in.

Acceptance criteria:
- [ ] "Continue" on s50 hands the unpaid order to s51; paying for it is [[Pay for an order]]: Stripe's hosted card page, card only, no method choice ([[DR-08 Stripe card checkout only]]).
- [ ] This flow needs three outcomes from it: pending (waiting for Stripe), failed (retry on the same order), succeeded (→ s52); leaving during pending keeps the order and reopening s51 resumes it.
- [ ] Details are in [[Pay for an order Story]]; the order itself is [[Payments & Orders Story]] S1.

### S6 · Event Ring granted ([[Screen Index#s52|s52]])

**As a** visitor, **I want** success to mean an Event Ring in my hub, **so that** the event is now part of my identity.

Acceptance criteria:
- [ ] Covered by [[Event Ring Auto-creation Story]] S1; this flow must not show s52 before the Ring is readable.

## States and motion the design asks for

- Motion: the event card **expands into the landing page** with the cover as shared element (brief §7.1).
- Motion: successful registration animates the **Event Ring joining the Ring carousel** (brief §7.3).
- State: sold out, tier unavailable, payment pending / failed / succeeded, registered.
- State: "your contacts are going" avatars on cards; empty when none.

## Rules the backend already enforces

- No events endpoint exists; the rules below are schema facts the stories must respect.
- One buyer per order (CHECK), `OrderItem` holds a price snapshot: the price the user saw is the price charged, not the current one.
- `Payment.providerReference` is unique: a replayed webhook updates, never duplicates; the client's retry on a failed payment reuses the order.
- `EventParticipant.role` carries visitor vs exhibitor; there is one registration flow with role-conditional branches, not two.
- `Event.timezone` and `Location.timezone` are IANA zones; dates are stored in UTC and rendered in the event's zone.
- The Event Ring is created in the registration transaction and cannot be created by the client ([[Event Ring Auto-creation Story]]).

## Open questions

- No decision note exists. Open points:
- S5 and therefore S6 wait on [[Pay for an order]], which has no backend yet; the provider and the method are decided ([[D-07 Payment provider]], [[DR-08 Stripe card checkout only]]).
- [[T-033 Events list, detail, schedule]] — "contacts going" needs [[T-023 Connection detail and contacts list]]; until then S1 ships without that filter.
- Whether an RSVP on a free event creates an `Order` with a zero total or no order at all affects S4's call count.
