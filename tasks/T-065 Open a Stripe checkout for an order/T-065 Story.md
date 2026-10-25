---
type: story
code: T-065
scope: task
feature: pay-for-an-order
module: payments-gateway
status: verified
screens: [s51]
depends: []
affects: []
related: ["Pay for an order Story", "DR-08 Stripe card checkout only", "DR-09 30-minute hold tied to the Stripe checkout"]
pending: []
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
updated: 2026-10-25
tags: [story, story/verified, module/payments-gateway, layer/business]
task: T-065
---

# T-065 · Open a Stripe checkout for an order · User Story

**Task:** [[T-065 Open a Stripe checkout for an order]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Story]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[T-065 Frontend Requirements]] · **Backend Integration:** [[T-065 Backend Integration]] · **Verified by:** [[T-065 QA Backend]], [[T-065 QA Frontend]]

What the attendee gets from this task: from the Payment screen they reach Stripe's card page for exactly their order, and when they come back they see whether the payment is waiting or failed, with the time their tickets stay held. It is S1 and S2 of [[Pay for an order Story]] up to the moment Stripe confirms; the confirmation itself, the webhook and s52 are the next task.

## Persona

An attendee (visitor, sponsor or VIP) with an unpaid order on [[Screen Index#s51|s51]], one tap away from paying, and the same attendee a minute later, back in the app after the card page.

## Stories

### S1 · Pay opens Stripe's card page ([[Screen Index#s51|s51]])

**As an** attendee **I want** "Pay" to take me to a secure card page for my order **so that** I pay exactly the total I was shown.

Acceptance criteria:
- [ ] s51 shows the order's lines, total and currency as the server returns them; the device computes no amount.
- [ ] "Pay $160" opens Stripe's hosted checkout for this order, card only ([[DR-08 Stripe card checkout only]]); the checkout expires when the order's 30-minute hold ends ([[DR-09 30-minute hold tied to the Stripe checkout]]).
- [ ] Tapping Pay again for the same unpaid order reopens the same checkout; it never opens a second one.
- [ ] Only the buyer of the order can open its checkout; a paid order cannot be paid again.
- [ ] Opening a checkout is written to the audit trail ([[Audit Log]]).

### S2 · Back in the app: waiting or failed ([[Screen Index#s51|s51]])

**As an** attendee **I want** to see where my payment stands when I come back from the card page **so that** I neither pay twice nor give up too early.

Acceptance criteria:
- [ ] The state comes from the server, never from what the card page returned: unpaid, pending, failed, or paid.
- [ ] Pending: "Waiting for confirmation"; the app reads the state again until it changes.
- [ ] Failed or abandoned: Stripe's reason for the buyer, "Your tickets are held for N minutes" with the time left on the hold, and "Try again" on the same order; once the hold has ended, "Your tickets were released" and a way back to s50.
- [ ] Paid shows "Payment received" and waits for the next task to carry the buyer to s52.

## States and motion the design asks for

- State: unpaid, pending, failed, hold ended (brief §7.3: payment pending / failed / succeeded).
- Motion: none in this task; the Event Ring motion belongs to the confirmation.

## Rules the backend already enforces

None yet: no payment endpoint exists. The schema has `Payment.providerReference` unique and a price snapshot on every `OrderItem` ([[Payments & Orders Backend Delivery]]).

## Open questions

- None open: the method is [[DR-08 Stripe card checkout only]], the hold is [[DR-09 30-minute hold tied to the Stripe checkout]].
