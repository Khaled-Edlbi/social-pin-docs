---
type: decision
id: D-07
status: decided
features: [payments, subscription]
blocks: [T-047, T-035, T-049]
decider: "owner"
screens: [s51, s70]
affects: []
related: ["Payments Gateway Module", "Payments & Orders", "Subscription (Free vs Pro)"]
decidedBy: "khaled"
decidedAt: 2026-10-21
owner: "khaled"
created: 2026-10-21
updated: 2026-10-22
tags: [decision, decision/decided]
---

# ✅ D-07 · Payment provider

**Status:** decided 2026-10-21 by khaled · **Decider:** owner · **Raised:** 2026-10-21 · **Needed by:** [[T-047 Orders, payments and the provider webhook]], [[T-035 Registration transaction with order and payment]], [[T-049 Subscription endpoints and a single Pro gate]] · **Feature:** [[Payments & Orders]], [[Subscription (Free vs Pro)]] · **Module:** [[Payments Gateway Module]]

> The cards in `blocks` are **Blocked · D-07** while this is `open` and return to their own status on the build after it is `decided`. Nobody edits their `status:` for this.

## What has to be decided

Which payment provider Social Pin moves money through, for every purchase in the product: an attendee's ticket, package or sub-event, an exhibitor's package and booth, a user's Pro account, and what the organizer is paid. Until it is chosen, [[T-047 Orders, payments and the provider webhook]] cannot shape the callback that settles an order, [[T-035 Registration transaction with order and payment]] cannot finish a registration that includes a payment, and [[T-049 Subscription endpoints and a single Pro gate]] has no channel to bill Pro on. Choosing one provider for all four flows keeps the gateway one module; choosing two splits the Pro billing from the event payments and doubles the integration and the audit.

## Notes

- The design asks for payment methods per organizer (card, e-payment and others), a confirmation that grants the Event Ring, and three states the buyer sees: pending, failed, succeeded ([[Wireframe Brief#Tickets, access levels, RSVP, registration, payment|§7.3]]). Exhibitors see booth and payment status ([[Wireframe Brief#Exhibitor journeys (User B)|§9]]). Pro is a recurring account type ([[Subscription (Free vs Pro)]]).
- The backend has already shaped the order around a `providerReference` that keeps the settlement idempotent ([[Payments & Orders]]); every payment action must be audited ([[Audit Log]]).
- The [[Payments Gateway Module]] lists the flows in product order: pay for an order, refund, pay the organizer, pay for Pro. The provider has to carry all four or the module note has to say which one it does not.
- Where the organizers are based decides which providers can pay them out; the product has not written that market down yet.
- Nothing has been tried: no provider is wired in the backend today.

## Options

1. **Stripe for all four flows** — hosted checkout for the order, webhooks for settlement, connected accounts for organizer payouts, subscriptions for Pro. One provider, one audit trail, one webhook endpoint; depends on Stripe serving the organizers' countries.
2. **A regional card and e-payment provider for events, the app stores for Pro** — matches local payment methods organizers ask for; two integrations, two billing records, Pro billing follows the store's rules.
3. **Each organizer brings its own merchant account; Social Pin only records the status** — no money passes through Social Pin and no payouts to build; the attendee leaves the app to pay, and refunds and the audit trail are the organizer's, so the product rules in the module note cannot be enforced.

## Responsible

`decider` above: the owner, before the first Payments Gateway feature's story is approved, after hearing from the backend what the settlement callback needs and from the PM which flow ships first.

## Decision

Decided 2026-10-21 by khaled (the owner): option 1, on its own card, [[DR-07 Stripe for all four flows]] (what was decided, why, what it changes).
