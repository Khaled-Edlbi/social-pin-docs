---
id: F-13
type: feature
module: identity
feature: widgets
name: "Widgets"
priority: high
release: v1
screens: [s36, s37]
owner: "omar"
created: 2026-10-15
updated: 2026-10-29
tags: [feature, module/identity, priority/high, release/v1]
---

# Widgets

**Backend:** Partial (needs more) · **Priority:** High · **Release:** v1 · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-20 Widgets Story|Story]] · [[FR-13 Widgets Frontend Requirements|Frontend Requirements]] · [[BD-13 Widgets Backend Delivery|Backend Delivery]] · [[Widgets Backend Integration|Backend Integration]] · [[Widgets Frontend Delivery|Frontend Delivery]] · [[Widgets QA Backend|QA Backend]] · [[Widgets QA Frontend|QA Frontend]]

Widgets on a Ring (s37). The table exists; no endpoints; the type list does not match the design.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s36|s36]] | Add to this Ring |  |
| [[Screen Index#s37|s37]] | Widgets |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[S-20 Widgets Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-017 | Extend WIDGET_TYPE to the design's list | To do | high | S6 |
| T-018 | Widget CRUD on the projection | Needs a decision | high | S7 |

### Log of the merged tasks

- T-017 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-017 · 2026-10-18 · created as the backend half of T-017
- T-017 · 2026-10-18 · created as the frontend half of T-017
- T-018 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-018 · 2026-10-25 · ND-03 decided ([[D-03 Links entered once, switched on or off per Ring]]); What and Dependencies updated, flag cleared. Status left as typed; still waits on T-017.
- T-018 · 2026-10-18 · created as the backend half of T-018
- T-018 · 2026-10-18 · created as the frontend half of T-018

## Decisions

- [[ND-03 Field library vs per-Ring copies]] — decided, links entered once, on or off per Ring ([[D-03 Links entered once, switched on or off per Ring|D-03]])

## Related

- [[F-10 Ring Projection]]
- [[F-26 Meetings]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
