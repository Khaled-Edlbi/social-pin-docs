---
id: D-07
type: decision
status: decided
features: [payments, subscription]
decision: ND-07
decidedBy: "khaled"
decidedAt: 2026-10-21
owner: "khaled"
affects: ["F-27 Payments & Orders", "F-28 Subscription (Free vs Pro)", "S-69 Payments & Orders Story", "S-49 Events Before Story", "S-71 Subscription (Free vs Pro) Story"]
related: ["ND-07 Payment provider"]
created: 2026-10-22
updated: 2026-10-29
tags: [decision, decision/decided]
---

# ⚖️ D-07 · Stripe for all four flows

**Answers:** [[ND-07 Payment provider]] · **Decided by:** khaled · **On:** 2026-10-21 · **Feature:** [[F-27 Payments & Orders]], [[F-28 Subscription (Free vs Pro)]]

> This card is the answer to [[ND-07 Payment provider]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. It is written when the decision is taken, by the PM or the owner on the user's word, never before; the needs-decision card is `decided` once this card exists.

## What was decided

**Option 1 on ND-07: Stripe for all four flows.** Stripe is the one payment provider of Social Pin: hosted checkout when an attendee or an exhibitor pays for an order, webhooks to settle it, connected accounts to pay the organizer, subscriptions to bill Pro. One provider, one audit trail, one callback endpoint, behind [[F-27 Payments & Orders]] and [[F-28 Subscription (Free vs Pro)]]. Options 2 (a regional provider plus the app stores) and 3 (each organizer's own merchant account) are ruled out.

## Why

- One provider keeps payments one integration, with one webhook endpoint and one audit trail ([[F-30 Audit Log]]); two would split Pro billing from event payments and double the integration.
- The order is already shaped around a `providerReference` that keeps the settlement idempotent ([[F-27 Payments & Orders]]); Stripe's webhooks fit it.
- Option 3 would leave refunds and the audit trail to each organizer, so the product rules could not be enforced.
- Traded away: whether Stripe serves every organizer's country is checked when the organizer onboarding feature is shaped; a market it does not serve is a new needs-decision card then, not a second provider now.

## What it changes

- [[S-69 Payments & Orders Story|Payments & Orders · S7]]: unblocked; the settlement callback is a Stripe webhook, idempotent on `providerReference`; the PM returns the hand-typed `needs-info` to `todo`.
- [[S-49 Events Before Story|Events Before · S9]]: unblocked on the provider side; still waits on Events Before · S8 and Payments & Orders · S7.
- [[S-71 Subscription (Free vs Pro) Story|Subscription (Free vs Pro) · S6]]: unblocked; Pro is billed as a Stripe subscription.
- [[F-27 Payments & Orders]] and [[F-28 Subscription (Free vs Pro)]]: the stories and the frontend requirements can name Stripe's checkout and billing screens where the design says "payment".

## Still open

Social Pin's share of organizer payouts, and the refund window and who may refund, each on its own needs-decision card when a feature needs it. Which payment methods an organizer may offer on s51, and whether an unpaid order holds its items, likewise ([[S-69 Payments & Orders Story]]).
