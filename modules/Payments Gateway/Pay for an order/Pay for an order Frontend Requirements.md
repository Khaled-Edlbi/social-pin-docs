---
type: frontend-requirements
code: pay-for-an-order
scope: feature
feature: pay-for-an-order
module: payments-gateway
status: approved
approvedBy: "khaled"
approvedAt: 2026-10-25
screens: [s51, s52]
depends: []
affects: []
related: ["Pay for an order Story", "T-065-fe Frontend Requirements", "DR-08 Stripe card checkout only", "DR-09 30-minute hold tied to the Stripe checkout", "T-063 Put the ErrorCode on the error body", "Event Ring Auto-creation", "Frontend Contract"]
pending: []
blockedBy: []
owner: "khaled"
updated: 2026-10-25
tags: [frontend-requirements, frontend-requirements/approved, module/payments-gateway, layer/frontend]
---

# Pay for an order · Frontend Requirements

**Feature:** [[Pay for an order]] · **Status:** Approved 2026-10-25 · **Story:** [[Pay for an order Story]] (approved) · **Backend Integration:** [[Pay for an order Backend Integration]] (not written yet)

Written by the **frontend** team, read by the backend: what the client needs to build [[Pay for an order Story]], and whether each need is met today. This note is the sum of the task-level requirements below; nothing is met today, no payment endpoint exists. `status: approved` once the backend accepts the list; `delivered` once every row is ✅.

## Tasks

| Task | Requirements | Screens | Status |
|---|---|---|---|
| [[T-065 Open a Stripe checkout for an order]] | [[T-065-fe Frontend Requirements]] | s51 | Draft |
| Confirmation and settlement (S3, S4) | no task yet | s51, s52 | — |

## Per screen

### [[Screen Index#s51|s51]] Payment

- Needs: the order from the server (lines, currency, total, state, hold end, failure reason); one call that opens or reuses the Stripe card checkout for it ([[DR-08 Stripe card checkout only]]); the state again on return. Details: [[T-065-fe Frontend Requirements]].
- States: unpaid, pending, failed with the time left on the 30-minute hold ([[DR-09 30-minute hold tied to the Stripe checkout]]), hold ended, paid.
- Source today: not yet ([[T-065 Open a Stripe checkout for an order]]).

### [[Screen Index#s52|s52]] Event Ring granted

- Needs: when the order is `paid`, whether the registration is complete and the Event Ring is readable (its id), so s52 renders the Ring or "Setting up your Ring…" ([[Event Ring Auto-creation]]); a paid order read after the app was closed lands here on next open.
- Source today: not yet; no task brings it yet (the webhook settlement and the confirmation, S3 and S4 of the story).

## Endpoints required

Endpoint names are the backend's to choose; each row is the need.

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Read one of my orders: lines, currency, total, state, hold end, failure reason | — | ❌ | [[T-065 Open a Stripe checkout for an order]] |
| Open or reuse the Stripe checkout for an unpaid order of mine | — | ❌ | [[T-065 Open a Stripe checkout for an order]] |
| Settle the order from Stripe's webhook (server to server, idempotent on `providerReference`) | — | ❌ | no task yet ([[T-047 Orders, payments and the provider webhook]] holds it today) |
| On `paid`: registration complete and the Event Ring id | — | ❌ | no task yet; [[T-035 Registration transaction with order and payment]], [[T-011 Create the Event Ring on registration]] |
| Audit of every payment action | — | ❌ | [[T-065 Open a Stripe checkout for an order]] (checkout opened), [[T-053 Audit log writes]] |

## Behaviour expectations

- Refetch / realtime: read the order on entry, on return from the card page and on foreground; poll while `pending` (every 3 s for 2 minutes, then on focus). On `paid`, invalidate `events:mine`, `event:{id}` and `rings:list` before opening s52.
- Caching keys: `order:{id}`; an unpaid order's id kept per device until its hold ends.
- Pagination / ordering: none.
- Money and cards: never computed on the device, never typed in the app ([[Frontend Contract]]).

## Error states the UI must handle

Branch on status and endpoint until `ErrorCode` is on the wire ([[T-063 Put the ErrorCode on the error body]]); the per-task note has the full table ([[T-065-fe Frontend Requirements]]).

| Status | ErrorCode | Show |
|---|---|---|
| 401 | `E_AUTH_04` | Sign in again, resume the same order |
| 403 / 404 order not mine | to be defined by T-065-be | "This order is not available" |
| 409 already paid | to be defined by T-065-be | "Payment received", on to s52 once the confirmation ships |
| 409 / 410 hold ended | to be defined by T-065-be | "Your tickets were released", back to s50 |
| 502 / 503 Stripe unreachable | to be defined by T-065-be | "Payment is not available right now" |

## Blocked by

- No open decision ([[DR-08 Stripe card checkout only]], [[DR-09 30-minute hold tied to the Stripe checkout]]).
- s51 rows wait on [[T-065 Open a Stripe checkout for an order]]; s52 rows wait on a task the PM has not filed yet.

## Sign-off

- Approved by: khaled (backend accepted the list) · on: 2026-10-25
