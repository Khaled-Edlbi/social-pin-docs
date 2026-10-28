---
type: story
code: exhibitor
scope: feature
feature: exhibitor
module: events
status: approved
screens: [s63, s64, s65]
approvedBy: "khaled"
approvedAt: 2026-10-25
owner: "khaled"
created: 2026-10-18
updated: 2026-10-28
tags: [story, story/approved, module/events, layer/business]
---

# Exhibitor · User Story

**Feature:** [[F-24 Exhibitor]] · **Status:** Approved 2026-10-25 by khaled · **Frontend Requirements:** [[FR-24 Exhibitor Frontend Requirements]] · **API Integration:** not yet (backend not built)

An exhibitor starts as a visitor and, at ticket selection or from Me, creates a business account. The business is showcased through a business Ring that sits beside their personal Rings. In event mode they handle incoming meeting requests, choose whether Gemma may surface them, and read who looked at their stand. The schema (`Business`, `BusinessMember`, `Exhibitor`, `ExhibitorDocument`, `Booth`, `AnalyticsEvent`) exists; no endpoint does.

## Persona

Exhibitor (User B): a visitor who has chosen the Exhibitor level on s50 or "Create business account" on s68. The organizer (User C) works on the web; the app shows only the exhibitor's side of the organizer's actions (S5).

## Stories

### S1 · Business account setup ([[Screen Index#s63|s63]])

**As a** visitor becoming an exhibitor, **I want** a stepped setup that ends in a business Ring, **so that** my business lives beside my personal Rings instead of in a separate app.

Acceptance criteria:
- [ ] Steps in this order: industry + activity + tags → address + social links → logo, phone, email, website, P.O. Box, About → video link + photo gallery → files (PDF / PPT / links). Each step saves a draft; the user can leave and resume.
- [ ] "Create business Ring" is the last action; on success the hub shows a new `CORPORATE` Ring with the Ring-creation motion, and the user is the Ring's owner.
- [ ] Required fields per step are validated at the edge; a step with errors cannot be skipped.
- [ ] The setup is reachable from s50 ("Set up") and s68; returning from s50 lands back on the ticket selection with the Exhibitor level selected.

### S2 · Team on the stand ([[Screen Index#s63|s63]])

**As an** exhibitor, **I want** to add colleagues to the business, **so that** they appear on our card and can be met.

Acceptance criteria:
- [ ] A business member becomes a member of the business Ring; removing them from the business removes the membership.
- [ ] Members see the business Ring under "shared with me" and never their own membership row.
- [ ] Inviting uses the existing Ring invitation rules ([[F-17 Ring Invitations & Join]]) once they exist; until then the flow is owner-adds-member.

### S3 · Incoming meetings ([[Screen Index#s64|s64]])

**As an** exhibitor, **I want** my requested meetings in one list with a clear "Need action" group, **so that** I never miss a lead.

Acceptance criteria:
- [ ] Groups: Need action, Accepted, Declined; empty state "No requests yet".
- [ ] Accept opens the slot offer ([[S-64 Meetings Story]] S4); Decline asks for a reason and the requester receives a notification with it.
- [ ] "See booth analytics" → s65.

### S4 · Booth analytics ([[Screen Index#s65|s65]])

**As an** exhibitor, **I want** to see QR scans, video clicks and Rings opened over the event, and export my leads, **so that** I can follow up after the event.

Acceptance criteria:
- [ ] Three counters with a per-day breakdown for the event window; sourced from `AnalyticsEvent`, never computed on the client.
- [ ] Leads are the attendees who connected or met us; anonymous viewers are counted, not listed.
- [ ] "Export CSV" downloads a file; the request is made once and the file is shared via the OS sheet.

### S5 · Organizer touchpoints ([[Screen Index#s64|s64]])

**As an** exhibitor, **I want** to see the organizer's invitation, requested files, my booth or area and my payment status inside the app, **so that** I do not need the web dashboard at the venue.

Acceptance criteria:
- [ ] Invitation received → accept joins the event as `EventParticipant.role = EXHIBITOR`.
- [ ] Requested files show a list with "upload" per item (`ExhibitorDocument`); a fulfilled request shows the uploaded file's name.
- [ ] Booth / area code and payment status (`Payment.collectedBy` ORGANIZER vs SOCIAL_PIN) are read-only.

### S6 · Discoverable via Gemma ([[Screen Index#s63|s63]])

**As an** exhibitor, **I want** a toggle that lets Gemma suggest us to attendees, **so that** Smart Match can send us leads, and I want to approve or reject what it proposes.

Acceptance criteria:
- [ ] Default off; a change takes effect immediately for future suggestions.
- [ ] Auto-requested meetings arrive in S3's Need action group like any other request.

### S7 · Business account setup → business Ring

*From T-048 (status then: To do), merged 2026-10-27.*

Multi-step DTOs; creates `Business` + a `CORPORATE` Ring; team members become Ring members.

Screens: [[Screen Index#s63|s63]] Business account


### S8 · Booth analytics and leads CSV export

*From T-048b (status then: Blocked), merged 2026-10-27.*

Scans, video clicks, Rings opened from `AnalyticsEvent`; CSV export of leads.

Screens: [[Screen Index#s65|s65]] Booth analytics

## States and motion the design asks for

- Motion: business-account creation **forms a business Ring** with the Ring-creation motion (brief §9.1).
- State: need-action, accepted, declined, no requests (brief §9.2).
- State: invitation received, files requested, booth and payment status (brief §9.3).

## Rules the backend already enforces

- `POST /rings` with `type = CORPORATE` is allowed, but the business Ring is created by the business setup transaction so the `Business` and the Ring never exist without each other (Exhibitor · S7); the client does not create it separately.
- Membership is private: a team member never reads their own membership row; viewers see the business Ring view, not the member list ([[Ring Access Model]]).
- Delegated administration of the business Ring goes through `assertCanAdminister` with a permission level ([[F-11 Rings]]).
- `EventParticipant.role` distinguishes exhibitor from visitor inside one registration flow.
- No service writes `AnalyticsEvent` or `AuditLog` yet; S4 counts are zero until [[S-37 Badge & QR Story|Badge & QR · S19]] and Exhibitor · S8.

## Open questions

- No decision note exists. Open points:
- [[S-59 Exhibitor Story|Exhibitor · S7]] — waits on [[S-29 Companies Story|Companies · S6]]; whether a business is a `Company` or its own aggregate changes S1's target.
- [[S-59 Exhibitor Story|Exhibitor · S8]] — which analytics identify the viewer (connections only?) is a privacy choice S4 depends on.
- The organizer's invitation and file-request flows have no task yet; S5 is design-only.
