---
type: feature
id: code-delivery
name: "Code Delivery"
priority: critical
release: mvp
module: platform
screens: [s02]
updated: 2026-10-25
tags: [feature, module/platform, priority/critical, release/mvp]
---

# Code Delivery

**Backend:** Partial (needs more) · **Priority:** Critical · **Release:** MVP · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Code Delivery Story|Story]] · [[Code Delivery Frontend Requirements|Frontend Requirements]] · [[Code Delivery Backend Delivery|Backend Delivery]] · [[Code Delivery Backend Integration|Backend Integration]] · [[Code Delivery Frontend Delivery|Frontend Delivery]] · [[Code Delivery QA Backend|QA Backend]] · [[Code Delivery QA Frontend|QA Frontend]]

Delivering the one-time code by email or SMS. Today the code is only logged, and returned as `devCode` **in every environment** (product decision 2026-10-15, so the passwordless app can sign in before a provider exists).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s02|s02]] | Verify | Resend timer, expired code |

Wireframe brief sections: [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-001 Wire an email provider for one-time codes]] | ⬜ To do | Critical | S |
| [[T-002 Wire an SMS provider for one-time codes]] | ⬜ To do | Critical | S |
| [[T-003 Remove devCode once delivery works]] | ⛔ Blocked | High | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "code-delivery" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]
- [[Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
