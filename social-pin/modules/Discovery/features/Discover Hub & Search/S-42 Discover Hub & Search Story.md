---
id: S-42
type: story
module: discovery
feature: discover-hub
status: approved
scope: feature
screens: [s38]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "Omar Fostok"
related: ["D-37 Discover opens a Pin by its exact Pin name in the MVP", "F-12 View As & Pin Views", "F-14 Connections", "F-15 Companies", "F-20 PinCast & Nearby", "F-36 Gemma AI"]
created: 2026-10-18
updated: 2026-11-12
tags: [story, story/approved, module/discovery, layer/business]
---

# Discover Hub & Search · User Story

> ⚠ Affected by [[S-29 Companies Story]] (2026-11-05): S-29 was rewritten as S1–S14 with its product rules decided inside the story (P1–P8, no decision cards). The old Companies · S6 (merged T-029) is gone: the list is S2, company detail S5, leave S9, and the business ↔ Ring link is decided as P2 (every company Ring carries its business; setup creates both). The domain shows as acme.co without Verified in the MVP (P6). Repoint the links that name Companies · S6.

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-19 Discover Hub & Search Frontend Requirements]] · **API Integration:** not yet (backend not built)

Discover is the tab for finding something on purpose: a person whose Pin name you were given, an event, a company, an exhibitor, the people around you, or the contacts already on your phone. It is not a feed and it does not browse strangers. Search here means "resolve the exact `!pinname` I typed", and the answer is whatever that person shares with me, or one neutral "not available".

**In the MVP** ([[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]], decided 2026-11-11 by Omar Fostok): S1, S2 and S3, so opening a Pin by its exact Pin name (`GET /views/pin/{pinName}`), "This Pin isn't available to you" under the field, and recent searches kept on the phone. **Later:** search by name, Gemma queries (S4), matching imported contacts (S5, S7), and a business Pin opening its company screen (S2).

## Persona

A **personal user** with a name in mind ("she said `!tareknassar`") or a goal in mind (find the event, start a PinCast), opening the Discover tab (s38). Also a **visitor at an event** reaching the exhibitors list from here. Gemma is the same search field in conversational form and is not available yet.

## Stories

### S1 · The hub ([[Screen Index#s38|s38]])

**As a** user opening Discover, **I want** one screen with a search field and the entry points, **so that** I reach the right tool in one tap.

Acceptance criteria:
- [ ] Top: the field "Open a Pin by name · !pinname" (it searches Pin names only; Gemma is later, S4). Below it, two cards: *PinCast* ("{count} nearby — go visible to see them", → [[Screen Index#s39|s39]]) and *Import contacts* ("LinkedIn, phone, a card"). Then **RECENT SEARCHES** (S3) and **BROWSE**: *People*, *Events*, *Companies*, *Exhibitors*.
- [ ] *People* opens Contacts, with "Requests · N" when someone is waiting ([[S-23 Connections Story|Connections · S8]]). *Events* switches to the Events tab, *Companies* opens My companies ([[Screen Index#s72|s72]]), and *Exhibitors* opens the exhibitors list ([[Screen Index#s54|s54]]).
- [ ] Entries for features not built yet are shown, not hidden: *Import contacts* says "Coming soon" and doesn't open (S5).
- [ ] Recent searches render under the field when there is at least one.
- [ ] The tab restores its scroll and last query on return within the session.

### S2 · Search by `!pinname` ([[Screen Index#s38|s38]] → [[Screen Index#s44|s44]])

**As a** user who was given a Pin name, **I want** to type it and open that person, **so that** I see what they share with me.

Acceptance criteria:
- [ ] Submit looks up the exact name (`GET /views/pin/{pinName}`; with or without the leading `!`, case-insensitive) before anything opens. A spinner shows under the field while it looks. When found, the person's card opens (s44) with the resolved view.
- [ ] There is no autocomplete, no partial match and no suggestions from other users' names; typing shows nothing until submit. Search by name is later (D-37).
- [ ] Unknown name, not shared with me, or blocked: one line under the field, "This Pin isn't available to you". The field keeps the text so a typo can be fixed, and typing again clears the line.
- [ ] Later (D-37): a company or exhibitor Pin name (for example `!vertexlabs`) opening its own screen (s55). In the MVP every resolve lands on s44.
- [ ] Submitting my own Pin name opens View as on my default Ring.
- [ ] Outside production builds only, a demo person's Pin name opens their sample card (they have no account). A production build never shows demo people.

### S3 · Recent searches ([[Screen Index#s38|s38]])

**As a** user, **I want** my recent searches kept, **so that** a person I looked up last week is one tap away.

Acceptance criteria:
- [ ] Only searches that opened are kept: newest first, one per name, at most 20. A failed lookup is never kept, because it would record a guessed name.
- [ ] Each entry shows the Pin name and the display name at the time of the search. Tapping looks the name up again, since the answer may have changed.
- [ ] Swipe to remove one; *Clear all* empties the list.
- [ ] **Kept on this phone, per user.** The list is tagged with the signed-in user, so another account on the phone reads none of it, and it is forgotten on sign-out. It isn't synced across devices: the API has no list.
- [ ] An entry whose lookup now fails stays in the list with the neutral message; it is not removed automatically.

### S4 · Ask Gemma ([[Screen Index#s38|s38]]) · later (D-37)

**As a** user, **I want** to ask the same field a question ("who did I meet at TechSummit?"), **so that** discovery works in my words.

Acceptance criteria:
- [ ] A query that does not start with `!` is treated as a Gemma prompt and opens the assistant sheet.
- [ ] Not available yet, and not in the MVP: the field searches Pin names only ("Open a Pin by name · !pinname"), and nothing is sent to Gemma.

### S5 · Import contacts ([[Screen Index#s38|s38]] → [[Screen Index#s03|s03]]) · later (D-37)

**As a** user, **I want** to find which of my phone contacts are on Social Pin, **so that** I can connect with people I already know.

Acceptance criteria:
- [ ] Contacts permission is requested on the tile, with a sentence saying that only hashed emails and phone numbers leave the device.
- [ ] Results list only the matches; a match is shown as the person's view (what they share with me) with *Connect*; nobody who is not in my contacts is ever listed.
- [ ] Not available yet, and not in the MVP: the *Import contacts* card says "Coming soon" and doesn't open s03 until the privacy review is done.

### S6 · Discover search by !pinname and recent searches

*From T-030 (status then: To do), merged 2026-10-27.*

Exact-name resolve reuses `GET /views/pin`. Recent searches are kept on the phone per user (S3; D-37), with no server store. No fuzzy search over other users' names.

Screens: [[Screen Index#s38|s38]] Discover hub


### S7 · Import contacts · later (D-37)

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

- ~~Whether recent searches are server-side or device-only~~: answered by D-37, they are kept on the phone, per user (S3).
- [[S-42 Discover Hub & Search Story|Discover Hub & Search · S7]] — the matching rule and what a match returns; S5 is disabled until the privacy review (later, D-37).
- [[S-89 Gemma AI Story|Gemma AI · S7]] — the assistant sheet behind S4 (later, D-37).
- [[S-29 Companies Story|Companies · S6]] — whether a business has a Pin name that resolves on this field (the `!vertexlabs` path to s55; later, D-37).
- Search by name: who may be found needs its own decision when it comes (D-37).

## Log

- 2026-11-12 · `tickets/pm/M-04-discovery/F-19-discover-hub/S-42-app-778d9b4` · rewritten to D-37's MVP scope:
  - S1 hub as the app has it;
  - S2 exact Pin name only, with the not-available line, my own Pin opening View as, and demo people only outside production;
  - S3 recent searches newest first, at most 20, swipe to remove, Clear all, kept on this phone per user (answers the open question);
  - S4, S5, S7, name search and the s55 path are later.

  Decided by Omar Fostok 2026-11-11, app 778d9b4. The story stays approved. Clears the D-37 flag.
- 2026-11-12 · flagged [[FR-19 Discover Hub & Search Frontend Requirements]]: the same; S1 hub entries, recent searches on the phone, demo people only outside production
