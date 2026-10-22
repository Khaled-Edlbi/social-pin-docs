---
type: decision
id: D-08
status: decided
features: [pay-for-an-order]
blocks: [pay-for-an-order]
decider: "owner"
screens: [s51]
affects: ["Pay for an order", "Payments & Orders", "Events Before", "Payments Gateway Module"]
related: ["D-07 Payment provider", "Payments Gateway Module", "Payments & Orders", "Events Before"]
decidedBy: "khaled"
decidedAt: 2026-10-22
owner: "khaled"
created: 2026-10-22
updated: 2026-10-22
tags: [decision, decision/decided]
---

# ✅ D-08 · Payment methods and gateways on s51

**Status:** decided 2026-10-22 by khaled · **Decider:** owner · **Raised:** 2026-10-22 · **Needed by:** [[Pay for an order]] · **Feature:** [[Pay for an order]] · **Module:** [[Payments Gateway Module]]

> The cards in `blocks` are **Blocked · D-08** while this is `open` and return to their own status on the build after it is `decided`. Nobody edits their `status:` for this.

## What has to be decided

Which payment methods, and through which gateways, an organizer may offer a buyer on the Payment screen ([[Screen Index#s51|s51]]) beyond the card checkout Stripe hosts. [[D-07 Payment provider]] made Stripe the one provider and stays decided; it left open what the buyer gets to choose on s51. Until this is decided, the story of [[Pay for an order]] cannot say what s51 shows, the frontend requirements cannot list the methods, and the backend cannot shape the checkout session. Decided narrowly (card only), s51 is one Stripe hosted page and nothing else ships; decided widely (local methods, a second gateway), the organizer gets a per-event setting, the settlement has more than one callback shape, and the audit trail carries a method on every payment.

## Notes

- The design asks for payment methods per organizer: card, e-payment and others ([[Wireframe Brief#Tickets, access levels, RSVP, registration, payment|§7.3]]); the prototype's s51 has one action, pay, and no method picker ([[Pay for an order]]).
- D-07 chose Stripe for all four flows and said a market Stripe does not serve is a new decision card then, not a second provider now ([[D-07 Payment provider]]).
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

**Option 1: Stripe card checkout only.** Decided by khaled on 2026-10-22, recorded by the PM. The Payment screen ([[Screen Index#s51|s51]]) hands the buyer to Stripe's hosted checkout with card as the only method: no method picker in the app, no per-event or per-organizer setting, no method field on the audited payment, and no second gateway. One callback, one audit trail, one `providerReference`, as [[D-07 Payment provider]] set them. A buyer without a card cannot pay today. Adding Stripe's local methods (option 2) or a second gateway (option 3) is a new decision card when an organizer's market asks for it, not part of this feature.

## Consequences

- [[Pay for an order]]: unblocked; its story can say s51 is Stripe's hosted card page and nothing else, and the frontend requirements list no method picker.
- [[Payments & Orders]]: an order is paid by card through Stripe; no payment-method field on the order or the payment. Its story, frontend requirements and backend delivery still read "card / e-payment per organizer": flagged.
- [[Events Before]]: s50 hands the total to s51 and offers no method choice; the "payment methods" row of its frontend requirements is card only: flagged.
- [[Payments Gateway Module]]: "which payment methods an organizer may offer" is no longer open: flagged for the owner.
- Still open: local payment methods and a second gateway, on a new card when a market needs them.
