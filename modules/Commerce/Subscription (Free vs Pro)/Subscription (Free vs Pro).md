---
type: feature
id: subscription
name: "Subscription (Free vs Pro)"
priority: high
release: v1
module: commerce
screens: [s34, s70]
created: 2026-10-15
updated: 2026-10-26
tags: [feature, module/commerce, priority/high, release/v1]
---

# Subscription (Free vs Pro)

> ⚠ Affected by [[Payment provider]] (2026-10-21): Pro is billed as a Stripe subscription; the story and the requirements can name it where the design says "subscription".

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[Commerce Module|Commerce]]

**Layers:** [[Subscription (Free vs Pro) Story|Story]] · [[Subscription (Free vs Pro) Frontend Requirements|Frontend Requirements]] · [[Subscription (Free vs Pro) Backend Delivery|Backend Delivery]] · [[Subscription (Free vs Pro) Backend Integration|Backend Integration]] · [[Subscription (Free vs Pro) Frontend Delivery|Frontend Delivery]] · [[Subscription (Free vs Pro) QA Backend|QA Backend]] · [[Subscription (Free vs Pro) QA Frontend|QA Frontend]]

Free vs Pro (s70) and the Pro gates: Smart Match, any-lounge access, Gemma automation, permanent QR.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s34|s34]] | Badge (flip) |  |
| [[Screen Index#s70|s70]] | Subscription |  |

Wireframe brief sections: [[Wireframe Brief#Sub-events, lounges, upgrades|§8.3 Sub-events, lounges, upgrades]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-049 Subscription endpoints and a single Pro gate]] | ⬜ To do | High | M |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "subscription" SORT priority ASC
```

## Related

- [[Badge & QR]]
- [[Gemma AI]]
- [[Events During]]
- [[Payments & Orders]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
