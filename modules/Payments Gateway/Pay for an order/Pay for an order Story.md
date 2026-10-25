---
type: story
code: pay-for-an-order
scope: feature
feature: pay-for-an-order
module: payments-gateway
status: draft
screens: [s51, s52]
depends: ["D-07 Payment provider", "D-08 Payment methods and gateways on s51", "T-047 Orders, payments and the provider webhook"]
affects: ["Event Ring Auto-creation", "Events Before", "T-035 Registration transaction with order and payment"]
related: ["Payments & Orders", "Events Before", "Event Ring Auto-creation", "Audit Log", "DR-08 Stripe card checkout only", "T-034 Tickets, packages, levels, sold-out"]
pending: []
approvedBy: ""
approvedAt: ""
owner: "khaled"
updated: 2026-10-25
tags: [story, story/draft, module/payments-gateway, layer/business]
---

# Pay for an order · User Story

**Feature:** [[Pay for an order]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Pay for an order Frontend Requirements]] · **Backend Integration:** [[Pay for an order Backend Integration]] · **Verified by:** [[Pay for an order QA Backend]], [[Pay for an order QA Frontend]]

An attendee has chosen what they want from an event on [[Screen Index#s50|s50]] and now pays for it. The app hands them to Stripe's hosted card page ([[DR-08 Stripe card checkout only]]), brings them back, tells them where the payment stands, and grants the Event Ring only once Stripe has confirmed the payment. The order, its lines and its price snapshot belong to [[Payments & Orders]]; this story is the hand-over to Stripe, the return, the settlement and the confirmation. No backend exists for it today: no checkout endpoint, no webhook, no order status to read ([[Pay for an order Backend Delivery]] is not written).

## Persona

An attendee (visitor, sponsor or VIP) at the end of registration, on the Payment screen ([[Screen Index#s51|s51]]) with an order already created from s50, then on the confirmation ([[Screen Index#s52|s52]]). An exhibitor paying for its package and booth takes the same path and sees the same states; it has no screen of its own here.

## Stories

### S1 · Pay ([[Screen Index#s51|s51]])

**As an** attendee **I want** one clear action that takes me to a secure card page for exactly what I chose **so that** I pay the price I saw and nothing else.

Acceptance criteria:
- [ ] s51 shows the order's lines and total from the server (the price snapshot on the order, [[Payments & Orders]]), in the order's currency, never a sum computed on the device.
- [ ] One action, "Pay $160" (the total): it opens Stripe's hosted checkout for this order, card only. No method picker, no organizer setting, no second gateway ([[DR-08 Stripe card checkout only]]).
- [ ] Card details are typed on Stripe's page only; no screen, log or table of Social Pin holds a card number.
- [ ] Tapping Pay twice, or coming back to s51 for the same order, reuses the same checkout; it never starts a second charge for one order.
- [ ] The endpoint that opens the checkout for an order is not available yet; it comes with this feature's first task.

### S2 · Back from Stripe: pending, failed, succeeded ([[Screen Index#s51|s51]])

**As an** attendee **I want** to see where my payment stands when I come back from the card page **so that** I neither pay twice nor give up too early.

Acceptance criteria:
- [ ] The app always shows one of three states, read from the order on the server, never from what the card page returned: **pending**, **failed**, **succeeded**.
- [ ] Pending: "Waiting for confirmation" with progress; the app reads the order's status again until it changes; leaving s51 and coming back resumes the same order.
- [ ] Failed or abandoned (the buyer closed the card page): the order stays unpaid, the reason Stripe gives the buyer is shown, and "Try again" reopens the checkout for the same order; "Change tickets" returns to s50.
- [ ] Whether a failed or abandoned order still holds its chosen tickets against sold-out, and for how long, is [[D-09 How long an unpaid order holds its tickets]]: the copy of this state waits on it.
- [ ] Succeeded: the app moves on to s52 (S4). Nothing is granted on pending or failed: not the Event Ring, not the sub-event, not the package.
- [ ] Reading an order's payment status is not available yet.

### S3 · Settlement: Stripe confirms, the order is paid

**As an** attendee **I want** my payment to count even if I close the app or lose my connection right after paying **so that** I never lose a ticket I paid for.

Acceptance criteria:
- [ ] Stripe's webhook, not the app, marks the order paid; the app never reports a payment succeeded on its own.
- [ ] A webhook Stripe sends again changes nothing: the settlement is idempotent on the order's `providerReference` ([[Payments & Orders]]), so nobody is charged or granted twice.
- [ ] A buyer who closed the app finds the order paid and the Event Ring in their hub on the next open.
- [ ] Every payment action (checkout opened, failed, succeeded) is written to the audit trail and can be read back by the buyer and the organizer it concerns ([[Audit Log]]).
- [ ] The webhook endpoint is not available yet ([[T-047 Orders, payments and the provider webhook]] holds it today; this feature's first task takes it over).

### S4 · Confirmation: the Event Ring is granted ([[Screen Index#s52|s52]])

**As an** attendee who has just paid **I want** to see that I am in **so that** I know my ticket is now an Event Ring in my hub, not a receipt.

Acceptance criteria:
- [ ] s52 is reached only from a succeeded payment; a pending or failed payment never lands here.
- [ ] What s52 shows (event, Ring name, window, "Enter event mode", "See it in my Ring hub") is [[Event Ring Auto-creation Story]] S1; this story only gates it on succeeded.
- [ ] If the payment is succeeded but the Ring is not readable yet, s52 shows "Setting up your Ring…" and retries; it never renders empty.

## States and motion the design asks for

- State: payment pending / failed / succeeded ([[Wireframe Brief#Tickets, access levels, RSVP, registration, payment|§7.3]]); sold out and tier unavailable belong to s50 ([[Events Before]]).
- State: the hold on chosen tickets while unpaid, once [[D-09 How long an unpaid order holds its tickets]] is decided.
- Motion: on success the Event Ring joins the user's Ring carousel, the bridge from "event" to "identity" (§7.3). Reduced motion: a fade.

## Rules the backend already enforces

None for this feature: no endpoint, job or webhook exists. What the schema already has, from [[Payments & Orders Backend Delivery]]: one buyer per order, a price snapshot on every `OrderItem`, `Payment.providerReference` unique (a replayed webhook updates rather than duplicates), an `AuditLog` table that no service writes yet.

## Open questions

- [[D-09 How long an unpaid order holds its tickets]] — whether a pending, failed or abandoned order holds its tickets against sold-out ([[T-034 Tickets, packages, levels, sold-out]]), and for how long. Blocks this story: S2's failed state and the copy around "Try again".
- Out of this story: refunds, paying the organizer, Pro billing (the module's next features, [[Payments Gateway Module]]); the in-event upgrade sheet on s53 ([[Payments & Orders]]).
