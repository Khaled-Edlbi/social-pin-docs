---
type: backend-integration
code: T-065-be
scope: task
feature: pay-for-an-order
module: payments-gateway
status: current
screens: [s51]
depends: ["T-065-be Backend Delivery"]
affects: ["T-065-fe Frontend · Open a Stripe checkout for an order"]
related: ["T-065-fe Frontend Requirements", "GET /orders/:id", "POST /orders/:id/checkout", "E_ORDER_01", "E_ORDER_02", "E_ORDER_03", "E_PAY_01", "E_AUTH_04", "T-063 Put the ErrorCode on the error body", "Frontend Contract"]
pending: []
owner: "khaled"
updated: 2026-10-25
tags: [backend-integration, backend-integration/current, module/payments-gateway, layer/backend]
task: T-065-be
---

# 🔌 T-065-be · Open a Stripe checkout for an order · Backend Integration

> **Simulated** for the M-09 agent-flow test: the calls below are not on `social-pin` `main`; build against them in the test only. [[Frontend API Guide]] and [[Frontend Contract]] are unchanged.

**Task:** [[T-065-be Backend · Open a Stripe checkout for an order]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Backend Integration]] · **Backend:** [[T-065-be Backend Delivery]] · **Requirements:** [[T-065-fe Frontend Requirements]] · **Read first:** [[Frontend Contract]], [[Frontend API Guide]]

Written by the **backend** team for the frontend and QA: how to call what T-065-be delivered for the Payment screen. Base URL `/api/v1`, access token on every call.

## Screens → calls

| Screen | The user does | Calls |
|---|---|---|
| [[Screen Index#s51\|s51]] Payment, on entry | sees the order, its total and its state | `GET /orders/:id` |
| s51 | taps "Pay $160" | `POST /orders/:id/checkout`, then opens `checkoutUrl` in the system browser or an in-app browser tab |
| s51 | comes back from the card page (success or cancel URL, or the app returns to the foreground) | `GET /orders/:id` |
| s51 | waits while pending | `GET /orders/:id` every 3 s for 2 minutes, then on focus |

## Flow

1. **Read the order.** `GET /orders/:id` → 200 `OrderEntity`. Render from `state`:
   - `UNPAID`: Pay enabled; show the time left until `holdEndsAt`.
   - `PENDING`: "Waiting for confirmation"; poll.
   - `FAILED`: show `failureReason`, "Your tickets are held for N minutes" from `holdEndsAt`, "Try again" (step 2 again, same order).
   - `PAID`: "Payment received". Carrying on to s52 is not available yet (no task).
   - `holdEndsAt` in the past and not `PAID`: "Your tickets were released", back to s50.
2. **Open the checkout.** `POST /orders/:id/checkout` (no body) → 201 `{ checkoutUrl, expiresAt }`. Calling it again for the same unpaid order while the session is open returns the same `checkoutUrl`; it never creates a second charge. `expiresAt` equals the order's `holdEndsAt`.
3. **Come back.** The success and cancel URLs both bring the buyer back to s51; read the order again (step 1) and trust only its `state`, never which URL was hit.

## Shapes that matter

`OrderEntity`: `id`, `state` (`UNPAID` · `PENDING` · `FAILED` · `PAID`), `currency` (ISO 4217), `total` (integer, minor units), `lines` (`name`, `unitPrice` in minor units, `quantity`), `holdEndsAt` (ISO datetime), `failureReason` (string or `null`, buyer-facing, from Stripe), `createdAt`.

- Amounts are integers in the currency's minor units; format them, never compute them.
- `holdEndsAt` is the order's creation plus 30 minutes ([[DR-09 30-minute hold tied to the Stripe checkout]]); count down from it on the device and correct the countdown on every read.
- No card field, no method field: card only, on Stripe's page ([[DR-08 Stripe card checkout only]]).

## State to keep on the client

`order:{id}`, refetched on entry, on return and on foreground. Keep the id of an unpaid order per device until `holdEndsAt` so s51 resumes it after a restart. Never store `checkoutUrl` beyond the screen: ask again, the server reuses the open session.

## Errors to handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); until it is, branch on the status and the endpoint, and keep `message` display-only.

| Status | ErrorCode | When | Show |
|---|---|---|---|
| 401 | `E_AUTH_04` | session expired | sign in again, resume the same order |
| 404 | `E_ORDER_01` | not your order, or no such order (one body for both) | "This order is not available", back to s50 |
| 409 | `E_ORDER_02` | `POST …/checkout` on a paid order | "Payment received" |
| 410 | `E_ORDER_03` | `POST …/checkout` after `holdEndsAt` | "Your tickets were released", back to s50 |
| 502 | `E_PAY_01` | Stripe unreachable; nothing was written | "Payment is not available right now", Pay enabled again |

## Not available yet

- The webhook settlement: an order does not reach `PAID` until it ships (no task yet; [[T-047 Orders, payments and the provider webhook]] holds it today).
- s52: "registration complete" and the Event Ring id (no task yet).
- Creating the order on s50 ([[T-035 Registration transaction with order and payment]]).
