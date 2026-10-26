---
type: decision
id: D-17
decision: ND-17
status: decided
decidedBy: "molham"
decidedAt: 2026-10-25
features: [connections]
affects: ["Connections", "T-021 Connect request send, inbox, cancel", "T-022 Accept into a Ring (sets grantedRingId)"]
related: ["Request expiry, note and asking again", "D-13 The requester sees a declined request"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-26
tags: [decision, decision/decided]
---

# ⚖️ D-17 · Requests expire after 30 days, optional note, ask again at once

**Answers:** [[Request expiry, note and asking again]] · **Decided by:** molham · **On:** 2026-10-25 · **Feature:** [[Connections]]

> This card is the answer to [[Request expiry, note and asking again]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[Request expiry, note and asking again]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1 on ND-17.**

- **Expiry.** A connection request left unanswered **expires after 30 days**. An expired request is closed with no connection; the requester sees it as expired and can ask again.
- **A note.** A request **may carry a short note** ("We met at TechSummit"), **optional**, at most **200 characters**.
- **Asking again.** After a decline ([[D-13 The requester sees a declined request]]) or an expiry, the requester **can ask again straight away**; there is no waiting period. A request still pending is not duplicated ([[T-021 Story]] S1).

Options 2 (no expiry, no note, a wait after a decline) and 3 (a waiting period after a decline) are ruled out.

Answered on the product-questions page, 2026-10-22 (Q3: expiry "ok" to the suggested 30 days, note "yes, optional", ask again "yes straight"); the 200-character limit was proposed by the owner agent, as no length was given, and accepted by molham on 2026-10-25.

## Why

- An expiry stops requests from waiting forever and gives a decline and silence the same end, with a clear status for the requester.
- A note helps the receiver place someone they met once; keeping it optional keeps a scan-and-connect quick, and 200 characters keeps it a line, not a message.
- Asking again at once fits a visible decline: the requester can add context and retry. **Traded away:** nothing stops a requester from asking repeatedly; a receiver who does not want that blocks ([[T-024 Block and unblock]]).

## What it changes

- [[Connections]]: a request is pending, accepted, declined, cancelled or **expired**; it may carry a note.
- [[T-021 Connect request send, inbox, cancel]]: `POST /connections/requests` takes an optional note (≤ 200 characters); requests lapse after 30 days; the open questions *Expiry* and *A note* in [[T-021 Story]] are answered.
- [[T-022 Accept into a Ring (sets grantedRingId)]]: [[T-022 Story]] S4's "may ask again later" becomes "may ask again straight away"; the receiver sees the note on the request (s45, s46).

## Still open

- Whether the receiver is reminded before a request expires, and whether expiry is shown to the receiver at all, are the stories' to say.
- Whether repeated requests to the same person need a limit is left until abuse shows it does.
