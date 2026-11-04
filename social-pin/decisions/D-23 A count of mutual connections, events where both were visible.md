---
id: D-23
type: decision
status: decided
features: [connections]
decision: ND-23
decidedBy: "Omar Fostok"
decidedAt: 2026-11-04
owner: "Omar Fostok"
affects: ["S-23 Connections Story", "FR-14 Connections Frontend Requirements", "BD-14 Connections Backend Delivery", "S-15 Ring Access Engine Story"]
related: ["ND-23 Mutual connections and events in common", "F-14 Connections", "F-08 Ring Access Engine", "F-23 Events During", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring"]
created: 2026-11-04
updated: 2026-11-04
tags: [decision, decision/decided]
---

# ✅ D-23 · A count of mutual connections, events where both were visible

**Answers:** [[ND-23 Mutual connections and events in common]] · **Decided by:** Omar Fostok · **On:** 2026-11-04 · **Feature:** [[F-14 Connections]]

> This card is the answer to [[ND-23 Mutual connections and events in common]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-23 Mutual connections and events in common]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Mutual connections, option 2: a count only.** Connection detail ([[Screen Index#s47|s47]]) shows "4 mutual connections" and never a name: the people connected to both of us are counted, never listed. A blocked pair is never counted, either way. Zero hides the row rather than showing "0 mutual connections".

**Events in common, option 2: events where we were both visible.** s47 lists the events we were both in an Event Ring of, and only those; an event the other person attended without my seeing them there is not shown. Until the events features ship ([[F-23 Events During]]), the row stays hidden.

This rules out showing names (mutual options 3 and 4), showing nothing (option 1 of both), and listing every event we both attended (events option 3). The count and the list are answered by the access engine ([[F-08 Ring Access Engine]]), never by the Connections service alone.

## Why

Every name in a mutual list tells me who the other person knows, which neither of them chose to show me; the product's promise is that I learn only what a Ring shows ([[S-15 Ring Access Engine Story]]). A count keeps the useful part, "we move in the same circles", and names no one. An event where we were both in the Event Ring is something we already saw together, so listing it reveals nothing new; any event either of us attended would reveal where the other person has been. The names option built on "members can see each other" ([[D-04 Ring settings at launch and their defaults]]) would show nothing at launch, since that setting does not exist yet.

What was traded away: the design's "Omar, Lina, Rami +1" names are not shown.

## What it changes

- [[S-23 Connections Story]]: S9's events-in-common and mutual-connections rows are no longer hidden pending a decision: a count, and the events we were both visible at (hidden until Events ship) (`/pm`).
- [[FR-14 Connections Frontend Requirements]]: s47 shows the count when it is above zero and no names; the events row stays hidden in the MVP (`/frontend`).
- [[BD-14 Connections Backend Delivery]]: the connection detail carries `mutualCount`, computed through the access engine without blocked pairs; events in common come with the events features (`/backend`).
- [[S-15 Ring Access Engine Story]]: the engine answers the mutual count and, later, the shared-visible events (`/pm`).

## Still open

- Names of mutual connections can come later, if the "members can see each other" setting exists and is on; a new card then.
- Events in common wait for the events features, which are not in the MVP ([[MVP Order]]).

## Log

- 2026-11-04 · flagged [[S-23 Connections Story]]: ND-23 decided: s47 shows a count of mutual connections, never names (hidden at zero), and the events we were both visible at (hidden until Events ship). S9 no longer waits on ND-23.
- 2026-11-04 · flagged [[FR-14 Connections Frontend Requirements]]: ND-23 decided: s47 shows the mutual-connection count when above zero, no names; the events-in-common row stays hidden in the MVP.
- 2026-11-04 · flagged [[BD-14 Connections Backend Delivery]]: ND-23 decided: the connection detail carries mutualCount, computed through the access engine without blocked pairs; events in common come with the events features.
- 2026-11-04 · flagged [[S-15 Ring Access Engine Story]]: ND-23 decided: the engine answers the mutual-connection count (no names) and, later, the events both people were visible at.
