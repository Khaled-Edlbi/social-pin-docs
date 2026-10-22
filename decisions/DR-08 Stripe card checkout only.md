---
type: decision-record
id: DR-08
decision: D-08
decidedBy: "khaled"
decidedAt: 2026-10-22
features: [pay-for-an-order]
affects: ["Pay for an order", "Payments & Orders", "Events Before", "Payments Gateway Module"]
related: ["D-08 Payment methods and gateways on s51", "D-07 Payment provider"]
owner: "khaled"
created: 2026-10-22
updated: 2026-10-22
tags: [decision-record]
---

# ⚖️ DR-08 · Stripe card checkout only

**Decides:** [[D-08 Payment methods and gateways on s51]] · **Decided by:** khaled · **On:** 2026-10-22 · **Feature:** [[Pay for an order]]

> This card is the answer to [[D-08 Payment methods and gateways on s51]]. The decision card keeps the question, the facts and the options; this one says what was decided, why, and what it changes. It is written when the decision is taken, by the PM or the owner on the user's word, never before; the decision is `decided` once this card exists.

## What was decided

**Option 1 on D-08: Stripe card checkout only.** The Payment screen ([[Screen Index#s51|s51]]) hands the buyer to Stripe's hosted checkout with card as the only method. There is no method picker in the app, no per-event or per-organizer setting, no method field on the audited payment, and no second gateway. One callback, one audit trail, one `providerReference`, as [[D-07 Payment provider]] set them. Options 2 (the local methods Stripe routes) and 3 (a second gateway) are ruled out for this feature.

## Why

- It is the fastest path to the first sale: s51 is one Stripe hosted page and nothing else ships, so [[Pay for an order]] and [[T-035 Registration transaction with order and payment]] stop waiting.
- The product has not written down the organizers' market, and only that market says which local methods matter; option 2 would build an organizer setting before anyone knows what goes in it.
- A second gateway would be the first integration outside the [[Payments Gateway Module]] and would break its one-callback, one-audit-trail rule; option 1 keeps D-07's shape whole.
- Traded away: a buyer without a card cannot pay today.

## What it changes

- [[Pay for an order]]: no longer Blocked · D-08; its story can say s51 is Stripe's hosted card page and nothing else, and the frontend requirements list no method picker.
- [[Payments & Orders]]: an order is paid by card through Stripe; no payment-method field on the order or the payment. Its story, frontend requirements and backend delivery still read "card / e-payment per organizer": flagged.
- [[Events Before]]: s50 hands the total to s51 and offers no method choice; the "Payment methods" row of its frontend requirements is card only: flagged.
- [[Payments Gateway Module]]: "which payment methods an organizer may offer" is no longer open: flagged for the owner.

## Still open

Local payment methods and a second gateway, on a new decision card when an organizer's market asks for them.
