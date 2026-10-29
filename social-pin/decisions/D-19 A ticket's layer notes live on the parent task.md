---
id: D-19
type: decision
status: decided
features: [error-contract]
decision: ND-19
decidedBy: "khaled"
decidedAt: 2026-10-25
owner: "khaled"
affects: ["S-87 Error Contract Story", "Agent Rules", "Docs Tree"]
related: ["ND-19 Where a ticket's layer notes live", "S-87 Error Contract Story"]
created: 2026-10-25
updated: 2026-10-29
tags: [decision, decision/decided]
---

# ✅ D-19 · A ticket's layer notes live on the parent task

**Answers:** [[ND-19 Where a ticket's layer notes live]] · **Decided by:** khaled · **On:** 2026-10-25 · **Feature:** [[F-35 Error Contract]]

> This card is the answer to [[ND-19 Where a ticket's layer notes live]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-19 Where a ticket's layer notes live]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

Option 1: a ticket's layer notes hang on the **parent task**. One ticket has one chain — `T-NNN Story`, `T-NNN Frontend Requirements`, `T-NNN Backend Delivery`, `T-NNN Backend Integration`, `T-NNN Frontend Delivery`, `T-NNN QA Backend`, `T-NNN QA Frontend` — scaffolded with `--scaffold <kind> T-NNN`. The halves `T-NNN-fe` and `T-NNN-be` stay what they are, the two sides of the work and the unit a person picks up, and they write **into the parent's notes** rather than opening notes of their own. This rules out a chain per half, and with it the two Backend Delivery notes per ticket that the halves' own notes ask for today.

## Why

The ticket's story is one note per ticket, not one per half, and it already names the parent's cards in its header; a chain per half would leave the story pointing at notes nobody writes. A feature-level note is the sum of its task-level notes, and one Backend Delivery per ticket rolls up cleanly where two would have to be merged by hand first. Nothing was lost by precedent: all 59 task-level notes in the vault are stories, so not one layer note had to be moved. What was traded away is the neatness of each agent owning its own file per ticket: the frontend and backend agents now write into the same chain, each into its own kind, which is the same arrangement they already have at feature level.

## What it changes

- [[S-87 Error Contract Story|Error Contract · S4–S8]]: its chain is the one the tree now draws under it; the ticket continues on `T-063 Frontend Requirements`.
- [[S-87 Error Contract Story|Error Contract · S4–S8]] and [[S-87 Error Contract Story|Error Contract · S4–S8]]: their *Layer notes* line pointed at `T-063-fe …` / `T-063-be …` cards and now points at the parent's.
- [[Agent Rules]] §2 says "each half writes its own layer notes (`--scaffold <kind> T-063-fe`)"; that sentence now reads the other way. The *Layer notes* line in `templates/Task Template.md` comes from the same reading. Both are the owner's: the ask is on [[S-87 Error Contract Story|Error Contract · S4–S8]]'s log, and the notes carry a flag.
- `taskFlow.tasks` in `docs.config.json` names parent tasks, which is what it does today (`["T-063"]`).

## Still open

Whether a **backend-only** ticket, which has one half and no frontend side, should still draw the frontend cards in its chain, and whether `taskFlow` should skip a kind the way `frontendOnly.skips` does for a feature. Nothing is blocked on it: Error Contract · S4–S8 has both sides. A new needs-decision card when the first backend-only ticket reaches its chain.
