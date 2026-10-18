---
type: requirements
id: widgets
feature: widgets
status: draft
domain: identity
screens: [s36, s37]
updated: 2026-10-18
tags: [requirements, requirements/draft, domain/identity]
---

# Widgets · Frontend Requirements

**Feature:** [[Widgets]] · **Status:** Draft · **Story:** [[Widgets Story]] · **API Integration:** not yet (backend not built)

What the client needs to build the widget picker and the widget rows on a Ring, and the fact that only the read side exists. The projection already returns `widgets[]` ([[Ring Projection Frontend]]); everything else waits on two tasks and one decision.

## Per screen

### [[Screen Index#s36|s36]] Add to this Ring

- Needs: an entry into the widget picker; a refetch of the projection on Done.
- Source today: `GET /rings/:ringId/projection` for the refetch. The picker entry: disabled.

### [[Screen Index#s37|s37]] Widgets

- Needs: the list of widget types; create several widgets with `type`, `config`, `sortOrder`, `isVisible`; per-type validation rules for `config`.
- States: selectable, "coming soon", selected count, saving.
- Source today: not yet. `WIDGET_TYPE` (8 values) is visible in `/docs`; the design's four extra types are not.

### [[Screen Index#s14|s14]] Ring data (widget rows)

- Needs: `widgets[]` with `id`, `type`, `config`, `sortOrder`, `isVisible`; reorder; hide / show; remove.
- Source today: read from `GET /rings/:ringId/projection`. Writes: not yet.

### Viewer card ([[Screen Index#s44|s44]], [[Screen Index#s31|s31]])

- Needs: visible widgets in the view, hidden ones excluded.
- Source today: `widgets[]` on `RingProfileViewEntity`; viewer rendering in `toView` is listed as a gap, so treat the array as present but unreliable until [[T-018 Widget CRUD on the projection]].

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Read a Ring's widgets (owner) | `GET /rings/:ringId/projection` → `widgets[]` | ✅ | — (listed under [[Ring Projection]]) |
| Read a Ring's widgets (viewer) | `GET /views/ring/:ringId` → `widgets[]` | ✅ | — (listed under [[View As & Pin Views]]; rendering in `toView` is a gap) |
| Types Availability, Payment, Now playing, Testimonial | — | ❌ | [[T-017 Extend WIDGET_TYPE to the design's list]] |
| Create a widget | — | ❌ | [[T-018 Widget CRUD on the projection]] |
| Edit `config`, `sortOrder`, `isVisible` | — | ❌ | [[T-018 Widget CRUD on the projection]] |
| Remove a widget | — | ❌ | [[T-018 Widget CRUD on the projection]] |
| Per-type `config` validation rules | — | ❌ | [[T-018 Widget CRUD on the projection]] |
| Decide the storage model first | — | ❌ | [[D-03 Field library vs per-Ring copies]] |

## Behaviour expectations

- Refetch / realtime: when writes exist, refetch the projection after every widget write and invalidate `view:<viewer>:ring:<ringId>` so View as is current. Today: read with the projection, nothing to invalidate.
- Caching keys: none of its own; widgets live on `projection:<ringId>` and the view caches.
- Pagination / ordering: none; render by `sortOrder`. Reorder, once it exists, sends the new `sortOrder` per moved row, as links do.
- Renderer: one component per known `type`, plus a fallback that renders nothing for an unknown type, so a type added server-side does not break old clients.
- Picker: list the design's full set; grey the four missing types; show the selected count on the primary button; validate `config` per type on the client with the rules T-018 defines.
- Visibility: an `isVisible: false` widget appears greyed in the owner's editor and must not be rendered on the viewer card even if it arrives, until the backend excludes it by the query.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| — | — | no widget codes exist yet; they will be defined by [[T-018 Widget CRUD on the projection]] |
| 403 | `E_RING_05` | the projection is not editable by this user: picker hidden |
| 404 | `E_RING_02` | Ring not found: back to My Rings |

Until [[T-063 Put the ErrorCode on the error body]] ships, branch on status and endpoint.

## Blocked by

- [[D-03 Field library vs per-Ring copies]] — the storage model widgets are built on; T-018 waits on it.
- [[T-017 Extend WIDGET_TYPE to the design's list]] — the four design types on s37.
- [[T-018 Widget CRUD on the projection]] — every write on s37 and s14, and viewer rendering.
