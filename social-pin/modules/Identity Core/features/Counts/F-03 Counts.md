---
id: F-03
type: feature
module: identity
feature: counts
priority: critical
release: mvp
screens: [s11, s12, s14, s16, s17, s68]
created: 2026-10-15
updated: 2026-11-24
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Counts

**Backend:** Done (S11 with F-14, backend `main` `1c460b0`) · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-03 Counts Story|Story]] · [[FR-03 Counts Frontend Requirements|Frontend Requirements]] · [[BD-03 Counts Backend Delivery|Backend Delivery]] · [[BI-14 Counts Backend Integration|Backend Integration]] · [[FD-06 Counts Frontend Delivery|Frontend Delivery]] · [[QB-07 Counts QA Backend|QA Backend]] · [[QF-08 Counts QA Frontend|QA Frontend]]

Member counts per Ring ("148 people") shown on Home, Ring data, My Rings and Shared with me, and on Me the connection count: the Connections tile of the profile card, one of its three tiles, Rings · Connections · Photos (kept by Omar Fostok 2026-11-24).

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

One story per feature (since 2026-10-27): all of this feature's work is in [[S-03 Counts Story]]. The tasks merged into it on 2026-10-27:

| Was | Title | Status then | Priority | Now in the story |
|---|---|---|---|---|
| T-004 | Member count per Ring on list and detail | To do | high | S6–S10 |
| T-005 | Connection count on Me and Home | To do | high | S11 |

### Log of the merged tasks

- T-004 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-004 · 2026-10-18 · created as the backend half of T-004
- T-004 · 2026-10-18 · created as the frontend half of T-004
- T-005 · 2026-10-15 · created from the backend vs design comparison ([[Status Report 2026-10-15]])
- T-005 · 2026-10-27 · `tickets/pm/…/S-05-written` · story written; What filled in; Me only (Home dropped by decision); the hand-typed `blocked` removed: the build shows it blocked by [[S-23 Connections Story|Connections · S2–S4]] (then numbered S8–S12).
- T-005 · 2026-10-18 · created as the backend half of T-005
- T-005 · 2026-10-18 · created as the frontend half of T-005

## Related

- [[F-11 Rings]]
- [[F-14 Connections]]
- [[F-01 Account]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
