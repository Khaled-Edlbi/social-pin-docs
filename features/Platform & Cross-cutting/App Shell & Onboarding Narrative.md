---
type: feature
id: app-shell
name: "App Shell & Onboarding Narrative"
status: frontend
priority: P2
domain: platform
screens: [s00a, s00b, s00c, s00d]
updated: 2026-10-15
tags: [feature, status/frontend, domain/platform, priority/P2]
---

# ⬜ App Shell & Onboarding Narrative

**Status:** Frontend only · **Priority:** P2 · **Domain:** [[Feature Tree#Platform & Cross-cutting|Platform & Cross-cutting]]

Splash, the three value panels, tab bar and the signature motions. No backend work.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s00a|s00a]] | Splash |  |
| [[Screen Index#s00b|s00b]] | Value · Rings |  |
| [[Screen Index#s00c|s00c]] | Value · PinCast |  |
| [[Screen Index#s00d|s00d]] | Value · Events |  |

Wireframe brief sections: [[Wireframe Brief#Global navigation & app shell|§2 Global navigation & app shell]], [[Wireframe Brief#Onboarding|§3 Onboarding]], [[Wireframe Brief#Motion principles|§14 Motion principles]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Backend state

**Endpoints:** none yet.

### Gaps

- Frontend only. Listed so every design screen maps to something.

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "app-shell" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[SPEC_MAP]]
