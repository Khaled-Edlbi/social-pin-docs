---
type: backend-delivery
code: exhibitor
scope: feature
feature: exhibitor
module: events
status: todo
screens: [s63, s64, s65]
created: 2026-10-18
updated: 2026-10-28
tags: [backend-delivery, backend-delivery/todo, module/events, layer/backend]
---

# ⬜ Exhibitor · Backend Delivery

**Feature:** [[F-24 Exhibitor]] · **Status:** To do · **Integration guide:** [[Exhibitor Backend Integration]] · **Requirements:** [[FR-24 Exhibitor Frontend Requirements]] · **QA:** [[Exhibitor QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `Business`, `BusinessMember`, `Exhibitor`, `ExhibitorDocument`, `Booth`, `AnalyticsEvent`

### What exists

- Exhibitor, document and booth schema; `AnalyticsEvent` table.

### Gaps

- Business account multi-step setup, creating a business `CORPORATE` Ring.
- Team members on the stand (business members → Ring members).
- Discoverable-via-AI toggle (feeds [[F-36 Gemma AI]]).
- Analytics: QR scans, video clicks, Rings opened, leads export.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[F-24 Exhibitor]] when the vault moved to layers
