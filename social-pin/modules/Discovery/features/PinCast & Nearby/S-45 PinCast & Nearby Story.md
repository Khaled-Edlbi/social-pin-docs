---
id: S-45
type: story
module: discovery
feature: pincast
status: approved
scope: feature
screens: [s11, s39, s40, s41, s42]
approvedBy: "Omar Fostok"
approvedAt: 2026-11-16
owner: "Omar Fostok"
depends: []
affects: ["S-23 Connections Story", "S-96 Notifications Story"]
related: ["F-20 PinCast & Nearby", "D-10 Connect sends what the requester already has", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly", "S-23 Connections Story", "S-96 Notifications Story", "S-89 Gemma AI Story", "F-31 Cleanup Jobs", "Ring Access Model"]
pending: []
created: 2026-10-18
updated: 2026-11-16
tags: [story, story/approved, module/discovery, layer/business]
---

# PinCast & Nearby · User Story

**Feature:** [[F-20 PinCast & Nearby]] · **Status:** Approved 2026-11-16 by Omar Fostok (rewritten 2026-11-16 for the MVP; first approved 2026-10-25 by khaled) · **Frontend Requirements:** [[FR-20 PinCast & Nearby Frontend Requirements]] · **Backend Integration:** not yet (backend not built)

> **Rewritten 2026-11-16.** PinCast moved into the MVP that day, priority critical ([[F-20 PinCast & Nearby]], Omar Fostok). This version follows the app's screens (`rings/F-11/honest-rings` @ `778d9b4`: s39 hidden, s40 live with the ripple and *+15 min*, s41 setup, s42 results with *Broadcast again*, the Home chip) and twelve rules decided by Omar Fostok on 2026-11-16, recorded **in this story** under *Decided in this story* (N1–N12), on purpose without decision cards. It changes what was approved on 2026-10-25, so it is back to `draft`. The merged task T-032 (old S7) is folded into *What the backend has to build*.

**In the MVP:** PinCast, S1 to S5. **Later:** Nearby by Ring (S6, N10), match % and "Worth meeting" (with Gemma), an event filter (with Events), and the PinCast notifications (with [[S-96 Notifications Story]], N11).

PinCast is "be findable, here, for a while": I pick a Ring, a distance and a duration, and for that window the people around me **who are also visible** find me and see that Ring's card, as if they had scanned my badge, and I see theirs. When it ends I get the list of who was reached and can connect from it. Nobody ever gets a coordinate, a distance or a direction.

## Persona

A **broadcaster**: a user at a venue, a co-working space or a conference floor who wants people around them to find them for the next 30 minutes through the right Ring (Clients, not Family). Because PinCast is mutual (N2), every broadcaster is also a **recipient**: they see the others who are visible near them, and only those.

## Decided in this story

Decided 2026-11-16 by Omar Fostok. They live here rather than on decision cards; a story or a requirements list that relies on one links this section and the rule's number.

| # | Question | Decided | Parts |
|---|---|---|---|
| N1 | **What someone in range sees of me** | While my PinCast is live, anyone in range who is also visible sees the **broadcast Ring's card**, like a badge scan: **no membership**, and the Ring's name is **never** shown to them ([[D-14 Shared with me lists people, never the Ring\|D-14]], [[D-18 Ring names shown when joined knowingly\|D-18]]). Connecting from it works like a scanned badge: a **PinCast token**, as D-10's `qrToken` ([[D-10 Connect sends what the requester already has\|D-10]]), never by Pin name. | S3, S5 |
| N2 | **Who sees whom** | PinCast is **mutual**: I see only people who are visible, and only they see me. | S1, S3 |
| N3 | **Distance, direction, map** | None, for any person. My **own range** ("100 m") is shown. | S2, S3, S5 |
| N4 | **People nearby while I'm hidden** | **No count**: "Go visible to see who's around". | S1 |
| N5 | **Distances and durations** | Distances from **25 to 500 m**; durations **5 min, 30 min, 1 hr, 3 hr**. | S2 |
| N6 | **Extending** | **"+15 min"** extends a live PinCast. | S3, S4 |
| N7 | **Filters on the live screen** | In the MVP: **All** and **New to me** (not yet a connection). No match % or "Worth meeting" (needs Gemma, later, [[S-89 Gemma AI Story]]) and no event filter (Events later). | S3 |
| N8 | **What the results say about each person** | Who was reached, with **"Sent you a request"** and **"Connected"**; **never** "Opened your card". | S5 |
| N9 | **Location** | **No background location**: the position is taken at start and refreshed while the app is open; the broadcast runs on the server until its end time. | S1, S2, S3 |
| N10 | **Nearby by Ring** | The radar (S6) is **later**, not the MVP. | S6 |
| N11 | **When it ends, without notifications** | No notifications in the MVP: when the time ends, Home's chip becomes **"PinCast ended · See results"** and s39 shows **"Your last PinCast · See results"**. "PinCast ended" and "pins nearby" notifications come with [[S-96 Notifications Story]]. | S1, S4, S5 |
| N12 | **How long results last** | Complete for **30 days**, then only the count remains. | S5 |

## Stories

### S1 · PinCast · hidden ([[Screen Index#s39|s39]])

**As a** user opening PinCast, **I want** to see that I am hidden and go visible with my last settings in one tap, **so that** going visible is fast.

Acceptance criteria:
- [ ] The screen says *Hidden* plainly, and "Go visible to see who's around" (N4): no count of people nearby, no sample people.
- [ ] With previous settings: a one-tap *Go visible* with them ("Clients · 100 m · 30 min") and *Change* to s41. With none: *Set up a PinCast* to s41.
- [ ] It says PinCast is mutual (N2): "Only people who are visible see you, and you see only them."
- [ ] Location permission: when missing, the primary action asks for it, saying the position is taken when PinCast starts and while the app is open, never in the background, and never shown to anyone (N9, N3).
- [ ] After a PinCast ended: **"Your last PinCast · See results"** → s42 (N11), while its results last (N12).
- [ ] Not available yet: the backend (every route below).

### S2 · PinCast setup ([[Screen Index#s41|s41]])

**As a** broadcaster, **I want** to pick the Ring, the distance and the duration, **so that** only people close enough, for a bounded time, see the right card.

Acceptance criteria:
- [ ] A Ring picker over my live Rings (name, colour), the default Ring preselected. The Ring's name is mine to see; the people reached never see it (N1).
- [ ] Distance from **25 to 500 m** and duration **5 min, 30 min, 1 hr or 3 hr** (N5); the sentence "Visible to people within 100 m for 30 min, through Clients" says what it does.
- [ ] *Start PinCast* takes my current position (N9), starts the broadcast and opens s40.
- [ ] No distance, direction or map anywhere (N3).
- [ ] Not available yet: start.

### S3 · PinCast · live ([[Screen Index#s40|s40]])

**As a** broadcaster, **I want** a live screen with the time left and the people found so far, **so that** I can act while it is still happening.

Acceptance criteria:
- [ ] The **ripple** while live, my Ring's name, my own range ("100 m", N3), and the time left counted down from the **server's end time**.
- [ ] The people found so far: only people **in range who are also visible** (N2), each with their name and photo as their broadcast Ring's card shows them; never a distance, a direction or a map (N3), never the Ring they broadcast through (N1).
- [ ] Filters **All** and **New to me** (not yet a connection) (N7). No match %, no "Worth meeting", no event filter.
- [ ] Tapping a person opens their broadcast Ring's card (s44), like a badge scan (N1); *Connect* there uses the PinCast token, never their Pin name ([[S-23 Connections Story|Connections · S2]]).
- [ ] **+15 min** adds a quarter of an hour (N6); the countdown follows the new server end time.
- [ ] *Stop* ends the broadcast now and opens s42; *Change* opens s41.
- [ ] The position is refreshed while the app is open, never in the background (N9); leaving the app doesn't stop the broadcast, which runs on the server until its end time. The list grows without a manual refresh; new rows animate in.
- [ ] Not available yet: the people in range, extend, stop, the position refresh.

### S4 · Home · Broadcasting ([[Screen Index#s11|s11]])

**As a** broadcaster back on Home, **I want** a visible "Broadcasting" chip with the time left, **so that** I never forget that I am findable.

Acceptance criteria:
- [ ] While live, Home shows a chip with my Ring's name and the countdown from the server's end time; tapping it opens s40.
- [ ] When the time ends, the chip becomes **"PinCast ended · See results"** → s42 (N11); no notification in the MVP.
- [ ] The chip follows *+15 min* and *Stop* done on s40.
- [ ] Not available yet: the current PinCast with its end time.

### S5 · PinCast results ([[Screen Index#s42|s42]])

**As a** broadcaster whose PinCast ended, **I want** the list of everyone reached, **so that** I can connect with the people who matter.

Acceptance criteria:
- [ ] The ended state: my Ring, the window, and how many people were reached; then each person reached, as their card showed them.
- [ ] Each row says what happened, only **"Sent you a request"** (with *Accept*, [[S-23 Connections Story|Connections · S5]]) or **"Connected"**; otherwise *Connect*, by PinCast token (N1, [[S-23 Connections Story|Connections · S2]]). **Never** "Opened your card" (N8).
- [ ] Never where anyone was, how far, or a map (N3).
- [ ] Ended-empty: "Nobody was nearby".
- [ ] *Broadcast again* → s41 with the same settings; *Done* → Home.
- [ ] Results stay complete for **30 days**, then only the count remains (N12).
- [ ] Reached from s40 (*Stop* or the end), Home's ended chip and s39's "Your last PinCast" (N11); from notifications (s69) once [[S-96 Notifications Story]] exists.
- [ ] Not available yet: the results.

### S6 · Nearby by Ring (no prototype screen; [[Wireframe Brief#Nearby discovery|§6.2]]) · later (N10)

> **Later**, not the MVP (N10). The criteria are kept for when it comes.

**As a** recipient, **I want** a radar of people near me who are in a Ring I belong to, filtered by Ring, **so that** I notice a client or a colleague in the same room.

Acceptance criteria:
- [ ] A radar view with a Ring filter and a list fallback; pins populate on a sweep; selecting one expands it into the person's view card.
- [ ] Only people whose Ring I am a live member of appear, and only while they are broadcasting through that Ring; I never see someone because of a Ring of mine they are in.
- [ ] States: searching, none found, permission needed; no coordinates or distances beyond "nearby".
- [ ] A "pins nearby" notification is opt-in and off by default ([[S-96 Notifications Story]]).

## States and motion the design asks for

- **s39:** hidden with last settings, first time, permission needed, "Your last PinCast · See results".
- **s41:** setup; starting.
- **s40:** live with people, live with none yet, filtered (All / New to me), extending, stopping, offline.
- **s11:** broadcasting chip; "PinCast ended · See results".
- **s42:** ended with people, ended-empty, past 30 days (the count only).
- **Motion:** the **broadcast ripple**, continuous waves while live; on end the waves **collapse into the results list**; new people animate in; reduced motion: a static ring and a fade.

## What the backend has to build

Not available yet (the old S7, merged task T-032), in the order the journey needs them:

1. **Start, extend, stop:** start with a Ring, a distance (25–500 m) and a duration (5 min, 30 min, 1 hr, 3 hr) and the current position (N5, N9); *+15 min* (N6); stop now. One live PinCast per user.
2. **The current PinCast** with its **server end time**, for s40, s39 and the Home chip; it ends on the server at that time, with nothing from the phone.
3. **Position refresh** while the app is open (N9); no background reports.
4. **People in range, mutually visible** (N2): those with a live PinCast within range of each other, by the existing GiST index; never a coordinate, a distance or a direction (N3); a blocked pair never sees each other; "new to me" (not a connection) per person, for the filter (N7).
5. **The temporary view of the broadcast Ring** (N1): someone in range reads my broadcast Ring's card like a badge scan, with no membership and no Ring name; it ends with the PinCast.
6. **Connect by PinCast token** (N1): a token per person found, used like D-10's `qrToken` by [[S-23 Connections Story|Connections · S2]], never a Pin name.
7. **Results:** each person reached with "Sent you a request" or "Connected" (N8), complete for 30 days, then the count only (N12), purged by [[F-31 Cleanup Jobs]] (`PincastRecipient.detectedAt`).
8. **Error codes** (none defined yet): no live PinCast, already live, distance or duration not allowed, not a live Ring of mine, token expired.

## Rules the backend already enforces

- `pincasts.geo` is a PostGIS geography kept by trigger with a GiST index; `PincastRecipient.detectedAt` is indexed for purging by [[F-31 Cleanup Jobs]]; nothing is served from these yet.
- Every "who can see whom" question goes through `RingAccessService`; a blocked pair sees nothing either way. N1's temporary read of a broadcast Ring is new: it has to answer there too.
- `RingProfileViewEntity` carries no Ring id; a person reached never learns which Ring they were reached through.
- The recipients' coordinates are never returned ([[Ring Access Model]]).

## Open questions

- ~~The allowed distance and duration steps~~: 25–500 m, 5 min / 30 min / 1 hr / 3 hr (N5).
- ~~How a device reports its position (interval, background)~~: at start and while the app is open, never in the background (N9).
- ~~Whether someone must be in a Ring of the broadcaster to be reached or to see~~: neither; anyone in range who is also visible sees the broadcast Ring's card, without membership (N1, N2).
- ~~The purge delay~~: 30 days, then the count only (N12).
- ~~How s42 is reached without notifications~~: Home's ended chip and s39's "Your last PinCast" (N11).
- [[S-96 Notifications Story]]: "PinCast ended" and "pins nearby", and replacing polling on s40 (later).
- How often the position is refreshed while the app is open, and how long a PinCast token stays valid after the PinCast ends: the backend's to propose in its delivery.

## Log

- 2026-11-16 · `tickets/pm/M-04-discovery/F-20-pincast/S-45-mvp-n1-n12` · rewritten for the MVP (F-20 moved in 2026-11-16, critical) and back to `draft`: **N1–N12 decided by Omar Fostok 2026-11-16** in the story (the broadcast Ring's card like a badge scan, no membership, no Ring name, connect by PinCast token; mutual; no distance, direction or map, my own range shown; no count while hidden; 25–500 m and 5 min–3 hr; +15 min; All and New to me; "Sent you a request" and "Connected", never "Opened your card"; no background location; Nearby by Ring later; no notifications, ended chip and "Your last PinCast"; 30 days then the count); S1–S5 rewritten to these and the app's screens (`778d9b4`); S6 marked later; old S7 (T-032) folded into *What the backend has to build*; open questions answered; Connections links to S-23 S2 and S5; owner set to Omar Fostok. Cleared the F-20 flag; flagged [[FR-20 PinCast & Nearby Frontend Requirements]] and [[BD-20 PinCast & Nearby Backend Delivery]]
