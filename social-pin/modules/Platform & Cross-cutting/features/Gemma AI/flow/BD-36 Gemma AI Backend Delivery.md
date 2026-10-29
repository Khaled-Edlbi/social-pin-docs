---
id: BD-36
type: backend-delivery
module: platform
feature: gemma
status: todo
scope: feature
screens: [s13, s60]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/todo, module/platform, layer/backend]
---

# ⬜ Gemma AI · Backend Delivery

**Feature:** [[F-36 Gemma AI]] · **Status:** To do · **Integration guide:** [[Gemma AI Backend Integration]] · **Requirements:** [[FR-36 Gemma AI Frontend Requirements]] · **QA:** [[Gemma AI QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `AiSession`, `AiMessage`, `AiAction`, `MatchResult`, `UserInterest`

### What exists

- AI session / message / action schema and `MatchResult`.

### Gaps

- Every suggestion must only see what the **asking user** may see: route through [[F-08 Ring Access Engine]].
- Smart Match over interests and event participants (Pro).
- Auto-send meeting requests (Pro).
- Audit every AI action.

## Log

- 2026-10-18 · split out of [[F-36 Gemma AI]] when the vault moved to layers
