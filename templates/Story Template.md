---
type: story
code: <feature id, or T-NNN for a task-level note>
scope: feature
feature: <feature id>
module: <module id>
status: draft
screens: []
depends: []
affects: []
related: []
# priority: high           # optional: inherits the task's or the feature's when absent (critical | high | medium | low)
# deadline: YYYY-MM-DD      # optional: inherits the task's or the feature's when absent
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
approvedBy: ""
approvedAt: ""
created: <date>
updated: <date>
tags: [story, story/draft, module/<module>, layer/business]
---

# <Feature name> · User Story

**Feature:** [[<Feature name>]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[<Feature name> Frontend Requirements]] · **Backend Integration:** [[<Feature name> Backend Integration]] · **Verified by:** [[<Feature name> QA Backend]], [[<Feature name> QA Frontend]]

One paragraph: who the user is here and what they are trying to get done, in product terms. `approved` (👍) when product signs off (`approvedBy`, `approvedAt`); `verified` (✅ Fulfilled) set by the PM once every QA note of its scope is `passing` with nothing pending.

## Persona

Who this is for (personal user, visitor, exhibitor, organizer, Ring owner, Ring member) and the moment they are in.

## Stories

### S1 · <Screen or journey name> ([[Screen Index#sNN|sNN]])

**As a** … **I want** … **so that** …

Acceptance criteria:
- [ ] …
- [ ] …

### S2 · …

## States and motion the design asks for

- State: …
- Motion: …

## Rules the backend already enforces

Edge cases a story must respect because the backend decides them (from the feature's Backend Delivery note).

## Open questions

- [[D-NN …]] — what it blocks here.
