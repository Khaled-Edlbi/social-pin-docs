---
id: ND-25
type: needs-decision
status: open
features: [connections]
blocks: ["S-23 Connections Story"]
decider: "owner"
screens: [s17, s45, s47, s68]
owner: "Omar Fostok"
affects: []
related: ["F-14 Connections", "F-01 Account", "D-25 A deleted account's connections, requests and blocks end silently"]
created: 2026-11-04
updated: 2026-11-04
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-25 · What deleting an account does to its connections

**Status:** open · **Decider:** owner · **Raised:** 2026-11-04 · **Needed by:** [[S-23 Connections Story]] (S16) · **Feature:** [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-25** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What happens to a person's connections, the requests they sent and received, and the blocks they made or received, when they delete their account; and whether the people on the other side are told. [[S-23 Connections Story|Connections · S16]] marks it "Not decided yet". Until it is, the backend can't write the account deletion's effect on Connections, and the app doesn't know what s47 answers for someone who is gone.

## Notes

- Connections and requests are kept by user id, never by Pin name ([[S-23 Connections Story|Connections · S16]]).
- [[FR-14 Connections Frontend Requirements]] needs only that the deleted person's rows stop being returned and that s47 answers its "not in your contacts any more" 404.
- A block, a disconnect and a deleted account already read the same on the other side: one neutral message, nothing that tells them apart.

## Options

1. **All end, silently**: the connections end, pending requests both ways close, the blocks are removed; the others lose the row without a notification.
2. **Kept as a "deleted user"**: the rows stay, shown as "Deleted account", until each person removes them.
3. **All end, with a notice**: as option 1, plus "Maya deleted her account" to each connection.

Recommendation: option 1. Nothing points at a person who's gone, and nothing tells the others more than a disconnect would.

## Responsible

`decider` above: the owner, before [[BD-14 Connections Backend Delivery]] writes the deletion's effect.

## Decision

Fulfilled by [[D-25 A deleted account's connections, requests and blocks end silently]] — decided 2026-11-04 by Omar Fostok: option 1.
