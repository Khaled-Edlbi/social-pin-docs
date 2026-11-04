---
id: F-03
type: feature
module: identity
feature: counts
priority: critical
release: mvp
screens: [s11, s12, s14, s16, s17, s68]
created: 2026-10-15
updated: 2026-11-01
tags: [feature, module/identity, priority/critical, release/mvp]
---

# Counts

> ⚠ Affected by [[S-23 Connections Story]] (2026-11-04): S-23 was rewritten as one set of parts, so the part numbers moved: Connections · S8–S12 (send, blocked pair, inbox, sent, notify) → S2–S4; S13–S18 (accept, window, Ring kept private, decline, errors) → S5–S7; S19–S24 (contacts, detail, shares, roster names, wizard, in common) → S8–S12; S25 (block) → S13; S26 (introduce) → S9 and Open questions. Repoint the links that name the old parts.

**Backend:** Partial (needs more) · **Priority:** Critical · **Release:** MVP · **Module:** [[M-01 Identity Core Module|Identity Core]]

**Layers:** [[S-03 Counts Story|Story]] · [[FR-03 Counts Frontend Requirements|Frontend Requirements]] · [[BD-03 Counts Backend Delivery|Backend Delivery]] · [[Counts Backend Integration|Backend Integration]] · [[Counts Frontend Delivery|Frontend Delivery]] · [[Counts QA Backend|QA Backend]] · [[Counts QA Frontend|QA Frontend]]

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
- T-005 · 2026-10-27 · `tickets/pm/…/S-05-written` · story written; What filled in; Me only (Home dropped by decision); the hand-typed `blocked` removed: the build shows it blocked by Connections · S8–S12.
- T-005 · 2026-10-18 · created as the backend half of T-005
- T-005 · 2026-10-18 · created as the frontend half of T-005

## Related

- [[F-11 Rings]]
- [[F-14 Connections]]
- [[F-01 Account]]

Project context: [[Ring Access Model]] · [[Architecture]] · [[API Conventions]] · [[Spec Map]]
