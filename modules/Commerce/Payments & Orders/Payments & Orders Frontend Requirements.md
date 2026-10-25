---
type: frontend-requirements
code: payments
scope: feature
feature: payments
module: commerce
status: draft
screens: [s50, s51]
updated: 2026-10-25
tags: [frontend-requirements, frontend-requirements/draft, module/commerce, layer/frontend]
---

# Payments & Orders · Frontend Requirements

> ⚠ Affected by [[DR-07 Stripe for all four flows]] (2026-10-21): the provider is Stripe, paid through its hosted checkout on s51; "the provider is undecided" is no longer true. Which methods s51 offers is still open ([[Payments & Orders Story]] S2).

**Feature:** [[Payments & Orders]] · **Status:** Draft · **Story:** [[Payments & Orders Story]] · **API Integration:** not yet (backend not built)

What the client needs to create an order, pay for it and learn the result, and whether each need is met today. Nothing is available; the provider is undecided.

## Per screen

### [[Screen Index#s50|s50]] Tickets & levels

- Needs: create an order from the selected package and add-ons; the response with line items (name, unit price snapshot, quantity), currency, total, accepted methods, collector, and the order id to resume.
- Source today: not yet ([[T-035 Registration transaction with order and payment]], [[T-047 Orders, payments and the provider webhook]]).

### [[Screen Index#s51|s51]] Payment

- Needs: methods for this order; start a payment with a method (provider hand-off data for card / wallet, instructions for cash / bank); order and payment status (pending, failed with reason, succeeded); registration-complete flag and the Event Ring id on success.
- Source today: not yet (T-047, T-035).

### [[Screen Index#s53|s53]] Event mode (upgrade sheet)

- Needs: the same order and payment calls for a mini-event or level upgrade; the mini-event's access state after success.
- Source today: not yet ([[T-040 Lounges and upgrades]], T-047).

### [[Screen Index#s68|s68]] Me / Account (orders and receipts)

- Needs: my orders, paginated, with items, total, status, method, collector, provider receipt reference.
- Source today: not yet (T-047).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Create an order with price snapshots | — | ❌ | [[T-035 Registration transaction with order and payment]] |
| Accepted methods and collector per order | — | ❌ | [[T-047 Orders, payments and the provider webhook]] (provider undecided) |
| Start a payment, provider hand-off | — | ❌ | [[T-047 Orders, payments and the provider webhook]] |
| Order / payment status to poll | — | ❌ | [[T-047 Orders, payments and the provider webhook]] |
| Provider webhook (server to server, idempotent on `providerReference`) | — | ❌ | [[T-047 Orders, payments and the provider webhook]] |
| Registration completes and the Event Ring is granted on success | — | ❌ | [[T-035 Registration transaction with order and payment]], [[T-011 Create the Event Ring on registration]] |
| In-event upgrade purchase | — | ❌ | [[T-040 Lounges and upgrades]] |
| My orders and receipts | — | ❌ | [[T-047 Orders, payments and the provider webhook]] |
| Audit of every payment action | — | ❌ | [[T-053 Audit log writes]] |
| "Registration confirmed" notification | — | ❌ | [[T-045 NotificationService.emit and the inbox]] |

## Behaviour expectations

- Refetch / realtime: poll the order status while pending (interval set by T-047; back off after 2 minutes to on-focus refetch); resume polling when the app returns to the foreground with a pending order stored locally. On succeeded, invalidate `events:mine`, `event:{id}`, `event:{id}:packages`, `event:{id}:miniEvents` and `rings:list`.
- Caching keys: `order:{id}`, `orders:mine`, `order:{id}:methods`. The pending order id is persisted per device so s51 can resume after a restart.
- Pagination / ordering: orders newest first, paginated (`limit` 20, `TABLE_MAX_LIMIT = 50`); `meta.total` is the unpaginated count.
- Idempotency: a client-generated key per order attempt and per payment start, reused on retry; a second tap while in flight is ignored. A changed selection means a new key. Never retry a succeeded payment.
- Amounts: display the server's `currency` and `total`; never compute money on the client. Never store card data; the provider's SDK or hosted page handles it.
- Security: the webhook is server-to-server; the client never calls it or reads `providerReference` beyond a receipt reference.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 409 item sold out at order time | to be defined by [[T-034 Tickets, packages, levels, sold-out]] | "Sold out while you were deciding", refetch packages, stay on s50 |
| 409 already registered / duplicate order | to be defined by [[T-035 Registration transaction with order and payment]] | Open the existing order, or s52 if complete |
| 400 method not accepted for this order | to be defined by [[T-047 Orders, payments and the provider webhook]] | Refetch methods, reselect |
| 402 / provider declined | to be defined by [[T-047 Orders, payments and the provider webhook]] | Failed state with the provider's reason, "Try again" |
| 409 payment already succeeded | to be defined by [[T-047 Orders, payments and the provider webhook]] | Treat as success, proceed to s52 |
| 401 | `E_AUTH_04` | Sign in again; resume the pending order afterwards |

## Blocked by

- No decision note. Upstream tasks:
- [[T-047 Orders, payments and the provider webhook]] — needs the provider decision (card / e-payment per organizer); every row above.
- [[T-035 Registration transaction with order and payment]] — waits on [[T-034 Tickets, packages, levels, sold-out]] and T-047; the order creation and the registration-complete signal.
- [[T-011 Create the Event Ring on registration]] — the Ring id on success.
- [[T-040 Lounges and upgrades]] — the in-event upgrade sheet.
