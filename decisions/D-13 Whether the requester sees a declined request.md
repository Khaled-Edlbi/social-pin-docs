---
type: decision
id: D-13
status: open
features: [connections]
blocks: ["T-021 Story", "T-022 Story"]
decider: "owner"
screens: [s44, s45]
affects: []
related: ["Connections"]
owner: "omar"
created: 2026-10-25
updated: 2026-10-25
tags: [decision, decision/open]
---

# ✅ D-13 · Whether the requester sees a declined request

**Status:** open · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[T-021 Story]], [[T-022 Story]] · **Feature:** [[Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (DR-NN) is `decided`. The cards in `blocks` are **Blocked · D-13** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What the requester sees after the receiver declines: on their Sent list ([[Screen Index#s45|s45]]) and on the *Connect* button of that person's card ([[Screen Index#s44|s44]]). A request is pending, accepted, declined or cancelled; the receiver's side is clear, the requester's is not. Showing the decline is honest but tells someone they were turned down; hiding it protects the receiver but leaves the requester waiting. Until this is chosen, [[T-021 Connect request send, inbox, cancel]] cannot say which statuses `GET /connections/requests?direction=sent` returns, and [[T-022 Accept into a Ring (sets grantedRingId)]] cannot finish its decline path.

## Notes

- [[T-022 Story]] S4: decline closes the request with no connection and no membership, the requester isn't told, and may ask again later.
- [[T-021 Story]] S1: asking again while a request is pending returns the same request instead of a second one; S4: cancelling a request that was just declined refreshes the list instead of failing.
- The product already hides refusals elsewhere: a block reads as "This profile isn't available to you", never "blocked" ([[T-021 Story]] S2).
- Whether an unanswered request expires is still an open question in [[T-021 Story]]; options 1 and 2 read better with an expiry, because then a decline and silence end the same way.

## Options

1. **A declined request stays pending to the requester** until it lapses (or forever, without an expiry): *Requested* on s44, listed under Sent. A decline is indistinguishable from no answer; the requester can't ask again until it lapses.
2. **A declined request disappears from the requester's side**: it leaves Sent and the button returns to *Connect*, so they can ask again. The vanishing row lets an attentive requester infer the decline.
3. **A declined request is shown as declined**: clear for the requester; tells them they were refused.

Recommendation: option 1, with an expiry on every unanswered request, so a decline and no answer end the same way and the requester can try again after it.

## Responsible

`decider` above: the owner, before [[T-021 Story]] and [[T-022 Story]] are approved, after hearing from the backend which request statuses it stores.

## Decision

Fulfilled by [[DR-13 The requester sees a declined request]], decided 2026-10-25 by molham: option 3.
