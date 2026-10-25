---
type: backend-integration
code: pay-for-an-order
scope: feature
feature: pay-for-an-order
module: payments-gateway
status: draft
screens: [s51, s52]
depends: []
affects: []
related: ["Pay for an order Backend Delivery", "T-065-be Backend Integration", "Pay for an order Frontend Requirements", "GET /orders/:id", "POST /orders/:id/checkout", "E_ORDER_01", "E_ORDER_02", "E_ORDER_03", "E_PAY_01", "E_AUTH_04", "T-063 Put the ErrorCode on the error body", "Frontend Contract"]
pending: []
blockedBy: []
owner: "khaled"
updated: 2026-10-25
tags: [backend-integration, backend-integration/draft, module/payments-gateway, layer/backend]
---

# 🔌 Pay for an order · Backend Integration

> **Simulated** for the M-09 agent-flow test: the calls below are not on `social-pin` `main`. `draft` until the whole feature is delivered; `blockedBy: []` because s51's part is usable now ([[T-065-be Backend Integration]] is `current`) while the feature-level delivery is still in progress.

**Feature:** [[Pay for an order]] · **Backend:** [[Pay for an order Backend Delivery]] (in progress) · **Requirements:** [[Pay for an order Frontend Requirements]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]]

What the client builds: the Payment screen ([[Screen Index#s51|s51]]) reading an order and handing the buyer to Stripe's card page, and the confirmation ([[Screen Index#s52|s52]]) once that part ships. The sum of the task-level integration notes; the full call-by-call detail for s51 is in [[T-065-be Backend Integration]].

## Screens → calls

| Screen | The user does | Calls | Task |
|---|---|---|---|
| [[Screen Index#s51\|s51]] Payment | sees the order and its state | `GET /orders/:id` | [[T-065-be Backend Integration]] |
| s51 | taps Pay | `POST /orders/:id/checkout` → open `checkoutUrl` | [[T-065-be Backend Integration]] |
| s51 | comes back, or waits while pending | `GET /orders/:id` (poll every 3 s for 2 minutes, then on focus) | [[T-065-be Backend Integration]] |
| [[Screen Index#s52\|s52]] Event Ring granted | arrives after a paid order | not available yet | no task yet |

## Shapes that matter

`OrderEntity`: `id`, `state` (`UNPAID` · `PENDING` · `FAILED` · `PAID`), `currency`, `total` and `lines[].unitPrice` in minor units, `holdEndsAt`, `failureReason`, `createdAt`. `POST /orders/:id/checkout` → `{ checkoutUrl, expiresAt }`, `expiresAt` = `holdEndsAt`.

## Errors to handle

Branch on status and endpoint until `ErrorCode` is on the wire ([[T-063 Put the ErrorCode on the error body]]).

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 401 | `E_AUTH_04` | session expired | sign in again, resume the order |
| 404 | `E_ORDER_01` | not your order, or none | "This order is not available" |
| 409 | `E_ORDER_02` | checkout on a paid order | "Payment received" |
| 410 | `E_ORDER_03` | checkout after the hold ended | "Your tickets were released" |
| 502 | `E_PAY_01` | Stripe unreachable | "Payment is not available right now" |

## Not available yet

- The webhook settlement: no order reaches `PAID` until it ships (no task yet; [[T-047 Orders, payments and the provider webhook]] holds it today).
- s52's registration-complete flag and Event Ring id (no task yet).
- Creating the order on s50 ([[T-035 Registration transaction with order and payment]]).

## Tasks

| Task | Integration note | Status |
|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-be Backend Integration]] | Current (simulated) |
