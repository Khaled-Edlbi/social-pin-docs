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
depends: ["BI-19 Discover Hub & Search Backend Integration", "BI-09 View As & Pin Views Backend Integration"]
affects: []
related: ["S-42 Discover Hub & Search Story", "FR-19 Discover Hub & Search Frontend Requirements", "BD-19 Discover Hub & Search Backend Delivery", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "FD-17 View As & Pin Views Frontend Delivery", "FD-13 Connections Frontend Delivery", "S-23 Connections Story", "S-45 PinCast & Nearby Story", "GET /views/pin/:pinName"]
pending: []
created: 2026-11-15
updated: 2026-11-16
tags: [frontend-delivery, frontend-delivery/done, module/discovery, layer/frontend]
---

# ✅ Discover Hub & Search · Frontend Delivery

> ⚠ Affected by [[BD-19 Discover Hub & Search Backend Delivery]] (2026-11-23): /frontend: the search by part of a Pin name (S-42 S2, S4), Connect and Accept from a row, and the Me - Privacy switch (S5) are built on backend branch BD-19/search/pin-name-search (c5bc838), not on main yet. How to call them is in BI-19 (screens to calls, PinNameResultEntity, errors, rules, checklist): GET /search/pin-names?q=&limit=20&skip=, findableByPinName on GET and PATCH /users/me, codes E_SEARCH_01 (400) and E_SEARCH_02 (429). The exact-name lookup on submit that shipped at 778d9b4 is replaced by the as-you-type search

> ⚠ Affected by [[D-41 Discover searches people by part of their Pin name]] (2026-11-17): /frontend: the exact-name lookup on submit that shipped at `778d9b4` is no longer the MVP's search. The partial search, the Connect states and the opt-out are still to build, once FR-19 is rewritten.

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** Done · **Built from:** [[BI-19 Discover Hub & Search Backend Integration]] (current 2026-11-16), which uses [[BI-09 View As & Pin Views Backend Integration|BI-09]]'s `GET /views/pin/:pinName` · **Against:** [[S-42 Discover Hub & Search Story]] · **Requirements:** [[FR-19 Discover Hub & Search Frontend Requirements]] · **QA:** [[Discover Hub & Search QA Frontend]]

What the client shipped for the Discover tab within [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]]'s MVP: opening a Pin by its exact Pin name, the one "not available" line, and recent searches kept on the phone (S1–S3). It is on `social_pin` `rings/F-11/honest-rings` @ `778d9b4` (2026-11-12), not on `main` yet. The hub and its demo came in `e03ddf9`; the real lookup, the recent searches and People → Contacts came in `778d9b4`. At `778d9b4`: `dart analyze` 0 errors, `flutter test` 1752 passed. Unit and widget tests only; not yet tried on a device.

**Why it isn't blocked by the flow:** `blockedBy: []`. [[BI-19 Discover Hub & Search Backend Integration|BI-19]] is `current` (2026-11-16, backend `main` `3cef5d7`). The MVP calls only View As & Pin Views' `GET /views/pin/:pinName`, whose shape and rules are in [[BI-09 View As & Pin Views Backend Integration|BI-09]], plus `pinName` from `GET /profiles`. Recent searches need no endpoint (D-37). The app matches BI-19's checklist at `778d9b4` (below).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s38\|s38]] Discover hub | ✅ | **The field:** "Open a Pin by name · !pinname". The name is trimmed, loses a leading `!` or `@`, and is lowercased, then looked up with `GET /views/pin/:pinName` **before** anything opens. While it looks, a quiet spinner shows under the field, and a second submit waits for it. **Found:** the person's card opens, and the name goes first in the recent searches. My own Pin name opens View as on my default Ring. **Not available** (every 404 `E_RING_ACCESS_01`): "This Pin isn't available to you" under the field. The text stays so a typo can be fixed, and typing again clears the line. **No answer** (offline, server): said under the field, and the name can be sent again (S2). **RECENT SEARCHES** with *Clear all*: only names that opened, newest first, one per name, at most 20, each with the name their card showed then (the Pin name alone when `displayName` is `null`). A tap puts the name back and looks it up again; if it no longer opens, it stays in the list with the message. A swipe removes one. With none, the section isn't shown (S3). **The two cards:** *PinCast* (opens PinCast, [[S-45 PinCast & Nearby Story\|S-45]], on demo data) and *Import contacts* ("Coming soon"). **BROWSE:** People → Contacts, with "Requests · N" when someone waits ([[S-23 Connections Story\|S-23]] S8); Events → the Events tab; Companies → My companies (s72); Exhibitors → the TechSummit exhibitors (s54). **Demo people:** outside production builds, a sample person's Pin name opens their sample card. Production never opens one (S1–S3) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /views/pin/:pinName` | s38 search, a recent search tapped | On submit only, never per keystroke. No retry. Every 404 `E_RING_ACCESS_01` is one message, never which case. s44 opens with this body, not fetched again; a 404 is never cached. It is read again on every tap of a recent search, since what they share with me may have changed. A 401 `E_AUTH_04` signs in again. |
| `GET /profiles` (already loaded) | s38, my own Pin name submitted | No lookup: the name is compared with my `pinName`, and View as opens on my default Ring (BI-09, *Flow* 4). |

The hub never calls `GET /profiles/pin-name/:pinName/availability`.

## State kept on the client

- **Recent searches** (Pin name, the name shown, when): newest first, at most 20, one per name. Kept in the phone's storage, tagged with the signed-in user's id, so another account on the phone reads none of them. Cleared on sign-out. Not synced: the API has no list (D-37).
- The search state (idle, looking, not available, no answer) is kept in memory.

## Deviations from the story or the integration note

- **Import contacts** is a card on the hub that says "Coming soon" and opens nothing. Matching contacts comes later ([[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]], S5, S7).
- **Demo people** open their sample card in non-production builds, for demos. Production never does.
- **No 400 is ever hit.** The route answers no 400 today, and a malformed name gets the same 404 (BI-19). The app keeps FR-19's 400 row with the same line, so nothing changes if validation is added later.

## Not done yet

- **Search by name, Gemma queries (S4), matching imported contacts (S5, S7), and a business Pin opening its company screen:** later, per [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]].
- **PinCast** on the hub runs on demo data: [[S-45 PinCast & Nearby Story|S-45]].

## Tests

Unit and widget, at `778d9b4`: `discover_search_test` (new: the lookup before opening, the one message, own Pin name → View as, recent searches newest first, 20 cap, swipe, Clear all, per user, cleared on sign-out, demo people only outside production) and `discover_demo_test` (updated). Not yet on a device.

## BI-19 checklist

At `778d9b4`:

- [x] Input normalised (strip `!` / `@`, trim, lowercase); submit only.
- [x] s44 opens with the resolve's body, not re-fetched.
- [x] One line for every 404; the text stays in the field.
- [x] My own Pin name opens View as, with no resolve call.
- [x] Recent searches on the phone, per user, keyed by Pin name; `displayName` `null` handled; a tap re-resolves.
- [x] No call to the Pin-name availability route from this screen.

## Log

- 2026-11-15 · app branch `rings/F-11/honest-rings` @ `e03ddf9`, `778d9b4` (social_pin, not on `main` yet; analyze 0 errors, 1752 tests pass) · S1–S3 (D-37's MVP) · s38 (Pin name lookup before opening, "This Pin isn't available to you", recent searches on the phone per user, People → Contacts, Import contacts "Coming soon", demo people outside production) · written; `blockedBy: []` because the MVP calls only BI-09's `GET /views/pin/:pinName` · flagged nothing (S-42's 2026-11-12 update, `S-42-app-778d9b4`, already says this)
- 2026-11-16 · `docs/frontend/M-04-discovery/F-19-discover-hub/FD-18-built-from-bi-19` · built from [[BI-19 Discover Hub & Search Backend Integration]] (current 2026-11-16), which uses BI-09's `GET /views/pin/:pinName`; the app at `778d9b4` matches its checklist; the route answers no 400, so the 400 row is never hit; own Pin name compared with `GET /profiles`, `displayName` `null` and the 401 written in · flagged nothing (BI-19 already names FD-18 in `affects`)
