---
id: D-26
type: decision
status: decided
features: [connections]
decision: ND-26
decidedBy: "Omar Fostok"
decidedAt: 2026-11-04
owner: "Omar Fostok"
affects: ["S-23 Connections Story", "FR-14 Connections Frontend Requirements", "BD-14 Connections Backend Delivery"]
related: ["ND-26 Whether a disconnect is announced", "D-15 Several Rings per connection, remove or disconnect", "F-14 Connections"]
created: 2026-11-04
updated: 2026-11-04
tags: [decision, decision/decided]
---

# ✅ D-26 · A disconnect is not announced

**Answers:** [[ND-26 Whether a disconnect is announced]] · **Decided by:** Omar Fostok · **On:** 2026-11-04 · **Feature:** [[F-14 Connections]]

> This card is the answer to [[ND-26 Whether a disconnect is announced]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-26 Whether a disconnect is announced]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: not told.** A disconnect ends the connection and every membership of theirs in my Rings, and sends nothing to them: no notification, no message. They simply lose access and stop seeing me in their contacts. This closes the question [[D-15 Several Rings per connection, remove or disconnect]] left open, and rules out a notice (option 2).

## Why

Removing someone from a Ring and blocking them are both silent; a disconnect sits between the two and follows the same rule, so ending a relationship never produces an awkward message.

## What it changes

- [[S-23 Connections Story]]: S11's "whether the other person is told is open" is answered (`/pm`).
- [[FR-14 Connections Frontend Requirements]]: no notification row for a disconnect (`/frontend`).
- [[BD-14 Connections Backend Delivery]]: `DELETE /connections/:userId` sends no notification (`/backend`).

## Still open

- Nothing.
