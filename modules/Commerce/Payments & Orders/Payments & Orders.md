---
type: feature
id: payments
name: "Payments & Orders"
priority: high
release: v1
module: commerce
screens: [s50, s51]
created: 2026-10-15
updated: 2026-10-25
tags: [feature, module/commerce, priority/high, release/v1]
---

# Payments & Orders

> ⚠ Affected by [[D-07 Payment provider]] (2026-10-21): the provider is Stripe; the order, its payment on s51 through Stripe's hosted checkout and the settlement webhook are this feature's.

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[Commerce Module|Commerce]]

**Layers:** [[Payments & Orders Story|Story]] · [[Payments & Orders Frontend Requirements|Frontend Requirements]] · [[Payments & Orders Backend Delivery|Backend Delivery]] · [[Payments & Orders Backend Integration|Backend Integration]] · [[Payments & Orders Frontend Delivery|Frontend Delivery]] · [[Payments & Orders QA Backend|QA Backend]] · [[Payments & Orders QA Frontend|QA Frontend]]

Ticket / package / sub-event purchase (s51): order with price snapshots, payment, provider webhook with idempotent `providerReference`.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s50|s50]] | Tickets & levels |  |
| [[Screen Index#s51|s51]] | Payment |  |

Wireframe brief sections: [[Wireframe Brief#Tickets, access levels, RSVP, payment|§7.3 Tickets, access levels, RSVP, payment]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-047 Orders, payments and the provider webhook]] | ❓ Needs a decision / info | High | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "payments" SORT priority ASC
```

## Related

- [[Events Before]]
- [[Subscription (Free vs Pro)]]
- [[Audit Log]]
- [[Event Ring Auto-creation]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
