---
type: feature
id: app-shell
name: "App Shell & Onboarding Narrative"
priority: medium
release: later
module: platform
frontendOnly: true
screens: [s00a, s00b, s00c, s00d]
created: 2026-10-15
updated: 2026-10-25
tags: [feature, module/platform, priority/medium, release/later]
---

# App Shell & Onboarding Narrative

**Backend:** Frontend only · **Priority:** Medium · **Release:** Later · **Module:** [[Platform & Cross-cutting Module|Platform & Cross-cutting]]

**Layers:** [[App Shell & Onboarding Narrative Story|Story]] · [[App Shell & Onboarding Narrative Frontend Requirements|Frontend Requirements]] · [[App Shell & Onboarding Narrative Backend Delivery|Backend Delivery]] · [[App Shell & Onboarding Narrative Backend Integration|Backend Integration]] · [[App Shell & Onboarding Narrative Frontend Delivery|Frontend Delivery]] · [[App Shell & Onboarding Narrative QA Backend|QA Backend]] · [[App Shell & Onboarding Narrative QA Frontend|QA Frontend]]

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

## Tasks

_No open tasks._

```dataview
TABLE status, priority, effort FROM #task WHERE feature = "app-shell" SORT priority ASC
```

## Related

- [[Auth & Sign-up]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
