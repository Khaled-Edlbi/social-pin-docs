---
type: backend-delivery
code: T-065-be
scope: task
feature: pay-for-an-order
module: payments-gateway
status: done
screens: [s51]
depends: ["T-065-fe Frontend Requirements"]
affects: ["T-065-fe Frontend · Open a Stripe checkout for an order"]
related: ["GET /orders/:id", "POST /orders/:id/checkout", "E_ORDER_01", "E_ORDER_02", "E_ORDER_03", "E_PAY_01", "E_AUTH_04", "DR-08 Stripe card checkout only", "DR-09 30-minute hold tied to the Stripe checkout", "Audit Log", "T-047 Orders, payments and the provider webhook"]
pending: []
blockedBy: []
owner: "khaled"
updated: 2026-10-25
tags: [backend-delivery, backend-delivery/done, module/payments-gateway, layer/backend]
task: T-065-be
---

# ✅ T-065-be · Open a Stripe checkout for an order · Backend Delivery

> **Simulated delivery** for the M-09 agent-flow test: nothing below is on `social-pin` `main`. The endpoints and error codes were agreed for the test (2026-10-25); [[Frontend API Guide]] and [[Frontend Contract]] are not changed by it.

**Task:** [[T-065-be Backend · Open a Stripe checkout for an order]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Backend Delivery]] · **Status:** Done · **Integration guide:** [[T-065-be Backend Integration]] · **Requirements:** [[T-065-fe Frontend Requirements]] (approved) · **QA:** [[T-065-be QA Backend]] (not run yet)

Written by the **backend** team: what shipped and how it works, as it **is**. A feature-level note is the sum of its task-level notes (table at the end).

## Endpoints, tables and code

**Endpoints**

| Method | Path | Auth | Who may call it |
|---|---|---|---|
| `GET` | `/orders/:id` | access token | the order's buyer only |
| `POST` | `/orders/:id/checkout` | access token | the order's buyer only, while the order is unpaid and its hold has not ended |

**Tables / models:** `Order` (reads its lines, currency, total; `holdEndsAt` derived from `createdAt` + 30 minutes), `Payment` (one row per checkout session: `provider = STRIPE`, `providerReference` = the Checkout Session id, `status`, `failureReason`), `AuditLog` (`PAYMENT_CHECKOUT_OPENED`).

**Code:** `src/modules/payments/` (`orders.controller.ts`, `checkout.service.ts`, `stripe.client.ts`)

## How it works

1. `GET /orders/:id` loads the order with its lines and its latest payment. Not the caller's order, or no such order: 404 `E_ORDER_01`, one body for both. The order's state is derived, never stored twice: `PAID` when a payment succeeded, `PENDING` when a session is open and Stripe has not answered, `FAILED` when the latest payment failed, `UNPAID` otherwise; `holdEndsAt` is the order's creation plus 30 minutes ([[DR-09 30-minute hold tied to the Stripe checkout]]).
2. `POST /orders/:id/checkout` runs in one transaction: checks the caller is the buyer (404 `E_ORDER_01`), the order is not paid (409 `E_ORDER_02`) and the hold has not ended (410 `E_ORDER_03`); if an open Stripe Checkout Session already exists for the order it is returned as is, otherwise a new one is created, card only ([[DR-08 Stripe card checkout only]]), with the order's total and currency, `expires_at` set to `holdEndsAt`, and the success and cancel URLs of the app; the session id is stored as the payment's `providerReference`. Stripe unreachable: 502 `E_PAY_01`, nothing written.
3. Every checkout opened writes `PAYMENT_CHECKOUT_OPENED` to the audit log with the order and the session ([[Audit Log]]).
4. No card data passes through the API; the Stripe secret key is read in `src/config` only.

### What exists

- Reading one of my orders with its state, hold end and failure reason (s51).
- Opening or reusing the Stripe card checkout for an unpaid order of mine (s51).
- The audit entry for a checkout opened.

### Gaps

- The Stripe webhook that marks the order paid (settlement, idempotent on `providerReference`) is **not available yet**: no task; [[T-047 Orders, payments and the provider webhook]] holds it today. Until it ships, an order never reaches `PAID` and `FAILED` is only set when Stripe's session reports a failed attempt on the next read.
- s52's "registration complete and the Event Ring id": no task yet.
- Creating the order on s50: [[T-035 Registration transaction with order and payment]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| [[T-065-be Backend · Open a Stripe checkout for an order]] | this note | ✅ Done (simulated) |

## Log

- 2026-10-25 · `payments-gateway/T-065/stripe-checkout` (simulated, no code) · `GET /orders/:id`, `POST /orders/:id/checkout`, `E_ORDER_01`–`E_ORDER_03`, `E_PAY_01`, audit `PAYMENT_CHECKOUT_OPENED`
