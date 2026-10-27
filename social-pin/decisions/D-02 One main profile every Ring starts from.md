---
type: decision
id: D-02
decision: ND-02
status: decided
decidedBy: "molham"
decidedAt: 2026-10-25
features: [onboarding-imports, photo-library, profiles, ring-projection]
affects: ["Profiles & Pin Name", "Ring Projection", "Onboarding Imports", "Photo Library", "Onboarding Imports Story", "Profiles & Pin Name Story", "Ring Projection Story"]
related: ["ND-02 Base profile work fields", "D-05 Inherit per field, copy without members", "D-03 Links entered once, switched on or off per Ring"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-27
tags: [decision, decision/decided]
---

# ⚖️ D-02 · One main profile every Ring starts from

**Answers:** [[ND-02 Base profile work fields]] · **Decided by:** molham · **On:** 2026-10-25 · **Feature:** [[Onboarding Imports]], [[Photo Library]], [[Profiles & Pin Name]], [[Ring Projection]]

> This card is the answer to [[ND-02 Base profile work fields]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-02 Base profile work fields]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option A on ND-02: a main profile that every Ring starts from.** A person writes their work details once, on the main profile, and every Ring shows them by default; each Ring may change them for itself.

| Main-profile field | A Ring may change it |
|---|---|
| Headline | yes |
| Role | not asked; see *Still open* |
| Company | yes |
| Location | yes |
| Photo | yes |
| Bio | yes |
| Full name | **no**: the same in every Ring |

- These six fields are the whole main profile ("that's all"); nothing else is added to it.
- A Ring that changed a field **keeps its own value** when the main value changes later; Rings that did not change it follow the main value (how a Ring follows it, field by field: [[D-05 Inherit per field, copy without members]]).
- Option B (everything per Ring, the client copying values when a Ring is created) is ruled out.

Answered on the product-questions page, 2026-10-22, recorded on molham's word on 2026-10-25.

## Why

- The design shows these details on every screen (s05, s06, s11, s23, s29), and the imports (s05) and "Inherit, stays in sync with your Pin" (s23) both need a main profile to feed the Rings; option A is the only one that serves them.
- Keeping a Ring's own value when the main one changes protects a Ring that was set on purpose ("Family" showing just "Omar") from being overwritten by a promotion meant for work Rings.
- Full name stays the same everywhere so that a person is recognisable across Rings and on printed badges.
- Traded away: `Profile` grows by these fields, and adding them is the review point the entity drift guard was built for (what is public stays decided per Ring).

## What it changes

- [[Profiles & Pin Name]]: the profile gains headline, role, company, location, photo and bio as main-profile fields; full name is never set per Ring.
- [[Ring Projection]]: each Ring may change headline, company, location, photo and bio for itself; a field it has not changed shows the main value.
- [[Onboarding Imports]]: imports (LinkedIn, business card, portfolio URL) fill the main profile, not one Ring; [[Onboarding Imports Story|Onboarding Imports · S7]] and [[Onboarding Imports Story|Onboarding Imports · S8]] are no longer waiting on this decision.
- [[Photo Library]]: a Ring's photo is the main photo unless the Ring picks another.
- [[Profiles & Pin Name Story|Profiles & Pin Name · Decide base profile work fields]]: its decision is taken; the PM closes it.
- [[Ring Projection Story|Ring Projection · Decide copy or inherit]]: the main profile it needed now exists; its own answer is [[D-05 Inherit per field, copy without members]].

## Still open

- **Role** was not in the per-Ring table. Until product says otherwise, it follows headline (a Ring may change it); a needs-decision card only if someone disagrees.
- Which main-profile fields an import may overwrite without asking is [[Onboarding Imports]]' story to say.
