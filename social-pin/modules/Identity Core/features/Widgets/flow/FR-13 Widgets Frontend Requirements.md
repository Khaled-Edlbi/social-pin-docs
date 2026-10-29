---
id: FR-13
type: frontend-requirements
module: identity
feature: widgets
status: draft
scope: feature
screens: [s36, s37]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/draft, module/identity, layer/frontend]
---

# Widgets · Frontend Requirements

> ⚠ Affected by [[D-03 Links entered once, switched on or off per Ring]] (2026-10-25): ND-03 decided, links are entered once and only switched on or off per Ring; booking, Behance, Dribbble, GitHub and YouTube join the types, detected from the pasted link.

**Feature:** [[F-13 Widgets]] · **Status:** Draft · **Story:** [[S-20 Widgets Story]] · **API Integration:** not yet (backend not built)

What the client needs to build the widget picker and the widget rows on a Ring, and the fact that only the read side exists. The projection already returns `widgets[]` ([[BI-07 Ring Projection Backend Integration]]); everything else waits on two tasks and one decision.

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
- Source today: `widgets[]` on `RingProfileViewEntity`; viewer rendering in `toView` is listed as a gap, so treat the array as present but unreliable until [[S-20 Widgets Story|Widgets · S7]].

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Read a Ring's widgets (owner) | `GET /rings/:ringId/projection` → `widgets[]` | ✅ | — (listed under [[F-10 Ring Projection]]) |
| Read a Ring's widgets (viewer) | `GET /views/ring/:ringId` → `widgets[]` | ✅ | — (listed under [[F-12 View As & Pin Views]]; rendering in `toView` is a gap) |
| Types Availability, Payment, Now playing, Testimonial | — | ❌ | [[S-20 Widgets Story|Widgets · S6]] |
| Create a widget | — | ❌ | [[S-20 Widgets Story|Widgets · S7]] |
| Edit `config`, `sortOrder`, `isVisible` | — | ❌ | [[S-20 Widgets Story|Widgets · S7]] |
| Remove a widget | — | ❌ | [[S-20 Widgets Story|Widgets · S7]] |
| Per-type `config` validation rules | — | ❌ | [[S-20 Widgets Story|Widgets · S7]] |
| Decide the storage model first | — | ❌ | [[ND-03 Field library vs per-Ring copies]] |

## Behaviour expectations

- Refetch / realtime: when writes exist, refetch the projection after every widget write and invalidate `view:<viewer>:ring:<ringId>` so View as is current. Today: read with the projection, nothing to invalidate.
- Caching keys: none of its own; widgets live on `projection:<ringId>` and the view caches.
- Pagination / ordering: none; render by `sortOrder`. Reorder, once it exists, sends the new `sortOrder` per moved row, as links do.
- Renderer: one component per known `type`, plus a fallback that renders nothing for an unknown type, so a type added server-side does not break old clients.
- Picker: list the design's full set; grey the four missing types; show the selected count on the primary button; validate `config` per type on the client with the rules Widgets · S7 defines.
- Visibility: an `isVisible: false` widget appears greyed in the owner's editor and must not be rendered on the viewer card even if it arrives, until the backend excludes it by the query.

## Error states the UI must handle

| Status | ErrorCode | Show |
|---|---|---|
| — | — | no widget codes exist yet; they will be defined by [[S-20 Widgets Story|Widgets · S7]] |
| 403 | `E_RING_05` | the projection is not editable by this user: picker hidden |
| 404 | `E_RING_02` | Ring not found: back to My Rings |

Until [[S-87 Error Contract Story|Error Contract · S4–S8]] ships, branch on status and endpoint.

## Blocked by

- [[ND-03 Field library vs per-Ring copies]] — the storage model widgets are built on; Widgets · S7 waits on it.
- [[S-20 Widgets Story|Widgets · S6]] — the four design types on s37.
- [[S-20 Widgets Story|Widgets · S7]] — every write on s37 and s14, and viewer rendering.
