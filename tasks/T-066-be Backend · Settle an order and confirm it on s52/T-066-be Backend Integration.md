---
type: backend-integration
code: T-066-be
scope: task
feature: pay-for-an-order
module: payments-gateway
status: current
screens: [s51, s52]
depends: []
affects: ["T-066-fe Frontend · Settle an order and confirm it on s52"]
related: ["T-066-be Backend Delivery", "T-066-fe Frontend Requirements", "T-065-be Backend Integration", "GET /orders/:id", "POST /payments/stripe/webhook", "E_PAY_02", "E_ORDER_01", "E_AUTH_04", "T-063 Put the ErrorCode on the error body", "Frontend Contract"]
pending: []
owner: "khaled"
updated: 2026-10-25
tags: [backend-integration, backend-integration/current, module/payments-gateway, layer/backend]
task: T-066-be
---

# 🔌 T-066-be · Settle an order and confirm it on s52 · Backend Integration

> **Simulated** for the M-09 agent-flow test: the calls below are not on `social-pin` `main`. [[Frontend API Guide]] and [[Frontend Contract]] are unchanged.

**Task:** [[T-066-be Backend · Settle an order and confirm it on s52]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Backend Integration]] · **Backend:** [[T-066-be Backend Delivery]] · **Requirements:** [[T-066-fe Frontend Requirements]] · **Read first:** [[T-065-be Backend Integration]] (the order read and the checkout), [[Frontend Contract]]

Written by the **backend** team for the frontend and QA: what T-066-be adds. The client calls nothing new: Stripe calls the webhook, and the order read the client already uses now reaches `PAID` and says when the Event Ring is ready.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s51\|s51]] | comes back from Stripe, or waits | `GET /orders/:id` until `state` is `PAID` (or `FAILED`) |
| s51 → [[Screen Index#s52\|s52]] | the order is `PAID` | go to s52 when `registrationComplete` is `true`; read the Ring by `eventRingId` through the Rings endpoints |
| s52 | waits while the Ring is set up | `GET /orders/:id` every 2 s for 30 s while `registrationComplete` is `false`, then on focus |
| app start | had paid and closed the app | `GET /orders/:id` for the stored unpaid order; `PAID` → s52 once |
| (none) | Stripe confirms a payment | `POST /payments/stripe/webhook`, server to server; the client never calls it |

## Flow

1. Stripe confirms the payment and calls the webhook; the order becomes `PAID`, the registration is completed and the Event Ring granted in one transaction.
2. The next `GET /orders/:id` returns `state: PAID`, `registrationComplete: true`, `eventRingId: "<id>"`.
3. A failed attempt returns `state: FAILED` with `failureReason`; "Try again" works as in [[T-065-be Backend Integration]] until the hold ends.
4. Between steps 1 and 2 a read may show `PAID` with `registrationComplete: false`, `eventRingId: null` for a moment: show "Setting up your Ring…" and read again; never treat it as an error.

## Shapes that matter

`OrderEntity` gains: `registrationComplete` (boolean; `true` only when `state` is `PAID` and the registration committed) and `eventRingId` (string or `null`). Everything else is [[T-065-be Backend Integration#Shapes that matter]].

## Errors to handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]).

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 401 | `E_AUTH_04` | session expired | sign in again, resume the order |
| 404 | `E_ORDER_01` | not your order, or none | "This order is not available" |
| 400 | `E_PAY_02` | webhook with a missing or wrong Stripe signature | never seen by the client (server to server); QA checks it |
