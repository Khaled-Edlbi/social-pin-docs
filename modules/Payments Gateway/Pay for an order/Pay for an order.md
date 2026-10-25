---
type: feature
id: pay-for-an-order
name: "Pay for an order"
priority: high
module: payments-gateway
screens: [s51, s52]
depends: ["T-047 Orders, payments and the provider webhook", "D-07 Payment provider"]
affects: ["Payments & Orders", "Events Before", "Event Ring Auto-creation"]
related: ["Payments & Orders", "Events Before", "Event Ring Auto-creation", "Audit Log", "Subscription (Free vs Pro)", "T-035 Registration transaction with order and payment"]
owner: "khaled"
updated: 2026-10-25
tags: [feature, module/payments-gateway, priority/high]
---

# Pay for an order

**Backend:** in progress, s51 delivered (simulated, [[Pay for an order Backend Delivery]]); the webhook and s52 not available yet · **Priority:** High · **Deadline:** — · **Module:** [[Payments Gateway Module|Payments Gateway]]

**Layers:** [[Pay for an order Story|Story]] · [[Pay for an order Frontend Requirements|Frontend Requirements]] · [[Pay for an order Backend Delivery|Backend Delivery]] · [[Pay for an order Backend Integration|Backend Integration]] · [[Pay for an order Frontend Delivery|Frontend Delivery]] · [[Pay for an order QA Backend|QA Backend]] · [[Pay for an order QA Frontend|QA Frontend]]

An attendee who has chosen a ticket, a package or a sub-event on [[Screen Index#s50|s50]] pays for it on the Payment screen ([[Screen Index#s51|s51]]), comes back to the app, and sees the confirmation that lets them into the event's Ring ([[Screen Index#s52|s52]]). An exhibitor paying for its package and booth takes the same path. The order itself, with its price snapshot and its state, belongs to [[Payments & Orders]]; this feature is the hand-over of the buyer to Stripe's hosted checkout, the return to the app, and the settlement that marks the order paid once Stripe confirms it, described here and nowhere else ([[D-07 Payment provider]]). It is the first feature of the [[Payments Gateway Module|Payments Gateway]] because nothing in the product is sold without it: event registration with a payment ([[T-035 Registration transaction with order and payment]]) waits on it.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s51|s51]] | Payment | Reached from s50 with the chosen tickets and the total; one action, pay. Today: nothing behind it, no backend. |
| [[Screen Index#s52|s52]] | Event Ring granted | The confirmation after a succeeded payment; the Ring itself is [[Event Ring Auto-creation]]'s. Today: partial, the Ring exists without a payment in front of it. |

Wireframe brief sections: [[Wireframe Brief#Tickets, access levels, RSVP, registration, payment|§7.3 Tickets, access levels, RSVP, registration, payment]]

## Product rules

- The buyer always sees which of three states the payment is in: pending, failed, succeeded. Nothing is granted before succeeded: not the Event Ring, not the sub-event, not the package.
- The buyer pays the price snapshot on the order, never the price of the moment; a changed price is a new order.
- Nobody is charged twice for the same order, whatever Stripe sends or resends: the settlement is idempotent on the order's provider reference ([[Payments & Orders]]).
- Card details never pass through Social Pin: Stripe's hosted page takes them, and no screen or table of ours holds a card number.
- A failed or abandoned payment leaves the order unpaid and the buyer free to try again from s50; what else it does with the chosen tickets is an open decision below.
- Every payment action is written to the audit trail and can be read back by the buyer and the organizer it concerns ([[Audit Log]]).

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | ⬜ To do | high | M |

## Decisions

- [[D-07 Payment provider]] — decided 2026-10-21, Stripe: this feature is its first consequence.
- [[D-08 Payment methods and gateways on s51]] — decided 2026-10-22, [[DR-08 Stripe card checkout only]]: s51 is Stripe's hosted card page, no method picker, no organizer setting, no second gateway.
- [[D-09 How long an unpaid order holds its tickets]] — decided 2026-10-25, [[DR-09 30-minute hold tied to the Stripe checkout]]: an order holds its items for 30 minutes, the Stripe checkout expires with the hold, a failed payment can be retried until it ends.

## Related

- [[Payments & Orders]] — owns the order, the price snapshot and the provider reference this feature settles; T-047 straddled the boundary and the PM redraws it with this feature's first task.
- [[Events Before]] — s50 chooses what is paid for and hands the total to s51.
- [[Event Ring Auto-creation]] — s52 is its screen; it must wait for succeeded.
- [[Audit Log]] — every payment action.
- [[Subscription (Free vs Pro)]] — the same provider bills Pro later (the module's fourth feature), not this one.

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
