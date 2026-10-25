---
type: decision
id: D-08
status: open
features: [pay-for-an-order]
blocks: [pay-for-an-order]
decider: "owner"
screens: [s51]
affects: []
related: ["D-07 Payment provider", "Payments Gateway Module", "Payments & Orders", "Events Before"]
owner: "khaled"
created: 2026-10-22
updated: 2026-10-25
tags: [decision, decision/open]
---

# ✅ D-08 · Payment methods and gateways on s51

**Status:** fulfilled (its decision card was decided 2026-10-22 by khaled) · **Decider:** owner · **Raised:** 2026-10-22 · **Needed by:** [[Pay for an order]] · **Feature:** [[Pay for an order]] · **Module:** [[Payments Gateway Module]]

> The cards in `blocks` are **Blocked · D-08** while this is `draft` or `open` and return to their own status once its decision card (DR-08) is decided: this card then shows Fulfilled. Nobody edits their `status:` for this.

## What has to be decided

Which payment methods, and through which gateways, an organizer may offer a buyer on the Payment screen ([[Screen Index#s51|s51]]) beyond the card checkout Stripe hosts. [[D-07 Payment provider]] made Stripe the one provider and stays decided; it left open what the buyer gets to choose on s51. Until this is decided, the story of [[Pay for an order]] cannot say what s51 shows, the frontend requirements cannot list the methods, and the backend cannot shape the checkout session. Decided narrowly (card only), s51 is one Stripe hosted page and nothing else ships; decided widely (local methods, a second gateway), the organizer gets a per-event setting, the settlement has more than one callback shape, and the audit trail carries a method on every payment.

## Notes

- The design asks for payment methods per organizer: card, e-payment and others ([[Wireframe Brief#Tickets, access levels, RSVP, registration, payment|§7.3]]); the prototype's s51 has one action, pay, and no method picker ([[Pay for an order]]).
- D-07 chose Stripe for all four flows and said a market Stripe does not serve is a new needs-decision card then, not a second provider now ([[D-07 Payment provider]]).
- Stripe's hosted checkout can present local methods on its own page (wallets, bank transfers, regional e-payment) without the method passing through Social Pin; a second gateway would be the first integration outside the [[Payments Gateway Module]] and would break the one-callback, one-audit-trail rule the module note keeps.
- The product has not written down the organizers' market, which decides which local methods matter.
- [[Payments & Orders]] keeps the order idempotent on one `providerReference`; a second gateway needs a second reference shape.
- Nothing has been tried: no checkout is wired in the backend today.

## Options

1. **Stripe card checkout only** — s51 is the Stripe hosted page with card; no organizer setting, nothing new in the audit trail. Fastest to ship; buyers without a card cannot pay.
2. **Stripe card plus the local methods Stripe routes** — the organizer turns on, per event, the methods Stripe offers in its market; the hosted page shows them; one callback, one audit trail, one `providerReference`. Needs the organizer setting and a method on each audited payment.
3. **A second gateway for the methods Stripe lacks** — a regional gateway next to Stripe for the organizer's market; two integrations, two callback shapes, two reference shapes; the module note's one-provider rule is rewritten.

## Responsible

`decider` above: the owner, before the [[Pay for an order]] story is approved, after hearing from the PM which markets the first events are in and from the backend what a second callback shape would cost.

## Decision

Fulfilled by [[DR-08 Stripe card checkout only]], decided 2026-10-22 by khaled: option 1 (what was decided, why, what it changes).
