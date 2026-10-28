---
type: backend-delivery
code: post-event
scope: feature
feature: post-event
module: events
status: todo
screens: [s62]
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/todo, module/events, layer/backend]
---

# ⬜ Post-Event · Backend Delivery

**Feature:** [[F-25 Post-Event]] · **Status:** To do · **Integration guide:** [[Post-Event Backend Integration]] · **Requirements:** [[FR-25 Post-Event Frontend Requirements]] · **QA:** [[Post-Event QA Backend]]

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
- Needs scan counting from [[F-18 Badge & QR]] and connections from [[F-14 Connections]].

## Log

- 2026-10-18 · split out of [[F-25 Post-Event]] when the vault moved to layers
