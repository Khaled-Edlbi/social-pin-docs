---
type: decision-record
id: DR-15
decision: D-15
status: decided
decidedBy: "molham"
decidedAt: 2026-10-25
features: [connections]
affects: ["Connections", "Ring Members", "T-022 Accept into a Ring (sets grantedRingId)", "T-023 Connection detail and contacts list"]
related: ["D-15 One Ring or several per connection", "DR-14 Shared with me lists people, never the Ring", "View As & Pin Views"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-25
tags: [decision-record, decision-record/decided]
---

# ⚖️ DR-15 · Several Rings per connection, remove or disconnect

**Answers:** [[D-15 One Ring or several per connection]] · **Decided by:** molham · **On:** 2026-10-25 · **Feature:** [[Connections]]

> This card is the answer to [[D-15 One Ring or several per connection]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[D-15 One Ring or several per connection]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 1 on D-15, with the owner choosing at the last removal.**

- **Several Rings.** One person can be in more than one of my Rings (Clients and Friends). Connection detail ([[Screen Index#s47|s47]]) lists every Ring of mine they are in and offers adding them to another. `grantedRingId` stays the Ring of the accept only.
- **Which version they see first:** the Ring they were **put in first** (the oldest membership). The other versions stay reachable.
- **Removing from the last Ring asks.** When I remove someone from the last of my Rings, I choose between **"Remove from Rings"**: they stay a connection, listed in my contacts as having no access, and I can add them to a Ring again without a new request; and **"Disconnect"**: the connection ends, they leave my contacts, and getting back in takes a new request.

Options 2 (the last removal always ends the connection) and 3 (one Ring per connection) are ruled out.

Answered on the product-questions page, 2026-10-22 (Q2 "yes, the oldest"; Q4 "show an option to disconnect or just remove"), recorded on molham's word on 2026-10-25.

## Why

- The design (s47) and the API (`POST /rings/:ringId/members`, `GET /views/user/:userId/perspectives`) already allow several memberships; option 3 would take a capability away.
- Revoking access is not the same as forgetting someone; asking at the last removal lets the owner do either, instead of the product guessing.
- Showing the oldest version first is stable: adding someone to a new Ring does not change what they see first.
- Traded away: the removal flow gains a choice, and contacts can hold people who see nothing of me.

## What it changes

- [[Connections]]: a connection outlives access unless the owner disconnects; a disconnect is its own action.
- [[Ring Members]]: removing a member from their last Ring of mine offers *Remove from Rings* or *Disconnect*; reassign and revoke stay as they are.
- [[T-023 Connection detail and contacts list]]: the detail response is a list of Rings, not one; contacts include people with no access (shown as such) and exclude people I disconnected or who blocked me; S1's "Someone I removed from every Ring … is not listed" becomes "Someone I disconnected …", and the open question *Connected without a Ring* is answered.
- [[T-022 Accept into a Ring (sets grantedRingId)]]: unchanged, accepting puts the person in one Ring; adding to more happens afterwards from s47.

## Still open

- "The version they see first": where a person meets several versions of me (my card on Shared with me, a scan, the perspectives list) and how they switch between them is [[View As & Pin Views]]' and the T-023 story's to say.
- Whether a disconnect tells the other person anything follows [[DR-13 The requester sees a declined request]] in spirit but was not asked; the T-023 story says it.
