---
type: feature
id: gemma
name: "Gemma AI"
status: todo
priority: P2
domain: platform
screens: [s13, s60]
updated: 2026-10-15
tags: [feature, status/todo, domain/platform, priority/P2]
---

# ❌ Gemma AI

**Status:** TODO · **Priority:** P2 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]]

The cross-cutting assistant: assistant sheet (s13), Smart Match (s60), and suggestions everywhere (Pin name, Ring name, which Ring on accept, bio rewrite, meeting agenda).

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s13|s13]] | Gemma sheet |  |
| [[Screen Index#s60|s60]] | Smart Match |  |

Wireframe brief sections: [[Wireframe Brief#Smart Match|§8.4 Smart Match]], [[Wireframe Brief#Gemma|§13 Gemma]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `AiSession`, `AiMessage`, `AiAction`, `MatchResult`, `UserInterest`

### What exists

- AI session / message / action schema and `MatchResult`.

### Gaps

- Every suggestion must only see what the **asking user** may see: route through [[Ring Access Engine]].
- Smart Match over interests and event participants (Pro).
- Auto-send meeting requests (Pro).
- Audit every AI action.

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

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
