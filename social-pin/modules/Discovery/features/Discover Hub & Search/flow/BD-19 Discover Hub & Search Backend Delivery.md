---
id: BD-19
type: backend-delivery
module: discovery
feature: discover-hub
status: todo
scope: feature
screens: [s38]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/todo, module/discovery, layer/backend]
---

# ⬜ Discover Hub & Search · Backend Delivery

> ⚠ Affected by [[D-37 Discover opens a Pin by its exact Pin name in the MVP]] (2026-11-12): F-19 is in the MVP, needing only the existing GET /views/pin/{pinName}; recent searches stay on the phone (no server store); name search, Gemma and contact matching are later

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** To do · **Integration guide:** [[Discover Hub & Search Backend Integration]] · **Requirements:** [[FR-19 Discover Hub & Search Frontend Requirements]] · **QA:** [[Discover Hub & Search QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /views/pin/:pinName (resolve one name)`

**Tables / models:** `Profile`, `AnalyticsEvent`

### What exists

- Resolving one exact Pin name works.

### Gaps

- Search must **not** become a membership oracle: a `!pinname` lookup returns the same 404 whether unknown, not shared, or blocked.
- Recent searches (per user, private).
- Import contacts (phone book match by hashed email / phone).

## Log

- 2026-10-18 · split out of [[F-19 Discover Hub & Search]] when the vault moved to layers
