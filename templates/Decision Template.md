---
type: decision
id: D-NN
status: draft
# priority: high           # optional: how urgent the decision is (critical | high | medium | low)
# deadline: YYYY-MM-DD      # optional: when it must be taken
features: []
blocks: []
decider: ""
screens: []
affects: []
related: []
created: <date>
tags: [decision, decision/draft]
---

# ❓ D-NN · <Title>

**Status:** draft · **Decider:** <role> · **Raised:** <date> · **Needed by:** <card> · **Feature:** <feature>

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (DR-NN) is `decided`. The cards in `blocks` are **Blocked · D-NN** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

The question, in one paragraph: what the card cannot continue without, and what happens if it is decided one way or the other.

## Notes

Facts, constraints, where the design and the backend disagree, what was tried.

## Options

1. …
2. …

## Responsible

`decider` above: the person or role that takes the decision, by when, and who they need to hear from.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold record D-NN "<the answer>"`, fills the decision card DR-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided <date> by <who>: option <n>"; then `--impact DR-NN` and flag the notes it lists)
