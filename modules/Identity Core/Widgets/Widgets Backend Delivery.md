---
type: backend-delivery
code: widgets
scope: feature
feature: widgets
module: identity
status: in-progress
screens: [s36, s37]
created: 2026-10-18
updated: 2026-10-18
tags: [backend-delivery, backend-delivery/in-progress, module/identity, layer/backend]
---

# 🟡 Widgets · Backend Delivery

**Feature:** [[Widgets]] · **Status:** In progress · **Integration guide:** [[Widgets Backend Integration]] · **Requirements:** [[Widgets Frontend Requirements]] · **QA:** [[Widgets QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints:** none yet.

**Tables / models:** `RingWidget`

**Code:** `prisma/schema/ring.prisma (WIDGET_TYPE)`

### What exists

- `RingWidget` with `WIDGET_TYPE`: LINKS, GALLERY, VIDEO, FILES, CALENDAR, CONTACT_CARD, MAP, CUSTOM.

### Gaps

- Add the design's types: **Availability, Payment, Now playing, Testimonial** (Map already exists).
- CRUD under `/rings/:ringId/projection/widgets` with sort order and visibility.
- Viewer rendering through `RingProfileService.toView`.

## Tasks delivered

| Task | Delivery note | Status |
|---|---|---|
| — | — | — |

## Log

- 2026-10-18 · split out of [[Widgets]] when the vault moved to layers ([[T-064 Restructure the docs vault]])
