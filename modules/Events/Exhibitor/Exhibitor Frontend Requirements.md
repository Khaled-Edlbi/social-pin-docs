---
type: frontend-requirements
code: exhibitor
scope: feature
feature: exhibitor
module: events
status: draft
screens: [s63, s64, s65]
updated: 2026-10-18
tags: [frontend-requirements, frontend-requirements/draft, module/events, layer/frontend]
---

# Exhibitor · Frontend Requirements

**Feature:** [[Exhibitor]] · **Status:** Draft · **Story:** [[Exhibitor Story]] · **API Integration:** not yet (backend not built)

What the client needs for business setup, incoming meetings and booth analytics, and whether each need is met today. The Ring side (list, members, projection, view) exists; the business side does not.

## Per screen

### [[Screen Index#s63|s63]] Business account

- Needs: a multi-step create with draft persistence (industry, activity, tags, address, social links, logo, phone, email, website, P.O. Box, about, video link, gallery, files); the resulting business and its `CORPORATE` Ring; team members; the Discoverable-via-Gemma toggle.
- Source today: not yet ([[T-048 Business account setup → business Ring]]). Once the Ring exists, its projection is edited with the existing `GET / PATCH /rings/:ringId/projection`, `…/links`, `…/info-blocks`, `…/attachments`, and members with `GET / POST /rings/:ringId/members` ([[Ring Members]], [[Ring Projection]]).

### [[Screen Index#s64|s64]] Incoming meetings

- Needs: meeting requests addressed to the business or to me, grouped by status, with requester card, requested slot, event; accept-with-slots and decline-with-reason; organizer touchpoints (invitation, requested files, booth, payment status).
- Source today: not yet ([[T-042 Meeting request, accept with slots, decline with reason]]; the organizer touchpoints have no task).

### [[Screen Index#s65|s65]] Booth analytics

- Needs: counts of QR scans, video clicks, Rings opened for the event window with a daily series; leads list; CSV export.
- Source today: not yet ([[T-048b Booth analytics and leads CSV export]]).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Business create (stepped), business Ring created with it | — | ❌ | [[T-048 Business account setup → business Ring]] |
| Edit the business Ring's projection | `GET / PATCH /rings/:ringId/projection` and sub-routes | ✅ | — |
| Team on the stand = business Ring members | `GET / POST /rings/:ringId/members`, `DELETE …/members/:userId` | ✅ | — (business-member sync is T-048) |
| Preview the business card as attendees see it | `GET /views/ring/:ringId` | ✅ | — |
| Incoming meeting requests, accept, decline | — | ❌ | [[T-042 Meeting request, accept with slots, decline with reason]] |
| Availability slots to offer | — | ❌ | [[T-041 Availability slots CRUD]] |
| Discoverable-via-Gemma toggle | — | ❌ | [[T-048 Business account setup → business Ring]] (feeds [[T-052 Smart Match]]) |
| Scans, video clicks, Rings opened; leads CSV | — | ❌ | [[T-048b Booth analytics and leads CSV export]] |
| Scan counting itself | — | ❌ | [[T-009 Scan counter and share link]] |
| Organizer invitation, requested files, booth and payment status | — | ❌ | no task yet; design-only |

## Behaviour expectations

- Refetch / realtime: incoming requests refetch on focus and when a meeting notification arrives ([[Notifications]]); the Need action badge count comes from the same list. Analytics refetch on focus with a minimum interval of 60 s.
- Caching keys: `business:mine`, `business:{id}`, `ring:{id}:members`, `meetingRequests:incoming:{status}`, `booth:{exhibitorId}:analytics:{eventId}`.
- Pagination / ordering: incoming requests paginated, newest first within each group; members list uses the existing pagination (`limit`, `skip`, `TABLE_MAX_LIMIT = 50`); leads export is a single request that returns a file.
- Drafts: each setup step is stored locally until the create call succeeds, so a lost connection does not lose the form; uploads (logo, gallery, files) use the existing upload shape.
- Decline: the reason is required (non-empty after trim) before the call is made.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[T-063 Put the ErrorCode on the error body]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 409 on the Ring created by setup (name clash) | `E_RING_01` | "You already have a Ring with this name", rename inline |
| 404 / 403 on `…/members` | `E_RING_02` / `E_RING_05` | "You cannot manage this business", back to s68 |
| 404 on `GET /views/ring/:ringId` | `E_RING_ACCESS_01` | "Preview not available" |
| business create validation | to be defined by [[T-048 Business account setup → business Ring]] | Field errors on the step that failed |
| accept / decline conflicts (slot taken, request withdrawn) | to be defined by [[T-042 Meeting request, accept with slots, decline with reason]] | Refetch the request, show its current state |
| analytics unavailable | to be defined by [[T-048b Booth analytics and leads CSV export]] | Counters at "—" with retry |

## Blocked by

- No decision note. Upstream tasks:
- [[T-048 Business account setup → business Ring]] — waits on [[T-029 My companies and company detail]]; s63 entirely.
- [[T-042 Meeting request, accept with slots, decline with reason]] and [[T-041 Availability slots CRUD]] — s64.
- [[T-048b Booth analytics and leads CSV export]] — waits on [[T-009 Scan counter and share link]] and [[T-036 Event mode exhibitors list and detail]]; s65.
- Organizer touchpoints (invitation, requested files, booth and payment status) — no task yet.
