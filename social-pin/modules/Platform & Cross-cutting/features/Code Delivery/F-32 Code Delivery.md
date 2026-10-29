---
id: F-32
type: feature
module: platform
feature: code-delivery
name: "Code Delivery"
priority: critical
release: mvp
screens: [s02]
created: 2026-10-18
updated: 2026-10-29
tags: [feature, module/platform, priority/critical, release/mvp]
---

# Code Delivery

**Backend:** Partial (needs more) · **Priority:** Critical · **Release:** MVP · **Module:** [[M-08 Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[S-78 Code Delivery Story|Story]] · [[FR-32 Code Delivery Frontend Requirements|Frontend Requirements]] · [[BD-32 Code Delivery Backend Delivery|Backend Delivery]] · [[Code Delivery Backend Integration|Backend Integration]] · [[Code Delivery Frontend Delivery|Frontend Delivery]] · [[Code Delivery QA Backend|QA Backend]] · [[Code Delivery QA Frontend|QA Frontend]]

Delivering the one-time code by email or SMS. Today the code is only logged, and returned as `devCode` **in every environment** (product decision 2026-10-15, so the passwordless app can sign in before a provider exists).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s02|s02]] | Verify | Resend timer, expired code |

Wireframe brief sections: [[Wireframe Brief#The three login/signup methods|§3.2 The three login/signup methods]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-78 Code Delivery Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-001 | Wire an email provider for one-time codes | To do | critical | S6 |
| T-002 | Wire an SMS provider for one-time codes | To do | critical | S7 |
| T-003 | Remove devCode once delivery works | Blocked | high | S8 |

### Log of the merged tasks

- T-001 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-001 · 2026-10-18 · created as the backend half of T-001
- T-002 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-002 · 2026-10-18 · created as the backend half of T-002
- T-003 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-003 · 2026-10-18 · created as the backend half of T-003

## Related

- [[F-02 Auth & Sign-up]]
- [[F-39 Notifications]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
