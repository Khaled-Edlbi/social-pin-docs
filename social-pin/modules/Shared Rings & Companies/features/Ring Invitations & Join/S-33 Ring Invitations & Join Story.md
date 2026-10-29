---
id: S-33
type: story
module: shared-rings
feature: ring-invitations
status: draft
scope: feature
screens: [s17, s74]
owner: "omar"
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-18 Ring names shown when joined knowingly"]
created: 2026-10-18
updated: 2026-10-29
tags: [story, story/draft, module/shared-rings, layer/business]
---

# Ring Invitations & Join · User Story

> ⚠ Affected by [[S-18 Rings Story]] (2026-10-29): where the owner invites someone or makes a code for a Ring, one line says "**People who join this way will see this Ring's name.**" (D-18), since the Ring's name copy (s09, s22) now reads "Only you see this name, unless someone joins it with an invitation or a code." The wizard's step 2 "Invite" (s19) is this story's.

> ⚠ Affected by [[S-16 Ring Members Story]] (2026-10-29): the **owner approves a Ring's join requests on s15** ("Waiting on you · N", S-16 S9): Add makes the person a member recorded as joined knowingly, Decline removes the request. This story makes the requests; s15 needs, per Ring, the pending requests with who asked, how (with a code, from the public card) and when.

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[FR-17 Ring Invitations & Join Frontend Requirements]] · **API Integration:** not yet (backend not built)

Being on the receiving end of someone else's Ring. A company invites its new hire into "Acme Team"; an organizer invites a speaker into "TechSummit Speakers"; a colleague hands over a join code. The person reviews what they are being offered, accepts or declines, or joins on their own with a code or a verified work address. Who may ask to join, and whether the owner approves each one, are the Ring's settings ([[D-04 Ring settings at launch and their defaults]]). Once inside, the owner appears on Shared with me with the Ring's name, because the person joined it knowingly ([[D-18 Ring names shown when joined knowingly]], the one exception to [[D-14 Shared with me lists people, never the Ring]]), and the owner's projection becomes readable.

## Persona

An **invitee**: a personal user who received an invitation into a Ring they do not own, or who holds a join code from a company. They are on Shared with me (s17) or My companies (s72) and want to settle the invitation. The owner's side (sending the invite) is one action on the Ring people screen and is described only where it touches these screens.

## Stories

### S1 · Shared with me, with pending invitations ([[Screen Index#s17|s17]])

**As an** invitee, **I want** my pending invitations shown above the Rings I am already in, **so that** I can act on them where I expect to find shared Rings.

Acceptance criteria:
- [ ] The list of people who share with me renders as in [[S-18 Rings Story]] S3: the person, with the Ring's **name** only for a Ring I joined by invitation, code or work email; never its colour or type ([[D-18 Ring names shown when joined knowingly]]).
- [ ] An *Invitations* section above it lists each pending invite with **the Ring's name**, the owner's display name, who invited me and when it was sent.
- [ ] *Review invite* opens s74 for that invitation; *Join with a code* opens s74 with the code field focused.
- [ ] A Ring whose access lapsed (window closed, removed, blocked) disappears from the list on the next focus with no message.
- [ ] Empty state covers both: "No Rings shared with you yet" plus the join action.

### S2 · Review an invitation ([[Screen Index#s74|s74]])

**As an** invitee, **I want** to see what I am joining before I accept, **so that** I do not join a Ring blindly.

Acceptance criteria:
- [ ] Shows the owner (name, Pin name), the access window if the invite carries one, and who invited me: the owner, an admin, or a member when the Ring's "members can invite others" is on (off by default, [[D-04 Ring settings at launch and their defaults]]).
- [ ] Shows **the Ring's name**, and its "who it's for" label if the owner wrote one, so I know what I am joining ([[D-18 Ring names shown when joined knowingly]]); never its colour or type.
- [ ] *Join Ring* accepts; on success the Ring is in Shared with me, named, and its projection opens; the prototype's path to s16 (My Rings) is a design slip, the destination is s17.
- [ ] *Decline* closes the invitation; the owner may invite again; the screen returns to where it came from (s17 or s72).
- [ ] An invitation to a Ring that has since expired or been deleted reads "This invitation is no longer valid" and offers only *Dismiss*.

### S3 · Join with a code ([[Screen Index#s74|s74]])

**As a** new employee holding a join code, **I want** to enter it and land in the company Ring, **so that** nobody has to invite me by hand.

Acceptance criteria:
- [ ] A code field with paste support; submit resolves the code to one Ring and shows the S2 review before joining, never a silent join.
- [ ] A wrong, expired or revoked code produces one neutral message ("This code doesn't work"); the UI never confirms that a Ring exists behind a partial code.
- [ ] A code works only on a Ring whose "who can request to join" allows a code (anyone who scans, or only with a code; the default is with a code or by invitation).
- [ ] With "approve each one" on, the default, submit shows "Request sent" and the owner approves; with it off, I join at once after the S2 review ([[D-04 Ring settings at launch and their defaults]]).
- [ ] Rendered disabled with "not available yet" until the settings exist.

### S4 · Join with a verified work email ([[Screen Index#s74|s74]])

**As an** employee, **I want** to prove I own an address at the company's domain, **so that** I join the employees Ring without a code.

Acceptance criteria:
- [ ] The user enters a work address; the domain must match the Ring's required domain; a one-time code is sent to that address and entered on the same screen.
- [ ] On verification the S2 review shows and *Join Ring* completes; the verified address is not added to my profile unless I say so.
- [ ] A mismatching domain gets the same neutral message as a wrong code.
- [ ] Rendered disabled with "not available yet" until the required domain exists on the Ring; that setting is not in the launch set and comes with [[F-15 Companies]] ([[D-04 Ring settings at launch and their defaults]]).

### S5 · Join via a colleague's QR ([[Screen Index#s43|s43]] → [[Screen Index#s74|s74]])

**As an** employee, **I want** scanning a colleague's badge to offer me the company Ring they belong to, **so that** joining is one scan at the desk.

Acceptance criteria:
- [ ] A scanned badge resolves to the colleague's Ring view, as any scan does; the "join this company Ring" offer appears only if the scanned token was issued for that purpose, never by reading which Ring the colleague is in.
- [ ] Not built in any form; shown nowhere until decided.

### S6 · What you contribute to a shared Ring ([[Screen Index#s74|s74]] after joining)

**As a** member of a company Ring, **I want** to choose what of mine the Ring may show to other members, **so that** joining does not expose my whole profile.

Acceptance criteria:
- [ ] After *Join Ring*, an optional step lists fields and links I can contribute; default is nothing.
- [ ] Not built; the step is skipped until the concept exists in the schema.

### S7 · Ring invitations invite, review, decline

*From T-026 (status then: Needs a decision), merged 2026-10-27.*

Likely a `RingMember` in an INVITED state with accept / decline endpoints. Notification on invite. Joining by invitation is one of the launch values of "who can request to join" (default: with a code or by invitation), and "members can invite others" is a launch setting, off by default ([[D-04 Ring settings at launch and their defaults]]).

Screens: [[Screen Index#s17|s17]] Shared with me


### S8 · Join a Ring with a code or verified work email

*From T-027 (status then: Blocked), merged 2026-10-27.*

Needs `joinPolicy`, join code and `requiredEmailDomain` on the Ring. Joining with a code is in the launch set ("who can request to join", default: with a code or by invitation; "approve each one" on by default); the required work email domain comes later, with [[F-15 Companies]], so the verified-work-email part waits for it ([[D-04 Ring settings at launch and their defaults]]).

Screens: [[Screen Index#s74|s74]] Join a company Ring


### S9 · What you contribute to a shared Ring

*From T-028 (status then: Needs a decision), merged 2026-10-27.*

A member-side projection inside someone else's Ring. Not in the schema; needs a product definition.

Screens: [[Screen Index#s74|s74]] Join a company Ring

## States and motion the design asks for

- State: invitation pending, accepted, declined, no longer valid; code entry idle, checking, rejected, approval pending.
- Motion: joining a Ring plays the **new ring forming** animation into the Shared with me carousel; declining collapses the invitation row out; reduced-motion fallback is a fade.
- State on s17: the live list and the invitations section load independently; one failing does not blank the other.

## Rules the backend already enforces

- `GET /rings/shared-with-me` returns only Rings whose access is live now: Ring window and membership window both open, no block ([[BI-08 Rings Backend Integration]]). An invitation must not appear there as a member row.
- Access is resolved per request; after *Join Ring* the next `GET /views/ring/:ringId` already works, and after a revoke it already fails.
- A member never reads their own membership row. Not available yet: the membership does not record how it was created (invitation, code, work email), which is what lets the app name the Ring ([[D-18 Ring names shown when joined knowingly]]).
- "Members can see each other" does not exist yet; it is a launch setting, off by default, and while it is off joining a Ring never shows who else is in it ([[D-04 Ring settings at launch and their defaults]]).
- An expired Ring returns 404 `E_RING_ACCESS_02` to a member; S2's "no longer valid" state maps to that.

## Open questions

- Decided: [[D-04 Ring settings at launch and their defaults]] (join policy and approval in S3, "members can invite" in S2; the email domain of S4 comes later). S3 and S4 stay disabled until the settings are built (not ticketed yet).
- Decided: [[D-18 Ring names shown when joined knowingly]] (S1 and S2 name the Ring; a Ring joined by invitation, code or work email stays named). The "who it's for" label beside the name on S2 is D-18's natural reading, not asked separately.
- [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S7]] — whether an invitation is a `RingMember` in an invited state or its own object; what the invite carries (window, purpose, inviter).
- [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S8]] — how the work email is verified; the sign-up OTP machinery exists but is not scoped for this.
- [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S9]] — the member-side projection of S6; not in the schema.
- [[S-37 Badge & QR Story|Badge & QR · S13–S18]] — whether a token can carry a join offer (S5), which must not depend on the colleague's membership.
