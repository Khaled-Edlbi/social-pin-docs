---
type: decision
id: D-15
aliases: [D-15]
status: open
features: [connections]
blocks: ["T-023 Story"]
decider: "owner"
screens: [s15, s47]
affects: []
related: ["Connections", "Ring Members"]
owner: "omar"
created: 2026-10-25
updated: 2026-10-26
tags: [decision, decision/open]
---

# ✅ D-15 · One Ring or several per connection

**Status:** open · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[T-023 Story]] · **Feature:** [[Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (DR-NN) is `decided`. The cards in `blocks` are **Blocked · D-15** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Two linked questions about what a connection is. First, whether a connection sits in **one** of the owner's Rings or may sit in **several**: [[T-022 Accept into a Ring (sets grantedRingId)]] accepts someone into one Ring, while the design's Connection detail ([[Screen Index#s47|s47]]) draws a person in more than one, and the API allows it. Second, whether a person removed from every one of the owner's Rings is **still a connection** (listed in contacts, with no access) or **no longer one**. Until both are answered, [[T-023 Connection detail and contacts list]] cannot shape the detail response (a Ring or a list of Rings) or say who the contacts list includes.

## Notes

- The API already allows several memberships per person: `POST /rings/:ringId/members` adds to any of the owner's Rings, and `GET /views/user/:userId/perspectives` exists to return everything one person shares with the caller ([[Ring Members Backend Integration]], [[View As & Pin Views Backend Integration]]).
- `grantedRingId` records the Ring of the accept only ([[T-022 Story]]); it is one value.
- Reassign moves a member between Rings in one transaction; revoke marks the row `REMOVED`, never deleted ([[T-023 Story]], rules).
- [[T-023 Story]] S1 already says someone removed from every Ring is not listed, while its open questions leave it undecided; whichever option is chosen, that criterion follows the answer.
- Someone who blocked the owner stays off the list in every option ([[T-024 Block and unblock]]).

## Options

1. **Several Rings; the connection outlives access**: s47 lists every Ring of the owner the person is in, with each window, and offers adding to another; removing them from the last Ring leaves them in contacts as "No access". `grantedRingId` stays as the Ring of the accept only.
2. **Several Rings; the last removal ends the connection**: as option 1, but leaving the last Ring removes the person from contacts, as T-023 S1 says today.
3. **One Ring per connection**: s47 shows one Ring with *Move to…*; adding to a second Ring is not offered from the connection; revoking ends the connection.

Recommendation: option 1. It matches the design and the API, and revoking access is not the same as forgetting someone: the owner can still find them and give access again.

## Responsible

`decider` above: the owner, before [[T-023 Story]] is approved, after hearing from the backend what the `Connection` row keeps when the last membership is revoked.

## Decision

Fulfilled by [[DR-15 Several Rings per connection, remove or disconnect]], decided 2026-10-25 by molham: option 1, with *Remove from Rings* or *Disconnect* offered at the last removal.
