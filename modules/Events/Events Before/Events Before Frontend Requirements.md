---
type: frontend-requirements
code: events-before
scope: feature
feature: events-before
module: events
status: draft
screens: [s48, s49, s50, s51, s52]
created: 2026-10-18
updated: 2026-10-25
tags: [frontend-requirements, frontend-requirements/draft, module/events, layer/frontend]
---

# Events Before · Frontend Requirements

> ⚠ Affected by [[DR-07 Stripe for all four flows]] (2026-10-21): the payment provider is Stripe; s51 is its hosted checkout. Which methods it offers is still open ([[Payments & Orders Story]] S2).

**Feature:** [[Events Before]] · **Status:** Draft · **Story:** [[Events Before Story]] · **API Integration:** not yet (backend not built)

What the client needs to build the events tab, landing page, ticket selection, payment and confirmation, and whether each need is met today. Nothing event-specific is available; the schema is complete.

## Per screen

### [[Screen Index#s48|s48]] Events tab

- Needs: paginated events with `name`, cover, `startsAt` / `endsAt`, location name and city, my participation flag, "contacts going" count and avatars; filters by date range, location and contacts-going; separate "my events" list.
- Source today: not yet ([[T-033 Events list, detail, schedule]]).

### [[Screen Index#s49|s49]] Event landing

- Needs: event detail with description, cover, location (coordinates for the map, `timezone`), schedule, mini-events, lounges, exhibitor preview, my participation and package, capacity summary for the CTA.
- Source today: not yet (T-033 for detail and schedule, [[T-034 Tickets, packages, levels, sold-out]] for the capacity state).

### [[Screen Index#s50|s50]] Tickets & levels

- Needs: packages with price, currency, level, entitlements (mini-events / lounges), remaining capacity, availability per account type; the registration form's pre-fill from the base profile.
- Source today: not yet (T-034). Pre-fill from the existing profile endpoint is available.

### [[Screen Index#s51|s51]] Payment

- Needs: order creation from a package, accepted methods, provider hand-off, order and payment status.
- Source today: not yet ([[T-035 Registration transaction with order and payment]], [[T-047 Orders, payments and the provider webhook]]). See [[Payments & Orders Frontend Requirements]].

### [[Screen Index#s52|s52]] Event Ring granted

- Needs: the Ring id from the registration response. See [[Event Ring Auto-creation Frontend Requirements]].

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Events list with filters and "contacts going" | — | ❌ | [[T-033 Events list, detail, schedule]] (contacts going also needs [[T-023 Connection detail and contacts list]]) |
| Event detail, schedule, mini-events | — | ❌ | [[T-033 Events list, detail, schedule]] |
| Packages, levels, entitlements, capacity / sold out | — | ❌ | [[T-034 Tickets, packages, levels, sold-out]] |
| Register (participant + order + payment intent) | — | ❌ | [[T-035 Registration transaction with order and payment]] |
| Payment methods, status, webhook completion | — | ❌ | [[T-047 Orders, payments and the provider webhook]] |
| Event Ring created on success | — | ❌ | [[T-011 Create the Event Ring on registration]] |
| Registered Ring in the hub after success | `GET /rings` | ✅ | — |

## Behaviour expectations

- Refetch / realtime: refetch the event detail when s49 regains focus (capacity changes); refetch packages on entering s50; after s51 reports succeeded, invalidate `events:mine`, `event:{id}` and `rings:list` before opening s52. Poll the order status on s51 while pending (interval set by T-047).
- Caching keys: `events:list:{filters}`, `events:mine`, `event:{id}`, `event:{id}:packages`, `order:{id}`.
- Pagination / ordering: events list is paginated (`limit`, `skip`; `TABLE_MAX_LIMIT = 50`), default `limit` 20, ordered by `startsAt` ascending for Discover and descending for past "my events"; `meta.total` is the unpaginated count. Filters that are absent are not sent (the builder treats `undefined` as "no filter", `false` as a real value).
- Idempotency: one client-generated key per registration attempt, reused on retry; a second tap on "Pay" while pending is ignored by the client.
- Timezones: render `startsAt` / `endsAt` in `Event.timezone`, and show the user's zone only as a secondary line when it differs.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 404 event | to be defined by [[T-033 Events list, detail, schedule]] | "This event is no longer available", back to s48 |
| 409 sold out / capacity reached at order time | to be defined by [[T-034 Tickets, packages, levels, sold-out]] | "Sold out while you were deciding", refetch packages, stay on s50 |
| 409 already registered | to be defined by [[T-035 Registration transaction with order and payment]] | "You are already registered", CTA becomes "Enter event mode" |
| 402 / payment failed | to be defined by [[T-047 Orders, payments and the provider webhook]] | Failed state on s51 with retry on the same order |
| 401 | `E_AUTH_04` | Sign in again; keep the selected package locally so the user resumes on s50 |

## Blocked by

- No decision note. Upstream tasks:
- [[T-033 Events list, detail, schedule]] — s48, s49; unblocks everything else here.
- [[T-034 Tickets, packages, levels, sold-out]] — s50; waits on T-033.
- [[T-035 Registration transaction with order and payment]] — s51, s52; waits on T-034 and T-047.
- [[T-047 Orders, payments and the provider webhook]] — payment provider undecided; s51.
- [[T-023 Connection detail and contacts list]] — the "contacts going" filter on s48.
