---
type: decision
id: D-05
decision: ND-05
status: decided
decidedBy: "molham"
decidedAt: 2026-10-25
features: [photo-library, ring-projection, rings]
affects: ["F-11 Rings", "F-10 Ring Projection", "F-06 Photo Library", "S-17 Ring Projection Story"]
related: ["ND-05 Copy or inherit", "D-02 One main profile every Ring starts from", "D-04 Ring settings at launch and their defaults"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-28
tags: [decision, decision/decided]
---

# ⚖️ D-05 · Inherit per field, copy without members

**Answers:** [[ND-05 Copy or inherit]] · **Decided by:** molham · **On:** 2026-10-25 · **Feature:** [[F-06 Photo Library]], [[F-10 Ring Projection]], [[F-11 Rings]]

> This card is the answer to [[ND-05 Copy or inherit]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-05 Copy or inherit]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option A on ND-05: both. Inherit by default, field by field; copy as a one-off.**

- **Inherit.** A Ring follows the main profile ([[D-02 One main profile every Ring starts from]]): updating the main photo or bio updates every Ring that has not changed that field.
- **Per field.** Editing one field in a Ring stops **that field only** from inheriting; the Ring's other fields keep following the main profile.
- **Copy.** Copying a Ring (when creating one, s18) copies its fields, its bio and photo, its colour and its settings ([[D-04 Ring settings at launch and their defaults]]); **members are never copied**. Copying another Ring's bio (s28) copies the bio only. After a copy the two Rings are independent.

Option B (copy only) is ruled out.

Answered on the product-questions page, 2026-10-22, recorded on molham's word on 2026-10-25.

## Why

- "Inherit, stays in sync with your Pin" (s23) is in the design, and it only means something with a main profile, which D-02 now gives.
- Per-field inheritance matches what a person expects: changing the Family bio should not freeze the Family photo.
- Members are people who were let into one Ring; copying them would give them access they were never granted.
- Traded away: the projection reads two sources (the Ring's own value or the main one) for every field.

## What it changes

- [[F-10 Ring Projection]]: each field of a Ring is either its own value or the main profile's; "Reset to Pin" (s23) returns a field to inheriting.
- [[F-11 Rings]]: creating a Ring can copy another (fields, bio, photo, colour, settings; no members).
- [[F-06 Photo Library]]: a Ring's photo inherits the main photo until the Ring picks its own.
- [[S-17 Ring Projection Story|Ring Projection · Decide copy or inherit]]: its decision is taken; the PM closes it.

## Still open

- Whether a copied Ring's fields are copied as fixed values or keep inheriting where the source Ring inherited was not asked; the natural reading is that inheriting fields stay inheriting. The Rings story says it.
