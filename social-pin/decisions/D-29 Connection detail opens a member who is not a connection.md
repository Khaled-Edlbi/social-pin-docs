---
id: D-29
type: decision
status: decided
features: [connections]
decision: ND-29
decidedBy: "Omar Fostok"
decidedAt: 2026-11-04
owner: "Omar Fostok"
affects: ["S-23 Connections Story", "FR-14 Connections Frontend Requirements", "BD-14 Connections Backend Delivery"]
related: ["ND-29 Connection detail for a member who is not a connection", "F-14 Connections", "F-09 Ring Members", "F-17 Ring Invitations & Join"]
created: 2026-11-04
updated: 2026-11-04
tags: [decision, decision/decided]
---

# ✅ D-29 · Connection detail opens a member who is not a connection

**Answers:** [[ND-29 Connection detail for a member who is not a connection]] · **Decided by:** Omar Fostok · **On:** 2026-11-04 · **Feature:** [[F-14 Connections]]

> This card is the answer to [[ND-29 Connection detail for a member who is not a connection]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-29 Connection detail for a member who is not a connection]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: s47 opens them, with `connectedAt: null`.** A member of one of my Rings who joined by an invitation or a code, and is not a connection, opens on Connection detail like anyone else: the header says they're a member, not a connection; the Ring checklist, the windows, what they can see and what they share with me work the same. `GET /connections/:userId` answers them with `connectedAt: null` and their memberships in my Rings, not a 404. This rules out s15 rows that open nothing (option 2).

## Why

Every row on a Ring's People tab should open, and the owner manages a member the same way however they joined.

## What it changes

- [[S-23 Connections Story]]: S12's "a row opens Connection detail (S9)" holds for every member (`/pm`).
- [[FR-14 Connections Frontend Requirements]]: s47 handles `connectedAt: null` (the header copy; no *Disconnect*, since there is no connection) (`/frontend`).
- [[BD-14 Connections Backend Delivery]]: `GET /connections/:userId` answers a member of my Rings who isn't a connection, with `connectedAt: null` (`/backend`).

## Still open

- What s47 offers to turn such a member into a connection, if anything: not in the MVP.
