---
id: ND-29
type: needs-decision
status: open
features: [connections]
blocks: ["S-23 Connections Story"]
decider: "owner"
screens: [s15, s47]
owner: "Omar Fostok"
affects: []
related: ["F-14 Connections", "F-09 Ring Members", "F-17 Ring Invitations & Join", "D-29 Connection detail opens a member who is not a connection"]
created: 2026-11-04
updated: 2026-11-04
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-29 · Connection detail for a member who is not a connection

**Status:** open · **Decider:** owner · **Raised:** 2026-11-04 · **Needed by:** [[S-23 Connections Story]] (S9, S12) · **Feature:** [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-29** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether a member of one of my Rings who is **not** a connection (they joined by an invitation or a code, [[S-33 Ring Invitations & Join Story]]) can be opened on Connection detail (s47) from the Ring's People tab (s15). [[S-23 Connections Story|Connections · S12]] says a row on s15 opens s47; for these members there is no connection to open.

## Notes

- [[FR-14 Connections Frontend Requirements]] proposes that `GET /connections/:userId` answers them with `connectedAt: null` and their memberships in my Rings, instead of a 404.
- Managing a member (window, move, remove) already works for any member through the Ring members routes.

## Options

1. **s47 opens them**, with `connectedAt: null`: the header says they're a member, not a connection; the Ring checklist and windows work the same.
2. **s15 rows for them open nothing.**

Recommendation: option 1, so every row on the People tab opens.

## Responsible

`decider` above: the owner.

## Decision

Fulfilled by [[D-29 Connection detail opens a member who is not a connection]] — decided 2026-11-04 by Omar Fostok: option 1.
