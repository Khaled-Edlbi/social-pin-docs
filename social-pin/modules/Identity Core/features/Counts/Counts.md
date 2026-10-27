---
type: feature
id: counts
name: "Counts"
priority: high
release: mvp
module: identity
screens: [s11, s12, s14, s16, s17, s68]
created: 2026-10-15
updated: 2026-10-27
tags: [feature, module/identity, priority/high, release/mvp]
---

# Counts

**Backend:** Partial (needs more) · **Priority:** High · **Release:** MVP · **Module:** [[Identity Core Module|Identity Core]]

**Layers:** [[Counts Story|Story]] · [[Counts Frontend Requirements|Frontend Requirements]] · [[Counts Backend Delivery|Backend Delivery]] · [[Counts Backend Integration|Backend Integration]] · [[Counts Frontend Delivery|Frontend Delivery]] · [[Counts QA Backend|QA Backend]] · [[Counts QA Frontend|QA Frontend]]

Member counts per Ring ("148 people") and connection counts ("218 connections") shown on Home, Ring data, My Rings and Me.

## Design reference

| Screen | Name | Note |
|---|---|---|
| [[Screen Index#s11|s11]] | Home · Broadcasting |  |
| [[Screen Index#s12|s12]] | Home · Idle |  |
| [[Screen Index#s14|s14]] | Ring data |  |
| [[Screen Index#s16|s16]] | My Rings |  |
| [[Screen Index#s17|s17]] | Shared with me | List done; review / decline invite todo |
| [[Screen Index#s68|s68]] | Me / Account |  |

Wireframe brief sections: [[Wireframe Brief#Home — Rings hub + active profile|§4.1 Home — Rings hub + active profile]], [[Wireframe Brief#Ring management|§4.2 Ring management]]

Prototype: `socialPin-design/.proto2.json` (screen ids above), click-through map in [[Navigation Map]], see [[Design Reference]].

## Work

One story per feature (since 2026-10-27): all of this feature's work is in [[Counts Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-004 | Member count per Ring on list and detail | To do | high | S6–S10 |
| T-005 | Connection count on Me and Home | To do | high | S11 |

### Log of the merged tasks

- T-004 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-004 · 2026-10-18 · created as the backend half of T-004
- T-004 · 2026-10-18 · created as the frontend half of T-004
- T-005 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-005 · 2026-10-27 · `tickets/pm/…/S-05-written` · story written; What filled in; Me only (Home dropped by decision); the hand-typed `blocked` removed: the build shows it blocked by Connections · S8–S12.
- T-005 · 2026-10-18 · created as the backend half of T-005
- T-005 · 2026-10-18 · created as the frontend half of T-005

## Related

- [[Rings]]
- [[Connections]]
- [[Account]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
