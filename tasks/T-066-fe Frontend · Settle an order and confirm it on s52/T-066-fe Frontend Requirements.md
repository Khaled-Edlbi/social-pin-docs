---
type: frontend-requirements
code: T-066-fe
scope: task
feature: pay-for-an-order
module: payments-gateway
status: approved
approvedBy: "khaled"
approvedAt: 2026-10-25
screens: [s51, s52]
depends: []
affects: ["T-066-be Backend · Settle an order and confirm it on s52"]
related: ["T-066-be Backend · Settle an order and confirm it on s52", "T-066 Story", "T-065-be Backend Integration", "Event Ring Auto-creation Story", "GET /orders/:id", "E_ORDER_01", "E_AUTH_04", "T-063 Put the ErrorCode on the error body", "Frontend Contract"]
pending: []
blockedBy: []
owner: "khaled"
updated: 2026-10-25
tags: [frontend-requirements, frontend-requirements/approved, module/payments-gateway, layer/frontend]
task: T-066-fe
---

# T-066-fe · Settle an order and confirm it on s52 · Frontend Requirements

**Task:** [[T-066-fe Frontend · Settle an order and confirm it on s52]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Frontend Requirements]] · **Status:** Approved 2026-10-25 · **Story:** [[T-066 Story]] (approved) · **Backend Integration:** T-066-be's, not written yet

Written by the **frontend** team, read by the backend: what the client needs to build [[T-066 Story]], and whether each need is met today. The settlement itself is server to server (the webhook): the client never calls it; it needs the order read to reflect it. `status: approved` once the backend accepts the list; `delivered` once every row is ✅.

## Per screen

### [[Screen Index#s51|s51]] Payment

- Needs: the order's state turning `PAID` (or `FAILED` with Stripe's reason) once Stripe has confirmed, on the same `GET /orders/:id` s51 already reads ([[T-065-be Backend Integration]]); when `PAID`, a flag saying the registration is complete and the Event Ring's id, so s51 can go on to s52.
- Source today: the order read exists (simulated), `PAID` is never reached because no settlement exists; the registration flag and the Ring id are not available yet ([[T-066-be Backend · Settle an order and confirm it on s52]]).

### [[Screen Index#s52|s52]] Event Ring granted

- Needs: reached only from a `PAID` order; the Event Ring by its id (name, colour, window) as [[Event Ring Auto-creation Story]] S1 shows it; while the registration is not complete or the Ring is not readable, a state to show "Setting up your Ring…" and retry.
- Source today: not yet ([[T-066-be Backend · Settle an order and confirm it on s52]]; reading the Ring itself is [[Event Ring Auto-creation]]'s).

### App start (any screen)

- Needs: the orders paid while the app was closed; the client keeps the id of its last unpaid order and reads it on start: a `PAID` order takes the buyer to s52 once, then the Event Ring is in the hub.
- Source today: the order read exists (simulated); it never shows `PAID` until the settlement ships.

## Endpoints required

Endpoint names are the backend's to choose; each row is the need.

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Stripe's confirmation settles the order (server to server, signed, idempotent on `providerReference`; registration and Event Ring in the same transaction; audited) | — | ❌ | [[T-066-be Backend · Settle an order and confirm it on s52]] |
| The order read shows `PAID` / `FAILED` after settlement | `GET /orders/:id` | ❌ (the read exists, the settlement does not) | [[T-066-be Backend · Settle an order and confirm it on s52]] |
| On `PAID`: registration complete and the Event Ring id on the order read | — | ❌ | [[T-066-be Backend · Settle an order and confirm it on s52]] |
| Read the Event Ring by id for s52 | — | ❌ | [[T-011 Create the Event Ring on registration]] / [[Event Ring Auto-creation]] |

## Behaviour expectations

- Refetch / realtime: while `PENDING`, keep T-065's polling (every 3 s for 2 minutes, then on focus); on `PAID` with the registration complete, go to s52 once; on `PAID` without it yet, s52 shows "Setting up your Ring…" and reads the order every 2 s for 30 s, then on focus.
- Caching keys: `order:{id}`; on `PAID`, invalidate `events:mine`, `event:{id}` and `rings:list` before rendering s52.
- App start: read the stored unpaid order once; clear it on `PAID` (after s52) or when its hold ends.
- Never decide `PAID` on the client: neither the success URL nor a timer marks an order paid.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 401 | `E_AUTH_04` | sign in again, then resume the same order |
| 404 | `E_ORDER_01` | "This order is not available", back to s50 |
| `PAID`, Ring not readable after 30 s | — | s52 keeps "Setting up your Ring…" with "Try again"; never an empty screen |

## Blocked by

- No decision. Every ❌ row waits on [[T-066-be Backend · Settle an order and confirm it on s52]]; reaching s51 with a real order waits on [[T-035 Registration transaction with order and payment]].

## Sign-off

- Approved by: khaled (backend accepted the list) · on: 2026-10-25
