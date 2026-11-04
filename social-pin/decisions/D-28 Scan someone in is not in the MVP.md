---
id: D-28
type: decision
status: decided
features: [connections]
decision: ND-28
decidedBy: "Omar Fostok"
decidedAt: 2026-11-04
owner: "Omar Fostok"
affects: ["S-23 Connections Story", "FR-14 Connections Frontend Requirements", "BD-14 Connections Backend Delivery"]
related: ["ND-28 Scanning someone straight into a Ring", "D-10 Connect sends what the requester already has", "F-14 Connections"]
created: 2026-11-04
updated: 2026-11-04
tags: [decision, decision/decided]
---

# ✅ D-28 · Scan someone in is not in the MVP

**Answers:** [[ND-28 Scanning someone straight into a Ring]] · **Decided by:** Omar Fostok · **On:** 2026-11-04 · **Feature:** [[F-14 Connections]]

> This card is the answer to [[ND-28 Scanning someone straight into a Ring]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-28 Scanning someone straight into a Ring]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: not in the MVP.** *Scan someone in* on a Ring's People tab (s15) stays disabled with "Not available yet". No route adds a scanned person to a Ring directly; people reach my Rings through *Connect* and *Accept*, an invitation or a code. This rules out building it for the MVP (option 2).

## Why

*Connect* then *Accept* already covers the journey, with the receiver choosing the Ring. Adding someone to a Ring without them asking to connect is a new behaviour that can wait for v1.

## What it changes

- [[S-23 Connections Story]]: S12's "added straight to this Ring once ND-10 allows it" is out of the MVP (`/pm`).
- [[FR-14 Connections Frontend Requirements]]: the button stays disabled (`/frontend`).
- [[BD-14 Connections Backend Delivery]]: no `POST /rings/:ringId/members { qrToken }` in the MVP (`/backend`).

## Still open

- Whether it comes in v1, and whether the person scanned has to agree: a new card then.
