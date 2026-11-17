---
id: ND-41
type: needs-decision
status: open
features: [discover-hub]
blocks: ["S-42 Discover Hub & Search Story"]
decider: "owner"
screens: [s38]
owner: "Omar Fostok"
affects: []
related: ["F-19 Discover Hub & Search", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "FR-19 Discover Hub & Search Frontend Requirements", "BD-19 Discover Hub & Search Backend Delivery", "BI-19 Discover Hub & Search Backend Integration", "S-23 Connections Story", "S-01 Account Story"]
created: 2026-11-17
updated: 2026-11-17
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-41 · Who Discover finds by part of a Pin name

**Status:** open · **Decider:** owner · **Raised:** 2026-11-17 · **Needed by:** [[S-42 Discover Hub & Search Story]] · **Feature:** [[F-19 Discover Hub & Search]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-41** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether Discover in the MVP searches people by part of their Pin name, and if it does, who can be found and what a result shows to someone who isn't connected. [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]] kept the MVP to an exact Pin name and said that search by name would need its own decision on who can be found. Today you can only find someone whose Pin name you already know.

## Notes

- **What exists:** `GET /views/pin/:pinName` opens a Pin by its exact name, and only when the viewer is in one of that person's Rings. Every other case answers the same 404 ([[BI-19 Discover Hub & Search Backend Integration|BI-19]]). No route searches by part of a name.
- **The app** (`778d9b4`) opens a Pin by its exact name and keeps recent searches on the phone ([[FD-18 Discover Hub & Search Frontend Delivery|FD-18]]).
- **The privacy question:** a partial search returns people the searcher isn't in a Ring of. The question is what they may see, and whether a person can opt out.
- **The design:** [Discover search, 8 screens](https://claude.ai/artifact/VtuKA2ezgz1snhMbBUmSbd). The screens are the hub, fewer than 3 letters, searching with a shimmer, results, the next page and Connect, no matches, no connection, and the Privacy switch.

## Options

1. **Keep D-37:** exact Pin name only, and nobody you aren't in a Ring of.
2. **Partial search, open by default with an opt-out:** anyone can be found by part of their Pin name unless they turn it off. Someone you aren't connected with shows only their account name and photo, with Connect.
3. **Partial search among people you already share a Ring with only:** nobody new can be found.

## Responsible

`decider` above: the owner (Omar Fostok).

## Decision

Fulfilled by [[D-41 Discover searches people by part of their Pin name]] — decided 2026-11-17 by Omar Fostok: option 2
