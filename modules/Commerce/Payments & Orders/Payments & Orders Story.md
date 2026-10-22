---
type: story
code: payments
scope: feature
feature: payments
module: commerce
status: draft
screens: [s50, s51]
updated: 2026-10-18
tags: [story, story/draft, module/commerce, layer/business]
---

# Payments & Orders · User Story

> ⚠ Affected by [[DR-08 Stripe card checkout only]] (2026-10-22): the provider is Stripe (D-07) and the only method is card through its hosted checkout; the open question "card / e-payment per organizer" is answered.

**Feature:** [[Payments & Orders]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Payments & Orders Frontend Requirements]] · **API Integration:** not yet (backend not built)

A visitor has picked a package, a sub-event or an in-event upgrade and now pays for it. An order freezes what they saw and at what price; a payment records how it was settled and by whom; the provider's webhook completes the registration and, in the same transaction, grants the Event Ring. The schema is complete; the payment provider is undecided and no endpoint exists.

## Persona

Visitor (User A) paying on s51, from s50 or from an in-event upgrade on s53. An exhibitor (User B) pays for their package the same way and sees payment status in the organizer touchpoints ([[Exhibitor Story]] S5). The organizer (User C) decides which methods are offered and whether they or Social Pin collect.

## Stories

### S1 · Order from a selection ([[Screen Index#s50|s50]])

**As a** visitor, **I want** "Continue · $160" to create an order for exactly what I selected, **so that** the price I saw is the price I pay.

Acceptance criteria:
- [ ] One order per attempt with one line per selected item (package, sub-event, upgrade), each line a price snapshot (`OrderItem`); the total shown comes from the server's response, not from the client's sum.
- [ ] Submitting twice reuses the same order (client idempotency key); a changed selection creates a new order and abandons the previous one.
- [ ] A sold-out item at order time fails the whole order; the client refetches packages and keeps the rest of the selection.

### S2 · Choose a method ([[Screen Index#s51|s51]])

**As a** visitor, **I want** to pay with a method this organizer accepts, **so that** I am not blocked by a method they do not take.

Acceptance criteria:
- [ ] Methods listed from the order's accepted set (`PAYMENT_METHOD`: cash, card, bank, wallet); nothing is hard-coded.
- [ ] Cash and bank show "pay at the venue" / "transfer details" and put the order in pending; card and wallet hand off to the provider.
- [ ] The screen says who collects ("Paid to the organizer" vs "Paid to Social Pin", `Payment.collectedBy`) and the amount in the order's currency.

### S3 · Pending, failed, succeeded ([[Screen Index#s51|s51]])

**As a** visitor, **I want** a clear state while the provider confirms, **so that** I do not pay twice or give up early.

Acceptance criteria:
- [ ] Pending: progress with "Waiting for confirmation"; the client polls the order status; leaving and coming back resumes the same order.
- [ ] Failed: the provider's user-facing reason and "Try again" on the same order; "Change method" returns to S2.
- [ ] Succeeded: proceed to [[Screen Index#s52|s52]] only once the server reports the registration complete and the Event Ring readable ([[Event Ring Auto-creation Story]] S1).

### S4 · Webhook completes the registration ([[Screen Index#s52|s52]])

**As a** visitor, **I want** my registration to complete even if I close the app after paying, **so that** a flaky connection does not lose my ticket.

Acceptance criteria:
- [ ] The provider's webhook, not the client, marks the payment succeeded; a replayed webhook is harmless (`providerReference` unique).
- [ ] If the app was closed, the next open shows the event under "My events" with the Event Ring in the hub; a notification "Registration confirmed" deep-links to s52 once [[Notifications]] exist.

### S5 · In-event upgrade ([[Screen Index#s53|s53]])

**As a** visitor at the event, **I want** to buy a lounge or an upgrade without leaving event mode, **so that** the door opens now.

Acceptance criteria:
- [ ] Same order and payment flow as S1–S3 in a sheet over s53; on success the mini-event state flips to owned ([[Events During Story]] S7).
- [ ] Pro any-lounge access shows no price; it is a subscription, not an order ([[Subscription (Free vs Pro) Story]]).

### S6 · Receipts and history ([[Screen Index#s68|s68]])

**As a** user, **I want** my orders and receipts under Me, **so that** I can expense a ticket.

Acceptance criteria:
- [ ] Orders listed newest first with status, items, total, method and collector; a receipt reference from the provider when there is one.
- [ ] Refunds are read-only here; the organizer handles them on the web.

## States and motion the design asks for

- State: payment pending / failed / succeeded; sold out and tier unavailable (brief §7.3); locked / owned / purchasable for upgrades (brief §8.3).
- Motion: success flows into the **Event Ring joining the carousel** (brief §7.3); an in-event purchase flips the lounge tile in place.
- State: "pay at the venue" for cash, with the order visible in the organizer's payment status.

## Rules the backend already enforces

- One buyer per order (CHECK constraint); `OrderItem` holds a price snapshot so historical totals never derive from mutable prices.
- `Payment.providerReference` is unique: a replayed webhook updates rather than duplicates.
- `PAYMENT_METHOD` covers cash, card, bank and wallet; `Payment.collectedBy` records `ORGANIZER` vs `SOCIAL_PIN`. Modelled, not decided: which provider, and who collects per organizer.
- The registration transaction (participant + order + payment intent) and the Event Ring creation are one `@Transactional` unit on webhook success ([[T-035 Registration transaction with order and payment]], [[T-011 Create the Event Ring on registration]]).
- `AuditLog` exists for every payment action; no service writes it yet ([[Audit Log]]).

## Open questions

- No decision note exists. Open points:
- [[T-047 Orders, payments and the provider webhook]] — the provider (card / e-payment per organizer) is undecided; S2 and S3 cannot be built until it is.
- Whether cash and bank orders hold capacity while pending, and for how long, affects S1's sold-out handling.
- Whether a free RSVP creates a zero-total order (one history for everything) or no order at all.
