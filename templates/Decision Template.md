---
type: decision
id: D-NN
status: open
# priority: high           # optional: how urgent the decision is (critical | high | medium | low)
# deadline: YYYY-MM-DD      # optional: when it must be taken
features: []
blocks: []
decider: ""
screens: []
affects: []
related: []
decidedBy: ""
decidedAt: ""
created: <date>
tags: [decision, decision/open]
---

# ❓ D-NN · <Title>

**Status:** open · **Decider:** <role> · **Raised:** <date> · **Needed by:** <card> · **Feature:** <feature>

> The cards in `blocks` are **Blocked · D-NN** while this is `open` and return to their own status on the build after it is `decided`. Nobody edits their `status:` for this.

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

— (taken on its own card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold record D-NN "<the answer>"` and fills the record DR-NN (what was decided, why, what it changes with every feature and task in its `affects`, what stays open); then signs this card off: `status: decided`, `decidedBy`, `decidedAt` as on the record, the tag `decision/decided`, ✅ in the H1, and this line replaced by `Decided <date> by <who>: option <n>, on its own card, [[DR-NN …]]`; then `--impact DR-NN` and flag the notes it lists)
