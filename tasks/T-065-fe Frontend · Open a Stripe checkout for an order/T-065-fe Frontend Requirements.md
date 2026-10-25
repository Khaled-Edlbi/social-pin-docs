---
type: frontend-requirements
code: T-065-fe
scope: task
feature: pay-for-an-order
module: payments-gateway
status: draft
screens: [s51]
depends: []
affects: ["T-065-be Backend · Open a Stripe checkout for an order"]
related: ["T-065-be Backend · Open a Stripe checkout for an order", "T-065 Story", "Pay for an order Story", "DR-08 Stripe card checkout only", "DR-09 30-minute hold tied to the Stripe checkout", "T-063 Put the ErrorCode on the error body", "T-035 Registration transaction with order and payment", "Frontend Contract"]
pending: []
blockedBy: []
owner: "khaled"
updated: 2026-10-25
tags: [frontend-requirements, frontend-requirements/draft, module/payments-gateway, layer/frontend]
task: T-065-fe
---

# T-065-fe · Open a Stripe checkout for an order · Frontend Requirements

**Task:** [[T-065-fe Frontend · Open a Stripe checkout for an order]] · **Feature:** [[Pay for an order]] · **Feature-level note:** [[Pay for an order Frontend Requirements]] · **Status:** Draft · **Story:** [[T-065 Story]] (approved) · **Backend Integration:** [[T-065-be Backend Integration]] (not written yet)

Written by the **frontend** team, read by the backend: what the client needs to build [[T-065 Story]] on s51, and whether each need is met today. Nothing is met today: no payment endpoint exists ([[Frontend Contract]]: "payments" is in the not-yet-available list). `status: approved` once the backend accepts the list; `delivered` once every row is ✅.

## Per screen

### [[Screen Index#s51|s51]] Payment

- Needs, on entry with an order id from s50:
  - the order as the server holds it: id, lines (name, unit price snapshot, quantity), currency, total, state (`unpaid` · `pending` · `failed` · `paid`), the time the hold ends ([[DR-09 30-minute hold tied to the Stripe checkout]]) and, when failed, the buyer-facing reason Stripe gave;
  - for "Pay $160": one call that opens, or reuses while it is still valid, the Stripe hosted checkout for this order, card only ([[DR-08 Stripe card checkout only]]), and returns the URL to open and the return URLs the app is registered for; the same call twice for one unpaid order returns the same checkout;
  - on return from the card page (success or cancel URL, or the app coming back to the foreground): the order's state again, never what the card page said.
- States to render: unpaid (Pay enabled), pending ("Waiting for confirmation"), failed (reason, "Your tickets are held for N minutes", "Try again" on the same order), hold ended ("Your tickets were released", back to s50), paid ("Payment received"; carrying on to s52 is the next task).
- Source today: not yet ([[T-065-be Backend · Open a Stripe checkout for an order]]).

## Endpoints required

Endpoint names are the backend's to choose; each row is the need.

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Read one of my orders: lines, currency, total, state, hold end, failure reason | — | ❌ | [[T-065-be Backend · Open a Stripe checkout for an order]] |
| Open or reuse the Stripe checkout for an unpaid order of mine; returns the checkout URL | — | ❌ | [[T-065-be Backend · Open a Stripe checkout for an order]] |
| Audit entry "checkout opened" (server side, no client call) | — | ❌ | [[T-065-be Backend · Open a Stripe checkout for an order]] |
| Create the order on s50 (the id s51 starts from) | — | ❌ | [[T-035 Registration transaction with order and payment]] |

## Behaviour expectations

- Refetch / realtime: read the order on entry, on return from the card page and on app foreground; while `pending`, poll every 3 s for 2 minutes, then only on focus. Stop polling on `paid`, `failed` or hold ended.
- Caching keys: `order:{id}`; the id of an unpaid order is kept per device so s51 resumes it after a restart until its hold ends.
- Pagination / ordering: none (one order).
- Idempotency: a second tap on Pay while the call is in flight is ignored; a retry reuses the order and whatever checkout the server returns. The client never creates a second order from s51.
- Money and cards: amounts and currency are shown as the server returns them, never computed; no card field exists in the app, and the checkout URL opens in the system browser or an in-app browser tab, never a web view the app can read.
- Hold countdown: computed from the hold end the server returns and the device clock, refreshed by every order read.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); until it is, the client branches on status and endpoint and keeps `message` display-only ([[Frontend Contract]]).

| Status | ErrorCode | Show |
|---|---|---|
| 401 | `E_AUTH_04` | Sign in again; reopen s51 on the same order afterwards |
| 403 / 404 on an order that is not mine | to be defined by [[T-065-be Backend · Open a Stripe checkout for an order]] | One message, "This order is not available", back to s50 |
| 409 order already paid | to be defined by T-065-be | Show "Payment received" |
| 409 / 410 hold ended | to be defined by T-065-be | "Your tickets were released", back to s50 |
| 502 / 503 Stripe unreachable | to be defined by T-065-be | "Payment is not available right now", Pay enabled again |

## Blocked by

- No decision: the method is [[DR-08 Stripe card checkout only]], the hold is [[DR-09 30-minute hold tied to the Stripe checkout]].
- Every row waits on [[T-065-be Backend · Open a Stripe checkout for an order]]; s51 cannot be reached with a real order until [[T-035 Registration transaction with order and payment]] creates one.

## Sign-off

- Approved by: — · on: —
