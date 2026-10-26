---
type: story
code: T-079
scope: task
feature: profiles
module: identity
status: draft
screens: [s06, s68]
depends: ["D-06 Yearly rename, old name freed, case-insensitive"]
affects: []
related: ["D-06 Yearly rename, old name freed, case-insensitive", "Profiles & Pin Name Backend Integration", "Badge & QR", "ND-12 What the badge QR encodes", "T-063 Put the ErrorCode on the error body"]
pending: []
approvedBy: ""
approvedAt: ""
created: 2026-10-26
updated: 2026-10-26
owner: "Omar Fostok"
tags: [story, story/draft, module/identity, layer/business]
task: T-079
---

# T-079 · Enforce the once-a-year Pin name rename · User Story

**Task:** [[T-079 Enforce the once-a-year Pin name rename]] · **Feature:** [[Profiles & Pin Name]] · **Feature-level note:** [[Profiles & Pin Name Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-079 Frontend Requirements]] · **Backend Integration:** [[T-079 Backend Integration]] · **Verified by:** [[T-079 QA Backend]], [[T-079 QA Frontend]]

A person who claimed a Pin name can change it, but not on a whim: once a year, so the name others scan and type stays stable, as [[D-06 Yearly rename, old name freed, case-insensitive]] decided. `approved` (👍) when product signs off (`approvedBy`, `approvedAt`); `verified` (✅ Fulfilled) set by the PM once every QA note of its scope is `passing` with nothing pending.

## Persona

A **personal user** on the profile editor, months after sign-up, who wants a new handle: after a rebrand, a typo, or a name that no longer fits.

## Stories

### S1 · Change my Pin name (profile editor, from [[Screen Index#s68|s68]])

**As a** signed-in user **I want** to change my Pin name and know when I can change it again **so that** I am never surprised by a refusal.

Acceptance criteria:
- [ ] The first rename after sign-up is allowed (claiming at s06 is not a rename); `PATCH /profiles/:id { pinName }` still checks the name is free (409 `E_PROFILE_02`).
- [ ] After a rename, the profile says when the next one is allowed; the editor shows it next to the name ("You can change it again on 26 Oct 2027").
- [ ] A rename within a year of the last one is refused with its own error code; the editor says "You can change your Pin name once a year. Next change: <date>." and keeps the current name.
- [ ] A change of capitals only is not a rename and is not counted.
- [ ] The old name is free for anyone at once, as today; nothing redirects to the new one.

### S2 · Claim at sign-up ([[Screen Index#s06|s06]])

**As a** new user **I want** the "once a year" promise to be true **so that** I choose carefully, knowing I can still change it once.

Acceptance criteria:
- [ ] s06's copy stays "You can change it once a year."; claiming the name does not start the year.

## States and motion the design asks for

- Editor: the Pin-name row shows the next allowed date when it is in the future, nothing extra otherwise.
- Refused rename: the message under the field; the field keeps the current name.

## Rules the backend already enforces

- Pin names are unique globally and ignore capitals (`pinNameNormalized`); 3–30 letters, digits, `.`, `_`; sent without the `!` ([[Profiles & Pin Name Backend Integration]]).
- A handle change re-checks uniqueness in the same transaction as the write.

## Open questions

- D-06 left open whether the year starts at sign-up or at the first rename; this task takes the natural reading (first rename free). Product can say otherwise before the task starts.
- What a printed badge or saved link does after its name is released: [[Badge & QR]], [[ND-12 What the badge QR encodes]].
