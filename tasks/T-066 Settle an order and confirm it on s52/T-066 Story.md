---
type: story
code: T-066
scope: task
feature: pay-for-an-order
module: payments-gateway
status: approved
screens: [s51, s52]
depends: []
affects: []
related: ["Pay for an order Story", "Event Ring Auto-creation Story", "DR-09 30-minute hold tied to the Stripe checkout"]
pending: []
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
updated: 2026-10-25
tags: [story, story/approved, module/payments-gateway, layer/business]
task: T-066
---

# T-066 · Settle an order and confirm it on s52 · User Story

**Task:** [[T-066 Settle an order and confirm it on s52]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Story]] · **Status:** Approved 2026-10-25 by khaled

What the attendee gets from this task: a payment that counts the moment Stripe confirms it, even with the app closed, and the confirmation that they are in, with the Event Ring in their hub. It is S3 and S4 of [[Pay for an order Story]]; paying on s51 is [[T-065 Story]].

## Persona

An attendee who has just paid on Stripe's card page for an order made on [[Screen Index#s50|s50]], back on [[Screen Index#s51|s51]] or not back at all, and then on [[Screen Index#s52|s52]].

## Stories

### S1 · The payment counts, even with the app closed

**As an** attendee **I want** my payment to count as soon as Stripe confirms it **so that** I never lose a ticket I paid for.

Acceptance criteria:
- [ ] Stripe's confirmation, not the app, marks the order paid; a confirmation sent twice changes nothing: one payment, one registration, one Event Ring.
- [ ] A failed attempt marks the order failed with Stripe's reason; the order can be paid again until its hold ends ([[DR-09 30-minute hold tied to the Stripe checkout]]).
- [ ] A buyer who closed the app finds the order paid and the Event Ring in the hub on the next open.
- [ ] Every settlement is in the audit trail.
- [ ] The settlement endpoint is not available yet; it comes with this task.

### S2 · Confirmation: I am in ([[Screen Index#s52|s52]])

**As an** attendee who has just paid **I want** to see that I am in **so that** I know my ticket is now an Event Ring, not a receipt.

Acceptance criteria:
- [ ] s51 carries a paid order on to s52; an unpaid, pending or failed order never lands there.
- [ ] s52 shows what [[Event Ring Auto-creation Story]] S1 describes; while the Ring is not readable yet, "Setting up your Ring…" and a retry, never an empty screen.
- [ ] Motion: the Event Ring joins the user's Ring carousel; reduced motion, a fade.

## Open questions

- None: the method is card only, the hold is 30 minutes, decided on D-08 and D-09.
