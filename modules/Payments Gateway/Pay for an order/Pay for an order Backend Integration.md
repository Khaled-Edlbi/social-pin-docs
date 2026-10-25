---
type: backend-integration
code: pay-for-an-order
scope: feature
feature: pay-for-an-order
module: payments-gateway
status: current
screens: [s51, s52]
depends: []
affects: []
related: ["Pay for an order Backend Delivery", "T-065-be Backend Integration", "T-066-be Backend Integration", "Pay for an order Frontend Requirements", "GET /orders/:id", "POST /orders/:id/checkout", "POST /payments/stripe/webhook", "E_ORDER_01", "E_ORDER_02", "E_ORDER_03", "E_PAY_01", "E_PAY_02", "E_AUTH_04", "T-063 Put the ErrorCode on the error body", "Frontend Contract"]
pending: []
owner: "khaled"
updated: 2026-10-25
tags: [backend-integration, backend-integration/current, module/payments-gateway, layer/backend]
---

# 🔌 Pay for an order · Backend Integration

> **Simulated** for the M-09 agent-flow test: the calls below are not on `social-pin` `main`.

**Feature:** [[Pay for an order]] · **Backend:** [[Pay for an order Backend Delivery]] (done) · **QA:** [[Pay for an order QA Backend]] (S3 and S4 rows ready to run) · **Requirements:** [[Pay for an order Frontend Requirements]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]]

What the client builds: the Payment screen ([[Screen Index#s51|s51]]) reading an order and handing the buyer to Stripe's card page, and the confirmation ([[Screen Index#s52|s52]]) once Stripe has settled the order. The sum of the task-level integration notes: s51 in [[T-065-be Backend Integration]], the settlement and s52 in [[T-066-be Backend Integration]].

## Screens → calls

| Screen | The user does | Calls | Task |
|---|---|---|---|
| [[Screen Index#s51\|s51]] Payment | sees the order and its state | `GET /orders/:id` | [[T-065-be Backend Integration]] |
| s51 | taps Pay | `POST /orders/:id/checkout` → open `checkoutUrl` | [[T-065-be Backend Integration]] |
| s51 | comes back, or waits while pending | `GET /orders/:id` (poll every 3 s for 2 minutes, then on focus) until `PAID` or `FAILED` | [[T-065-be Backend Integration]], [[T-066-be Backend Integration]] |
| s51 → [[Screen Index#s52\|s52]] Event Ring granted | the order is `PAID` | on `registrationComplete: true`, s52 with the Ring by `eventRingId`; "Setting up your Ring…" while `false` | [[T-066-be Backend Integration]] |
| app start | had paid with the app closed | `GET /orders/:id` for the stored order; `PAID` → s52 once | [[T-066-be Backend Integration]] |
| (none) | Stripe confirms the payment | `POST /payments/stripe/webhook`, server to server | [[T-066-be Backend Integration]] |

## Shapes that matter

`OrderEntity`: `id`, `state` (`UNPAID` · `PENDING` · `FAILED` · `PAID`), `currency`, `total` and `lines[].unitPrice` in minor units, `holdEndsAt`, `failureReason`, `registrationComplete`, `eventRingId`, `createdAt`. `POST /orders/:id/checkout` → `{ checkoutUrl, expiresAt }`, `expiresAt` = `holdEndsAt`.

## Errors to handle

Branch on status and endpoint until `ErrorCode` is on the wire ([[T-063 Put the ErrorCode on the error body]]).

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 401 | `E_AUTH_04` | session expired | sign in again, resume the order |
| 404 | `E_ORDER_01` | not your order, or none | "This order is not available" |
| 409 | `E_ORDER_02` | checkout on a paid order | "Payment received", on to s52 |
| 410 | `E_ORDER_03` | checkout after the hold ended | "Your tickets were released" |
| 502 | `E_PAY_01` | Stripe unreachable | "Payment is not available right now" |
| 400 | `E_PAY_02` | webhook without a valid Stripe signature | server to server, never shown |

## For QA: what can be checked now

On the T-065 build (simulated), against `GET /orders/:id` and `POST /orders/:id/checkout`: the rows of [[T-065-be QA Backend]] (already passing). On the T-066 build (simulated), against the webhook and the order read:

| Check | Expect |
|---|---|
| Stripe sends `checkout.session.completed` for my order's session | 200; the order `PAID`, `registrationComplete: true`, `eventRingId` set; one `PAYMENT_SUCCEEDED` audit entry |
| the same event sent again | 200; nothing new: one payment, one registration, one Event Ring, one audit entry |
| a call without, or with a wrong, `Stripe-Signature` | 400 `E_PAY_02`; nothing written |
| `payment_intent.payment_failed` | the order `FAILED`, `failureReason` from Stripe, one `PAYMENT_FAILED` entry; the checkout can be opened again until the hold ends |
| an event for an unknown session | 200, nothing written |
| `checkout.session.expired` | nothing written; the order released by its hold |
| the order read between the payment and the registration | `PAID` with `registrationComplete: false`, `eventRingId: null`, then `true` and the id |
| the response bodies | no card data, no Stripe secret, no `providerReference` |

## Not available yet

- Creating the order on s50 ([[T-035 Registration transaction with order and payment]]); the tests seed an order.

## Tasks

| Task | Integration note | Status |
|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-be Backend Integration]] | Current (simulated) |
| [[T-066 Settle an order and confirm it on s52]] | [[T-066-be Backend Integration]] | Current (simulated) |
