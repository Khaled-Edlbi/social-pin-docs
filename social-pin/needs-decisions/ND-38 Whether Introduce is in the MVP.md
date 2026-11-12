---
id: ND-38
type: needs-decision
status: open
features: [connections]
blocks: ["S-23 Connections Story"]
decider: "owner"
screens: [s47]
owner: "Omar Fostok"
affects: []
related: ["F-14 Connections", "FR-14 Connections Frontend Requirements", "BD-14 Connections Backend Delivery", "FD-13 Connections Frontend Delivery"]
created: 2026-11-12
updated: 2026-11-12
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-38 · Whether Introduce is in the MVP

**Status:** open · **Decider:** owner · **Raised:** 2026-11-12 · **Needed by:** [[S-23 Connections Story]] (S9) · **Feature:** [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-38** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether *Introduce* on Connection detail ([[Screen Index#s47|s47]]) is in the MVP. [[S-23 Connections Story]] shows it disabled, "Not available yet", and proposes it for v1 in its open questions.

## Notes

- **What exists:** no endpoint for an introduction. [[BD-14 Connections Backend Delivery]] ships requests, accept and decline, disconnect, block, and connection detail, but nothing that introduces one connection to another.
- **The app** shows Introduce disabled on s47 ([[FD-13 Connections Frontend Delivery]]).
- S-23's open question also asks what Introduce means: a request sent on someone's behalf, or a suggestion.

## Options

1. **In the MVP.** S-23 gets an Introduce part with backend criteria; `/frontend` adds it to the requirements; the backend builds an endpoint.
2. **v1, as proposed.** It stays disabled in the MVP.

## Responsible

`decider` above: the owner (Omar Fostok).

## Decision

Fulfilled by [[D-38 Introduce is in the MVP]] — decided 2026-11-11 by Omar Fostok: option 1
