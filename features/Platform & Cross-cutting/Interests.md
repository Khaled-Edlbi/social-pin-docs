---
type: feature
id: interests
name: "Interests"
status: partial
priority: P1
domain: platform
screens: [s07, s71]
updated: 2026-10-18
tags: [feature, status/partial, domain/platform, priority/P1]
---

# 🟡 Interests

**Status:** Partial (needs more) · **Priority:** P1 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]] · **Story:** [[Interests Story]] · **Requirements:** [[Interests Requirements]]

Interest picking during onboarding (s07) and from Me (s71). Used for search and matchmaking, never shown to others.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s07|s07]] | Interests |  |
| [[Screen Index#s71|s71]] | Interests |  |

Wireframe brief sections: [[Wireframe Brief#Onboarding flow|§3.1 Onboarding flow]], [[Wireframe Brief#Gemma|§13 Gemma]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

**Tables / models:** `Interest`, `UserInterest`

**Code:** `prisma/seed/interest.seed.ts`

### What exists

- Table and seeded vocabulary.

### Gaps

- `GET /interests` vocabulary.
- `GET/PUT /users/me/interests`.
- No outward entity, ever: interests feed [[Gemma AI]] matchmaking only.

## Tasks

| Task | Status | Priority | Effort |
|---|---|---|---|
| [[T-016 Interests vocabulary and my interests]] | ⬜ To do | P1 | S |

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "interests" SORT priority ASC
```

## Related

- [[Gemma AI]]
- [[Account]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
