---
type: map
updated: 2026-10-15
tags: [map]
---

# Backlog

Every open task, ordered by priority. Status key: ⬜ To do · ❓ Needs a decision / info · ⛔ Blocked · 🔵 In progress · ✅ Done.

Columns as a board: [[Task Board]] (Kanban plugin format; also readable as a plain checklist).

## P0

| Task | Feature | Domain | Status | Effort | Depends on |
|---|---|---|---|---|---|
| [[T-001 Wire an email provider for one-time codes]] | [[Code Delivery]] | Platform & Cross-cutting | ⬜ To do | S | — |
| [[T-002 Wire an SMS provider for one-time codes]] | [[Code Delivery]] | Platform & Cross-cutting | ⬜ To do | S | [[T-001 Wire an email provider for one-time codes|T-001]] |
| [[T-007 Issue and rotate the QR token for a Ring]] | [[Badge & QR]] | Discovery | ⬜ To do | M | — |
| [[T-008 Resolve a scanned QR token]] | [[Badge & QR]] | Discovery | ⬜ To do | M | [[T-007 Issue and rotate the QR token for a Ring|T-007]] |
| [[T-021 Connect request send, inbox, cancel]] | [[Connections]] | Connections | ⬜ To do | M | — |
| [[T-022 Accept into a Ring (sets grantedRingId)]] | [[Connections]] | Connections | ⬜ To do | M | [[T-021 Connect request send, inbox, cancel|T-021]] |
| [[T-023 Connection detail and contacts list]] | [[Connections]] | Connections | ⬜ To do | M | [[T-022 Accept into a Ring (sets grantedRingId)|T-022]] |
| [[T-024 Block and unblock]] | [[Connections]] | Connections | ⬜ To do | S | — |
| [[T-033 Events list, detail, schedule]] | [[Events Before]] | Events | ⬜ To do | L | — |
| [[T-034 Tickets, packages, levels, sold-out]] | [[Events Before]] | Events | ⬜ To do | M | [[T-033 Events list, detail, schedule|T-033]] |
| [[T-041 Availability slots CRUD]] | [[Meetings]] | Meetings | ⬜ To do | M | — |
| [[T-042 Meeting request, accept with slots, decline with reason]] | [[Meetings]] | Meetings | ⬜ To do | L | [[T-041 Availability slots CRUD|T-041]] |
| [[T-043 Temporary meeting Ring per meeting]] | [[Meetings]] | Meetings | ⬜ To do | M | [[T-042 Meeting request, accept with slots, decline with reason|T-042]] |
| [[T-044 My meetings, calendar, detail, reschedule, cancel]] | [[Meetings]] | Meetings | ⬜ To do | M | [[T-042 Meeting request, accept with slots, decline with reason|T-042]] |
| [[T-053 Audit log writes]] | [[Audit Log]] | Platform & Cross-cutting | ⬜ To do | S | — |
| [[T-055 Run the e2e suite in CI against PostGIS]] | [[E2E Test Run]] | Platform & Cross-cutting | ⬜ To do | S | — |
| [[T-011 Create the Event Ring on registration]] | [[Event Ring Auto-creation]] | Events | ⛔ Blocked | M | [[T-033 Events list, detail, schedule|T-033]] |
| [[T-035 Registration transaction with order and payment]] | [[Events Before]] | Events | ⛔ Blocked | L | [[T-034 Tickets, packages, levels, sold-out|T-034]], [[T-047 Orders, payments and the provider webhook|T-047]] |
| [[T-036 Event mode exhibitors list and detail]] | [[Events During]] | Events | ⛔ Blocked | M | [[T-033 Events list, detail, schedule|T-033]] |
| [[T-056 Decide passwordless login]] | [[Auth & Sign-up]] | Identity Core | ✅ Done | S | — |
| [[T-057 Decide base profile work fields]] | [[Profiles & Pin Name]] | Identity Core | ❓ Needs a decision / info | S | — |
| [[T-058 Decide field library vs per-Ring copies]] | [[Ring Projection]] | Identity Core | ❓ Needs a decision / info | S | — |
| [[T-059 Decide Ring settings]] | [[Rings]] | Identity Core | ❓ Needs a decision / info | S | — |

## P1

| Task | Feature | Domain | Status | Effort | Depends on |
|---|---|---|---|---|---|
| [[T-004 Member count per Ring on list and detail]] | [[Counts]] | Identity Core | ⬜ To do | S | — |
| [[T-006 Delegated admin endpoints]] | [[Delegated Admins]] | Shared Rings & Companies | ⬜ To do | M | — |
| [[T-009 Scan counter and share link]] | [[Badge & QR]] | Discovery | ⬜ To do | S | [[T-008 Resolve a scanned QR token|T-008]] |
| [[T-012 List my files (photo library)]] | [[Photo Library]] | Identity Core | ⬜ To do | S | — |
| [[T-014 Register devices on login; list and remove]] | [[Devices & NFC]] | Platform & Cross-cutting | ⬜ To do | M | — |
| [[T-016 Interests vocabulary and my interests]] | [[Interests]] | Platform & Cross-cutting | ⬜ To do | S | — |
| [[T-017 Extend WIDGET_TYPE to the design's list]] | [[Widgets]] | Identity Core | ⬜ To do | S | — |
| [[T-029 My companies and company detail]] | [[Companies]] | Shared Rings & Companies | ⬜ To do | M | — |
| [[T-030 Discover search by !pinname and recent searches]] | [[Discover Hub & Search]] | Discovery | ⬜ To do | S | — |
| [[T-032 PinCast setup, start, stop, results]] | [[PinCast & Nearby]] | Discovery | ⬜ To do | L | — |
| [[T-045 NotificationService.emit and the inbox]] | [[Notifications]] | Platform & Cross-cutting | ⬜ To do | M | — |
| [[T-048 Business account setup → business Ring]] | [[Exhibitor]] | Events | ⬜ To do | L | [[T-029 My companies and company detail|T-029]] |
| [[T-049 Subscription endpoints and a single Pro gate]] | [[Subscription (Free vs Pro)]] | Commerce | ⬜ To do | M | — |
| [[T-054 Cleanup jobs]] | [[Cleanup Jobs]] | Platform & Cross-cutting | ⬜ To do | M | — |
| [[T-003 Remove devCode once delivery works]] | [[Code Delivery]] | Platform & Cross-cutting | ⛔ Blocked | S | [[T-001 Wire an email provider for one-time codes|T-001]], [[T-002 Wire an SMS provider for one-time codes|T-002]] |
| [[T-005 Connection count on Me and Home]] | [[Counts]] | Identity Core | ⛔ Blocked | S | [[T-021 Connect request send, inbox, cancel|T-021]] |
| [[T-010 Public browser page for viewers without the app]] | [[Badge & QR]] | Discovery | ❓ Needs a decision / info | M | [[T-008 Resolve a scanned QR token|T-008]] |
| [[T-018 Widget CRUD on the projection]] | [[Widgets]] | Identity Core | ❓ Needs a decision / info | M | [[T-017 Extend WIDGET_TYPE to the design's list|T-017]], [[D-03 Field library vs per-Ring copies]] |
| [[T-019 LinkedIn OAuth link, unlink, login]] | [[Linked Accounts (OAuth)]] | Platform & Cross-cutting | ⬜ To do | L | — (D-01 decided) |
| [[T-020 LinkedIn import → review → base profile]] | [[Onboarding Imports]] | Identity Core | ⛔ Blocked | L | [[T-019 LinkedIn OAuth link, unlink, login|T-019]], [[D-02 Base profile work fields]] |
| [[T-026 Ring invitations invite, review, decline]] | [[Ring Invitations & Join]] | Shared Rings & Companies | ❓ Needs a decision / info | M | [[D-04 Ring settings]] |
| [[T-027 Join a Ring with a code or verified work email]] | [[Ring Invitations & Join]] | Shared Rings & Companies | ⛔ Blocked | M | [[D-04 Ring settings]], [[T-026 Ring invitations invite, review, decline|T-026]] |
| [[T-037 Event pass with a 60 s rotating code]] | [[Events During]] | Events | ⛔ Blocked | M | [[T-007 Issue and rotate the QR token for a Ring|T-007]], [[T-011 Create the Event Ring on registration|T-011]] |
| [[T-038 Floor map and booths]] | [[Events During]] | Events | ⛔ Blocked | M | [[T-036 Event mode exhibitors list and detail|T-036]] |
| [[T-039 Catalogue products and talks (new table)]] | [[Events During]] | Events | ❓ Needs a decision / info | L | [[T-036 Event mode exhibitors list and detail|T-036]] |
| [[T-040 Lounges and upgrades]] | [[Events During]] | Events | ⛔ Blocked | M | [[T-034 Tickets, packages, levels, sold-out|T-034]], [[T-049 Subscription endpoints and a single Pro gate|T-049]] |
| [[T-046 Push delivery and preferences]] | [[Notifications]] | Platform & Cross-cutting | ⛔ Blocked | M | [[T-045 NotificationService.emit and the inbox|T-045]], [[T-014 Register devices on login; list and remove|T-014]] |
| [[T-047 Orders, payments and the provider webhook]] | [[Payments & Orders]] | Commerce | ❓ Needs a decision / info | L | — |
| [[T-048b Booth analytics and leads CSV export]] | [[Exhibitor]] | Events | ⛔ Blocked | M | [[T-009 Scan counter and share link|T-009]], [[T-036 Event mode exhibitors list and detail|T-036]] |
| [[T-050 Post-event summary and follow-ups]] | [[Post-Event]] | Events | ⛔ Blocked | M | [[T-009 Scan counter and share link|T-009]], [[T-023 Connection detail and contacts list|T-023]], [[T-044 My meetings, calendar, detail, reschedule, cancel|T-044]] |
| [[T-060 Decide copy or inherit]] | [[Ring Projection]] | Identity Core | ❓ Needs a decision / info | S | [[D-02 Base profile work fields]] |
| [[T-061 Decide Pin name rules]] | [[Profiles & Pin Name]] | Identity Core | ❓ Needs a decision / info | S | — |

## P2

| Task | Feature | Domain | Status | Effort | Depends on |
|---|---|---|---|---|---|
| [[T-013 Usage count per file across Rings]] | [[Photo Library]] | Identity Core | ⬜ To do | S | [[T-012 List my files (photo library)|T-012]] |
| [[T-015 Pair and revoke an NFC card]] | [[Devices & NFC]] | Platform & Cross-cutting | ⬜ To do | M | [[T-007 Issue and rotate the QR token for a Ring|T-007]] |
| [[T-020b Business card scan and portfolio URL import]] | [[Onboarding Imports]] | Identity Core | ❓ Needs a decision / info | L | [[D-02 Base profile work fields]] |
| [[T-025 Introduce a connection to another]] | [[Connections]] | Connections | ❓ Needs a decision / info | M | [[T-023 Connection detail and contacts list|T-023]] |
| [[T-028 What you contribute to a shared Ring]] | [[Ring Invitations & Join]] | Shared Rings & Companies | ❓ Needs a decision / info | L | [[T-027 Join a Ring with a code or verified work email|T-027]] |
| [[T-031 Import contacts]] | [[Discover Hub & Search]] | Discovery | ❓ Needs a decision / info | M | — |
| [[T-051 Gemma assistant sheet and suggestions]] | [[Gemma AI]] | Platform & Cross-cutting | ❓ Needs a decision / info | L | [[T-016 Interests vocabulary and my interests|T-016]], [[T-049 Subscription endpoints and a single Pro gate|T-049]] |
| [[T-052 Smart Match]] | [[Gemma AI]] | Platform & Cross-cutting | ⛔ Blocked | L | [[T-051 Gemma assistant sheet and suggestions|T-051]], [[T-036 Event mode exhibitors list and detail|T-036]] |

## Suggested order of work

1. **Unblock the decisions** (T-056 … T-061). Four of them (D-01 … D-04) change the schema; deciding them first avoids rework on everything built on projections and Ring settings.
2. **Finish the identity core**: code delivery (T-001, T-002), QR issue / resolve (T-007, T-008), counts (T-004), audit log (T-053), e2e in CI (T-055).
3. **Connections** (T-021 … T-024) and **notifications** (T-045): the next most important feature after Rings, and the first thing every event or meeting flow needs.
4. **Events before + payments + Event Ring** (T-033, T-034, T-047, T-035, T-011).
5. **Meetings** (T-041 … T-044) and **events during** (T-036 … T-040).
6. **Exhibitor, post-event, companies, PinCast, devices, widgets, interests.**
7. **Gemma** last: it only suggests over data the earlier phases create.

## Live views (Dataview plugin)

```dataview
TABLE feature, status, priority, effort FROM #task WHERE status != "done" SORT priority ASC, status ASC
```

```dataview
TABLE feature, priority FROM #task WHERE status = "needs-info"
```
