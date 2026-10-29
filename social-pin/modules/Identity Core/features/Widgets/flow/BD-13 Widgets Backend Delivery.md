---
id: BD-13
type: backend-delivery
module: identity
feature: widgets
status: in-progress
scope: feature
screens: [s36, s37]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/in-progress, module/identity, layer/backend]
---

# 🟡 Widgets · Backend Delivery

**Feature:** [[F-13 Widgets]] · **Status:** In progress · **Integration guide:** [[Widgets Backend Integration]] · **Requirements:** [[FR-13 Widgets Frontend Requirements]] · **QA:** [[Widgets QA Backend]]

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

## Log

- 2026-10-18 · split out of [[F-13 Widgets]] when the vault moved to layers
