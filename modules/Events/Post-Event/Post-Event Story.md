---
type: story
code: post-event
scope: feature
feature: post-event
module: events
status: draft
screens: [s62]
created: 2026-10-18
updated: 2026-10-18
tags: [story, story/draft, module/events, layer/business]
---

# Post-Event · User Story

**Feature:** [[Post-Event]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Post-Event Frontend Requirements]] · **API Integration:** not yet (backend not built)

The event has ended and the Event Ring has lapsed. The visitor gets one screen that tells them what the event was worth (connections, meetings, scans), proposes follow-ups, and asks the one identity question a temporary Ring leaves behind: keep it, merge it into another Ring, or let it go. The disposition endpoint exists; the summary does not.

## Persona

Visitor (User A) or exhibitor (User B) after the event's `expiresAt`, arriving from a notification, from the hub, or from the event-mode exit. The same screen serves a lapsed meeting Ring with smaller numbers ([[Meetings Story]] S7).

## Stories

### S1 · Summary assembles ([[Screen Index#s62|s62]])

**As a** visitor whose event ended, **I want** a summary of connections made, meetings held and scans received, **so that** I know how I used the event.

Acceptance criteria:
- [ ] Three counters (connections, meetings, scans) for the event window, taken from the stored `EventSummary`, never recomputed on the client.
- [ ] The summary builds up from the user's activity with the continuous-build motion; reduced-motion shows the final numbers at once.
- [ ] If the summary is not computed yet, the screen shows the Ring choice (S3) with a "summary coming" placeholder; the choice is never blocked by the stats.

### S2 · Follow-up suggestions ([[Screen Index#s62|s62]])

**As a** visitor, **I want** suggested follow-ups ("Review 4 pending requests", "Thank the people you met"), **so that** the event turns into connections.

Acceptance criteria:
- [ ] "Review N" opens the accept sheet ([[Screen Index#s46|s46]]) for the pending connection requests received during the event.
- [ ] Suggestions come from Gemma over what I may see; nothing suggests a person who is not already visible to me ([[Gemma AI]]).
- [ ] "Later" dismisses without deciding; the screen can be reopened from the hub until a disposition is chosen.

### S3 · Keep, merge or let go ([[Screen Index#s62|s62]])

**As a** visitor, **I want** to choose what happens to my Event Ring, **so that** the people I met land in the Ring I want them in.

Acceptance criteria:
- [ ] Three options with the design's motion: keep (stays, loses its expiry), merge (two Rings combine into a chosen one of mine), delete (collapses out).
- [ ] Merge asks for a target Ring from `GET /rings` (my own, excluding this one); the call is `POST /rings/:id/disposition` with `disposition: MERGE` and `mergedIntoRingId`.
- [ ] "Confirm" sends one call and returns to [[Screen Index#s11|s11]]; the Ring carousel reflects the result (kept Ring now permanent, merged Ring gone, target unchanged in count until refetched).
- [ ] The choice is only offered while the Ring's disposition is `UNDECIDED`; a decided Ring reopens the summary without the sheet.

### S4 · The Ring is unreadable, still mine ([[Screen Index#s62|s62]])

**As a** visitor, **I want** the post-event screen to work even though the Event Ring has lapsed, **so that** I am not locked out of my own decision.

Acceptance criteria:
- [ ] The screen reads the Ring via `GET /rings/:id` (owner path), never via `GET /views/ring/:ringId`, which returns 404 for an expired Ring even to the owner.
- [ ] Members of the lapsed Ring see nothing from it from `expiresAt` on; the summary never shows them what they lost access to.

### S5 · Exhibitor's post-event ([[Screen Index#s62|s62]])

**As an** exhibitor, **I want** the same summary with leads instead of connections, **so that** my team can follow up.

Acceptance criteria:
- [ ] Counters read scans, meetings and leads; "Export leads" reuses [[Exhibitor Story]] S4.
- [ ] The business Ring is permanent and gets no disposition sheet; only the Event Ring does.

## States and motion the design asks for

- Motion: the summary **assembles from the user's event activity** (brief §8.5).
- Motion: the lifecycle choice animates keep (stays), merge (two Rings combine), delete (collapses out) (brief §8.5, signature motion 9).
- State: summary pending, summary ready, disposition undecided / decided, "Later".

## Rules the backend already enforces

- `POST /rings/:id/disposition` runs `UNDECIDED → KEEP | MERGE | AUTO_DELETE` in one transaction. `KEEP` clears the expiry and the temporary flag; `MERGE` needs another Ring of the same owner (400 `E_RING_07`), moves every active member into the target with their window and archives the source with `mergedIntoRingId`; `AUTO_DELETE` archives and sets `expiresAt` to now, leaving the purge to the retention job ([[Rings]], [[Cleanup Jobs]]).
- Owner editing ignores expiry (`assertCanAdminister`), so the choice stays possible after the event ([[Ring Access Model]]).
- The owner's "View as" of an expired Ring is 404 `E_RING_ACCESS_02`; s62 must not use it to preview.
- The backend never writes `RING_STATUS.EXPIRED`; expiry is evaluated live from the timestamps.
- `EventSummary` and `FollowUpAutomation` (unique `dedupeKey`) are modelled; nothing computes or sends them yet.

## Open questions

- No decision note exists. Open points:
- [[T-050 Post-event summary and follow-ups]] — waits on [[T-009 Scan counter and share link]], [[T-023 Connection detail and contacts list]] and [[T-044 My meetings, calendar, detail, reschedule, cancel]]; S1 and S2.
- Who triggers the summary (a job at `expiresAt`, or the first open of s62) decides how long S1's placeholder lasts.
- Whether "delete" on s62 should read "expire" (the Screen Index note says keep / merge / expire) is copy, not behaviour: the call is `AUTO_DELETE` either way.
