---
id: FD-19
type: frontend-delivery
module: identity
feature: widgets
status: todo
scope: feature
deployedTo: []
screens: [s36, s37]
owner: "Omar Fostok"
depends: []
affects: []
related: ["S-20 Widgets Story", "FR-13 Widgets Frontend Requirements", "BD-13 Widgets Backend Delivery", "F-36 Gemma AI"]
pending: []
created: 2026-11-15
updated: 2026-11-24
tags: [frontend-delivery, frontend-delivery/todo, module/identity, layer/frontend]
---

# ⬜ Widgets · Frontend Delivery

> Blocked by default until [[Widgets Backend Integration]] is `current` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-13 Widgets]] · **Status:** To do · **Built from:** [[Widgets Backend Integration]] (not written yet) · **Against:** [[S-20 Widgets Story]] · **Requirements:** [[FR-13 Widgets Frontend Requirements]] · **QA:** [[Widgets QA Frontend]]

Widgets aren't built: they have no endpoints yet. The note stays `todo` and blocked by the flow until the Backend Integration is written. What the app has today, on `social_pin` `rings/F-11/honest-rings` @ `778d9b4` (2026-11-12, on `main` since 2026-11-24 at `866240a`), is the way in, shown switched off (S-20 S1), plus a preview screen nothing opens. At `778d9b4`: `dart analyze` 0 errors, `flutter test` 1752 passed.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s36\|s36]] Add to a Ring | 🟡 | **Widget** ("Video, map, availability, and more") is dimmed, with a "Coming soon" label. It doesn't open s37. Under GEMMA SUGGESTS, **Booking availability** is dimmed the same way, with no *Add*, because a booking is a widget. *A deck or portfolio* stays and adds a file (`778d9b4`). Field, Social and File work as before (their own features) |
| [[Screen Index#s37\|s37]] Widgets | ⬜ | Not reachable. A preview screen exists in the code (two sample widgets, nothing saved, with a header and a note saying so; `e03ddf9`), but nothing opens it until widget endpoints exist |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| — | — | None: widgets have no API yet |

## State kept on the client

- None.

## Deviations from the story or the integration note

- None: S-20 S1's 2026-11-12 update (`S-20-app-778d9b4`) describes the dimmed entry and suggestion.

## Not done yet

- **Every widget part of [[S-20 Widgets Story|S-20]]** (s37, adding, ordering and showing widgets on a Ring's card): waits on the widget endpoints ([[BD-13 Widgets Backend Delivery]]) and their Backend Integration.
- **Gemma's suggestions** run on demo data: [[F-36 Gemma AI]].

## Tests

Widget test at `778d9b4`: `widget_entry_test` (new: the Widget row and the Booking suggestion are dimmed with "Coming soon", and neither opens anything).

## Log

- 2026-11-15 · app branch `rings/F-11/honest-rings` @ `e03ddf9`, `778d9b4` (social_pin, on `main` since 2026-11-24 at `866240a`; analyze 0 errors, 1752 tests pass) · S1 (the entry only) · s36 (Widget and Booking availability dimmed, "Coming soon"), s37 not reachable · written; stays `todo`, blocked until the Widgets Backend Integration exists · flagged nothing
