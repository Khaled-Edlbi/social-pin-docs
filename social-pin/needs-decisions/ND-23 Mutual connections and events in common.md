---
type: needs-decision
id: ND-23
status: open
features: [connections]
blocks: ["S-23 Connections Story"]
decider: "owner"
screens: [s47]
affects: []
related: ["F-14 Connections", "F-08 Ring Access Engine", "S-15 Ring Access Engine Story", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "F-23 Events During"]
owner: "Omar Fostok"
created: 2026-10-29
updated: 2026-10-29
tags: [needs-decision, needs-decision/open]
---

# ❓ ND-23 · Mutual connections and events in common

**Status:** open · **Decider:** owner · **Raised:** 2026-10-29 · **Needed by:** [[S-23 Connections Story]] (S4, S24) · **Feature:** [[F-14 Connections]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-23** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

What Connection detail ([[Screen Index#s47|s47]]) may tell me about **what I share with another person**: the people we're both connected to ("4 mutual connections · Omar, Lina, Rami +1") and the events we both went to ("2 events in common · TechSummit '26 · Design Week"). Both are drawn in the design. Each tells me something about the other person that they never chose to show me through a Ring: who they know, and where they've been. The answer decides what [[S-23 Connections Story|Connections · S24]] builds, and what the engine ([[F-08 Ring Access Engine]]) allows; until it's decided, s47 shows neither.

## Notes

- **What a name reveals.** "Omar" in the list tells me *Maya knows Omar*. Neither Maya nor Omar chose to show me that. The product's promise is that you only learn what someone's Ring shows you ([[S-15 Ring Access Engine Story]]).
- **The story's draft rule** ([[S-23 Connections Story|Connections · S24]], never decided by product): "only people who are connections of both of us, and only where a Ring's 'members can see each other' is on; hidden otherwise", and events in common "after the events features; until then hidden". Its Open questions give a different version ("computed over the viewer's own connections only"). The two disagree; this card settles them.
- **"Members can see each other"** ([[D-04 Ring settings at launch and their defaults]]) is off by default and doesn't exist yet; a rule built on it shows nothing at launch.
- **Blocks and private Rings:** a person I blocked, or who blocked me, must never appear in any list; the engine already hides blocked pairs everywhere.
- **Events in common** depend on the events features ([[F-23 Events During]]); an event I attended with an Event Ring is visible to me, but whether the other person was there is their information.
- **Who enforces it:** the engine, like every other "may I see this" answer (golden rule 8); the Connections service never decides it alone.
- The design review of 2026-10-29 ([[S-15 Ring Access Engine Story]], decision 5) chose to raise this card and to hide both rows on s47 until it is decided.

## Options

**Mutual connections**
1. **Not shown.** s47 has no mutual connections.
2. **A count only** ("4 mutual connections"), never names. Says we move in the same circles; names no one.
3. **The story's draft rule:** names, but only people connected to both of us **and** in a Ring of the other person's where "members can see each other" is on. Shows nothing until that setting exists and is turned on.
4. **Names of people who are my own connections and theirs** (the Open questions' version): every name is someone I already know; what it adds is that they also know this person.

**Events in common**
1. **Not shown.**
2. **Events we both attended where we were both visible to each other** (an Event Ring we were both in), once the events features ship.
3. **Any event we both attended.**

Recommendation (PM): **mutual connections option 2 (a count only)** and **events option 2 (both visible)**. A count keeps the useful part ("we know people in common") without naming anyone the other person didn't choose to show; events where we were both visible are something we already saw together. Option 3 can come later if the setting is on.

## Responsible

`decider` above: the owner, before [[S-23 Connections Story|Connections · S24]] is built, after hearing from the backend how the count would be computed through the engine.

## Decision

— (answered on its decision card, never written here: the PM or the owner, on the user's word, runs `node scripts/build-tree.mjs --scaffold decision ND-23 "<the answer>"`, fills the decision card D-NN (what was decided, why, what it changes with every feature and card in its `affects`, what stays open) and sets it `decided` with `decidedBy` and `decidedAt`; this card then shows Fulfilled by itself; the H1 gets ✅, and this line is replaced by "Fulfilled by" and a wikilink to the decision card, then "decided <date> by <who>: option <n>"; then `--impact D-NN` and flag the notes it lists)
