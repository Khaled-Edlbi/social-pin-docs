---
type: decision-record
id: DR-14
decision: D-14
status: decided
decidedBy: "molham"
decidedAt: 2026-10-25
features: [connections]
affects: ["Connections", "Rings", "Ring Members", "T-022 Accept into a Ring (sets grantedRingId)", "T-023 Connection detail and contacts list"]
related: ["Connection-granted Ring on Shared with me", "View As & Pin Views", "DR-15 Several Rings per connection, remove or disconnect"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-26
tags: [decision-record, decision-record/decided]
---

# ⚖️ DR-14 · Shared with me lists people, never the Ring

**Answers:** [[Connection-granted Ring on Shared with me]] · **Decided by:** molham · **On:** 2026-10-25 · **Feature:** [[Connections]]

> This card is the answer to [[Connection-granted Ring on Shared with me]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[Connection-granted Ring on Shared with me]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 2 on D-14, for every member: Shared with me lists people, never the Ring.**

- A person **never learns which of someone's Rings they are in**: not its name, colour or type.
- Shared with me ([[Screen Index#s17|s17]]) is **"everyone who shares with me"**, not only Rings joined by invitation or code: one row per person who shares with me ("Sam's card", from that person's projection), whatever way I got in.
- This holds for every member, not only people accepted from a connection request: a member added with `POST /rings/:ringId/members` sees the same row without the Ring's identity. The owner still sees everything on their own Rings.

Options 1 (listed with the Ring's name) and 3 (connection-granted Rings not listed) are ruled out.

Answered on the product-questions page, 2026-10-22 ("dont show"; Shared with me is for "all"), recorded on molham's word on 2026-10-25.

## Why

- [[T-022 Story]] S3 promises that the requester never learns the Ring they were put in; a Ring name on s17 would break that promise for every member, not only connections.
- Owners name Rings for themselves ("Acquaintances", "Maybe later"); those names were never meant to be read by the people in them.
- Listing everyone who shares with me makes s17 one place to find every card shared with me, instead of splitting people by how they got in.
- Traded away: the `shared-with-me` row changes for every member, and a person in two of someone's Rings sees one person, not two Rings ([[DR-15 Several Rings per connection, remove or disconnect]] says which version they see).

## What it changes

- [[Rings]]: `GET /rings/shared-with-me` stops returning the Ring's name, colour and type to a member; it returns the person who shares.
- [[Ring Members]]: a member can no longer read the identity of the Ring they are in.
- [[Connections]]: someone accepted into a Ring appears on the requester's Shared with me as the person, like everyone else.
- [[T-022 Accept into a Ring (sets grantedRingId)]]: S3 holds as written; the open question *Shared with me by name* in [[T-022 Story]] is answered (listed, without a name).
- [[T-023 Connection detail and contacts list]]: contacts and Shared with me both reach a person, neither names the Ring.

## Still open

- ~~Whether a Ring joined openly may show its name to members~~: answered by [[DR-18 Ring names shown when joined knowingly]] (2026-10-25): a Ring joined by invitation, code or work email is named to that member; a Ring the owner placed them in never is.
