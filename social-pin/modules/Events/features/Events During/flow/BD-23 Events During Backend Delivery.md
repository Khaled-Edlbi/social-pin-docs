---
id: BD-23
type: backend-delivery
module: events
feature: events-during
status: todo
scope: feature
screens: [s53, s54, s55, s56, s57, s58]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/todo, module/events, layer/backend]
---

# ⬜ Events During · Backend Delivery

**Feature:** [[F-23 Events During]] · **Status:** To do · **Integration guide:** [[Events During Backend Integration]] · **Requirements:** [[FR-23 Events During Frontend Requirements]] · **QA:** [[Events During QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Exhibitor`, `Booth`, `MiniEvent`, `MiniEventAccess`, `EventParticipant`

### What exists

- Exhibitors, booths and mini-events schema.

### Gaps

- Exhibitor list / detail scoped by the Event Ring.
- Event pass: rotating code (shares the mechanism of [[F-18 Badge & QR]]).
- Floor map data (booth positions).
- **No products / catalogue table yet**: schema change needed.
- Lounges and upgrades gate on package and Pro, see [[F-28 Subscription (Free vs Pro)]].

## Log

- 2026-10-18 · split out of [[F-23 Events During]] when the vault moved to layers
