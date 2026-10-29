---
id: FR-24
type: frontend-requirements
module: events
feature: exhibitor
status: draft
scope: feature
screens: [s63, s64, s65]
created: 2026-10-18
updated: 2026-10-29
tags: [frontend-requirements, frontend-requirements/draft, module/events, layer/frontend]
---

# Exhibitor · Frontend Requirements

**Feature:** [[F-24 Exhibitor]] · **Status:** Draft · **Story:** [[S-59 Exhibitor Story]] · **API Integration:** not yet (backend not built)

What the client needs for business setup, incoming meetings and booth analytics, and whether each need is met today. The Ring side (list, members, projection, view) exists; the business side does not.

## Per screen

### [[Screen Index#s63|s63]] Business account

- Needs: a multi-step create with draft persistence (industry, activity, tags, address, social links, logo, phone, email, website, P.O. Box, about, video link, gallery, files); the resulting business and its `CORPORATE` Ring; team members; the Discoverable-via-Gemma toggle.
- Source today: not yet ([[S-59 Exhibitor Story|Exhibitor · S7]]). Once the Ring exists, its projection is edited with the existing `GET / PATCH /rings/:ringId/projection`, `…/links`, `…/info-blocks`, `…/attachments`, and members with `GET / POST /rings/:ringId/members` ([[F-09 Ring Members]], [[F-10 Ring Projection]]).

### [[Screen Index#s64|s64]] Incoming meetings

- Needs: meeting requests addressed to the business or to me, grouped by status, with requester card, requested slot, event; accept-with-slots and decline-with-reason; organizer touchpoints (invitation, requested files, booth, payment status).
- Source today: not yet ([[S-64 Meetings Story|Meetings · S9]]; the organizer touchpoints have no task).

### [[Screen Index#s65|s65]] Booth analytics

- Needs: counts of QR scans, video clicks, Rings opened for the event window with a daily series; leads list; CSV export.
- Source today: not yet ([[S-59 Exhibitor Story|Exhibitor · S8]]).

## Endpoints required

| Need | Endpoint | Available | Task / decision |
|---|---|---|---|
| Business create (stepped), business Ring created with it | — | ❌ | [[S-59 Exhibitor Story|Exhibitor · S7]] |
| Edit the business Ring's projection | `GET / PATCH /rings/:ringId/projection` and sub-routes | ✅ | — |
| Team on the stand = business Ring members | `GET / POST /rings/:ringId/members`, `DELETE …/members/:userId` | ✅ | — (business-member sync is Exhibitor · S7) |
| Preview the business card as attendees see it | `GET /views/ring/:ringId` | ✅ | — |
| Incoming meeting requests, accept, decline | — | ❌ | [[S-64 Meetings Story|Meetings · S9]] |
| Availability slots to offer | — | ❌ | [[S-64 Meetings Story|Meetings · S8]] |
| Discoverable-via-Gemma toggle | — | ❌ | [[S-59 Exhibitor Story|Exhibitor · S7]] (feeds [[S-89 Gemma AI Story|Gemma AI · S8]]) |
| Scans, video clicks, Rings opened; leads CSV | — | ❌ | [[S-59 Exhibitor Story|Exhibitor · S8]] |
| Scan counting itself | — | ❌ | [[S-37 Badge & QR Story|Badge & QR · S19]] |
| Organizer invitation, requested files, booth and payment status | — | ❌ | no task yet; design-only |

## Behaviour expectations

- Refetch / realtime: incoming requests refetch on focus and when a meeting notification arrives ([[F-39 Notifications]]); the Need action badge count comes from the same list. Analytics refetch on focus with a minimum interval of 60 s.
- Caching keys: `business:mine`, `business:{id}`, `ring:{id}:members`, `meetingRequests:incoming:{status}`, `booth:{exhibitorId}:analytics:{eventId}`.
- Pagination / ordering: incoming requests paginated, newest first within each group; members list uses the existing pagination (`limit`, `skip`, `TABLE_MAX_LIMIT = 50`); leads export is a single request that returns a file.
- Drafts: each setup step is stored locally until the create call succeeds, so a lost connection does not lose the form; uploads (logo, gallery, files) use the existing upload shape.
- Decline: the reason is required (non-empty after trim) before the call is made.

## Error states the UI must handle

`ErrorCode` is not on the wire yet ([[S-87 Error Contract Story|Error Contract · S4–S8]]); branch on status and endpoint until it is.

| Status | ErrorCode | Show |
|---|---|---|
| 409 on the Ring created by setup (name clash) | `E_RING_01` | "You already have a Ring with this name", rename inline |
| 404 / 403 on `…/members` | `E_RING_02` / `E_RING_05` | "You cannot manage this business", back to s68 |
| 404 on `GET /views/ring/:ringId` | `E_RING_ACCESS_01` | "Preview not available" |
| business create validation | to be defined by [[S-59 Exhibitor Story|Exhibitor · S7]] | Field errors on the step that failed |
| accept / decline conflicts (slot taken, request withdrawn) | to be defined by [[S-64 Meetings Story|Meetings · S9]] | Refetch the request, show its current state |
| analytics unavailable | to be defined by [[S-59 Exhibitor Story|Exhibitor · S8]] | Counters at "—" with retry |

## Blocked by

- No decision note. Upstream tasks:
- [[S-59 Exhibitor Story|Exhibitor · S7]] — waits on [[S-29 Companies Story|Companies · S6]]; s63 entirely.
- [[S-64 Meetings Story|Meetings · S9]] and [[S-64 Meetings Story|Meetings · S8]] — s64.
- [[S-59 Exhibitor Story|Exhibitor · S8]] — waits on [[S-37 Badge & QR Story|Badge & QR · S19]] and [[S-53 Events During Story|Events During · S8]]; s65.
- Organizer touchpoints (invitation, requested files, booth and payment status) — no task yet.
