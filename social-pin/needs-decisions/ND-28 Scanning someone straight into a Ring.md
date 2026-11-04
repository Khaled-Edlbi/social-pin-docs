---
id: ND-28
type: needs-decision
status: open
features: [connections]
blocks: ["S-23 Connections Story"]
decider: "owner"
screens: [s15]
owner: "Omar Fostok"
affects: []
related: ["F-14 Connections", "D-10 Connect sends what the requester already has", "D-28 Scan someone in is not in the MVP"]
created: 2026-11-04
updated: 2026-11-04
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-28 · Scanning someone straight into a Ring

**Status:** open · **Decider:** owner · **Raised:** 2026-11-04 · **Needed by:** [[S-23 Connections Story]] (S12) · **Feature:** [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-28** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether *Scan someone in* on a Ring's People tab ([[Screen Index#s15|s15]], [[S-23 Connections Story|Connections · S12]]) adds the person I scan straight to that Ring. After [[D-10 Connect sends what the requester already has]] a scan carries no user id, so it would need its own route (`POST /rings/:ringId/members { qrToken }`). The person scanned would be added without asking to connect.

## Notes

- *Connect* then *Accept* already lets the two people end up in a Ring together ([[S-23 Connections Story|Connections · S2, S5]]).
- [[FR-14 Connections Frontend Requirements]] shows the button disabled, "Not available yet", until this is decided.

## Options

1. **Not in the MVP**: the button stays disabled; it can come in v1.
2. **In the MVP**: a scan adds the person to the Ring at once, through a new route.

Recommendation: option 1. Connect and Accept already cover it, and adding someone without them asking can wait.

## Responsible

`decider` above: the owner.

## Decision

Fulfilled by [[D-28 Scan someone in is not in the MVP]] — decided 2026-11-04 by Omar Fostok: option 1.
