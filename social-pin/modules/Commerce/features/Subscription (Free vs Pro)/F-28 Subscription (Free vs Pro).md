---
type: feature
id: subscription
name: "Subscription (Free vs Pro)"
priority: high
release: v1
module: commerce
screens: [s34, s70]
created: 2026-10-15
updated: 2026-10-28
tags: [feature, module/commerce, priority/high, release/v1]
---

# Subscription (Free vs Pro)

> ⚠ Affected by [[ND-07 Payment provider]] (2026-10-21): Pro is billed as a Stripe subscription; the story and the requirements can name it where the design says "subscription".

**Backend:** TODO · **Priority:** High · **Release:** v1 · **Module:** [[M-07 Commerce Module|Commerce]]

**Layers:** [[S-71 Subscription (Free vs Pro) Story|Story]] · [[FR-28 Subscription (Free vs Pro) Frontend Requirements|Frontend Requirements]] · [[BD-28 Subscription (Free vs Pro) Backend Delivery|Backend Delivery]] · [[Subscription (Free vs Pro) Backend Integration|Backend Integration]] · [[Subscription (Free vs Pro) Frontend Delivery|Frontend Delivery]] · [[Subscription (Free vs Pro) QA Backend|QA Backend]] · [[Subscription (Free vs Pro) QA Frontend|QA Frontend]]

Free vs Pro (s70) and the Pro gates: Smart Match, any-lounge access, Gemma automation, permanent QR.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s34|s34]] | Badge (flip) |  |
| [[Screen Index#s70|s70]] | Subscription |  |

Wireframe brief sections: [[Wireframe Brief#Sub-events, lounges, upgrades|§8.3 Sub-events, lounges, upgrades]], [[Wireframe Brief#Account, subscription & settings|§12 Account, subscription & settings]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-71 Subscription (Free vs Pro) Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-049 | Subscription endpoints and a single Pro gate | To do | high | S6 |

### Log of the merged tasks

- T-049 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-049 · 2026-10-18 · created as the backend half of T-049
- T-049 · 2026-10-18 · created as the frontend half of T-049

## Related

- [[F-18 Badge & QR]]
- [[F-36 Gemma AI]]
- [[F-23 Events During]]
- [[F-27 Payments & Orders]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
