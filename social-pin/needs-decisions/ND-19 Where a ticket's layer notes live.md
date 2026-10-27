---
type: needs-decision
id: ND-19
status: open
features: [error-contract]
blocks: ["Error Contract Story"]
decider: "owner"
screens: []
affects: []
related: ["Agent Rules", "Docs Tree", "Error Contract Story"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-27
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-19 · Where a ticket's layer notes live

**Status:** open · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[Error Contract Story|Error Contract · S4–S8]] · **Feature:** [[Error Contract]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (D-NN) is `decided`. The cards in `blocks` are **Blocked · ND-19** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

A build task is split into its halves, `T-NNN-fe` and `T-NNN-be`, and each half is a task of its own. The vault does not say which of the two levels carries the ticket's layer notes: the parent (`T-063 Backend Delivery`) or each half (`T-063-be Backend Delivery`). Until it does, the agent who picks the ticket up has to guess, and the two guesses produce different files for the same work. No ticket in the vault settles it by precedent: all 59 task-level notes today are stories, and not one layer note has yet been written at task level.

## Notes

- **The two sides already disagree in writing.** [[Error Contract Story|Error Contract · S4–S8]]'s header links `[[Error Contract Frontend Requirements|Error Contract · S4–S8]]`, `[[Error Contract Backend Integration|Error Contract · S4–S8]]`, `[[Error Contract QA Backend|Error Contract · S4–S8]]` and `[[Error Contract QA Frontend|Error Contract · S4–S8]]` — the parent. The halves' own notes ([[Error Contract Story|Error Contract · S4–S8]], [[Error Contract Story|Error Contract · S4–S8]]) tell their team to scaffold `[[Error Contract Backend Delivery|Error Contract · S4–S8]]` — the half. Both lines come from templates, so every build ticket in the vault carries the contradiction.
- [[Agent Rules#2 · Codes, scopes and the "sum of" rule]] says "each half writes its own layer notes (`--scaffold <kind> T-063-fe`)", which reads for the half.
- `taskFlow` in `docs.config.json` (added 2026-10-25) draws the chain under the parent, for the tasks it names; it names `T-063` today. Whichever way this goes, that list and one of the two templates have to follow — both are the owner's files.
- A ticket's story is one note per ticket, not one per half, and the feature-level notes are the sum of the task-level ones. A chain per half gives two Backend Delivery notes to roll up where the story gives one.
- Counting: the parent draws one chain of up to 7 cards per ticket; the halves draw two chains that between them skip nothing but split QA and delivery in two.

## Options

1. **The parent task.** One chain per ticket, on `T-NNN`, matching the story. The halves stay the two sides of the work and write into the parent's notes; a half-only ticket (backend-only) still has one chain. `taskFlow.tasks` names parents; the *Layer notes* line in `templates/Task Template.md` is corrected to point at the parent's cards. **Recommended:** one ticket, one story, one chain, one roll-up into the feature note.
2. **Each half.** Two chains per ticket, on `T-NNN-fe` and `T-NNN-be`, matching the half notes and Agent Rules §2 as written. `taskFlow.tasks` names halves; the header in `templates/Story Template.md` is corrected. Closer to how the work is actually split between two agents, at the cost of two notes of each kind per ticket.

## Responsible

`decider` above: the owner, who holds the rules, the config and the templates. The PM raises it because the ticket it blocks is the PM's; the frontend and backend agents are the ones it costs, since they write the notes either way. Needed before the first layer note of [[Error Contract Story|Error Contract · S4–S8]] is written, which is the next step on that ticket.

## Decision

Fulfilled by [[D-19 A ticket's layer notes live on the parent task]] — decided 2026-10-25 by khaled: option 1.
