---
id: F-27
type: feature
module: commerce
feature: payments
name: "Payments & Orders"
priority: high
release: v1
screens: [s50, s51]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/commerce, priority/high, release/v1]
---

# Payments & Orders

> ⚠ Affected by [[ND-07 Payment provider]] (2026-10-21): the provider is Stripe; the order, its payment on s51 through Stripe's hosted checkout and the settlement webhook are this feature's.

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[M-07 Commerce Module|Commerce]]

**Layers:** [[S-69 Payments & Orders Story|Story]] · [[FR-27 Payments & Orders Frontend Requirements|Frontend Requirements]] · [[BD-27 Payments & Orders Backend Delivery|Backend Delivery]] · [[Payments & Orders Backend Integration|Backend Integration]] · [[Payments & Orders Frontend Delivery|Frontend Delivery]] · [[Payments & Orders QA Backend|QA Backend]] · [[Payments & Orders QA Frontend|QA Frontend]]

Ticket / package / sub-event purchase (s51): order with price snapshots, payment, provider webhook with idempotent `providerReference`.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s50|s50]] | Tickets & levels |  |
| [[Screen Index#s51|s51]] | Payment |  |

Wireframe brief sections: [[Wireframe Brief#Tickets, access levels, RSVP, payment|§7.3 Tickets, access levels, RSVP, payment]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-69 Payments & Orders Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-047 | Orders, payments and the provider webhook | Needs a decision | high | S7 |

### Log of the merged tasks

- T-047 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-047 · 2026-10-18 · created as the backend half of T-047

## Related

- [[F-22 Events Before]]
- [[F-28 Subscription (Free vs Pro)]]
- [[F-30 Audit Log]]
- [[F-21 Event Ring Auto-creation]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
