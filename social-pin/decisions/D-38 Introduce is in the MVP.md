---
id: D-38
type: decision
status: decided
features: [connections]
decision: ND-38
decidedBy: "Omar Fostok"
decidedAt: 2026-11-11
owner: "Omar Fostok"
affects: ["S-23 Connections Story", "FR-14 Connections Frontend Requirements", "BD-14 Connections Backend Delivery", "FD-13 Connections Frontend Delivery"]
related: ["ND-38 Whether Introduce is in the MVP", "F-14 Connections"]
created: 2026-11-12
updated: 2026-11-12
tags: [decision, decision/decided]
---

# ✅ D-38 · Introduce is in the MVP

**Answers:** [[ND-38 Whether Introduce is in the MVP]] · **Decided by:** Omar Fostok · **On:** 2026-11-11 · **Feature:** [[F-14 Connections]]

> This card is the answer to [[ND-38 Whether Introduce is in the MVP]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-38 Whether Introduce is in the MVP]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1: Introduce on Connection detail ([[Screen Index#s47|s47]]) is in the MVP.**

- The API has no endpoint for it yet, so it needs a story part with backend criteria, and then requirements.
- Until the backend ships it, the app keeps it disabled, "Not available yet".

## Why

- It moves into the MVP on the owner's word, after the vault-vs-app review of 2026-11-11.
- **Traded away:** the MVP waits on one more endpoint.

## What it changes

- [[S-23 Connections Story]] (`/pm`): S9 Introduce becomes an MVP part with screen and backend criteria; the open question on Introduce is answered "MVP" and no longer "proposed v1".
- [[FR-14 Connections Frontend Requirements]] (`/frontend`): the endpoint Introduce needs, once S-23 has the part.
- [[BD-14 Connections Backend Delivery]] (`/backend`): an Introduce endpoint to build after the requirements are approved.
- [[FD-13 Connections Frontend Delivery]] (`/frontend`): Introduce stays disabled until the endpoint ships.

## Still open

- **What Introduce means** (a request sent on someone's behalf, or a suggestion to both people), and what each person sees: `/pm` writes it in S-23 and brings any open choice back as a decision.

## Log

- 2026-11-12 · flagged [[S-23 Connections Story]]: D-38: Introduce (s47) is in the MVP; S9 needs a part with backend criteria, and the open question's "proposed v1" goes
- 2026-11-12 · flagged [[FR-14 Connections Frontend Requirements]]: the same; requirements for the Introduce endpoint once S-23 has the part
- 2026-11-12 · flagged [[BD-14 Connections Backend Delivery]]: the same; an Introduce endpoint is needed
- 2026-11-12 · flagged [[FD-13 Connections Frontend Delivery]]: the same; Introduce stays disabled until the endpoint ships
