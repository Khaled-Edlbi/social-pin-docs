---
type: decision-record
id: DR-07
decision: D-07
status: decided
decidedBy: "khaled"
decidedAt: 2026-10-21
features: [payments, subscription]
affects: ["Payments Gateway Module", "Payments & Orders", "Subscription (Free vs Pro)", "T-047 Orders, payments and the provider webhook", "T-035 Registration transaction with order and payment", "T-049 Subscription endpoints and a single Pro gate"]
related: ["D-07 Payment provider", "Payments Gateway Module"]
owner: "khaled"
created: 2026-10-22
updated: 2026-10-25
tags: [decision-record, decision-record/decided]
---

# ⚖️ DR-07 · Stripe for all four flows

**Answers:** [[D-07 Payment provider]] · **Decided by:** khaled · **On:** 2026-10-21 · **Feature:** [[Payments & Orders]], [[Subscription (Free vs Pro)]]

> This card is the answer to [[D-07 Payment provider]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. It is written when the decision is taken, by the PM or the owner on the user's word, never before; the needs-decision card is `decided` once this card exists.

## What was decided

**Option 1 on D-07: Stripe for all four flows.** Stripe is the one payment provider of Social Pin: hosted checkout when an attendee or an exhibitor pays for an order, webhooks to settle it, connected accounts to pay the organizer, subscriptions to bill Pro. One provider, one audit trail, one callback endpoint, all of it in the [[Payments Gateway Module]]. Options 2 (a regional provider plus the app stores) and 3 (each organizer's own merchant account) are ruled out.

## Why

- One provider keeps the gateway one module, with one webhook endpoint and one audit trail ([[Audit Log]]); two would split Pro billing from event payments and double the integration.
- The order is already shaped around a `providerReference` that keeps the settlement idempotent ([[Payments & Orders]]); Stripe's webhooks fit it.
- Option 3 would leave refunds and the audit trail to each organizer, so the module's product rules could not be enforced.
- Traded away: whether Stripe serves every organizer's country is checked when the organizer onboarding feature is shaped; a market it does not serve is a new needs-decision card then, not a second provider now.

## What it changes

- [[Payments Gateway Module]]: the provider is no longer an open question; the candidates become features named for the flow, with Stripe's product behind each.
- [[T-047 Orders, payments and the provider webhook]]: unblocked; the settlement callback is a Stripe webhook, idempotent on `providerReference`; the PM redraws the boundary with the gateway's first feature and returns the hand-typed `needs-info` to `todo`.
- [[T-035 Registration transaction with order and payment]]: unblocked on the provider side; still waits on T-034 and T-047.
- [[T-049 Subscription endpoints and a single Pro gate]]: unblocked; Pro is billed as a Stripe subscription.
- [[Payments & Orders]] and [[Subscription (Free vs Pro)]]: the stories and the frontend requirements can name Stripe's checkout and billing screens where the design says "payment".

## Still open

Social Pin's share of organizer payouts, and the refund window and who may refund, each on its own needs-decision card when a feature needs it. Which payment methods an organizer may offer was raised as [[D-08 Payment methods and gateways on s51]] and is decided ([[DR-08 Stripe card checkout only]]).
