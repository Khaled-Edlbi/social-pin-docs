---
type: backend-delivery
code: T-066-be
scope: task
feature: pay-for-an-order
module: payments-gateway
status: done
screens: [s51, s52]
depends: ["T-066-fe Frontend Requirements"]
affects: ["T-066-fe Frontend · Settle an order and confirm it on s52"]
related: ["POST /payments/stripe/webhook", "GET /orders/:id", "E_PAY_02", "E_ORDER_01", "T-065-be Backend Delivery", "T-047 Orders, payments and the provider webhook", "T-011 Create the Event Ring on registration", "DR-09 30-minute hold tied to the Stripe checkout", "Audit Log"]
pending: []
blockedBy: []
owner: "khaled"
updated: 2026-10-25
tags: [backend-delivery, backend-delivery/done, module/payments-gateway, layer/backend]
task: T-066-be
---

# ✅ T-066-be · Settle an order and confirm it on s52 · Backend Delivery

> **Simulated delivery** for the M-09 agent-flow test: nothing below is on `social-pin` `main`. The endpoint, the fields and `E_PAY_02` were chosen for the test (2026-10-25); [[Frontend API Guide]] and [[Frontend Contract]] are not changed by it. `blockedBy: []` because the requirements it answers are the frontend half's, [[T-066-fe Frontend Requirements]] (approved).

**Task:** [[T-066-be Backend · Settle an order and confirm it on s52]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Backend Delivery]] · **Status:** Done · **Integration guide:** [[T-066-be Backend Integration]] · **Requirements:** [[T-066-fe Frontend Requirements]] (approved) · **QA:** [[T-066-be QA Backend]] (not run yet)

Written by the **backend** team: what shipped and how it works, as it **is**. A feature-level note is the sum of its task-level notes (table at the end).

## Endpoints, tables and code

**Endpoints**

| Method | Path | Auth | Who may call it |
|---|---|---|---|
| `POST` | `/payments/stripe/webhook` | Stripe's signature (`Stripe-Signature` header), no access token | Stripe only |
| `GET` | `/orders/:id` (changed) | access token | the order's buyer; now also `registrationComplete` and `eventRingId` |

**Tables / models:** `Payment` (`status` set to `SUCCEEDED` / `FAILED`, `failureReason`), `Order`, `EventParticipant` (the registration), `Ring` (`EVENT`), `RingMembership`, `AuditLog` (`PAYMENT_SUCCEEDED`, `PAYMENT_FAILED`).

**Code:** `src/modules/payments/` (`stripe-webhook.controller.ts`, `settlement.service.ts`)

## How it works

1. The webhook verifies Stripe's signature on the raw body; an unsigned or wrongly signed call is 400 `E_PAY_02` and nothing is read.
2. It finds the payment by the event's Checkout Session id, the `providerReference` stored by [[T-065-be Backend Delivery]]. An unknown session is acknowledged (200) and ignored.
3. `checkout.session.completed` (paid): in one transaction, the payment becomes `SUCCEEDED`, the registration is completed and the Event Ring granted ([[T-011 Create the Event Ring on registration]]'s service, called here), and `PAYMENT_SUCCEEDED` is audited. A payment already `SUCCEEDED` makes the event a no-op: a replayed event changes nothing, 200.
4. A failed attempt (`payment_intent.payment_failed`): the payment becomes `FAILED` with Stripe's buyer-facing reason; `PAYMENT_FAILED` is audited; the order can be paid again until its hold ends ([[DR-09 30-minute hold tied to the Stripe checkout]]).
5. `checkout.session.expired`: nothing is written; the order is released by its hold.
6. `GET /orders/:id` now carries `registrationComplete` (true once the transaction in step 3 committed) and `eventRingId` (the Event Ring's id, `null` until then).

### What exists

- The settlement of an order by Stripe's webhook, idempotent on `providerReference`, with the registration and the Event Ring in the same transaction, audited (S3).
- What s51 and s52 need on the order read to go on to the confirmation (S4).

### Gaps

- Creating the order on s50: [[T-035 Registration transaction with order and payment]].
- Reading the Event Ring for s52 goes through the Rings endpoints ([[Event Ring Auto-creation]]); nothing new here.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| [[T-066-be Backend · Settle an order and confirm it on s52]] | this note | ✅ Done (simulated) |

## Log

- 2026-10-25 · `payments-gateway/T-066/stripe-webhook` (simulated, no code) · `POST /payments/stripe/webhook`, `registrationComplete` and `eventRingId` on `GET /orders/:id`, `E_PAY_02`, audit `PAYMENT_SUCCEEDED` / `PAYMENT_FAILED`
