---
id: BD-19
type: backend-delivery
module: discovery
feature: discover-hub
status: done
scope: feature
screens: [s38]
created: 2026-10-18
updated: 2026-11-16
tags: [backend-delivery, backend-delivery/done, module/discovery, layer/backend]
---

# ✅ Discover Hub & Search · Backend Delivery

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** Done · **Integration guide:** [[BI-19 Discover Hub & Search Backend Integration]] · **Requirements:** [[FR-19 Discover Hub & Search Frontend Requirements]] · **QA:** [[Discover Hub & Search QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /views/pin/:pinName (resolve one name)`

**Tables / models:** `Profile`, `AnalyticsEvent`

### What exists

- Resolving one exact Pin name works: `GET /views/pin/:pinName` answers the view of what that person shares with the viewer, with `pinName` and `displayName` (which may be `null`), no Ring id and no user id. It is View As & Pin Views' route; how to call it is [[BI-09 View As & Pin Views Backend Integration]].
- The lookup is not a membership oracle: unknown, deleted, not shared and blocked all answer the same 404 `E_RING_ACCESS_01`.
- The viewer's own Pin name: `pinName` on `GET /profiles`.
- This is everything the MVP asks ([[FR-19 Discover Hub & Search Frontend Requirements]], S1–S3, [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]]): nothing new to build.

### Gaps

- The route does not validate the name's format: a malformed name answers the same 404, never a 400.
- Recent searches: not a gap any more. They stay on the phone, per user, with no server store (D-37, S-42 S3).
- Later (D-37), not built: search by name, Gemma, import contacts (phone book match by hashed email / phone), and knowing a Pin name is a business's.

## Log

- 2026-10-18 · split out of [[F-19 Discover Hub & Search]] when the vault moved to layers
- 2026-11-16 · `tickets/backend/M-04-discovery/F-19-discover-hub/FR-19-accepted` · [[FR-19 Discover Hub & Search Frontend Requirements]] approved on the backend's review (backend `main` `3cef5d7`): `todo` → `in-progress`. The MVP (S-42 S1–S3, D-37) asks for nothing new; *What exists* and *Gaps* brought to that, and the FR-19, S-42 and D-37 flags (2026-11-12, 2026-11-16) cleared
- 2026-11-16 · `docs/backend/M-04-discovery/F-19-discover-hub/BD-19-shipped` · S-42 S1–S3 (the MVP, D-37) · no code branch and no merge of this feature's own: what the MVP asks is already on backend `main` `3cef5d7`, `GET /views/pin/:pinName` (View As & Pin Views, [[BD-12 View As & Pin Views Backend Delivery]]) and `pinName` on `GET /profiles`. `in-progress` → `done`; [[BI-19 Discover Hub & Search Backend Integration]] written and `current`. Nothing flagged: no contract moved
