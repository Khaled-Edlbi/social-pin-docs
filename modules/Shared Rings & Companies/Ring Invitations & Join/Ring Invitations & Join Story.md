---
type: story
code: ring-invitations
scope: feature
feature: ring-invitations
module: shared-rings
status: draft
screens: [s17, s74]
updated: 2026-10-25
owner: "omar"
related: ["DR-04 Ring settings at launch and their defaults", "DR-14 Shared with me lists people, never the Ring"]
tags: [story, story/draft, module/shared-rings, layer/business]
---

# Ring Invitations & Join · User Story

**Feature:** [[Ring Invitations & Join]] · **Status:** Draft (awaiting product sign-off) · **Frontend Requirements:** [[Ring Invitations & Join Frontend Requirements]] · **API Integration:** not yet (backend not built)

Being on the receiving end of someone else's Ring. A company invites its new hire into "Acme Team"; an organizer invites a speaker into "TechSummit Speakers"; a colleague hands over a join code. The person reviews what they are being offered, accepts or declines, or joins on their own with a code or a verified work address. Who may ask to join, and whether the owner approves each one, are the Ring's settings ([[DR-04 Ring settings at launch and their defaults]]). Once inside, the owner appears on Shared with me (as a person, never by the Ring's name: [[DR-14 Shared with me lists people, never the Ring]]) and the owner's projection becomes readable.

## Persona

An **invitee**: a personal user who received an invitation into a Ring they do not own, or who holds a join code from a company. They are on Shared with me (s17) or My companies (s72) and want to settle the invitation. The owner's side (sending the invite) is one action on the Ring people screen and is described only where it touches these screens.

## Stories

### S1 · Shared with me, with pending invitations ([[Screen Index#s17|s17]])

**As an** invitee, **I want** my pending invitations shown above the Rings I am already in, **so that** I can act on them where I expect to find shared Rings.

Acceptance criteria:
- [ ] The list of people who share with me renders as in [[Rings Story]] S3 (the person, never the Ring's name, colour or type); an *Invitations* section above it lists each pending invite with the owner's display name, who invited me and when it was sent.
- [ ] *Review invite* opens s74 for that invitation; *Join with a code* opens s74 with the code field focused.
- [ ] A Ring whose access lapsed (window closed, removed, blocked) disappears from the list on the next focus with no message.
- [ ] Empty state covers both: "No Rings shared with you yet" plus the join action.

### S2 · Review an invitation ([[Screen Index#s74|s74]])

**As an** invitee, **I want** to see what I am joining before I accept, **so that** I do not join a Ring blindly.

Acceptance criteria:
- [ ] Shows the owner (name, Pin name), the access window if the invite carries one, and who invited me: the owner, an admin, or a member when the Ring's "members can invite others" is on (off by default, [[DR-04 Ring settings at launch and their defaults]]).
- [ ] Following [[DR-14 Shared with me lists people, never the Ring]], it does not show the Ring's name, colour or type, nor its "who it's for" label; the design shows them, and whether an invitation may name the Ring is [[D-18 Company and invited Ring names shown to members]].
- [ ] *Join Ring* accepts; on success the Ring is in Shared with me and its projection opens; the prototype's path to s16 (My Rings) is a design slip, the destination is s17.
- [ ] *Decline* closes the invitation; the owner may invite again; the screen returns to where it came from (s17 or s72).
- [ ] An invitation to a Ring that has since expired or been deleted reads "This invitation is no longer valid" and offers only *Dismiss*.

### S3 · Join with a code ([[Screen Index#s74|s74]])

**As a** new employee holding a join code, **I want** to enter it and land in the company Ring, **so that** nobody has to invite me by hand.

Acceptance criteria:
- [ ] A code field with paste support; submit resolves the code to one Ring and shows the S2 review before joining, never a silent join.
- [ ] A wrong, expired or revoked code produces one neutral message ("This code doesn't work"); the UI never confirms that a Ring exists behind a partial code.
- [ ] A code works only on a Ring whose "who can request to join" allows a code (anyone who scans, or only with a code; the default is with a code or by invitation).
- [ ] With "approve each one" on, the default, submit shows "Request sent" and the owner approves; with it off, I join at once after the S2 review ([[DR-04 Ring settings at launch and their defaults]]).
- [ ] Rendered disabled with "not available yet" until the settings exist.

### S4 · Join with a verified work email ([[Screen Index#s74|s74]])

**As an** employee, **I want** to prove I own an address at the company's domain, **so that** I join the employees Ring without a code.

Acceptance criteria:
- [ ] The user enters a work address; the domain must match the Ring's required domain; a one-time code is sent to that address and entered on the same screen.
- [ ] On verification the S2 review shows and *Join Ring* completes; the verified address is not added to my profile unless I say so.
- [ ] A mismatching domain gets the same neutral message as a wrong code.
- [ ] Rendered disabled with "not available yet" until the required domain exists on the Ring; that setting is not in the launch set and comes with [[Companies]] ([[DR-04 Ring settings at launch and their defaults]]).

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

## States and motion the design asks for

- State: invitation pending, accepted, declined, no longer valid; code entry idle, checking, rejected, approval pending.
- Motion: joining a Ring plays the **new ring forming** animation into the Shared with me carousel; declining collapses the invitation row out; reduced-motion fallback is a fade.
- State on s17: the live list and the invitations section load independently; one failing does not blank the other.

## Rules the backend already enforces

- `GET /rings/shared-with-me` returns only Rings whose access is live now: Ring window and membership window both open, no block ([[Rings Backend Integration]]). An invitation must not appear there as a member row.
- Access is resolved per request; after *Join Ring* the next `GET /views/ring/:ringId` already works, and after a revoke it already fails.
- A member never reads their own membership row.
- "Members can see each other" does not exist yet; it is a launch setting, off by default, and while it is off joining a Ring never shows who else is in it ([[DR-04 Ring settings at launch and their defaults]]).
- An expired Ring returns 404 `E_RING_ACCESS_02` to a member; S2's "no longer valid" state maps to that.

## Open questions

- Decided: [[DR-04 Ring settings at launch and their defaults]] (join policy and approval in S3, "members can invite" in S2; the email domain of S4 comes later). S3 and S4 stay disabled until the settings are built (not ticketed yet).
- [[D-18 Company and invited Ring names shown to members]] — whether an invitation, and a Ring joined through it or a code, may name the Ring (DR-14's *Still open* point; the design names it on s17 and s74). Blocks this story; until it is decided, S1 and S2 follow DR-14.
- [[T-026 Ring invitations invite, review, decline]] — whether an invitation is a `RingMember` in an invited state or its own object; what the invite carries (window, purpose, inviter).
- [[T-027 Join a Ring with a code or verified work email]] — how the work email is verified; the sign-up OTP machinery exists but is not scoped for this.
- [[T-028 What you contribute to a shared Ring]] — the member-side projection of S6; not in the schema.
- [[T-008 Resolve a scanned QR token]] — whether a token can carry a join offer (S5), which must not depend on the colleague's membership.
