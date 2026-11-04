---
id: ND-26
type: needs-decision
status: open
features: [connections]
blocks: ["S-23 Connections Story"]
decider: "owner"
screens: [s47]
owner: "Omar Fostok"
affects: []
related: ["F-14 Connections", "D-15 Several Rings per connection, remove or disconnect", "D-26 A disconnect is not announced"]
created: 2026-11-04
updated: 2026-11-04
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-26 · Whether a disconnect is announced

**Status:** open · **Decider:** owner · **Raised:** 2026-11-04 · **Needed by:** [[S-23 Connections Story]] (S11) · **Feature:** [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-26** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

When I disconnect someone ([[S-23 Connections Story|Connections · S11]]), whether they are told. [[D-15 Several Rings per connection, remove or disconnect]] made *Disconnect* and left this in its *Still open*. The route is the same either way; what changes is whether a notification is sent.

## Notes

- Removing someone from a Ring already tells them nothing beyond losing access ([[S-23 Connections Story|Connections · S11]]).
- A block is never announced ([[S-23 Connections Story|Connections · S13]]).

## Options

1. **Not told**: they lose access and the connection; nothing is sent.
2. **Told**: "Maya removed you from her connections".

Recommendation: option 1, the same as a removal and a block.

## Responsible

`decider` above: the owner.

## Decision

Fulfilled by [[D-26 A disconnect is not announced]] — decided 2026-11-04 by Omar Fostok: option 1.
