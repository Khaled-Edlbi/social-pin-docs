---
id: D-37
type: decision
status: decided
features: [discover-hub]
decision: ND-37
decidedBy: "Omar Fostok"
decidedAt: 2026-11-11
owner: "Omar Fostok"
affects: ["S-42 Discover Hub & Search Story", "FR-19 Discover Hub & Search Frontend Requirements", "BD-19 Discover Hub & Search Backend Delivery", "F-19 Discover Hub & Search"]
related: ["ND-37 What Discover does in the MVP", "F-12 View As & Pin Views", "F-36 Gemma AI", "F-15 Companies"]
created: 2026-11-12
updated: 2026-11-12
tags: [decision, decision/decided]
---

# ✅ D-37 · Discover opens a Pin by its exact Pin name in the MVP

**Answers:** [[ND-37 What Discover does in the MVP]] · **Decided by:** Omar Fostok · **On:** 2026-11-11 · **Feature:** [[F-19 Discover Hub & Search]]

> This card is the answer to [[ND-37 What Discover does in the MVP]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-37 What Discover does in the MVP]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: Discover & Search is in the MVP, and in the MVP it opens a Pin by its exact Pin name.**

- **In the MVP:**
  - Typing an exact Pin name opens that Pin (`GET /views/pin/{pinName}`).
  - When the Pin can't be opened, the line "This Pin isn't available to you" shows under the field.
  - Recent searches are kept on the phone.
- **Later:** search by name, Gemma queries, matching imported contacts, and a business Pin opening its company screen.
- The feature's release is `mvp` ([[F-19 Discover Hub & Search]]).

## Why

- **It is already built:** the backend has the exact-name read and the app uses it.
- **Search by name needs more:** a privacy rule for who may be found, and an endpoint that doesn't exist yet.
- **Traded away:** in the MVP, you can only find someone whose Pin name you already know.

## What it changes

- [[S-42 Discover Hub & Search Story]] (`/pm`):
  - S2 and S3 are the MVP.
  - S3 and S6 say recent searches are kept on the phone, which answers the open question.
  - S4 (Gemma), S5 and S7 (import contacts), and name search are later.
- [[FR-19 Discover Hub & Search Frontend Requirements]] (`/frontend`): the MVP needs only the exact-name read; recent searches need no endpoint.
- [[BD-19 Discover Hub & Search Backend Delivery]] (`/backend`): nothing new for the MVP; a recent-searches store isn't needed.
- [[F-19 Discover Hub & Search]] (owner): release `mvp`.

## Still open

- Nothing for the MVP. Search by name will need its own decision on who can be found.

## Log

- 2026-11-12 · flagged [[S-42 Discover Hub & Search Story]]: D-37: the MVP is S2 and S3 (exact Pin name, "not available" line, recent searches on the phone); Gemma, import contacts, name search and company screens are later
- 2026-11-12 · flagged [[FR-19 Discover Hub & Search Frontend Requirements]]: the same; the MVP needs only GET /views/pin/{pinName}
- 2026-11-12 · flagged [[BD-19 Discover Hub & Search Backend Delivery]]: the same; no recent-searches store for the MVP
