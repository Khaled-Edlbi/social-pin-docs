---
type: story
code: payments
scope: feature
feature: payments
module: commerce
status: approved
screens: [s50, s51, s53, s68]
approvedBy: "khaled"
approvedAt: 2026-10-25
depends: ["ND-07 Payment provider"]
affects: ["F-22 Events Before", "F-23 Events During", "F-21 Event Ring Auto-creation"]
related: ["D-07 Stripe for all four flows", "F-22 Events Before", "F-23 Events During", "F-21 Event Ring Auto-creation", "F-28 Subscription (Free vs Pro)", "F-30 Audit Log", "S-49 Events Before Story", "S-53 Events During Story"]
owner: "khaled"
created: 2026-10-18
updated: 2026-10-28
tags: [story, story/approved, module/commerce, layer/business]
---

# Payments & Orders · User Story

**Feature:** [[F-27 Payments & Orders]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-27 Payments & Orders Frontend Requirements]] · **API Integration:** not yet (backend not built)

A visitor has picked a package, a sub-event or an in-event upgrade and now pays for it. An order freezes what they saw and at what price; a payment records how it was settled and by whom; Stripe's webhook completes the registration and, in the same transaction, grants the Event Ring. The provider is Stripe ([[D-07 Stripe for all four flows]]); the schema is complete and no endpoint exists.

## Persona

Visitor (User A) paying on s51, from s50 or from an in-event upgrade on s53, then reading their orders under Me (s68). An exhibitor (User B) pays for their package the same way and sees payment status in the organizer touchpoints ([[S-59 Exhibitor Story]] S5). The organizer (User C) sees the orders placed for its event.

## Stories

### S1 · Order from a selection ([[Screen Index#s50|s50]])

**As a** visitor, **I want** "Continue · $160" to create an order for exactly what I selected, **so that** the price I saw is the price I pay.

Acceptance criteria:
- [ ] One order per attempt with one line per selected item (package, sub-event, upgrade), each line a price snapshot (`OrderItem`); the total shown comes from the server's response, not from the client's sum.
- [ ] Submitting twice reuses the same order (client idempotency key); a changed selection creates a new order and abandons the previous one.
- [ ] A sold-out item at order time fails the whole order; the client refetches packages and keeps the rest of the selection.
- [ ] A free selection creates no payment and goes straight to s52 ([[S-49 Events Before Story]] S4).
- [ ] Not available yet ([[S-49 Events Before Story|Events Before · S9]]).

### S2 · Pay on s51 ([[Screen Index#s51|s51]])

**As a** visitor, **I want** to pay for my order without leaving the flow, **so that** I am registered in one go.

Acceptance criteria:
- [ ] s51 shows the order's items and total in its currency and hands the order to Stripe's hosted checkout; the card details never touch Social Pin.
- [ ] The methods offered come from the server, never from a list hard-coded in the client; which methods an organizer may offer is not decided (open questions).
- [ ] The screen says who collects ("Paid to the organizer" vs "Paid to Social Pin", `Payment.collectedBy`) once that is decided.

### S3 · Pending, failed, succeeded ([[Screen Index#s51|s51]])

**As a** visitor, **I want** a clear state while Stripe confirms, **so that** I do not pay twice or give up early.

Acceptance criteria:
- [ ] Pending: progress with "Waiting for confirmation"; the client polls the order status; leaving and coming back resumes the same order.
- [ ] Failed: Stripe's user-facing reason and "Try again" on the same order.
- [ ] Succeeded: proceed to [[Screen Index#s52|s52]] only once the server reports the registration complete and the Event Ring readable ([[S-47 Event Ring Auto-creation Story]] S1).

### S4 · Webhook completes the registration ([[Screen Index#s52|s52]])

**As a** visitor, **I want** my registration to complete even if I close the app after paying, **so that** a flaky connection does not lose my ticket.

Acceptance criteria:
- [ ] Stripe's webhook, not the client, marks the payment succeeded; a replayed webhook is harmless (`providerReference` unique).
- [ ] If the app was closed, the next open shows the event under "My events" with the Event Ring in the hub; a notification "Registration confirmed" deep-links to s52 once [[F-39 Notifications]] exist.
- [ ] Not available yet ([[S-69 Payments & Orders Story|Payments & Orders · S7]]).

### S5 · In-event upgrade ([[Screen Index#s53|s53]])

**As a** visitor at the event, **I want** to buy a lounge or an upgrade without leaving event mode, **so that** the door opens now.

Acceptance criteria:
- [ ] Same order and payment flow as S1–S3 in a sheet over s53; on success the mini-event state flips to owned ([[S-53 Events During Story]] S7).
- [ ] Pro any-lounge access shows no price; it is a subscription, not an order ([[S-71 Subscription (Free vs Pro) Story]]).
- [ ] Not available yet ([[S-53 Events During Story|Events During · S12]]).

### S6 · Receipts and history ([[Screen Index#s68|s68]])

**As a** user, **I want** my orders and receipts under Me, **so that** I can expense a ticket.

Acceptance criteria:
- [ ] Orders listed newest first with status, items, total, method and collector; the receipt reference Stripe gives when there is one.
- [ ] Refunds are read-only here; the organizer handles them on the web.

### S7 · Orders, payments and the provider webhook

*From T-047 (status then: Needs a decision), merged 2026-10-27.*

Provider undecided. Webhook idempotent on `providerReference`. Audit every payment action.

Screens: [[Screen Index#s51|s51]] Payment

## States and motion the design asks for

- State: payment pending / failed / succeeded; sold out and tier unavailable at order time (brief §7.3); locked / owned / purchasable for upgrades (brief §8.3).
- Motion: success flows into the **Event Ring joining the carousel** (brief §7.3); an in-event purchase flips the lounge tile in place.

## Rules the backend already enforces

- One buyer per order (CHECK constraint); `OrderItem` holds a price snapshot so historical totals never derive from mutable prices.
- `Payment.providerReference` is unique: a replayed webhook updates rather than duplicates.
- `PAYMENT_METHOD` covers cash, card, bank and wallet; `Payment.collectedBy` records `ORGANIZER` vs `SOCIAL_PIN`. Modelled, not decided: which methods are offered, and who collects per organizer.
- The registration transaction (participant + order + payment intent) and the Event Ring creation are one `@Transactional` unit on webhook success ([[S-49 Events Before Story|Events Before · S9]], [[S-47 Event Ring Auto-creation Story|Event Ring Auto-creation · S6]]).
- `AuditLog` exists for every payment action; no service writes it yet ([[F-30 Audit Log]]).

## Open questions

- Which payment methods s51 offers (card only through Stripe's checkout, or more, per organizer): not raised yet; S2 is drawn so either answer fits.
- Whether an unpaid order holds its items against sold-out while it is paid, and for how long: not raised yet; S1's sold-out handling follows the answer ([[S-49 Events Before Story|Events Before · S8]]).
- Whether a free RSVP creates a zero-total order (one history for everything) or no order at all.
- Who collects (organizer or Social Pin) per organizer: not raised yet.
