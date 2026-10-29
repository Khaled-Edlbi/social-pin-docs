---
id: D-13
type: decision
status: decided
features: [connections]
decision: ND-13
decidedBy: "molham"
decidedAt: 2026-10-25
owner: "khaled"
affects: ["F-14 Connections", "S-23 Connections Story"]
related: ["ND-13 Whether the requester sees a declined request", "ND-17 Request expiry, note and asking again"]
created: 2026-10-25
updated: 2026-10-29
tags: [decision, decision/decided]
---

# ⚖️ D-13 · The requester sees a declined request

**Answers:** [[ND-13 Whether the requester sees a declined request]] · **Decided by:** molham · **On:** 2026-10-25 · **Feature:** [[F-14 Connections]]

> This card is the answer to [[ND-13 Whether the requester sees a declined request]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-13 Whether the requester sees a declined request]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 3 on ND-13: a declined request is shown as declined** to the person who sent it, on their Sent list ([[Screen Index#s45|s45]]) and on the *Connect* button of that person's card ([[Screen Index#s44|s44]]). A request can be asked again straight away after a decline ([[ND-17 Request expiry, note and asking again]]).

Options 1 (a decline looks pending until it lapses) and 2 (a declined request silently disappears) are ruled out. The needs-decision card had recommended option 1.

Answered on the product-questions page, 2026-10-22 ("yes visible"), recorded on molham's word on 2026-10-25.

## Why

- Product chose clarity for the requester over hiding the refusal: a person waiting on a request that will never be answered is the worse experience.
- With asking again allowed straight away, a visible decline is the requester's signal to try again (with a note) or move on.
- Traded away: the receiver's decline is no longer private; the requester knows they were turned down. A block still reads as "This profile isn't available to you", never as a decline ([[S-23 Connections Story|Connections · S8–S12]] S2), so a person who wants to stay invisible blocks rather than declines.

## What it changes

- [[F-14 Connections]]: a request is pending, accepted, declined, cancelled or expired, and the requester sees each of them.
- [[S-23 Connections Story|Connections · S8–S12]]: `GET /connections/requests?direction=sent` returns declined requests with that status; s44's button shows the decline and offers *Connect* again; the open question *Request statuses* in [[S-23 Connections Story|Connections · S8–S12]] is answered.
- [[S-23 Connections Story|Connections · S13–S18]]: the decline path closes the request as **declined, visible to the requester**; [[S-23 Connections Story|Connections · S13–S18]] S4's "The requester isn't told it was declined" is reversed.

## Still open

- How long a declined request stays on the requester's Sent list, and the exact wording on s44 and s45, are the stories' and the frontend requirements' to say.
