---
type: backend-delivery
code: post-event
scope: feature
feature: post-event
module: events
status: todo
screens: [s62]
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/todo, module/events, layer/backend]
---

# ⬜ Post-Event · Backend Delivery

**Feature:** [[Post-Event]] · **Status:** To do · **Integration guide:** [[Post-Event Backend Integration]] · **Requirements:** [[Post-Event Frontend Requirements]] · **QA:** [[Post-Event QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `POST /rings/:id/disposition`

**Tables / models:** `EventSummary`, `AnalyticsEvent`, `FollowUpAutomation`

**Code:** `src/modules/ring/ring.service.ts`

### What exists

- Ring disposition.

### Gaps

- Compute and store `EventSummary`.
- Follow-up suggestions (Gemma).
- Needs scan counting from [[Badge & QR]] and connections from [[Connections]].

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Post-Event]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
