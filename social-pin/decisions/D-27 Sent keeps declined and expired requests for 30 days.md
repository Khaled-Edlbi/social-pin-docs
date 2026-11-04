---
id: D-27
type: decision
status: decided
features: [connections]
decision: ND-27
decidedBy: "Omar Fostok"
decidedAt: 2026-11-04
owner: "Omar Fostok"
affects: ["S-23 Connections Story", "FR-14 Connections Frontend Requirements", "BD-14 Connections Backend Delivery"]
related: ["ND-27 How long declined and expired requests stay on Sent", "D-17 Requests expire after 30 days, optional note, ask again at once", "F-14 Connections"]
created: 2026-11-04
updated: 2026-11-04
tags: [decision, decision/decided]
---

# ✅ D-27 · Sent keeps declined and expired requests for 30 days

**Answers:** [[ND-27 How long declined and expired requests stay on Sent]] · **Decided by:** Omar Fostok · **On:** 2026-11-04 · **Feature:** [[F-14 Connections]]

> This card is the answer to [[ND-27 How long declined and expired requests stay on Sent]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-27 How long declined and expired requests stay on Sent]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: 30 days, no reminder.** A declined or expired request stays on the requester's Sent list for 30 days after it was declined or expired, then leaves it. The receiver gets no reminder before a pending request expires, in the MVP. This closes what [[D-17 Requests expire after 30 days, optional note, ask again at once]] left open, and rules out 7 days (option 2) and keeping them until removed (option 3).

## Why

30 days matches the request's own expiry, so the Sent list has one rule of time. A reminder needs push notifications, which come later.

## What it changes

- [[S-23 Connections Story]]: the open question on Sent closes (`/pm`).
- [[FR-14 Connections Frontend Requirements]]: the app shows what the server returns; nothing to count on the phone (`/frontend`).
- [[BD-14 Connections Backend Delivery]]: `GET /connections/requests?direction=sent` drops declined and expired requests 30 days after they ended (`/backend`).

## Still open

- A reminder before a request expires can come with notifications, on a new card.
