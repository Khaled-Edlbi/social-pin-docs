---
id: FD-23
type: frontend-delivery
module: platform
feature: notifications
status: in-progress
scope: feature
deployedTo: []
screens: [s69]
owner: "Omar Fostok"
depends: []
affects: []
related: ["S-96 Notifications Story", "FR-39 Notifications Frontend Requirements", "BD-39 Notifications Backend Delivery", "D-40 The bell count, the tab cross-fade and Go Pro coming soon stay", "F-29 App Shell & Onboarding Narrative", "S-73 App Shell & Onboarding Narrative Story"]
pending: []
created: 2026-11-15
updated: 2026-11-24
tags: [frontend-delivery, frontend-delivery/in-progress, module/platform, layer/frontend]
---

# 🟡 Notifications · Frontend Delivery

> Blocked by default until [[Notifications Backend Integration]] is `current` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-39 Notifications]] · **Status:** In progress · **Built from:** [[Notifications Backend Integration]] (not written yet: the inbox has no API) · **Against:** [[S-96 Notifications Story]] · **Requirements:** [[FR-39 Notifications Frontend Requirements]] · **QA:** [[Notifications QA Frontend]]

The inbox (s69) and the bell are built **on demo data**: the inbox has no API yet ([[BD-39 Notifications Backend Delivery]]). The note stays `in-progress`, and blocked by the flow, until the Backend Integration exists. It is on `social_pin` `rings/F-11/honest-rings` @ `778d9b4` (2026-11-12), on `main` since 2026-11-24 at `866240a`. The demo inbox came in `e03ddf9`. The owner kept the bell's count before this feature ships ([[D-40 The bell count, the tab cross-fade and Go Pro coming soon stay|D-40]]). At `778d9b4`: `dart analyze` 0 errors, `flutter test` 1752 passed.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s69\|s69]] Notifications | 🟡 | Newest first, in two groups: **today** (the last 24 hours) and **earlier**. Each row shows who it's about (or the event's mark) with an unread dot, the headline over the action it offers, and how long ago ("2 min ago", "3 h ago", "Yesterday", in the current language). **A tap opens the place it is about:** a request or a scan opens Requests, a meeting opens Meetings, an event opens its page in the Events tab. ***Mark all read*** clears the dots, not the rows. Reached from the bell on Home and from Me. **Demo data:** the TechSummit '26 sample notes, read from nowhere (S1, S3, S4; `e03ddf9`) |
| The bell on Home | 🟡 | The count of notes under an hour old, until *Mark all read*; no badge at 0. Home's bell and s69 share one read state (S2, [[D-40 The bell count, the tab cross-fade and Go Pro coming soon stay\|D-40]]; the bell itself is [[F-29 App Shell & Onboarding Narrative\|App Shell]]'s, recorded in its Frontend Delivery) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| — | s69, the bell | None: the inbox has no API yet. |

## State kept on the client

- **Read state:** "all read" or not, one for the whole app so the bell and s69 agree. It is on this phone only, not on a server, and resets with the session.
- **The inbox:** the bundled demo notes.

## Deviations from the story or the integration note

- **Unread means "under an hour old"** until *Mark all read*. There is no `readAt` per note, and tapping one row doesn't mark it read (S3 asks for both). That rule exists only because the inbox has no API.
- ***Mark all read* clears the dots and keeps the rows,** as the design shows.

## Not done yet

- **The inbox from the server, `readAt` per note, and mark one read:** S1–S4 against the endpoints, which wait on [[BD-39 Notifications Backend Delivery]] (S7).
- **Push delivery and preferences per type:** S5, S6, S8.

## Tests

At `778d9b4`: `notifications_test` (the two groups, the unread rule, *Mark all read*, where each row goes).

## Log

- 2026-11-15 · app branch `rings/F-11/honest-rings` @ `e03ddf9`, `778d9b4` (social_pin, on `main` since 2026-11-24 at `866240a`; analyze 0 errors, 1752 tests pass) · S1–S4 on demo data · s69 (today and earlier, unread dots, rows open their place, *Mark all read*), the Home bell count (D-40) · written; `in-progress` and blocked until the inbox has an API and its Backend Integration exists · flagged nothing
