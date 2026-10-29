---
id: S-92
type: story
module: platform
feature: interests
status: approved
scope: feature
screens: [s07, s71]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-29
tags: [story, story/approved, module/platform, layer/business]
---

# Interests · User Story

**Feature:** [[F-37 Interests]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-37 Interests Frontend Requirements]] · **API Integration:** not yet (backend not built)

During onboarding, and later from Me, the user picks a few interests from a fixed vocabulary. Nobody else ever sees them; they exist so search and Smart Match can find the right people. The vocabulary is seeded and the tables exist; there is no endpoint to read or save a selection.

## Persona

A first-time user on step s07 of onboarding, who may skip; and the same user later on s71 tuning what Gemma matches on.

## Stories

### S1 · Pick interests during onboarding ([[Screen Index#s07|s07]])

**As a** new user **I want** to tap a few interests from a grouped list **so that** matchmaking works from day one without me writing anything.

Acceptance criteria:
- [ ] Interests are shown as chips grouped by category (the vocabulary carries a `category` such as Industry or Technology).
- [ ] The primary button shows the running count ("Continue · 3 picked") and leads to s08.
- [ ] "Skip" leads to s08 with nothing saved; the step is optional, as the brief's "add links & interests (optional, skippable)" says.
- [ ] The onboarding progress ring fills one segment on Continue and on Skip alike.

### S2 · Edit interests from Me ([[Screen Index#s71|s71]])

**As a** user **I want** to change my interests from Me **so that** matches follow what I care about now.

Acceptance criteria:
- [ ] The picker opens pre-filled with the saved selection; "Save · N picked" replaces the whole selection and returns to s68.
- [ ] "Cancel" returns to s68 with no change.
- [ ] The saved list is the one source of truth; saving twice with the same chips is a no-op.

### S3 · Search the vocabulary

**As a** user with a long list in front of me **I want** to filter chips by typing **so that** I find "FinTech" without scrolling every category.

Acceptance criteria:
- [ ] Filtering is client-side over the fetched vocabulary; the match is case-insensitive on the name.
- [ ] Selected chips stay selected while filtering.

### S4 · Nobody else sees my interests

**As a** user **I want** my interests kept private **so that** picking them has no social cost.

Acceptance criteria:
- [ ] Interests never appear on any Ring view, perspective, connection detail or match reason; a match reason says "shared industry", never which interest.
- [ ] The only screens that show a user's own interests are s07 and s71.

### S5 · Interests vocabulary and my interests

*From T-016 (status then: To do), merged 2026-10-27.*

`GET /interests` (public reference data), `GET/PUT /users/me/interests`. No outward entity.

Screens: [[Screen Index#s07|s07]] Interests · [[Screen Index#s71|s71]] Interests

## States and motion the design asks for

- State: empty selection (Continue still enabled as Skip-equivalent or disabled, product to confirm), N picked, saved; loading the vocabulary; offline fallback with the last fetched vocabulary ([[Wireframe Brief#Onboarding flow|§3.1]]).
- Motion: s07 slides in from s06 and out to s08 with the ring anchor; chips toggle in place. No signature motion is specific to this screen.

## Rules the backend already enforces

- `Interest.name` is unique and the vocabulary is seeded reference data (`prisma/seed/interest.seed.ts`); `UserInterest` is keyed by (user, interest) with a `weight` defaulting to 1.
- There is no outward entity for interests and the feature note says there never will be; matchmaking reads them server-side only ([[F-36 Gemma AI]]).
- No endpoint exists yet ([[S-92 Interests Story|Interests · S5]]).

## Open questions

- No decision note names this feature. Whether a minimum number of picks is required, and whether the `weight` on `UserInterest` is exposed in the picker, are for [[S-92 Interests Story|Interests · S5]] to state.
