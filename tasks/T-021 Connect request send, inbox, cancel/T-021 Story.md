---
type: story
code: T-021
scope: task
feature: connections
module: connections
status: draft
screens: [s44, s45]
depends: []
affects: []
related: []
pending: []
approvedBy: ""
approvedAt: ""
owner: "omar"
updated: 2026-10-25
tags: [story, story/draft, module/connections, layer/business]
task: T-021
---

# T-021 · Connect request send, inbox, cancel · User Story

**Task:** [[T-021 Connect request send, inbox, cancel]] · **Feature:** [[Connections]] · **Feature-level note:** [[Connections Story]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[T-021 Frontend Requirements]] · **Backend Integration:** [[T-021 Backend Integration]] · **Verified by:** [[T-021 QA Backend]], [[T-021 QA Frontend]]

> Derived from the task [[T-021 Connect request send, inbox, cancel]]; **not approved by product yet**. The feature-level story is [[Connections Story]]; this note says what the user gets from this task in particular. `approved` when product signs off (`approvedBy`, `approvedAt`); `verified` when both QA notes are `passing`.

`POST /connections/requests` (target by user id from a resolved view), `GET /connections/requests?direction=incoming|sent`, `DELETE …/:id`. Blocked pairs rejected with the same 404 as views.

## Persona

Two people who just met. The **requester** has scanned or looked up someone (s44) and wants to stay in touch. The **receiver** gets the request later, on Requests (s45), and decides. This task is asking, seeing and cancelling; accepting into a Ring is [[T-022 Accept into a Ring (sets grantedRingId)]].

## Stories

### S1 · Ask to connect from a scanned card ([[Screen Index#s44|s44]])

**As a** requester **I want** *Connect* on the card I just scanned **so that** this person can let me into one of their Rings.

Acceptance criteria:
- [ ] *Connect* sends `POST /connections/requests` addressed to the person on the card. The id comes from the scan ([[T-008 Resolve a scanned QR token]]) or the lookup, never derived from the view.
- [ ] The button becomes *Requested* and stays so after leaving and coming back.
- [ ] Asking again while a request is pending doesn't create a second one: the same request comes back.
- [ ] Asking someone I'm already connected with says so, instead of sending.

### S2 · A blocked pair learns nothing ([[Screen Index#s44|s44]])

**As a** person who blocked someone **I want** their request to fail exactly like an unavailable profile **so that** they can't tell they're blocked.

Acceptance criteria:
- [ ] Sending to someone who blocked me, or whom I blocked, answers the same 404 body as `/views` ("This profile isn't available to you").
- [ ] Nothing in the wording, timing or status says "blocked".

### S3 · See who wants to connect ([[Screen Index#s45|s45]])

**As a** receiver **I want** my incoming requests in one list **so that** I answer them when I have a moment.

Acceptance criteria:
- [ ] `GET /connections/requests?direction=incoming` lists pending requests, newest first, paged (`limit` ≤ 50, `meta.total`).
- [ ] Each row has the person's `displayName`, `pinName`, `avatarFileId` (shown once [[T-062 Serve uploaded file bytes by id]] ships), when it was sent, and where from (scan, event) if known.
- [ ] The tab label shows `meta.total`.
- [ ] Accept and Decline on a row lead to [[T-022 Accept into a Ring (sets grantedRingId)]].

### S4 · See and cancel what I sent ([[Screen Index#s45|s45]])

**As a** requester **I want** my sent requests listed **so that** I can take one back.

Acceptance criteria:
- [ ] `GET /connections/requests?direction=sent` lists my pending requests the same way.
- [ ] *Cancel* (`DELETE /connections/requests/:id`) removes it at once (optimistic) and from the receiver's inbox.
- [ ] Cancelling a request that was just accepted or declined refreshes the list instead of failing loudly.

### S5 · The other person sees the request

**As a** receiver **I want** to know a request came in **so that** I don't miss it.

Acceptance criteria:
- [ ] The People tile shows a count of pending incoming requests. Push and the inbox are [[T-045 NotificationService.emit and the inbox]]; until then the count refetches on focus, at most once a minute.

## States and motion the design asks for

- s44: *Connect* → sending → *Requested*; not available (404).
- s45: Incoming / Sent segments with counts; a row per request; empty ("No requests yet"); a row leaves the list once answered or cancelled.
- Motion: none beyond the design's row exit.

## Rules the backend already enforces

- Views resolve through `RingAccessService` with one 404 for missing, not shared and blocked; the send must reuse that body.
- `{ data, meta: { total } }` pagination with `limit` ≤ 50, as every list.
- Membership and which Ring someone is in are private to the owner.

## Open questions

- **The receiver's id.** The view body has no user id. The app needs it from the scan ([[T-008 Story#Open questions]]) or from a `pinName` lookup; or the request accepts the scanned token or the `pinName` and resolves the person itself.
- **Request statuses.** Pending, accepted, declined, cancelled: does a declined request stay visible to the requester (as "pending" forever, to hide the refusal) or disappear?
- **Expiry.** Whether a request left unanswered expires, and after how long.
- **A note.** Whether the request can carry a short message ("We met at TechSummit").
