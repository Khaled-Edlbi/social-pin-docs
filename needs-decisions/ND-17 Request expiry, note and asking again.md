---
type: needs-decision
id: ND-17
status: open
features: [connections]
blocks: ["T-021 Story"]
decider: "owner"
screens: [s44, s45]
affects: ["T-021 Connect request send, inbox, cancel"]
related: ["Connections", "ND-13 Whether the requester sees a declined request"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-26
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-17 · Request expiry, note and asking again

**Status:** open · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[T-021 Story]] · **Feature:** [[Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-17** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Three rules of a connection request that [[T-021 Connect request send, inbox, cancel]] cannot build without: whether a request left unanswered **expires**, and after how long; whether a request can carry a short **note** ("We met at TechSummit"), and how long it may be; and whether someone can **ask again after a decline**, straight away or after a wait. They are the open questions *Expiry* and *A note* in [[T-021 Story]], and the "may ask again later" of [[T-022 Story]] S4.

## Notes

- [[ND-13 Whether the requester sees a declined request]] decides what the requester sees after a decline; asking again only matters once they can see it.
- [[T-021 Story]] S1: asking again while a request is pending returns the same request instead of a second one.
- Raised and decided in one step by the owner, on the user's answers to the product-questions page (Q3, 2026-10-22).

## Options

1. **Expire after 30 days; an optional note; ask again straight away after a decline.**
2. **No expiry; no note; ask again only after a waiting period.**
3. A mix: expiry, but a waiting period after a decline to stop repeated requests.

## Responsible

`decider` above: the owner, before [[T-021 Story]] is approved.

## Decision

Fulfilled by [[D-17 Requests expire after 30 days, optional note, ask again at once]], decided 2026-10-25 by molham: option 1.
