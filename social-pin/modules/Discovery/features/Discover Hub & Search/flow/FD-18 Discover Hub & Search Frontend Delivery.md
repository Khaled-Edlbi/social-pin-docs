---
id: FD-18
type: frontend-delivery
module: discovery
feature: discover-hub
status: done
scope: feature
deployedTo: []
screens: [s38]
owner: "Omar Fostok"
blockedBy: []
depends: ["BI-09 View As & Pin Views Backend Integration"]
affects: []
related: ["S-42 Discover Hub & Search Story", "FR-19 Discover Hub & Search Frontend Requirements", "BD-19 Discover Hub & Search Backend Delivery", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "FD-17 View As & Pin Views Frontend Delivery", "FD-13 Connections Frontend Delivery", "S-23 Connections Story", "S-45 PinCast & Nearby Story", "GET /views/pin/:pinName"]
pending: []
created: 2026-11-15
updated: 2026-11-15
tags: [frontend-delivery, frontend-delivery/done, module/discovery, layer/frontend]
---

# ✅ Discover Hub & Search · Frontend Delivery

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** Done · **Built from:** [[BI-09 View As & Pin Views Backend Integration]] (the exact Pin name read; this feature has no Backend Integration of its own) · **Against:** [[S-42 Discover Hub & Search Story]] · **Requirements:** [[FR-19 Discover Hub & Search Frontend Requirements]] · **QA:** [[Discover Hub & Search QA Frontend]]

What the client shipped for the Discover tab within [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]]'s MVP: opening a Pin by its exact Pin name, the one "not available" line, and recent searches kept on the phone (S1–S3). It is on `social_pin` `rings/F-11/honest-rings` @ `778d9b4` (2026-11-12), not on `main` yet. The hub and its demo came in `e03ddf9`; the real lookup, the recent searches and People → Contacts came in `778d9b4`. At `778d9b4`: `dart analyze` 0 errors, `flutter test` 1752 passed. Unit and widget tests only; not yet tried on a device.

**Why it isn't blocked by the flow:** `blockedBy: []`. The MVP calls only `GET /views/pin/:pinName`, which ships with [[BI-09 View As & Pin Views Backend Integration|BI-09]]. Recent searches need no endpoint (D-37), so this feature has no Backend Integration to wait on.

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s38\|s38]] Discover hub | ✅ | **The field:** "Open a Pin by name · !pinname". The name is trimmed, loses a leading `!` or `@`, and is lowercased, then looked up with `GET /views/pin/:pinName` **before** anything opens. While it looks, a quiet spinner shows under the field, and a second submit waits for it. **Found:** the person's card opens, and the name goes first in the recent searches. My own Pin name opens View as on my default Ring. **Not available** (every 404, and a 400 for a name the API refuses): "This Pin isn't available to you" under the field. The text stays so a typo can be fixed, and typing again clears the line. **No answer** (offline, server): said under the field, and the name can be sent again (S2). **RECENT SEARCHES** with *Clear all*: only names that opened, newest first, one per name, at most 20, each with the name their card showed then. A tap puts the name back and looks it up again; if it no longer opens, it stays in the list with the message. A swipe removes one. With none, the section isn't shown (S3). **The two cards:** *PinCast* (opens PinCast, [[S-45 PinCast & Nearby Story\|S-45]], on demo data) and *Import contacts* ("Coming soon"). **BROWSE:** People → Contacts, with "Requests · N" when someone waits ([[S-23 Connections Story\|S-23]] S8); Events → the Events tab; Companies → My companies (s72); Exhibitors → the TechSummit exhibitors (s54). **Demo people:** outside production builds, a sample person's Pin name opens their sample card. Production never opens one (S1–S3) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /views/pin/:pinName` | s38 search, a recent search tapped | No retry. A 404 or a 400 is one message, never which one (the contract). It is read again on every tap of a recent search, since what they share with me may have changed. |

## State kept on the client

- **Recent searches** (Pin name, the name shown, when): newest first, at most 20, one per name. Kept in the phone's storage, tagged with the signed-in user's id, so another account on the phone reads none of them. Cleared on sign-out. Not synced: the API has no list (D-37).
- The search state (idle, looking, not available, no answer) is kept in memory.

## Deviations from the story or the integration note

- **Import contacts** is a card on the hub that says "Coming soon" and opens nothing. Matching contacts comes later ([[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]], S5, S7).
- **Demo people** open their sample card in non-production builds, for demos. Production never does.
- **A 400** (a name the API refuses) reads the same as a 404.

## Not done yet

- **Search by name, Gemma queries (S4), matching imported contacts (S5, S7), and a business Pin opening its company screen:** later, per [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]].
- **PinCast** on the hub runs on demo data: [[S-45 PinCast & Nearby Story|S-45]].

## Tests

Unit and widget, at `778d9b4`: `discover_search_test` (new: the lookup before opening, the one message, own Pin name → View as, recent searches newest first, 20 cap, swipe, Clear all, per user, cleared on sign-out, demo people only outside production) and `discover_demo_test` (updated). Not yet on a device.

## Log

- 2026-11-15 · app branch `rings/F-11/honest-rings` @ `e03ddf9`, `778d9b4` (social_pin, not on `main` yet; analyze 0 errors, 1752 tests pass) · S1–S3 (D-37's MVP) · s38 (Pin name lookup before opening, "This Pin isn't available to you", recent searches on the phone per user, People → Contacts, Import contacts "Coming soon", demo people outside production) · written; `blockedBy: []` because the MVP calls only BI-09's `GET /views/pin/:pinName` · flagged nothing (S-42's 2026-11-12 update, `S-42-app-778d9b4`, already says this)
