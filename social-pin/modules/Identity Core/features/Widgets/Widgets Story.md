---
type: story
code: widgets
scope: feature
feature: widgets
module: identity
status: approved
screens: [s36, s37]
approvedBy: "khaled"
approvedAt: 2026-10-25
created: 2026-10-18
updated: 2026-10-27
owner: "omar"
related: ["D-03 Links entered once, switched on or off per Ring"]
tags: [story, story/approved, module/identity, layer/business]
---

# Widgets · User Story

**Feature:** [[Widgets]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Widgets Frontend Requirements]] · **API Integration:** not yet (backend not built)

A Ring owner wants a Ring to do more than list facts: show availability for a meeting, a way to pay, what they are playing, a testimonial, a map, a gallery. Widgets are blocks on a Ring's projection, ordered and switchable per Ring, and rendered to viewers through the same perspective as everything else. They are built on the library model ND-03 chose for links ([[D-03 Links entered once, switched on or off per Ring]]): a widget is set up once and each Ring switches it on or off. The table exists; the endpoints and the design's full type list do not.

## Persona

A Ring owner on "Add to this Ring" ([[Screen Index#s36|s36]]) choosing widgets for a Ring ([[Screen Index#s37|s37]]), typically a professional or exhibitor Ring; and the viewer who sees the result on the scanned card.

## Stories

### S1 · Add a widget from the sheet ([[Screen Index#s36|s36]])

**As a** Ring owner **I want** "Widget" on the Add sheet **so that** widgets sit next to fields, links and files.

Acceptance criteria:
- [ ] "Widget" and "Add" lead to s37; the entry is shown but disabled with "coming soon" until widget endpoints exist.
- [ ] Done returns to s14 and refetches the projection, where `widgets[]` already arrives today.

### S2 · Pick widgets ([[Screen Index#s37|s37]])

**As a** Ring owner **I want** to pick from the design's widget list **so that** this Ring gets the blocks that fit its audience.

Acceptance criteria:
- [ ] The picker lists the design's types: Availability, Payment, Now playing, Testimonial, Map, plus the existing Links, Gallery, Video, Files, Calendar, Contact card, Custom.
- [ ] Types the backend does not have yet (Availability, Payment, Now playing, Testimonial) are greyed with "coming soon".
- [ ] "Add 2 widgets" creates the selected widgets on the projection in one go when CRUD exists, then lands on s14; Cancel returns to s36.
- [ ] Each widget's `config` is validated per type on the client before sending, mirroring the server rules once defined.

### S3 · Order and visibility on Ring data ([[Screen Index#s14|s14]])

**As a** Ring owner **I want** to switch widgets on or off for this Ring, and reorder them, like links **so that** the Ring reads the way I want.

Acceptance criteria:
- [ ] Widgets render from `widgets[]` of `GET /rings/:ringId/projection` by `sortOrder`; hidden ones greyed.
- [ ] Editing a widget's content changes it in every Ring that has it on; this Ring only switches it on or off ([[D-03 Links entered once, switched on or off per Ring]]).
- [ ] Reorder and on / off are disabled until CRUD exists; today the list is read-only.

### S4 · A viewer sees the widgets ([[Screen Index#s44|s44]], [[Screen Index#s31|s31]])

**As a** viewer **I want** widgets on the person's card **so that** I can book, pay or listen from the same place.

Acceptance criteria:
- [ ] Visible widgets arrive in `widgets[]` of the view, hidden ones never; the client renders each type with a fallback for unknown types.
- [ ] Viewer rendering through `toView` is not written; until it is, the client renders what the field carries and tolerates an empty array.
- [ ] Availability widgets link into the meeting flow ([[Meetings]]) when it exists.

### S5 · Today's read-only widgets (journey, no prototype screen)

**As a** developer **I want** to know what `widgets[]` holds today **so that** I build the renderer once.

Acceptance criteria:
- [ ] `WIDGET_TYPE` today: `LINKS`, `GALLERY`, `VIDEO`, `FILES`, `CALENDAR`, `CONTACT_CARD`, `MAP`, `CUSTOM`; rows have `sortOrder` and `isVisible`.
- [ ] No row can be created from the app; the array is empty for every Ring created through the API.

### S6 · Extend WIDGET_TYPE to the design's list

*From T-017 (status then: To do), merged 2026-10-27.*

Add AVAILABILITY, PAYMENT, NOW_PLAYING, TESTIMONIAL. New migration; never edit an applied one.

Screens: [[Screen Index#s37|s37]] Widgets


### S7 · Widget CRUD on the projection

*From T-018 (status then: Needs a decision), merged 2026-10-27.*

`…/projection/widgets` with `type`, `config` (validated per type), `sortOrder`, `isVisible`. Viewer rendering in `toView`. Built on the library model ND-03 chose (one library, on/off per Ring: [[D-03 Links entered once, switched on or off per Ring]]), not on the per-Ring copies.

Screens: [[Screen Index#s36|s36]] Add to this Ring · [[Screen Index#s37|s37]] Widgets

## States and motion the design asks for

- State: picker with selectable and "coming soon" types, selected count on the primary button, widget rows on Ring data (greyed when hidden), empty ("No widgets yet").
- Motion: added widgets take their place in the Ring data list as part of the Ring re-compose; the widget sheet rises from s36. Reduced motion: fade.

## Rules the backend already enforces

- `RingWidget` exists with `WIDGET_TYPE` (8 values); the projection selects and returns `widgets[]` for the owner and the viewer, so the shape is stable.
- There are no widget endpoints; nothing can be created, edited, reordered, hidden or deleted.
- Viewer rendering must go through `RingProfileService.toView` and the access engine, like every other row; hidden widgets must be excluded by the query.

## Open questions

- Decided: [[D-03 Links entered once, switched on or off per Ring]]; widgets are built on the library from the start ([[Widgets Story|Widgets · S7]], which still waits on [[Widgets Story|Widgets · S6]]).
- Whether the order of widgets is shared or per Ring, as for links (D-03, *Still open*).
- Per-type `config` schemas (what an Availability or Payment widget carries) are not defined; [[Widgets Story|Widgets · S7]] must specify them before the picker can validate.
