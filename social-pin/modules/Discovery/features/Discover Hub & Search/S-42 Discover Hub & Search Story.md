---
type: story
code: discover-hub
scope: feature
feature: discover-hub
module: discovery
status: approved
screens: [s38]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-28
tags: [story, story/approved, module/discovery, layer/business]
---

# Discover Hub & Search · User Story

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-19 Discover Hub & Search Frontend Requirements]] · **API Integration:** not yet (backend not built)

Discover is the tab for finding something on purpose: a person whose Pin name you were given, an event, a company, an exhibitor, the people around you, or the contacts already on your phone. It is not a feed and it does not browse strangers. Search here means "resolve the exact `!pinname` I typed", and the answer is whatever that person shares with me, or one neutral "not available".

## Persona

A **personal user** with a name in mind ("she said `!tareknassar`") or a goal in mind (find the event, start a PinCast), opening the Discover tab (s38). Also a **visitor at an event** reaching the exhibitors list from here. Gemma is the same search field in conversational form and is not available yet.

## Stories

### S1 · The hub ([[Screen Index#s38|s38]])

**As a** user opening Discover, **I want** one screen with a search field and the entry points, **so that** I reach the right tool in one tap.

Acceptance criteria:
- [ ] Top: a field labelled "Ask Gemma or Discover" with the `!` prefix hinted; below: tiles for People (s45), Events (s48), Companies (s72), Exhibitors (s54), PinCast (s39) and Import contacts (s03).
- [ ] Tiles that lead to features not yet built open their screen in its "not available yet" state rather than hiding the tile.
- [ ] Recent searches render under the field when it is empty and there is at least one.
- [ ] The tab restores its scroll and last query on return within the session.

### S2 · Search by `!pinname` ([[Screen Index#s38|s38]] → [[Screen Index#s44|s44]])

**As a** user who was given a Pin name, **I want** to type it and open that person, **so that** I see what they share with me.

Acceptance criteria:
- [ ] Submit resolves the exact name (with or without the leading `!`, case-insensitive) and opens the Scanned Pin screen (s44) with the resolved view.
- [ ] There is no autocomplete, no partial match and no suggestions from other users' names; typing shows nothing until submit.
- [ ] Unknown name, not shared with me, or blocked: one inline message "This Pin isn't available to you"; the field keeps the text so a typo can be fixed.
- [ ] A company or exhibitor Pin name (for example `!vertexlabs`) opens its own screen (s55) when that resolves to a business; until businesses exist, every resolve lands on s44.
- [ ] Submitting my own Pin name opens my own default Ring's view marked as a preview.

### S3 · Recent searches ([[Screen Index#s38|s38]])

**As a** user, **I want** my recent searches kept, **so that** a person I looked up last week is one tap away.

Acceptance criteria:
- [ ] Only searches that resolved are stored, newest first, deduplicated by name, capped at 20; a failed lookup is never stored (it would record a guessed name).
- [ ] Each entry shows the Pin name and the display name at the time of the search; tapping re-resolves (the answer may have changed since).
- [ ] Swipe to remove one; *Clear all*; the list is private to the signed-in user and synced across their devices.
- [ ] An entry whose re-resolve now fails stays in the list with the neutral message; it is not removed automatically.

### S4 · Ask Gemma ([[Screen Index#s38|s38]])

**As a** user, **I want** to ask the same field a question ("who did I meet at TechSummit?"), **so that** discovery works in my words.

Acceptance criteria:
- [ ] A query that does not start with `!` is treated as a Gemma prompt and opens the assistant sheet.
- [ ] Not available yet: the sheet opens in a "coming soon" state and offers the `!` search instead; nothing is sent.

### S5 · Import contacts ([[Screen Index#s38|s38]] → [[Screen Index#s03|s03]])

**As a** user, **I want** to find which of my phone contacts are on Social Pin, **so that** I can connect with people I already know.

Acceptance criteria:
- [ ] Contacts permission is requested on the tile, with a sentence saying that only hashed emails and phone numbers leave the device.
- [ ] Results list only the matches; a match is shown as the person's view (what they share with me) with *Connect*; nobody who is not in my contacts is ever listed.
- [ ] Not available yet: the tile opens s03 in a "coming soon" state until the privacy review is done.

### S6 · Discover search by !pinname and recent searches

*From T-030 (status then: To do), merged 2026-10-27.*

Exact-name resolve reuses `GET /views/pin`. Recent searches stored per user. No fuzzy search over other users' names.

Screens: [[Screen Index#s38|s38]] Discover hub


### S7 · Import contacts

*From T-031 (status then: Needs a decision), merged 2026-10-27.*

Match hashed emails / phones against users; must not reveal who is on the platform beyond the match. Privacy review needed.

Screens: [[Screen Index#s38|s38]] Discover hub

## States and motion the design asks for

- State: hub idle, field focused with recent searches, resolving, resolved (hands over to s44), not available, Gemma coming soon, contacts permission needed.
- Motion: the brief gives the hub no signature motion; the handover to s44 reuses the profile-card reveal of the scan flow (QR-to-person) in its reduced form; tiles use the standard push transition.

## Rules the backend already enforces

- `GET /views/pin/:pinName` resolves the exact normalised handle and renders the default Ring if the viewer is in it, else the oldest Ring they can see; no profile, no live Ring, or a block all give the same 404 `E_RING_ACCESS_01` ([[F-12 View As & Pin Views]]).
- The response carries no `ringId`, no `userId`; a search result cannot tell the user which Ring they were resolved into.
- There is no fuzzy or partial lookup on other users' names, and Discover Hub & Search · S6 keeps it that way: search must not become a membership oracle.
- The Pin-name availability check (`GET /profiles/pin-name/:pinName/availability`, public) never says who holds a taken name and must not be used by Discover as a "does this person exist" probe.

## Open questions

- [[S-42 Discover Hub & Search Story|Discover Hub & Search · S6]] — whether recent searches are server-side (synced) or device-only; S3 assumes server-side and private.
- [[S-42 Discover Hub & Search Story|Discover Hub & Search · S7]] — the matching rule and what a match returns; S5 is disabled until the privacy review.
- [[S-89 Gemma AI Story|Gemma AI · S7]] — the assistant sheet behind S4.
- [[S-29 Companies Story|Companies · S6]] — whether a business has a Pin name that resolves on this field (the `!vertexlabs` path to s55).
