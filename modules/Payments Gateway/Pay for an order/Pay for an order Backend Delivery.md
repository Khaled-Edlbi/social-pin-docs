---
type: backend-delivery
code: pay-for-an-order
scope: feature
feature: pay-for-an-order
module: payments-gateway
status: in-progress
screens: [s51, s52]
depends: ["Pay for an order Frontend Requirements"]
affects: []
related: ["T-065-be Backend Delivery", "GET /orders/:id", "POST /orders/:id/checkout", "E_ORDER_01", "E_ORDER_02", "E_ORDER_03", "E_PAY_01", "DR-08 Stripe card checkout only", "DR-09 30-minute hold tied to the Stripe checkout", "Audit Log", "T-047 Orders, payments and the provider webhook"]
pending: []
owner: "khaled"
updated: 2026-10-25
tags: [backend-delivery, backend-delivery/in-progress, module/payments-gateway, layer/backend]
---

# 🟡 Pay for an order · Backend Delivery

> **Simulated** for the M-09 agent-flow test: nothing below is on `social-pin` `main` (see [[T-065-be Backend Delivery]]).

**Feature:** [[Pay for an order]] · **Status:** In progress (s51 delivered, the webhook and s52 not) · **Integration guide:** [[Pay for an order Backend Integration]] · **Requirements:** [[Pay for an order Frontend Requirements]] (approved) · **QA:** [[Pay for an order QA Backend]] (not run yet)

Written by the **backend** team: what shipped and how it works, as it **is**. The sum of this feature's task-level Backend Delivery notes (table at the end).

## Endpoints, tables and code

**Endpoints**

| Method | Path | Auth | Who may call it | Task |
|---|---|---|---|---|
| `GET` | `/orders/:id` | access token | the order's buyer | [[T-065-be Backend Delivery]] |
| `POST` | `/orders/:id/checkout` | access token | the order's buyer, unpaid order, hold not ended | [[T-065-be Backend Delivery]] |

**Tables / models:** `Order`, `Payment` (`providerReference` = the Stripe Checkout Session id), `AuditLog`.

**Code:** `src/modules/payments/`

## How it works

- The order's state (`UNPAID`, `PENDING`, `FAILED`, `PAID`) is derived from its latest payment; its hold ends 30 minutes after creation ([[DR-09 30-minute hold tied to the Stripe checkout]]).
- A checkout is a Stripe hosted Checkout Session, card only ([[DR-08 Stripe card checkout only]]), reused while open, expiring with the hold; one session per order at a time, never a second charge.
- Only the buyer may read or pay an order (404 `E_ORDER_01`, one body for "not yours" and "missing"); a paid order cannot be paid again (409 `E_ORDER_02`); an ended hold cannot be paid (410 `E_ORDER_03`); Stripe unreachable writes nothing (502 `E_PAY_01`).
- Every checkout opened is audited (`PAYMENT_CHECKOUT_OPENED`, [[Audit Log]]).

### What exists

- s51: read an order with its state, hold end and failure reason; open or reuse its Stripe card checkout ([[T-065-be Backend Delivery]]).

### Gaps

- The Stripe webhook that settles an order (idempotent on `providerReference`): **not available yet**, no task; [[T-047 Orders, payments and the provider webhook]] holds it today. Without it no order reaches `PAID`.
- s52: "registration complete" and the Event Ring id on a paid order: no task yet.
- Creating the order on s50: [[T-035 Registration transaction with order and payment]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-be Backend Delivery]] | ✅ Done (simulated) |
| Confirmation and settlement (story S3, S4) | — | no task yet |

## Log

- 2026-10-25 · rolled up T-065-be (simulated): s51's two endpoints
