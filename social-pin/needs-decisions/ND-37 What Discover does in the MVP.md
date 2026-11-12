---
id: ND-37
type: needs-decision
status: open
features: [discover-hub]
blocks: ["S-42 Discover Hub & Search Story"]
decider: "owner"
screens: [s38, s44]
owner: "Omar Fostok"
affects: []
related: ["F-19 Discover Hub & Search", "FR-19 Discover Hub & Search Frontend Requirements", "BD-19 Discover Hub & Search Backend Delivery", "F-12 View As & Pin Views", "F-36 Gemma AI"]
created: 2026-11-12
updated: 2026-11-12
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-37 · What Discover does in the MVP

**Status:** open · **Decider:** owner · **Raised:** 2026-11-12 · **Needed by:** [[S-42 Discover Hub & Search Story]] · **Feature:** [[F-19 Discover Hub & Search]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-37** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether Discover & Search ([[F-19 Discover Hub & Search]]) is in the MVP, and if it is, which of [[S-42 Discover Hub & Search Story]]'s parts are. The feature had no release, and the story describes the whole hub: Pin name search, recent searches, Gemma, importing contacts. The app already ships part of it, so the story can't say what the MVP has to deliver until the scope is set.

## Notes

- **What exists:** the backend opens a Pin by its exact Pin name with `GET /views/pin/{pinName}` and gives the same answer whether the Pin is unknown, not shared or blocked ([[S-42 Discover Hub & Search Story|S-42 · Rules the backend already enforces]]). Nothing serves name search, Gemma queries or contact matching.
- **The app** (social_pin `rings/F-11/honest-rings`) opens a Pin by its exact name, shows "This Pin isn't available to you" under the field, and keeps recent searches on the phone.
- S-42's open question asked whether recent searches are stored on the server or on the phone.

## Options

1. **In the MVP, opening a Pin by its exact name only:** the Pin name, the "not available" line and recent searches on the phone. The rest comes later.
2. **In the MVP with search by name too:** needs a new search endpoint and a privacy rule for who can be found.
3. **Not in the MVP:** Discover shows only its tiles.

Recommendation: option 1. It is what the backend and the app already do.

## Responsible

`decider` above: the owner (Omar Fostok).

## Decision

Fulfilled by [[D-37 Discover opens a Pin by its exact Pin name in the MVP]] — decided 2026-11-11 by Omar Fostok: option 1
