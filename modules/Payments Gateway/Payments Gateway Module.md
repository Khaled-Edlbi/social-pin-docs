---
type: module
id: payments-gateway
name: "Payments Gateway"
updated: 2026-10-21
tags: [module, module/payments-gateway]
---

# Payments Gateway · Module

Stripe as the payment provider: checkout, webhooks, refunds, organizer payouts, Pro billing. This module holds the provider integration itself; what is bought (orders, tickets, the Pro plan) stays in [[Commerce Module|Commerce]] and links here.

A module is the sum of its features; a feature is the sum of its tasks. Each feature below is a business note with one child note per layer (story, frontend requirements, backend delivery and integration, frontend delivery, QA backend and frontend). Statuses roll up in [[Docs Tree|the docs tree]].

## Features

| Feature | Backend | Story | Frontend req. | Backend | Frontend | QA |
|---|---|---|---|---|---|---|

No feature yet. The first one is the PM's to create: `node scripts/build-tree.mjs --scaffold feature payments-gateway "<Name>"`, then its story. Candidates, in the order the product needs them: Stripe Checkout (start a payment for an order, return to the app), Stripe Webhooks (settle the order, idempotent on `providerReference`), Refunds, Organizer Payouts (Connect), Pro Billing (the subscription channel [[Subscription (Free vs Pro)]] waits on).

## Cross-cutting rules

- The provider decision this module answers is the one [[T-047 Orders, payments and the provider webhook]] is waiting for; [[T-035 Registration transaction with order and payment]] and [[T-049 Subscription endpoints and a single Pro gate]] wait on the same answer. It is taken on a decision card under T-047, not in prose.
- Every payment action is audited ([[Audit Log]]); the webhook is idempotent on `providerReference` ([[Payments & Orders]]).
- Every visibility decision goes through `RingAccessService` ([[Ring Access Model]]).
- Conventions: [[API Conventions]] · [[Architecture]] · [[Frontend Contract]].

## Log

- 2026-10-21 · created by the owner; first feature handed to the PM
