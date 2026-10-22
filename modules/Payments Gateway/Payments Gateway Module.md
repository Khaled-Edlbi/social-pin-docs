---
type: module
id: payments-gateway
name: "Payments Gateway"
owner: "khaled"
updated: 2026-10-21
tags: [module, module/payments-gateway]
---

# Payments Gateway · Module

> ⚠ Affected by [[DR-08 Stripe card checkout only]] (2026-10-22): D-08 decided, Stripe card checkout only; "which payment methods an organizer may offer" is no longer open (card only, no organizer setting, no second gateway).

How money moves between the people of Social Pin. An attendee (visitor, sponsor or VIP) pays an organizer for a ticket, a package or access to a sub-event and gets into the event's Ring once the payment is confirmed ([[Screen Index#s51|s51]]). An exhibitor pays for its package and booth and sees where that payment stands. A user pays Social Pin for Pro ([[Subscription (Free vs Pro)]], [[Screen Index#s70|s70]]). An organizer is paid what its attendees and exhibitors paid. [[Commerce Module|Commerce]] says *what* is bought and at what price; this module says how the money gets from one person to the other through a payment provider, and what each of them sees while it is pending, failed, refunded or paid out. It is its own module because the same provider serves every purchase in the product, and a change to it must not be rewritten under each feature that sells something.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|
| [[Pay for an order]] | ⬜ To do | [[Pay for an order Story\|Story]] | [[Pay for an order Frontend Requirements\|Req.]] | [[Pay for an order Backend Delivery\|Delivery]] · [[Pay for an order Backend Integration\|Integration]] | [[Pay for an order Frontend Delivery\|Delivery]] | [[Pay for an order QA Backend\|Backend]] · [[Pay for an order QA Frontend\|Frontend]] |

After [[Pay for an order]], the next features in the order the product needs them (each is the owner's to create, [[Owner Agent#4I · Create a feature]]):

1. **Refund a payment** — who may refund, within what window, and what the attendee and the organizer see. Next because an event with tickets needs a way back before it needs anything else.
2. **Pay the organizer** — the organizer receives what was paid to it, when, and sees the statement. Needs the first two.
3. **Pay for Pro** — the recurring payment the Pro account type runs on; [[Subscription (Free vs Pro)]] and [[T-049 Subscription endpoints and a single Pro gate]] wait on it.

## Product rules

- A payment is always in one of three states the buyer can see: pending, failed, succeeded (the states the design asks for in [[Wireframe Brief#Tickets, access levels, RSVP, registration, payment|§7.3]]). Nothing is granted on a pending or failed payment: the Event Ring, the sub-event, the package, Pro.
- Nobody is charged twice for the same order, whatever the provider sends or resends ([[Payments & Orders]] keeps the order idempotent on its provider reference).
- Every movement of money is recorded and can be read back by the people it concerns ([[Audit Log]]).
- The boundary with Commerce: an order, its price snapshot and its state live in [[Payments & Orders]]; the provider integration, including the endpoint the provider calls back to settle an order, lives here, described once. [[T-047 Orders, payments and the provider webhook]] straddles that line today; the PM redraws it when the first feature here is scaffolded.
- The provider is Stripe for all four flows, decided on [[D-07 Payment provider]] (2026-10-21): hosted checkout, webhooks, connected accounts for organizers, subscriptions for Pro. Still to decide, on decision cards and not here: whether Social Pin keeps a share of what organizers are paid, the refund window and who may refund, which payment methods an organizer may offer.

## Cross-cutting rules

- Every payment action is audited ([[Audit Log]]); the webhook is idempotent on `providerReference` ([[Payments & Orders]]).
- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-21 · created by the owner; first feature handed to the PM
- 2026-10-21 · rewritten in product terms by the owner: the people, the money flows, the product rules, the open decisions; the provider is no longer named as decided
- 2026-10-21 · provider decided: Stripe for all four flows ([[D-07 Payment provider]])
- 2026-10-21 · first feature created by the owner: [[Pay for an order]]; its story handed to the PM
