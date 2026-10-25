---
type: story
code: gemma
scope: feature
feature: gemma
module: platform
status: draft
screens: [s13, s60]
created: 2026-10-18
updated: 2026-10-25
owner: "omar"
related: ["DR-06 Yearly rename, old name freed, case-insensitive"]
tags: [story, story/draft, module/platform, layer/business]
---

# Gemma AI · User Story

**Feature:** [[Gemma AI]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Gemma AI Frontend Requirements]] · **API Integration:** not yet (backend not built)

Gemma is the assistant that sits across the app rather than in a tab: a sheet opened from Home, a suggestion inside the accept flow, a list of matches at an event, and small nudges wherever a name or a bio is typed. The user is asking "what should I do next" about their Rings, their connections and their meetings, and the one rule that makes Gemma safe in this product is that she may only see what the asking user may see. Nothing is built; the schema for sessions, messages, actions and match results exists.

## Persona

A personal user on Home (Free, or Pro for automation), and the same user in event mode looking for the right five people to meet. Pro gates Smart Match and any action Gemma takes on the user's behalf.

## Stories

### S1 · Open the Gemma sheet from Home ([[Screen Index#s13|s13]])

**As a** user on Home **I want** "Ask Gemma" to open a context-aware sheet **so that** I get suggestions about the Ring and screen I am on, not a generic chat.

Acceptance criteria:
- [ ] The sheet opens over s12 with the context set to the active Ring; its entry affordance is the same wherever Gemma appears ([[Wireframe Brief#Gemma|§13]]).
- [ ] Suggestions arrive as cards with one action each; a card that would change a Ring or send something is marked "needs your confirmation".
- [ ] "Later" dismisses to s11 with nothing changed.

### S2 · Suggest a Ring on accept ([[Screen Index#s13|s13]])

**As a** user accepting a connection **I want** Gemma to propose which Ring to put the person in **so that** I pick the right perspective in one tap.

Acceptance criteria:
- [ ] The card names a Ring from the user's own list with a reason that reveals nothing about the other person beyond what the user already sees.
- [ ] "Accept into Clients" goes to s46 with that Ring pre-selected; the actual grant is made there by [[Connections]], never by Gemma.

### S3 · Meeting actions from the sheet ([[Screen Index#s13|s13]])

**As a** user with meetings **I want** Gemma to surface "open meeting" and "reschedule" **so that** meeting admin is one tap from Home.

Acceptance criteria:
- [ ] "Open meeting" and "Reschedule" both go to s67 for that meeting; the change is made on s67 by [[Meetings]].
- [ ] A meeting the user cannot see never appears, even as a hint.

### S4 · Smart Match at an event ([[Screen Index#s60|s60]])

**As a** Pro user in event mode **I want** a ranked list of people and exhibitors worth meeting, with Strong / Good / Weak strength **so that** I spend the event on the right conversations.

Acceptance criteria:
- [ ] Each card shows the match strength and human-readable reasons that never name a private interest ("shared industry", not which one).
- [ ] Cards surface and stack by strength; the list only includes people and exhibitors registered for the event and visible to the user.
- [ ] A Free user sees the entry point with an upgrade prompt, not the list.

### S5 · Request a meeting from a match ([[Screen Index#s60|s60]])

**As a** Pro user **I want** "Request meeting" on a card to open the slot-based request **so that** acting on a match is continuous.

Acceptance criteria:
- [ ] "Request meeting" goes to s59 pre-filled with the matched person; the request is sent by [[Meetings]].
- [ ] Gemma may auto-send requests only after an explicit per-batch confirmation; each sent request is recorded as an executed AI action.

### S6 · Suggestions while typing

**As a** user choosing a Pin name, naming a Ring or writing a bio **I want** Gemma to offer options **so that** blank fields are easier.

Acceptance criteria:
- [ ] Pin-name suggestions are derived **only from the user's own name** (what they typed and their full name), the only input Gemma gets for them, and checked for availability one at a time; none is derived from other users' names ([[DR-06 Yearly rename, old name freed, case-insensitive]]). Suggestions that differ from a taken name by capitals only are never offered: names ignore capitals.
- [ ] On a rename, suggestions are offered only when a rename is allowed (once a year, [[Profiles & Pin Name Story]] S5).
- [ ] Bio rewrite and Ring-name suggestions are offered inline and never applied without a tap.

## States and motion the design asks for

- State: sheet idle, loading, suggestions, "needs confirmation", Pro upsell; Smart Match empty (no event), loading, list, Free locked ([[Wireframe Brief#Smart Match|§8.4]], [[Wireframe Brief#Gemma|§13]]).
- Motion: the sheet rises over the current screen; match cards surface and stack by strength; accepting a suggestion flows straight into the slot-based meeting request.

## Rules the backend already enforces

- Nothing is built. The schema fixes the shape: `AiSession` has a `contextType` (PROFILE, RING, EVENT, MEETING, DISCOVERY); `AiAction` types are SUGGEST_RING, SUGGEST_RING_MERGE, SUGGEST_LINK_CHANGE, INTRODUCE_FRIENDS, SEND_MEETING_REQUEST, SUGGEST_EXHIBITOR, SUGGEST_ATTENDEE; sensitive actions start at `AWAITING_CONFIRMATION`.
- `MatchResult.reasons` are scrubbed of the private interests that produced them; interests never have an outward entity ([[Interests]]).
- Every suggestion is scoped by [[Ring Access Engine]]; every AI action is audited ([[Audit Log]]).

## Open questions

- Decided: [[DR-06 Yearly rename, old name freed, case-insensitive]] (S6). Whether the suggestions come from Gemma or from a plain server rule is not decided; either way the input is the person's own name only.
- [[T-051 Gemma assistant sheet and suggestions]] needs a model and provider decision; no decision note exists for it yet.
