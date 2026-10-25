---
type: story
code: payments
scope: feature
feature: payments
module: commerce
status: draft
screens: [s50, s53, s68]
depends: ["D-07 Payment provider", "D-08 Payment methods and gateways on s51"]
affects: ["Pay for an order", "Events Before", "Events During"]
related: ["Pay for an order", "Pay for an order Story", "D-09 How long an unpaid order holds its tickets", "DR-08 Stripe card checkout only", "T-047 Orders, payments and the provider webhook", "Events Before", "Events During", "Subscription (Free vs Pro)", "Audit Log", "T-034 Tickets, packages, levels, sold-out", "T-035 Registration transaction with order and payment", "T-040 Lounges and upgrades"]
owner: "khaled"
updated: 2026-10-25
tags: [story, story/draft, module/commerce, layer/business]
---

# Payments & Orders · User Story

**Feature:** [[Payments & Orders]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Payments & Orders Frontend Requirements]] · **API Integration:** not yet (backend not built)

A visitor has picked a package, a sub-event or an in-event upgrade. This feature is the **order**: it freezes what they chose and at what price, keeps one order per attempt, and lets them read their orders and receipts afterwards. Paying for the order is not here: the hand-over to Stripe's hosted card page on [[Screen Index#s51|s51]], the pending / failed / succeeded states, the webhook that settles the order and the confirmation on s52 are [[Pay for an order]] ([[Pay for an order Story]]), described there once ([[DR-08 Stripe card checkout only]]). The schema is complete; no endpoint exists.

## Persona

Visitor (User A) choosing on s50, or buying an in-event upgrade on s53, then reading their orders under Me (s68). An exhibitor (User B) orders its package the same way and sees the order's state in the organizer touchpoints ([[Exhibitor Story]] S5). The organizer (User C) sees the orders placed for its event.

## Stories

### S1 · Order from a selection ([[Screen Index#s50|s50]])

**As a** visitor, **I want** "Continue · $160" to create an order for exactly what I selected, **so that** the price I saw is the price I pay.

Acceptance criteria:
- [ ] One order per attempt with one line per selected item (package, sub-event, upgrade), each line a price snapshot (`OrderItem`); the total shown comes from the server's response, not from the client's sum.
- [ ] Submitting twice reuses the same order (client idempotency key); a changed selection creates a new order and abandons the previous one.
- [ ] A sold-out item at order time fails the whole order; the client refetches packages and keeps the rest of the selection.
- [ ] The order goes to s51 unpaid; from there [[Pay for an order]] takes over. A free selection creates no payment and goes straight to s52 ([[Events Before Story]] S4).
- [ ] Creating an order is not available yet ([[T-035 Registration transaction with order and payment]]).

### S2 · In-event upgrade ([[Screen Index#s53|s53]])

**As a** visitor at the event, **I want** to buy a lounge or an upgrade without leaving event mode, **so that** the door opens now.

Acceptance criteria:
- [ ] The upgrade creates an order as in S1, in a sheet over s53, and is paid through the same flow as s51 ([[Pay for an order]]); on success the mini-event state flips to owned ([[Events During Story]] S7).
- [ ] Pro any-lounge access shows no price; it is a subscription, not an order ([[Subscription (Free vs Pro) Story]]).
- [ ] Not available yet ([[T-040 Lounges and upgrades]]).

### S3 · Orders and receipts ([[Screen Index#s68|s68]])

**As a** user, **I want** my orders and receipts under Me, **so that** I can expense a ticket.

Acceptance criteria:
- [ ] Orders listed newest first with status (unpaid, paid), items, total and the receipt reference Stripe gives when there is one; card only, so no method column ([[DR-08 Stripe card checkout only]]).
- [ ] Refunds are read-only here; the organizer handles them on the web (the Payments Gateway's *Refund a payment*, not created yet).
- [ ] Not available yet ([[T-047 Orders, payments and the provider webhook]]).

## States and motion the design asks for

- State: sold out and tier unavailable at order time (brief §7.3); locked / owned / purchasable for upgrades (brief §8.3).
- State: an order is unpaid until [[Pay for an order]] settles it; payment pending / failed / succeeded and the Event Ring motion on success are that feature's.
- Motion: an in-event purchase flips the lounge tile in place.

## Rules the backend already enforces

- One buyer per order (CHECK constraint); `OrderItem` holds a price snapshot so historical totals never derive from mutable prices.
- `Payment.providerReference` is unique; [[Pay for an order]] settles on it, so a replayed webhook updates rather than duplicates.
- `PAYMENT_METHOD` (cash, card, bank, wallet) is modelled but only card is used ([[DR-08 Stripe card checkout only]]); `Payment.collectedBy` records `ORGANIZER` vs `SOCIAL_PIN`, and who collects is not decided.
- The registration transaction (participant + order + payment intent) and the Event Ring creation are one `@Transactional` unit on a succeeded payment ([[T-035 Registration transaction with order and payment]], [[T-011 Create the Event Ring on registration]]).
- `AuditLog` exists for every payment action; no service writes it yet ([[Audit Log]]).

## Open questions

- Whether an unpaid order holds its items against sold-out, and for how long: [[D-09 How long an unpaid order holds its tickets]], raised from [[Pay for an order Story]] (owner to decide); S1's sold-out handling follows the answer.
- Whether a free RSVP creates a zero-total order (one history for everything) or no order at all.
- Who collects (organizer or Social Pin) per organizer: not raised yet; it waits on the Payments Gateway's *Pay the organizer*.
