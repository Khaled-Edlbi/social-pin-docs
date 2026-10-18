---
type: story
code: pincast
scope: feature
feature: pincast
module: discovery
status: draft
screens: [s11, s39, s40, s41, s42]
updated: 2026-10-18
tags: [story, story/draft, module/discovery, layer/business]
---

# PinCast & Nearby · User Story

**Feature:** [[PinCast & Nearby]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[PinCast & Nearby Frontend Requirements]] · **API Integration:** not yet (backend not built)

PinCast is "be findable, here, for a while": the user picks a Ring, a distance and a duration, and for that window people nearby who are also looking can find them and see that Ring's perspective. When it ends, the user gets a list of who was reached and can connect from it. Nearby is the other direction: "who around me is in a Ring I belong to". Both are bounded by distance and time, and neither ever hands anyone a coordinate.

## Persona

A **broadcaster**: a user at a venue, a co-working space or a conference floor who wants people around them to find them for the next 30 minutes through the right Ring (Clients, not Family). A **recipient**: a user with PinCast discovery on, who sees a broadcaster appear and may open their view and connect. The same person is usually both.

## Stories

### S1 · PinCast · hidden ([[Screen Index#s39|s39]])

**As a** user opening PinCast, **I want** to see that I am hidden and start with my last settings in one tap, **so that** going visible is fast.

Acceptance criteria:
- [ ] The screen states *Hidden* plainly, with the last-used settings as a one-tap action ("Go visible · Clients, 30 min") and *Change* to s41.
- [ ] Location permission: when missing, the primary action requests it and the screen explains that location is used only while a PinCast is live and is never shown to others.
- [ ] A first-time user with no previous settings sees *Set up a PinCast* leading to s41 instead of the one-tap action.

### S2 · PinCast setup ([[Screen Index#s41|s41]])

**As a** broadcaster, **I want** to pick the Ring, the distance and the duration, **so that** only the right people, close enough, for a bounded time, can find me.

Acceptance criteria:
- [ ] Ring picker over my live Rings (name, colour), default Ring preselected; Event and Meeting Rings are offered only while that event or meeting is current.
- [ ] Distance and duration are chosen from fixed steps (the backend defines the allowed values and maximums); the screen shows the resulting sentence "Visible to people within 200 m for 30 min through Clients".
- [ ] *Start PinCast* creates the broadcast with the device's current position and opens s40; a position older than a minute is refreshed first.
- [ ] Opened from s40 via *Change Ring or range*, saving restarts the broadcast with the new settings and the remaining time.

### S3 · PinCast · live ([[Screen Index#s40|s40]])

**As a** broadcaster, **I want** a live screen with the countdown and the people found so far, **so that** I can act while it is still happening.

Acceptance criteria:
- [ ] A ripple animation while live, the Ring name, the remaining time as a countdown computed from the server's end time, and the list of recipients detected so far (name, Pin name, avatar placeholder, detected-at).
- [ ] Tapping a recipient opens their view (s44): what they share with me, which may be nothing but a name.
- [ ] *Stop* ends the broadcast now and goes to s42; *Change Ring or range* goes to s41.
- [ ] The device keeps reporting its position while live at the interval the backend asks for; leaving the app does not stop the broadcast, the countdown does.
- [ ] The list grows without a manual refresh (polling until push exists); new rows animate in.

### S4 · Home · Broadcasting ([[Screen Index#s11|s11]])

**As a** broadcaster back on Home, **I want** a visible "Broadcasting" state with the remaining time and a *Stop*, **so that** I never forget that I am findable.

Acceptance criteria:
- [ ] Home shows a chip with the Ring name and the countdown while live; tapping it opens s40; *Stop* ends it in place and Home returns to Idle (s12).
- [ ] The chip disappears on its own when the time runs out, and a "PinCast ended, see results" notification leads to s42.

### S5 · PinCast results ([[Screen Index#s42|s42]])

**As a** broadcaster whose PinCast ended, **I want** the list of everyone reached, **so that** I can connect with the people who matter and ignore the rest.

Acceptance criteria:
- [ ] The ended state shows the Ring, the window and the count, then the recipients with *Connect* on each (into [[Connections Story]] s46); a recipient who already requested me shows *Accept* instead.
- [ ] Ended-empty: "Nobody was nearby", with *Broadcast again* (s41) and *Done* (s11).
- [ ] The list never shows where anyone was, how far, or a map; detected-at is the only time shown.
- [ ] Results stay reachable from the notifications screen (s69) until the recipients are purged; after purge the screen shows the count only.

### S6 · Nearby by Ring (no prototype screen; [[Wireframe Brief#Nearby discovery|§6.2]])

**As a** recipient, **I want** a radar of people near me who are in a Ring I belong to, filtered by Ring, **so that** I notice a client or a colleague in the same room.

Acceptance criteria:
- [ ] A radar view with a Ring filter and a list fallback; pins populate on a sweep; selecting one expands it into the person's view card.
- [ ] Only people whose Ring I am a live member of appear, and only while they are broadcasting through that Ring; I never see someone because of a Ring of mine they are in.
- [ ] States: searching, none found, permission needed; no coordinates or distances beyond "nearby".
- [ ] A "pins nearby" notification is opt-in and off by default.

## States and motion the design asks for

- State: setup, live / countdown, ended-with-results, ended-empty; Home idle versus broadcasting; radar searching, none found, permission needed.
- Motion: the **broadcast ripple**, continuous concentric waves while live; on end the waves **collapse into the results list**; the **radar sweep** populates pins; selecting a pin expands it into a profile card; reduced-motion fallback is a static ring and a fade.

## Rules the backend already enforces

- `pincasts.geo` is a PostGIS geography kept by trigger with a GiST index; `PincastRecipient.detectedAt` is indexed for purging by [[Cleanup Jobs]]; nothing is served from these yet.
- Every "who can see whom" question goes through `RingAccessService`: a recipient sees the broadcaster's Ring projection only if they are a live member of that Ring, or get the neutral 404; a blocked pair sees nothing either way.
- Opening a recipient from s40 / s42 is `GET /views/user/:userId/perspectives` or `/views/pin`, which returns what *they* share with *me*, possibly an empty list.
- `RingProfileViewEntity` carries no Ring id; a recipient never learns which Ring they were reached through.
- The results list is the broadcaster's; the recipients' coordinates are never returned ([[Ring Access Model]]).

## Open questions

- [[T-032 PinCast setup, start, stop, results]] — the allowed distance and duration steps, how a recipient's device reports its position (interval, background), whether a recipient must be in a Ring of the broadcaster to be *reached* or only to *see*, and the purge delay that bounds S5's last bullet.
- [[T-045 NotificationService.emit and the inbox]] — "PinCast ended" and "pins nearby"; until then s42 is reached from s40 only.
- [[T-046 Push delivery and preferences]] — replaces polling on s40 and the opt-in of S6.
