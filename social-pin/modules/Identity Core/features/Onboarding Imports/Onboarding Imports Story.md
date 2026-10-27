---
type: story
code: onboarding-imports
scope: feature
feature: onboarding-imports
module: identity
status: approved
screens: [s03, s03a, s03b, s04, s05]
approvedBy: "khaled"
approvedAt: 2026-10-25
created: 2026-10-18
updated: 2026-10-27
owner: "omar"
related: ["D-02 One main profile every Ring starts from"]
tags: [story, story/approved, module/identity, layer/business]
---

# Onboarding Imports · User Story

**Feature:** [[Onboarding Imports]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[Onboarding Imports Frontend Requirements]] · **API Integration:** not yet (backend not built)

A new user has just verified their code and does not want to type a profile from scratch. They start from something they already have: a LinkedIn account, a paper business card, or a portfolio URL. The import proposes fields, the user reviews each one (include / skip, edit inline), and the confirmed fields populate the **main profile** (headline, role, company, location, photo, bio, and the full name), which every Ring then follows field by field, the first Ring included ([[Wireframe Brief#LinkedIn profile import|§3.3]], [[D-02 One main profile every Ring starts from]]). Nothing is written before the user confirms.

## Persona

A new user between Verify ([[Screen Index#s02|s02]]) and Claim your Pin ([[Screen Index#s06|s06]]), still inside the onboarding narrative with the ring progress indicator on screen. Professionals with a LinkedIn presence or a stack of cards; the "fill it in myself" path must stay one tap away at every step.

## Stories

### S1 · Start from ([[Screen Index#s03|s03]])

**As a** new user **I want** to choose where my profile starts from **so that** I type as little as possible.

Acceptance criteria:
- [ ] Four options: Import from LinkedIn (→ s04), Scan a paper business card (→ s03a), Behance or a portfolio URL (→ s03b), Fill it in myself (→ s06).
- [ ] Options whose backend does not exist are visible but marked "coming soon" and do not navigate; "Fill it in myself" always works.
- [ ] The ring progress indicator keeps its position; this step does not fill a segment until the import is confirmed or skipped.

### S2 · Importing from LinkedIn ([[Screen Index#s04|s04]])

**As a** new user **I want** to hand off to LinkedIn and come back with my profile **so that** my name, headline, company and photo are filled in.

Acceptance criteria:
- [ ] OAuth hand-off, return, then an "importing" state while candidate fields are fetched.
- [ ] "Skip and fill it in myself" is available during the wait and leads to s06 without writing anything.
- [ ] OAuth cancelled or failed, and permissions denied, each show a message and return to s03.
- [ ] Nothing is written to the profile on this screen; the result goes to s05.

### S3 · Scan a card ([[Screen Index#s03a|s03a]])

**As a** new user **I want** to photograph my business card **so that** the printed fields become my profile.

Acceptance criteria:
- [ ] Camera view with a card guide; "Use this card" sends the image for recognition and continues to s05 with the candidates; "Type it in instead" goes to s06.
- [ ] Camera permission denied shows the fallback copy and the manual path.
- [ ] The card image is treated as a temporary upload; it is not attached to any Ring.

### S4 · Portfolio URL ([[Screen Index#s03b|s03b]])

**As a** new user **I want** to paste my Behance or portfolio link **so that** my headline, bio and links are proposed from it.

Acceptance criteria:
- [ ] URL field with client validation (absolute `http(s)`); "Import from this site" continues to s05; "Skip for now" goes to s06.
- [ ] A site that returns nothing usable shows "We couldn't read this page" and the manual path.

### S5 · Review import ([[Screen Index#s05|s05]])

**As a** new user **I want** to see every imported field with an include / skip toggle and edit it inline **so that** nothing lands on my profile without my say.

Acceptance criteria:
- [ ] Elements per §3.3: imported avatar, full name, headline / role, company, location, and a list of importable fields, each with a toggle and an editable value. Only the main profile's fields (headline, role, company, location, photo, bio) and the full name are imported; nothing else is added to the profile.
- [ ] The relationship imported data → main profile → every Ring is shown structurally (a short "your Rings start from this" strip); the first Ring shows these values because it follows the main profile, not because the import wrote to it.
- [ ] "Confirm & continue" writes only the included fields and proceeds to s06; "Skip" proceeds to s06 with nothing written.
- [ ] Partial import (some fields unavailable) shows the missing ones as empty and editable; nothing returned falls back to the manual path.
- [ ] Imported fields animate into their slots as a continuous "assembling your profile" sequence.

### S6 · Fall back to manual (journey, [[Screen Index#s06|s06]])

**As a** new user whose import failed **I want** to continue to the Pin name without losing progress **so that** onboarding never dead-ends.

Acceptance criteria:
- [ ] Every import screen has a one-tap route to s06.
- [ ] Full name typed later on s06 is sent as `fullName` on `POST /auth/complete-registration`, the only profile field registration accepts today.

## States and motion the design asks for

- State (§3.2, §3.3): OAuth cancelled / failed, permissions denied, importing, partial import, nothing returned, edit-before-import.
- Motion: the LinkedIn import assembly, imported fields animating into a profile being built, is signature motion 3 in §14 of the [[Wireframe Brief]]. Reduced motion: fields appear together with a fade.
- Motion: the ring progress indicator stays as the shared anchor across s03 → s05.

## Rules the backend already enforces

- Only `SocialIdentity` has a table; there is no import, review or confirm endpoint, no OCR and no scraping. Nothing in this feature can be called yet.
- Registration accepts `fullName` only; headline, role, company, location, the main photo and the main bio do not exist on `Profile` yet. [[D-02 One main profile every Ring starts from]] puts them there; until that is built, imported values have nowhere to go, and writing them to a Ring projection instead is not what was decided.
- Whatever the import writes must go through `ProfileService` (Pin-name uniqueness, default profile) and `RingProfileService` (the first Ring's projection); the import must never bypass them.

## Open questions

- Decided: [[D-02 One main profile every Ring starts from]]. S5 still waits for the main profile fields to be built (not ticketed yet).
- Which main-profile fields an import may overwrite without asking, when the profile already has values (D-02, *Still open*).
- Provider choice for card OCR and URL scraping ([[T-020b Business card scan and portfolio URL import]]) — blocks S3 and S4.
- Whether a LinkedIn login (not only import) is offered on s01 depends on [[ND-01 Passwordless login]] and [[Linked Accounts (OAuth) Story|Linked Accounts (OAuth) · S7]].
