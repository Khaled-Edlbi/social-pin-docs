---
id: D-25
type: decision
status: decided
features: [connections]
decision: ND-25
decidedBy: "Omar Fostok"
decidedAt: 2026-11-04
owner: "Omar Fostok"
affects: ["S-23 Connections Story", "FR-14 Connections Frontend Requirements", "BD-14 Connections Backend Delivery"]
related: ["ND-25 What deleting an account does to its connections", "F-14 Connections", "F-01 Account"]
created: 2026-11-04
updated: 2026-11-04
tags: [decision, decision/decided]
---

# ✅ D-25 · A deleted account's connections, requests and blocks end silently

**Answers:** [[ND-25 What deleting an account does to its connections]] · **Decided by:** Omar Fostok · **On:** 2026-11-04 · **Feature:** [[F-14 Connections]]

> This card is the answer to [[ND-25 What deleting an account does to its connections]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-25 What deleting an account does to its connections]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: all end, silently.** When an account is deleted, every connection it had ends, every pending request it sent or received closes, and every block it made or received is removed. The people on the other side are not told: the person simply stops appearing in their contacts, their request lists and Shared with me, and opening them answers the same neutral "not available" as a disconnect or a block. This rules out keeping "deleted user" rows (option 2) and announcing the deletion (option 3).

## Why

Nothing should point at a person who is gone, and a deletion should tell the others no more than a disconnect does ([[S-23 Connections Story|Connections · S11]]): the product never tells a block, a disconnect or a deleted account apart.

## What it changes

- [[S-23 Connections Story]]: S16's "Not decided yet" is answered (`/pm`).
- [[FR-14 Connections Frontend Requirements]]: the deleted person's rows stop being returned; s47 answers its 404 (`/frontend`).
- [[BD-14 Connections Backend Delivery]]: deleting an account ends its connections, closes its requests both ways and removes its blocks, in the same deletion (`/backend`).

## Still open

- The rest of what an account deletion does belongs to [[F-01 Account]]; this card covers Connections only.
