---
id: B-30
type: bug
module: discovery
feature: discover-hub
status: todo
priority: high
effort: S
foundOn: "BD-19 Discover Hub & Search Backend Delivery"
screens: [s38, s44]
depends: []
affects: ["QB-18 Discover Hub & Search QA Backend", "BI-19 Discover Hub & Search Backend Integration", "FD-18 Discover Hub & Search Frontend Delivery"]
related: ["BD-19 Discover Hub & Search Backend Delivery", "QB-18 Discover Hub & Search QA Backend", "BI-19 Discover Hub & Search Backend Integration", "BI-16 Connections Backend Integration", "S-42 Discover Hub & Search Story", "D-41 Discover searches people by part of their Pin name", "FD-18 Discover Hub & Search Frontend Delivery", "POST /connections/requests", "GET /search/pin-names"]
pending: []
created: 2026-11-23
updated: 2026-11-23
tags: [bug, bug/todo, module/discovery, priority/high]
---

# ⬜ B-30 · Connect from a Discover search row is refused for a person you can't already open

**Found against:** [[BD-19 Discover Hub & Search Backend Delivery]] · **Feature:** [[F-19 Discover Hub & Search]] · **Status:** To do · **Priority:** High · **Deadline:** — · **Effort:** S

**Found by:** [[QB-18 Discover Hub & Search QA Backend]] row B43, on build backend `main @ e83682d` (and before it `c5bc838`), 2026-11-23.

## What

**What happens.** On Discover, a stranger's row in the search results (`relationship: NONE`, `canOpenCard: false`) shows **Connect**. Tapping it sends `POST /connections/requests` `{ pinName }`, and the server answers 404 `E_RING_ACCESS_01`, so no request is created. By Pin name, a request is accepted only from someone who can already open the person's card ([[BI-16 Connections Backend Integration|BI-16]]).

**What should happen.** **Connect** sends the normal connection request to anyone the requester's search can show ([[S-42 Discover Hub & Search Story|S-42 · S2]], [[D-41 Discover searches people by part of their Pin name|D-41]] rule 5, decided by Omar Fostok). That is anyone who:
- has `findableByPinName` on;
- has no block with the requester, in either direction;
- is not the requester;
- is not already connected to the requester and has no request pending with them.

The answer is 201 with the request, as for a scanned badge. Afterwards the requester's row reads `REQUESTED` with its `requestId`, and the other person's row reads `ASKED_ME` with the same `requestId`.

**Where.** `POST /connections/requests` `{ pinName }`, reached from s38 (the search results).

**Steps.**
1. Sign in as A.
2. Search 3 or more letters of B's Pin name. B is findable and shares no Ring with A.
3. Tap Connect on B's row: the answer is 404 `E_RING_ACCESS_01`.

**On which build.** backend `main @ e83682d`. The same on `c5bc838`.

**Where the docs already say so.** [[BI-19 Discover Hub & Search Backend Integration|BI-19]] lists it under *Not available yet*. The app ([[FD-18 Discover Hub & Search Frontend Delivery|FD-18]]) shows "This Pin isn't available to you" and keeps Connect until this is fixed.

**Severity.** High: it blocks S2's main promise, connecting with a person found by search.

The fix is `/backend`'s. It sets `in-progress` when it starts and `ready` when the fix ships, and records the fix in [[BD-19 Discover Hub & Search Backend Delivery|BD-19]] and BI-19 with a flag line here. QA then re-runs B43 (and B44, with the request made from the row) and closes or reopens this bug.

## Design

- [[Screen Index#s38|s38]] · [[Screen Index#s44|s44]]

## Impact

- [[BD-19 Discover Hub & Search Backend Delivery]]: found against
- [[QB-18 Discover Hub & Search QA Backend]]: row B43, `pending`
- [[BI-19 Discover Hub & Search Backend Integration]]: *Not available yet*, *Screens → calls*, *Flow* 5, to update when it ships
- [[BI-16 Connections Backend Integration]]: who may request by Pin name
- [[FD-18 Discover Hub & Search Frontend Delivery]]: the app's message on a refused Connect

## Definition of done

- [ ] `POST /connections/requests` `{ pinName }` answers 201 for anyone the requester's search can show (D-41 rule 5); still 404 for a hidden, blocking, own, or unknown Pin name; already connected or pending as today
- [ ] B43 re-run against the fix, on a named build (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] BD-19 and BI-19 updated; `--impact` notes updated or flagged
- [ ] `node scripts/build-tree.mjs` run; generated files committed

## Log

- 2026-11-23 · filed with --scaffold bug, found against BD-19 Discover Hub & Search Backend Delivery, from [[QB-18 Discover Hub & Search QA Backend]] row B43 on backend `main @ e83682d`. Filed as a bug on Omar Fostok's word, replacing the S2 line in QB-18's `unmet`; for `/backend`
