---
type: story
code: companies
scope: feature
feature: companies
module: shared-rings
status: draft
screens: [s72, s73]
updated: 2026-10-25
owner: "omar"
related: ["DR-04 Ring settings at launch and their defaults", "DR-14 Shared with me lists people, never the Ring"]
tags: [story, story/draft, module/shared-rings, layer/business]
---

# Companies · User Story

**Feature:** [[Companies]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Companies Frontend Requirements]] · **API Integration:** not yet (backend not built)

A person belongs to one or more businesses: as an employee of Acme Studio, as a founder of Northstar, as a speaker inserted into an organizer's business account. Each business shows itself through company Rings (`CORPORATE`, nested with `parentRingId`: public, employees, c-suite), and the person is a member of some of those Rings. "My companies" is the list of those businesses and "Company detail" is one business, seen from the member's side: what it is, which of its Rings I am in, and the door out.

## Persona

A **business member**: an employee or associate who was invited into a company Ring or joined it with a code. They are not the business owner; the owner's setup journey (visitor → *Create business account* → business Ring) belongs to [[Exhibitor]] and ends here, on s72, with the new business in the list. The member's moment is checking which companies they are attached to, opening one, and occasionally leaving.

## Stories

### S1 · My companies ([[Screen Index#s72|s72]])

**As a** business member, **I want** a list of the companies I belong to, with pending company invitations on top, **so that** I can open one or deal with an invitation.

Acceptance criteria:
- [ ] Each company row shows name, logo placeholder, industry and my role in it (member / admin / owner); tapping opens s73.
- [ ] Pending invitations appear in a separate section above the list, each with *Review* leading to s74 ([[Ring Invitations & Join]]).
- [ ] *Join a company Ring* leads to s74 with no company preselected.
- [ ] Empty state: "You're not part of a company yet", with *Join a company Ring* and, for a visitor, *Create a business account*.
- [ ] A company whose Rings have all expired or removed me is no longer listed.

### S2 · Company detail ([[Screen Index#s73|s73]])

**As a** business member, **I want** the company's public facts and the list of its Rings I am in, **so that** I know what the company shows and what I am part of.

Acceptance criteria:
- [ ] Header: name, logo placeholder, industry and activity, tags, address, website, phone, email, social links, about text, and the company's files (listed by name, no download until file bytes can be served).
- [ ] A *Rings* section lists only the company Rings I am a live member of, each opening the Ring's projection (s14); Rings I am not in are not listed and their number is not shown. Per [[DR-14 Shared with me lists people, never the Ring]] a member never sees a Ring's name, colour or type, so the rows do not show the design's Ring names ("Acme Team", "Company") unless product reopens this for company Rings (see *Open questions*).
- [ ] "22 colleagues" opens the Ring people screen (s15) when I am owner or admin of that Ring, or, for a plain member, when the Ring's "members can see each other" is on, in which case I see my colleagues' full cards ([[DR-04 Ring settings at launch and their defaults]]); otherwise the count is hidden, because membership is private to the owner. Not available yet: the setting does not exist.
- [ ] *Leave company* is at the bottom, destructive style, with a confirmation.

### S3 · Leave a company ([[Screen Index#s73|s73]] → [[Screen Index#s72|s72]])

**As a** business member who moved on, **I want** to leave a company in one action, **so that** its Rings stop showing me and I stop seeing them.

Acceptance criteria:
- [ ] Confirmation names the consequence: my membership in every Ring of this company ends now; the company's owner keeps the record that I was there.
- [ ] On success s72 reloads without the company; the Rings disappear from Shared with me on the next focus.
- [ ] The business owner cannot leave their own company from here; the action is hidden for the owner.

### S4 · Company Rings as a hierarchy ([[Screen Index#s73|s73]] → [[Screen Index#s14|s14]])

**As a** member of several Rings of the same company, **I want** each Ring to open as the perspective it is, **so that** "Company" (public) and "Acme Team" (employees) read as two views of one business.

Acceptance criteria:
- [ ] Opening a Ring from s73 renders that Ring's projection through the same view path as a scan; nothing on the screen says which level of the hierarchy it is ([[DR-14 Shared with me lists people, never the Ring]]).
- [ ] The parent / child structure is used by the client only for ordering (parent first), never shown as a tree to a member.

### S5 · A business Ring forms after setup (journey, lands on [[Screen Index#s72|s72]])

**As a** visitor who just created a business account, **I want** the new business to appear in My companies and its business Ring in my Ring carousel, **so that** the business identity sits beside my personal Rings.

Acceptance criteria:
- [ ] After the setup flow of [[Exhibitor]] completes, s72 lists the company with my role as owner and s16 shows the `CORPORATE` Ring.
- [ ] The ring-forming motion from Ring creation plays once for the new business Ring.

## States and motion the design asks for

- State: list with companies, list with pending invitations, empty; detail loaded, leaving (progress), left.
- Motion: business-account creation **forms a business Ring** with the Ring-creation animation; leaving a company collapses its row out of the list; reduced-motion fallback is a fade.
- State on s73: file rows render as names only while bytes cannot be fetched.

## Rules the backend already enforces

- `CORPORATE` is an allowed type on `POST /rings`, with `parentRingId` required to be the caller's own (400 `E_RING_06`), so the hierarchy is owner-built ([[Rings Backend Integration]]).
- `GET /rings/shared-with-me` lists only Rings whose access is live right now (Ring window, membership window, no block), newest first, as Ring rows with `type` and `parentRingId`; it does not carry the business.
- A Ring's projection is read with `GET /views/ring/:ringId` through `RingAccessService`; an expired company Ring returns 404 `E_RING_ACCESS_02` to a member.
- The roster (`GET /rings/:ringId/members`) is owner or `MEMBER_MANAGER` admin only (403 `E_RING_05`); a plain member cannot count colleagues.
- Admin rights on a company Ring come from `RingAdmin` levels ([[Delegated Admins]]).

## Open questions

- Decided: [[DR-04 Ring settings at launch and their defaults]]: a plain member sees colleagues only where the Ring's "members can see each other" is on (S2). The **required work email domain** setting comes with this feature, not at launch.
- **Company Ring names.** [[DR-14 Shared with me lists people, never the Ring]] says a member never sees a Ring's name, and leaves open (*Still open*) whether a Ring joined openly, such as a company Ring, may show its name. The design of s73 shows the names. Until product answers, S2 and S4 follow DR-14; the answer belongs on a needs-decision card raised from this story.
- [[T-029 My companies and company detail]] — how a business and its Rings are linked for the member's list (the `Business` tables have no Ring reference in the feature note); the list needs that link to show "which of its Rings I am in".
- [[T-048 Business account setup → business Ring]] — whether team members on the stand become members of the employees Ring automatically, which is what makes S1 populate for an employee.
