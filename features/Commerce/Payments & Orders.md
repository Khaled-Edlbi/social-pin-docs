---
type: feature
id: payments
name: "Payments & Orders"
status: todo
priority: P1
domain: commerce
screens: [s50, s51]
updated: 2026-10-15
tags: [feature, status/todo, domain/commerce, priority/P1]
---

# ❌ Payments & Orders

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Commerce|Commerce]]

Ticket / package / sub-event purchase (s51): order with price snapshots, payment, provider webhook with idempotent `providerReference`.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s50|s50]] | Tickets & levels |  |
| [[Screen Index#s51|s51]] | Payment |  |

Wireframe brief sections: [[Wireframe Brief#Tickets, access levels, RSVP, payment|§7.3 Tickets, access levels, RSVP, payment]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Order`, `OrderItem`, `Payment`

### What exists

- Schema: one buyer per order CHECK, `OrderItem` price snapshot, `Payment.providerReference` unique, `collectedBy` ORGANIZER vs SOCIAL_PIN.

### Gaps

- Provider choice (card / e-payment per organizer) is undecided.
- Order → payment → webhook → registration completes → Event Ring granted.
- Audit log on every payment action.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-047 Orders, payments and the provider webhook]] | ❓ Needs a decision / info | P1 | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "payments" SORT priority ASC
```

## Related

- [[Events Before]]
- [[Subscription (Free vs Pro)]]
- [[Audit Log]]
- [[Event Ring Auto-creation]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
