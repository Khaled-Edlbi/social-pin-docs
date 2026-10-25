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
related: ["DR-13 The requester sees a declined request", "DR-17 Requests expire after 30 days, optional note, ask again at once", "D-10 How Connect addresses the scanned person"]
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

`POST /connections/requests` (target by user id from a resolved view, an optional note), `GET /connections/requests?direction=incoming|sent`, `DELETE …/:id`. Blocked pairs rejected with the same 404 as views. A request is pending, accepted, declined, cancelled or expired ([[DR-13 The requester sees a declined request]], [[DR-17 Requests expire after 30 days, optional note, ask again at once]]).

## Persona

Two people who just met. The **requester** has scanned or looked up someone (s44) and wants to stay in touch. The **receiver** gets the request later, on Requests (s45), and decides. This task is asking, seeing and cancelling; accepting into a Ring is [[T-022 Accept into a Ring (sets grantedRingId)]].

## Stories

### S1 · Ask to connect from a scanned card ([[Screen Index#s44|s44]])

**As a** requester **I want** *Connect* on the card I just scanned **so that** this person can let me into one of their Rings.

Acceptance criteria:
- [ ] *Connect* sends `POST /connections/requests` addressed to the person on the card. The id comes from the scan ([[T-008 Resolve a scanned QR token]]) or the lookup, never derived from the view.
- [ ] The request may carry a **note** ("We met at TechSummit"): optional, at most **200 characters**; a longer one is refused with a validation error and the app counts characters as they are typed. The receiver sees the note on the request (S3).
- [ ] The button becomes *Requested* and stays so after leaving and coming back.
- [ ] Asking again while a request is pending doesn't create a second one: the same request comes back.
- [ ] After a decline or an expiry the button offers *Connect* again, and asking sends a **new** request straight away; there is no waiting period ([[DR-17 Requests expire after 30 days, optional note, ask again at once]]).
- [ ] Asking someone I'm already connected with says so, instead of sending.

### S2 · A blocked pair learns nothing ([[Screen Index#s44|s44]])

**As a** person who blocked someone **I want** their request to fail exactly like an unavailable profile **so that** they can't tell they're blocked.

Acceptance criteria:
- [ ] Sending to someone who blocked me, or whom I blocked, answers the same 404 body as `/views` ("This profile isn't available to you").
- [ ] Nothing in the wording, timing or status says "blocked". A block is never shown as a decline.

### S3 · See who wants to connect ([[Screen Index#s45|s45]])

**As a** receiver **I want** my incoming requests in one list **so that** I answer them when I have a moment.

Acceptance criteria:
- [ ] `GET /connections/requests?direction=incoming` lists pending requests, newest first, paged (`limit` ≤ 50, `meta.total`).
- [ ] Each row has the person's `displayName`, `pinName`, `avatarFileId` (shown once [[T-062 Serve uploaded file bytes by id]] ships), when it was sent, where from (scan, event) if known, and the **note** if there is one.
- [ ] The tab label shows `meta.total`.
- [ ] Accept and Decline on a row lead to [[T-022 Accept into a Ring (sets grantedRingId)]].
- [ ] A request left unanswered for **30 days expires**: it leaves the incoming list and closes with no connection.

### S4 · See and cancel what I sent ([[Screen Index#s45|s45]])

**As a** requester **I want** my sent requests listed with what happened to them **so that** I know where I stand and can take one back.

Acceptance criteria:
- [ ] `GET /connections/requests?direction=sent` lists my requests the same way, each with its **status**: pending, declined or expired ([[DR-13 The requester sees a declined request]]). Accepted and cancelled requests leave the list.
- [ ] A **declined** request reads as declined, and an **expired** one as expired (no answer in 30 days); both offer *Connect* again (S1).
- [ ] *Cancel* (`DELETE /connections/requests/:id`) on a pending request removes it at once (optimistic) and from the receiver's inbox.
- [ ] Cancelling a request that was just accepted, declined or expired refreshes the list instead of failing loudly.

### S5 · The other person sees the request

**As a** receiver **I want** to know a request came in **so that** I don't miss it.

Acceptance criteria:
- [ ] The People tile shows a count of pending incoming requests. Push and the inbox are [[T-045 NotificationService.emit and the inbox]]; until then the count refetches on focus, at most once a minute.

## States and motion the design asks for

- s44: *Connect* → sending → *Requested*; *Declined* or *Expired* with *Connect* again; not available (404).
- s45: Incoming / Sent segments with counts; a row per request, with its note; on Sent, the status of each row; empty ("No requests yet"); an incoming row leaves the list once answered, cancelled or expired.
- Motion: none beyond the design's row exit.

## Rules the backend already enforces

- Views resolve through `RingAccessService` with one 404 for missing, not shared and blocked; the send must reuse that body.
- `{ data, meta: { total } }` pagination with `limit` ≤ 50, as every list.
- Membership and which Ring someone is in are private to the owner.

## Open questions

- **The receiver's id** ([[D-10 How Connect addresses the scanned person]]). The view body has no user id. The app needs it from the scan ([[T-008 Story#Open questions]]) or from a `pinName` lookup; or the request accepts the scanned token or the `pinName` and resolves the person itself. This story stays Blocked · D-10 until it is decided.
- How long a declined or expired request stays on the Sent list, and whether the receiver is reminded before a request expires (left open by [[DR-17 Requests expire after 30 days, optional note, ask again at once]]).
