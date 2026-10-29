---
id: F-37
type: feature
module: platform
feature: interests
name: "Interests"
priority: high
release: mvp
screens: [s07, s71]
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/platform, priority/high, release/mvp]
---

# Interests

**Backend:** Partial (needs more) · **Priority:** High · **Release:** MVP · **Module:** [[M-08 Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[S-92 Interests Story|Story]] · [[FR-37 Interests Frontend Requirements|Frontend Requirements]] · [[BD-37 Interests Backend Delivery|Backend Delivery]] · [[Interests Backend Integration|Backend Integration]] · [[Interests Frontend Delivery|Frontend Delivery]] · [[Interests QA Backend|QA Backend]] · [[Interests QA Frontend|QA Frontend]]

Interest picking during onboarding (s07) and from Me (s71). Used for search and matchmaking, never shown to others.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s07|s07]] | Interests |  |
| [[Screen Index#s71|s71]] | Interests |  |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#Gemma|§13 Gemma]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-92 Interests Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-016 | Interests vocabulary and my interests | To do | high | S5 |

### Log of the merged tasks

- T-016 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-016 · 2026-10-18 · created as the backend half of T-016
- T-016 · 2026-10-18 · created as the frontend half of T-016

## Related

- [[F-36 Gemma AI]]
- [[F-01 Account]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
