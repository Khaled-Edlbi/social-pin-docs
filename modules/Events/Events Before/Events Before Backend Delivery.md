---
type: backend-delivery
code: events-before
scope: feature
feature: events-before
module: events
status: todo
screens: [s48, s49, s50, s51, s52]
created: 2026-10-18
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/todo, module/events, layer/backend]
---

# ⬜ Events Before · Backend Delivery

**Feature:** [[Events Before]] · **Status:** To do · **Integration guide:** [[Events Before Backend Integration]] · **Requirements:** [[Events Before Frontend Requirements]] · **QA:** [[Events Before QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Event`, `EventParticipant`, `EventPackage`, `PackageEntitlement`, `MiniEvent`, `MiniEventAccess`, `Location`

### What exists

- Full event schema, package → mini-event entitlement as data.

### Gaps

- Event list + detail + schedule.
- Packages and visitor levels; sold-out state.
- Registration transaction: participant + order + Event Ring (see [[Event Ring Auto-creation]], [[Payments & Orders]]).

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Events Before]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
