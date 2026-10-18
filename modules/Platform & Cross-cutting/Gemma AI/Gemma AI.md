---
type: feature
id: gemma
name: "Gemma AI"
status: todo
priority: P2
module: platform
screens: [s13, s60]
updated: 2026-10-18
tags: [feature, status/todo, module/platform, priority/P2]
---

# ❌ Gemma AI

**Status:** TODO · **Priority:** P2 · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[Gemma AI Story|Story]] · [[Gemma AI Frontend Requirements|Frontend Requirements]] · [[Gemma AI Backend Delivery|Backend Delivery]] · [[Gemma AI Backend Integration|Backend Integration]] · [[Gemma AI Frontend Delivery|Frontend Delivery]] · [[Gemma AI QA Backend|QA Backend]] · [[Gemma AI QA Frontend|QA Frontend]]

The cross-cutting assistant: assistant sheet (s13), Smart Match (s60), and suggestions everywhere (Pin name, Ring name, which Ring on accept, bio rewrite, meeting agenda).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s13|s13]] | Gemma sheet |  |
| [[Screen Index#s60|s60]] | Smart Match |  |

Wireframe brief sections: [[Wireframe Brief#Smart Match|§8.4 Smart Match]], [[Wireframe Brief#Gemma|§13 Gemma]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-051 Gemma assistant sheet and suggestions]] | ❓ Needs a decision / info | P2 | L |
| [[T-052 Smart Match]] | ⛔ Blocked | P2 | L |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "gemma" SORT priority ASC
```

## Open decisions

- [[D-06 Pin name rules]]

## Related

- [[Connections]]
- [[Meetings]]
- [[Interests]]
- [[Subscription (Free vs Pro)]]
- [[Ring Access Engine]]
- [[Audit Log]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
