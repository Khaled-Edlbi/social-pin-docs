---
type: backend-delivery
code: pay-for-an-order
scope: feature
feature: pay-for-an-order
module: payments-gateway
status: done
screens: [s51, s52]
depends: ["Pay for an order Frontend Requirements"]
affects: []
related: ["T-065-be Backend Delivery", "T-066-be Backend Delivery", "GET /orders/:id", "POST /orders/:id/checkout", "POST /payments/stripe/webhook", "E_ORDER_01", "E_ORDER_02", "E_ORDER_03", "E_PAY_01", "E_PAY_02", "DR-08 Stripe card checkout only", "DR-09 30-minute hold tied to the Stripe checkout", "Audit Log", "T-047 Orders, payments and the provider webhook"]
pending: []
owner: "khaled"
updated: 2026-10-25
tags: [backend-delivery, backend-delivery/done, module/payments-gateway, layer/backend]
---

# ✅ Pay for an order · Backend Delivery

> **Simulated** for the M-09 agent-flow test: nothing below is on `social-pin` `main` (see [[T-065-be Backend Delivery]], [[T-066-be Backend Delivery]]).

**Feature:** [[Pay for an order]] · **Status:** Done: every story of [[Pay for an order Story]] delivered (T-065, T-066) · **Integration guide:** [[Pay for an order Backend Integration]] · **Requirements:** [[Pay for an order Frontend Requirements]] (approved) · **QA:** [[Pay for an order QA Backend]]

Written by the **backend** team: what shipped and how it works, as it **is**. The sum of this feature's task-level Backend Delivery notes (table at the end).

## Endpoints, tables and code

**Endpoints**

| Method | Path | Auth | Who may call it | Task |
|---|---|---|---|---|
| `GET` | `/orders/:id` | access token | the order's buyer | [[T-065-be Backend Delivery]], `registrationComplete` and `eventRingId` from [[T-066-be Backend Delivery]] |
| `POST` | `/orders/:id/checkout` | access token | the order's buyer, unpaid order, hold not ended | [[T-065-be Backend Delivery]] |
| `POST` | `/payments/stripe/webhook` | Stripe's signature | Stripe only | [[T-066-be Backend Delivery]] |

**Tables / models:** `Order`, `Payment` (`providerReference` = the Stripe Checkout Session id), `EventParticipant`, `Ring` (`EVENT`), `RingMembership`, `AuditLog`.

**Code:** `src/modules/payments/`

## How it works

- The order's state (`UNPAID`, `PENDING`, `FAILED`, `PAID`) is derived from its latest payment; its hold ends 30 minutes after creation ([[DR-09 30-minute hold tied to the Stripe checkout]]).
- A checkout is a Stripe hosted Checkout Session, card only ([[DR-08 Stripe card checkout only]]), reused while open, expiring with the hold; one session per order at a time.
- Stripe's webhook settles the order: signed (400 `E_PAY_02` otherwise), found by `providerReference`, idempotent (a replayed event changes nothing); on payment, the payment, the registration and the Event Ring are written in one transaction; a failed attempt records Stripe's reason and the order can be paid again until the hold ends.
- The order read tells the client when the registration is complete and which Event Ring was granted (`registrationComplete`, `eventRingId`).
- Only the buyer may read or pay an order (404 `E_ORDER_01`); a paid order cannot be paid again (409 `E_ORDER_02`); an ended hold cannot be paid (410 `E_ORDER_03`); Stripe unreachable writes nothing (502 `E_PAY_01`).
- Every payment action is audited: `PAYMENT_CHECKOUT_OPENED`, `PAYMENT_SUCCEEDED`, `PAYMENT_FAILED` ([[Audit Log]]).

### What exists

- s51: read an order, open or reuse its Stripe card checkout ([[T-065-be Backend Delivery]]).
- The settlement by Stripe's webhook, with the registration and the Event Ring, and what s52 needs on the order read ([[T-066-be Backend Delivery]]).

### Gaps

- None for this feature. Creating the order on s50 is [[T-035 Registration transaction with order and payment]] (Payments & Orders, Events Before).

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-be Backend Delivery]] | ✅ Done (simulated) |
| [[T-066 Settle an order and confirm it on s52]] | [[T-066-be Backend Delivery]] | ✅ Done (simulated) |

## Log

- 2026-10-25 · rolled up T-065-be (simulated): s51's two endpoints
- 2026-10-25 · `docs/backend/M-09-payments-gateway/F-41-pay-for-an-order/BD-41-done` · done for every task filed (T-065, simulated); the webhook settlement and s52 have no task: handed to the PM in `pending`; QA Backend can run on s51
- 2026-10-25 · `docs/backend/M-09-payments-gateway/F-41-pay-for-an-order/BD-41-t066-rolled-up` · rolled up T-066-be (simulated): the webhook settlement and the s52 fields; both `@pm` pending items cleared (T-066 filed and delivered)
