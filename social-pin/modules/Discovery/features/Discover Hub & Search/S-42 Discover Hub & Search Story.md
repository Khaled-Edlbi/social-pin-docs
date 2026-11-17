---
id: S-42
type: story
module: discovery
feature: discover-hub
status: draft
scope: feature
screens: [s38, s44, s68]
owner: "Omar Fostok"
related: ["D-41 Discover searches people by part of their Pin name", "D-37 Discover opens a Pin by its exact Pin name in the MVP", "D-15 Several Rings per connection, remove or disconnect", "S-01 Account Story", "S-23 Connections Story", "S-29 Companies Story", "F-12 View As & Pin Views", "F-14 Connections", "F-15 Companies", "F-20 PinCast & Nearby", "F-36 Gemma AI"]
created: 2026-10-18
updated: 2026-11-17
tags: [story, story/draft, module/discovery, layer/business]
---

# Discover Hub & Search · User Story

**Feature:** [[F-19 Discover Hub & Search]] · **Status:** Draft, rewritten 2026-11-17 to [[D-41 Discover searches people by part of their Pin name|D-41]] (was approved 2026-10-25 by khaled) · **Frontend Requirements:** [[FR-19 Discover Hub & Search Frontend Requirements]] · **API Integration:** [[BI-19 Discover Hub & Search Backend Integration]] (the exact-name lookup only; the search is not built yet) · **Design:** [Discover search, 8 screens](https://claude.ai/artifact/VtuKA2ezgz1snhMbBUmSbd)

Discover is the tab for finding someone on purpose: a person whose Pin name you know or partly remember, an event, a company, an exhibitor, the people around you. You type part of a Pin name and see who matches. Someone who has you in one of their Rings opens as their card. Anyone else shows only the name and photo they signed up with, and a Connect button, so you can ask to connect without seeing anything they share in their Rings.

**In the MVP** ([[D-41 Discover searches people by part of their Pin name|D-41]], decided 2026-11-17 by Omar Fostok, replacing [[D-37 Discover opens a Pin by its exact Pin name in the MVP|D-37]]'s exact-name rule): S1–S5. **Later** (D-37, unchanged): Gemma queries (S6), matching imported contacts (S7), and a business Pin opening its company screen.

## Persona

A **personal user** with a name in mind ("she's `!tarek…` something") or a goal in mind (find the event, start a PinCast), opening the Discover tab (s38). Also a **visitor at an event** reaching the exhibitors list from here. And **the person being searched for**, who decides whether strangers can find them (S5).

## Stories

### S1 · The hub ([[Screen Index#s38|s38]])

**As a** user opening Discover, **I want** one screen with a search field and the entry points, **so that** I reach the right tool in one tap.

Acceptance criteria:
- [ ] Top: the field **"Search by Pin name"** (it searches Pin names only; Gemma is later, S6). Below it, two cards: *PinCast* ("{count} nearby — go visible to see them", → [[Screen Index#s39|s39]]) and *Import contacts* ("LinkedIn, phone, a card"). Then **RECENT SEARCHES** (S3) and **BROWSE**: *People*, *Events*, *Companies*, *Exhibitors*.
- [ ] *People* opens Contacts, with "Requests · N" when someone is waiting ([[S-23 Connections Story|Connections · S8]]). *Events* switches to the Events tab, *Companies* opens My companies ([[Screen Index#s72|s72]]), and *Exhibitors* opens the exhibitors list ([[Screen Index#s54|s54]]).
- [ ] Entries for features not built yet are shown, not hidden: *Import contacts* says "Coming soon" and doesn't open (S7).
- [ ] Recent searches render under the field when there is at least one; while a search is shown (S2), they are hidden.

### S2 · Search by part of a Pin name ([[Screen Index#s38|s38]] → [[Screen Index#s44|s44]])

**As a** user who knows or partly remembers someone's Pin name, **I want** to type part of it and see who matches, **so that** I can open their card or ask to connect.

Acceptance criteria:
- [ ] The search runs **as I type, from 3 letters**. A leading `!` or `@` is ignored, and case doesn't matter. It matches Pin names only, never display names or anything shared in a Ring.
- [ ] Results come **20 per page**; the next page loads when I reach the bottom of the list (S4).
- [ ] **Four kinds of row:**
  - **Connected**: someone who has me in one of their Rings. The row shows their card's name and photo, and a tap opens their card (s44), as today.
  - **Not connected**: only their account name and photo (from sign-up, nothing from their Rings), their Pin name, and **Connect**. The row doesn't open their card.
  - **Requested**: after I tap Connect, or when my request is already waiting, the button reads **Requested** and does nothing more.
  - **Asked to connect**: someone who sent me a request shows "Asked to connect" with **Accept**. Accept accepts their request as on [[S-23 Connections Story|Connections · S5]], and the row becomes Connected.
- [ ] **Connect** sends the normal connection request ([[S-23 Connections Story|Connections · S2]]), and "Request sent." confirms it (S4).
- [ ] **No photo:** a person outline. **No name:** the Pin name is shown as the name.
- [ ] **Never shown:** blocked people, whichever side blocked, and myself.
- [ ] **Who is found** is set by S5: anyone, unless they turned off "Let people find me by Pin name". Then only people already in their Rings find them.
- [ ] Outside production builds only, demo people (they have no account) can appear and open their sample card. A production build never shows demo people.
- [ ] Later (D-37): a company or exhibitor Pin name (for example `!vertexlabs`) opening its own screen (s55). In the MVP every card opens on s44.

### S3 · Recent searches ([[Screen Index#s38|s38]])

**As a** user, **I want** my recent searches kept, **so that** a person I looked up last week is one tap away.

Acceptance criteria:
- [ ] Only people whose card opened are kept: newest first, one per name, at most 20. Typed text and people I only saw in the results are never kept.
- [ ] Each entry shows the Pin name and the display name at the time. Tapping opens that person again, read afresh, since what they share may have changed.
- [ ] Swipe to remove one; *Clear all* empties the list.
- [ ] **Kept on this phone, per user.** The list is tagged with the signed-in user, so another account on the phone reads none of it, and it is forgotten on sign-out. It isn't synced across devices: the API has no list.
- [ ] An entry that no longer opens stays in the list with the neutral message "This Pin isn't available to you"; it is not removed automatically.

### S4 · The search's states ([[Screen Index#s38|s38]])

**As a** user, **I want** the search to say what it is doing, **so that** I'm never left looking at a blank list.

Acceptance criteria:
- [ ] **Fewer than 3 letters:** no search runs, and a hint says to type at least 3 letters.
- [ ] **Searching:** shimmer rows stand in for the results.
- [ ] **No matches:** "No Pin names match …", with what I typed.
- [ ] **No connection** (offline, no answer): said in place of the results, with **Try again**.
- [ ] **The next page:** a loading row under the results while it loads. If it fails, a row there says so and lets me try again, and the results already shown stay.
- [ ] **Request sent.:** a short confirmation after Connect; the row then reads Requested.

### S5 · "Let people find me by Pin name" (Me › Privacy, [[Screen Index#s68|s68]])

**As a** person who could be found, **I want** to choose whether strangers can find me by my Pin name, **so that** I decide who reaches me.

Acceptance criteria:
- [ ] A switch, **"Let people find me by Pin name"**, on the Privacy screen (Me › Privacy, [[S-01 Account Story|Account · S1]]), under **PEOPLE**. On by default.
- [ ] Under it, what a stranger sees: only my account name and photo from sign-up and a Connect button, never anything I share in my Rings.
- [ ] **On:** anyone can find me in Discover (S2).
- [ ] **Off:** only people already in my Rings find me.
- [ ] Blocked people never find me, whichever way the switch is set.

### S6 · Ask Gemma ([[Screen Index#s38|s38]]) · later (D-37)

**As a** user, **I want** to ask the same field a question ("who did I meet at TechSummit?"), **so that** discovery works in my words.

Acceptance criteria:
- [ ] A query that does not start with `!` is treated as a Gemma prompt and opens the assistant sheet.
- [ ] Not available yet, and not in the MVP: the field searches Pin names only, and nothing is sent to Gemma.

### S7 · Import contacts ([[Screen Index#s38|s38]] → [[Screen Index#s03|s03]]) · later (D-37)

**As a** user, **I want** to find which of my phone contacts are on Social Pin, **so that** I can connect with people I already know.

Acceptance criteria:
- [ ] Contacts permission is requested on the tile, with a sentence saying that only hashed emails and phone numbers leave the device.
- [ ] Results list only the matches, shown as in S2 (a card for someone who has me in a Ring, name, photo and Connect for others); nobody who is not in my contacts is ever listed.
- [ ] The matching (hashed emails and phone numbers against users) needs a privacy review before it ships.
- [ ] Not available yet, and not in the MVP: the *Import contacts* card says "Coming soon" and doesn't open s03 until the privacy review is done.

## States and motion the design asks for

- State: the hub with recent searches, fewer than 3 letters, searching (shimmer), results, the next page loading or failing, no matches, no connection with Try again, Request sent., the Privacy switch. The 8 screens are in the [design](https://claude.ai/artifact/VtuKA2ezgz1snhMbBUmSbd).
- Motion: the brief gives the hub no signature motion; opening a card reuses the profile-card reveal of the scan flow (QR-to-person) in its reduced form; tiles use the standard push transition.

## What the decision allows

- **Search by part of a Pin name**, and only by Pin name: as you type, from 3 letters, 20 per page (D-41).
- **Anyone can be found,** unless they turned the switch off (S5). Off, only people already in their Rings find them.
- **A stranger sees only the account name and photo** from sign-up, the Pin name, and their relationship to me (Connect, Requested, Asked to connect). Nothing from any Ring, and no way to open their card.
- **A card opens only for someone who has me in one of their Rings,** with what that Ring shows me. Which Ring it is is never said: the view of my oldest live membership in their Rings ([[D-15 Several Rings per connection, remove or disconnect|D-15]], [[F-12 View As & Pin Views]]).
- **Blocked people never appear,** whichever side blocked, and I never see myself.
- The Pin-name availability check (`GET /profiles/pin-name/:pinName/availability`) is for choosing a Pin name; Discover never uses it.

## What the backend has to build

What exists today is `GET /views/pin/:pinName`: an exact name, answered only when I'm in one of that person's Rings ([[BI-19 Discover Hub & Search Backend Integration|BI-19]]). The search needs:

1. A search by part of a Pin name, paged 20 at a time.
2. Each result carries:
   - the Pin name;
   - the account name and photo;
   - the relationship to me (connected, requested, asked me);
   - whether the row opens a card.
3. Blocked people (either side), the searcher, and people with the switch off who don't have the searcher in a Ring are never returned.
4. The setting "Let people find me by Pin name" on the account, on by default, read and changed from Me › Privacy.
5. Connect and Accept from a result use the connection request routes of [[S-23 Connections Story|S-23]].

## Open questions

From [[D-41 Discover searches people by part of their Pin name|D-41]]'s *Still open*:

- **Matching:** whether part of a name matches anywhere in the Pin name or only at the start, and how results are ordered.
- **An exact Pin name:** whether typing one still opens that card directly, or only lists it.
- **Turning the switch off:** whether it applies at once to searches already shown, and whether someone with a waiting request still finds me.
- **Abuse:** a rate limit, so that walking every 3-letter part can't list everyone.
- **The account name and photo:** whether the backend keeps them apart from the Ring profiles today (`/backend`).

Later, from D-37:

- S7: the matching rule and what a match returns; disabled until the privacy review.
- [[S-89 Gemma AI Story|Gemma AI · S7]]: the assistant sheet behind S6.
- [[S-29 Companies Story#Open questions|Companies · Open questions]]: whether a business has a Pin name that opens its company screen (the `!vertexlabs` path to s55).

## Log

- 2026-11-12 · `tickets/pm/M-04-discovery/F-19-discover-hub/S-42-app-778d9b4` · rewritten to D-37's MVP scope:
  - S1 hub as the app has it;
  - S2 exact Pin name only, with the not-available line, my own Pin opening View as, and demo people only outside production;
  - S3 recent searches newest first, at most 20, swipe to remove, Clear all, kept on this phone per user (answers the open question);
  - S4, S5, S7, name search and the s55 path are later.

  Decided by Omar Fostok 2026-11-11, app 778d9b4. The story stays approved. Clears the D-37 flag.
- 2026-11-12 · flagged [[FR-19 Discover Hub & Search Frontend Requirements]]: the same; S1 hub entries, recent searches on the phone, demo people only outside production
- 2026-11-16 · `tickets/pm/M-04-discovery/F-19-discover-hub/S-42-tidy` · tidied: S1's "restores its scroll and last query" removed (decided by Omar Fostok 2026-11-16, not needed; the app doesn't do it); S6 and S7 (merged T-030, T-031) folded in, S7's no-reveal and privacy-review rule now an S5 criterion; the offline / no-answer state added (said under the field, the name can be sent again, app 778d9b4); the Companies · S6 link repointed to S-29's Open questions, the S6 and S7 self-links to S2 and S5; cleared the S-29 flag. The story stays approved (records decisions already made). Flagged [[FR-19 Discover Hub & Search Frontend Requirements]] and [[BD-19 Discover Hub & Search Backend Delivery]]
- 2026-11-17 · `tickets/pm/M-04-discovery/F-19-discover-hub/S-42-pin-name-search` · rewritten to [[D-41 Discover searches people by part of their Pin name|D-41]] (decided by Omar Fostok 2026-11-17) and back to **draft**, since it changes what was approved:
  - S1 the field reads "Search by Pin name";
  - S2 search by part of a Pin name, with the four kinds of row;
  - S3 recent searches unchanged;
  - S4 the search's states (new);
  - S5 "Let people find me by Pin name" (new);
  - Gemma is now S6 and Import contacts S7, both later.

  "Rules the backend already enforces" is replaced by *What the decision allows* and *What the backend has to build*; the Ring the card shows is the oldest live membership (D-15). The no-partial-match and submit-only rules and "my own Pin name opens View as" are removed (I never see myself), and D-41's Still open is added to the open questions. The design is linked. Clears the D-41 and FR-19 flags. Flagged [[FR-19 Discover Hub & Search Frontend Requirements]], [[BD-19 Discover Hub & Search Backend Delivery]], [[BI-19 Discover Hub & Search Backend Integration]] and [[S-01 Account Story]]
