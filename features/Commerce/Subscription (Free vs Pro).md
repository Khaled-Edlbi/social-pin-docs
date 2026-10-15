---
type: feature
id: subscription
name: "Subscription (Free vs Pro)"
status: todo
priority: P1
domain: commerce
screens: [s34, s70]
updated: 2026-10-15
tags: [feature, status/todo, domain/commerce, priority/P1]
---

# ❌ Subscription (Free vs Pro)

**Status:** TODO · **Priority:** P1 · **Domain:** [[Feature Tree#Commerce|Commerce]]

Free vs Pro (s70) and the Pro gates: Smart Match, any-lounge access, Gemma automation, permanent QR.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s34|s34]] | Badge (flip) |  |
| [[Screen Index#s70|s70]] | Subscription |  |

Wireframe brief sections: [[Wireframe Brief#Sub-events, lounges, upgrades|§8.3 Sub-events, lounges, upgrades]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Subscription`, `User.accountType`

### What exists

- `User.accountType` FREE / PRO and `Subscription` with one live row per owner and plan.

### Gaps

- Subscribe / cancel / status endpoints and store receipts.
- A single `ProGate` helper every gated feature calls, instead of scattered `accountType` checks.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-049 Subscription endpoints and a single Pro gate]] | ⬜ To do | P1 | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "subscription" SORT priority ASC
```

## Related

- [[Badge & QR]]
- [[Gemma AI]]
- [[Events During]]
- [[Payments & Orders]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
