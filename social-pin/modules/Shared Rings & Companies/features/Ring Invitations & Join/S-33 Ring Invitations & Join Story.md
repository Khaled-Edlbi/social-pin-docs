---
id: S-33
type: story
module: shared-rings
feature: ring-invitations
status: draft
scope: feature
screens: [s15, s17, s19, s26, s43, s72, s73, s74]
owner: "Omar Fostok"
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-17 Requests expire after 30 days, optional note, ask again at once", "D-18 Ring names shown when joined knowingly", "D-31 An invitation is its own record", "D-32 Several join codes per Ring", "D-33 Work email joining waits for real emails and Companies", "D-34 A member shows one of their own Rings", "D-35 A join code can be shown as a QR", "D-36 Who it's for stays the owner's alone", "ND-31 What an invitation is", "ND-32 How a Ring's join code works", "ND-33 When a work email is checked", "ND-34 What a member contributes to a shared Ring", "ND-35 A colleague's QR offering their company Ring", "ND-36 Whether an invitee sees who a Ring is for", "S-16 Ring Members Story", "S-18 Rings Story", "S-29 Companies Story", "S-31 Delegated Admins Story", "S-37 Badge & QR Story", "S-78 Code Delivery Story", "BI-08 Rings Backend Integration", "FR-15 Companies Frontend Requirements"]
created: 2026-10-18
updated: 2026-11-08
tags: [story, story/draft, module/shared-rings, layer/business]
---

# Ring Invitations & Join · User Story

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** Draft (updated 2026-11-08, all six questions decided) · **Frontend Requirements:** [[FR-17 Ring Invitations & Join Frontend Requirements]] · **API Integration:** not yet (backend not built)

> **Rewritten 2026-11-08** as one set of parts, ordered as the journey happens, against backend `main` @ `12172c6` ([[BI-08 Rings Backend Integration]]), [[D-04 Ring settings at launch and their defaults]] and [[D-18 Ring names shown when joined knowingly]]; **updated the same day** with the answers to its six questions, [[D-31 An invitation is its own record|D-31]] to [[D-36 Who it's for stays the owner's alone|D-36]]. The merged tasks T-026 to T-028 (old S7–S9) are folded into the parts below. The owner's side, which [[S-16 Ring Members Story]] and [[S-18 Rings Story]] handed to this story, is S6–S8; the company asks of [[FR-15 Companies Frontend Requirements]] are in S1 and S5.

Being let into someone else's Ring **knowingly**. A company invites its new hire into "Acme Team"; an organizer invites a speaker into "TechSummit Speakers"; a company hands out a join code, or shows it as a QR at the welcome desk. The person sees what they are joining, accepts or declines, or asks to join and waits for the owner; once in, they choose which of their own Rings the other members see. Who may ask and whether the owner approves each one are the Ring's settings ([[D-04 Ring settings at launch and their defaults]]). Because the person chose to join, the Ring keeps its **name** for them on Shared with me, the one exception to [[D-14 Shared with me lists people, never the Ring]] ([[D-18 Ring names shown when joined knowingly]]).

**What exists today** (backend `main` @ `12172c6`): the six Ring settings, saved with their defaults; "members can see each other" **enforced**, the other four saved and enforced only when this story ships; Shared with me as **people**, each row with a `ringName` and a `memberCount` that are always `null` until a membership records how it was made ([[BI-08 Rings Backend Integration]]). No invitation, join code, join request or member's card choice exists.

## Persona

- **The joiner**: a personal user invited into a Ring they don't own, or holding a join code (typed or scanned) from a company. On Shared with me ([[Screen Index#s17|s17]]), My companies ([[Screen Index#s72|s72]]) or the join screen ([[Screen Index#s74|s74]]).
- **The owner**, and the Ring's admins at "can also manage who's in it" ([[S-31 Delegated Admins Story|Delegated Admins · A4]]): who invite, manage the join codes and approve requests, from the Ring's people ([[Screen Index#s15|s15]]) and Edit Ring's *Joining and permissions* ([[Screen Index#s26|s26]]).

## Stories

### S1 · Shared with me: my invitations, and the Rings I joined ([[Screen Index#s17|s17]])

**As a** joiner **I want** my pending invitations above the people who share with me **so that** I settle them where I look for what's shared with me.

Acceptance criteria:
- [ ] An **Invitations** section above the list: each `PENDING` invitation with the Ring's **name** (an invitation names its Ring, D-18), the owner's name, who invited me and when; *Review* → s74 for it. Hidden while empty. An invitation is its own record, never a membership while pending ([[D-31 An invitation is its own record]]).
- [ ] An invitation to a company Ring also carries the company (`business { id, name, logoFileId }`), so s72 can list it **by company** ([[S-29 Companies Story|Companies · S3]], [[FR-15 Companies Frontend Requirements|FR-15]]).
- [ ] A pending invitation **expires after 30 days** and leaves the section ([[D-17 Requests expire after 30 days, optional note, ask again at once|D-17]]).
- [ ] The people list is `GET /rings/shared-with-me` as it is: one row per person (exists). On a row I **joined knowingly**, `ringName` is shown with the person ("Acme Team · Shared by Acme Studio"), and "· N people" only when `memberCount` is not `null` (the Ring lets members see each other). Never its colour or type. Not available yet: `ringName` and `memberCount` are always `null` until joining records how it was made (S2, S3).
- [ ] On a row I joined knowingly: "**Your card here: <my Ring> ›**" to change what I show its members (S10).
- [ ] *Join with a code* opens s74 with the code field ready.
- [ ] An invitation to a Ring that ended or was deleted reads "This invitation is no longer valid" with *Dismiss* only (`valid: false`, FR-15).
- [ ] The two load separately: one failing doesn't blank the other. Empty: "Nothing shared with you yet" and *Join with a code*.

### S2 · Review an invitation ([[Screen Index#s74|s74]])

**As a** joiner **I want** to see what I'm joining before I accept **so that** I never join a Ring blindly.

Acceptance criteria:
- [ ] Shows the Ring's **name**, the owner (name, Pin name, photo), who invited me (the owner, an admin, or a member when the Ring lets members invite others), and the access window if the invitation carries one. Never the Ring's colour or type.
- [ ] Never the Ring's "who it's for" line (`purpose`): it is the owner's alone ("Only you see this", [[D-36 Who it's for stays the owner's alone]]). A company that wants to say what its Ring is for writes it in the Ring's **bio**, which members see once they join.
- [ ] **Join Ring** accepts: the invitation becomes `ACCEPTED` and, in the same step, I become a member with the invitation's window, recorded as **joined knowingly**; then the "Your card in <Ring>" step (S10); then the owner is on Shared with me with the Ring's name and their card opens. The design's path to s16 (My Rings) is a slip: the destination is s17.
- [ ] **Decline** makes it `DECLINED`; the owner may invite me again; back to where I came from (s17 or s72).
- [ ] An invitation that is no longer valid (S1) offers only *Dismiss*.
- [ ] Not available yet: invitations.

### S3 · Join with a code ([[Screen Index#s74|s74]])

**As a** new employee holding a code **I want** to type it and land in the company Ring **so that** nobody has to invite me by hand.

Acceptance criteria:
- [ ] A code field with paste, for 8 characters shown grouped as **K7QM-4RXT** (letters and digits without look-alikes: no 0/O, 1/I); typed in any case, with or without the dash ([[D-32 Several join codes per Ring]]).
- [ ] Submit resolves the code to one Ring and shows the review (as S2, with the code in place of the inviter) before anything happens, never a silent join.
- [ ] A code that doesn't work, whether wrong, turned off, past its end date or used up, gets **one** message, "This code doesn't work", never the reason and never a hint that a Ring is behind it. Tries are limited per person (the numbers: `/backend` proposes them).
- [ ] A code works only where the Ring's "who can request to join" allows it: anyone who scans, or with a code or invitation (the default); never "only by invitation".
- [ ] With "approve each one" on (the default), *Join Ring* sends a **join request** and shows "Request sent: {owner} will approve it" (S5, S8); off, I join at once, then S10. Either way it counts as one use of that code, and I am recorded as **joined knowingly**.
- [ ] Not available yet.

### S4 · Join with a verified work email: not in this version

- [ ] **Left out of this version** ([[D-33 Work email joining waits for real emails and Companies]]): s74 and s72 offer no work-email way in, and nothing names it as "coming soon".
- [ ] It waits on real emails ([[S-78 Code Delivery Story|Code Delivery · S6]]) and the company Ring's work-email domain ([[S-29 Companies Story|Companies · S12]]). When both exist, a new needs-decision card settles whether the address is checked once at joining or every 12 months, starting from [[ND-33 When a work email is checked]].

### S5 · My join requests: waiting, cancelled, declined ([[Screen Index#s72|s72]], [[Screen Index#s17|s17]])

**As a** joiner **I want** to see the requests I sent and cancel one **so that** I know where I stand.

Acceptance criteria:
- [ ] My pending and declined requests, newest first: the Ring's name, the company when it is a company Ring, when I asked, and the status (`PENDING`, `DECLINED`). On s72 by company ([[S-29 Companies Story|Companies · S3]]); on s17 under Invitations.
- [ ] **Cancel** a pending request; **Dismiss** a declined one. Both remove it from my list.
- [ ] Approved: the request is not listed any more, the Ring is on Shared with me (and the company on s72) on the next refetch, and the "Your card in <Ring>" step (S10) is offered the next time I open it.
- [ ] A declined request tells me only "Not accepted": never why.
- [ ] Not available yet.

### S6 · Invite someone into my Ring ([[Screen Index#s15|s15]], [[Screen Index#s19|s19]], [[Screen Index#s26|s26]])

**As a** Ring owner **I want** to invite a person into a Ring by name **so that** they join knowingly and see what they joined.

Acceptance criteria:
- [ ] *Invite* on the Ring's people (s15), and in the New Ring wizard's step 2 (s19): pick a connection, or type a Pin name; an optional access window. One invitation per person, its own record: the Ring, the person, who invited them, the window, when it was sent, and `PENDING` ([[D-31 An invitation is its own record]]). Someone not on Social Pin yet can't be invited (no email or phone invitations).
- [ ] Beside it, one line: "**People who join this way will see this Ring's name.**" ([[D-18 Ring names shown when joined knowingly]]), matching the Ring's name copy ("Only you see this name, unless someone joins it with an invitation or a code.", [[S-18 Rings Story|Rings · S1, S5]]).
- [ ] Who may invite: the owner; an admin at "can also manage who's in it" ([[S-31 Delegated Admins Story|Delegated Admins · A4]]); a member only when "members can invite others" is on (off by default, D-04).
- [ ] **Invited · N** on s15: the invitations sent and not answered, each with *Withdraw* (the owner, or whoever sent it; it becomes `WITHDRAWN`); a declined one shows as declined, never why; after 30 days unanswered it expires and leaves the list. A pending invitation is never a member: no access to the card, not on the roster, not in any count.
- [ ] An invitation works whatever the Ring's "who can request to join" says: the policy limits who may **ask**, never whom the owner invites.
- [ ] Not available yet.

### S7 · The Ring's join codes (Edit Ring · *Joining* → **Join codes**, [[Screen Index#s26|s26]])

**As a** Ring owner **I want** codes I can hand out, one for each group **so that** people join without me inviting each one, and I can stop one without stopping the others.

Acceptance criteria:
- [ ] Under *Joining*, when the policy allows codes: **Join codes**, a list of the Ring's codes, each with its **label**, the code (K7QM-4RXT), its end date and use limit if set, how many have used it ("12 of 20 used"), and *Off* or *Ended* when it no longer works ([[D-32 Several join codes per Ring]]).
- [ ] **Make a new code** adds one: a **label**, required, up to 40 characters, seen only by the owner ("Onboarding week", "Speakers 2026"); an optional **end date**; an optional **use limit** (one use is one person who joined or asked to join with it). Up to **10 active** codes; at 10, *Make a new code* says to turn one off first. Nothing is replaced on its own.
- [ ] On each active code: **Share** (the code as text), **Show as QR** (S9) and **Turn off** (stops it at once, and its QR with it; it stays listed as *Off*).
- [ ] The D-18 line under the list: "People who join this way will see this Ring's name."
- [ ] Hidden when the policy is "only by invitation"; the codes are kept and work again if codes are allowed again.
- [ ] Managed by the owner, and later the admins at "can also manage who's in it" (A4).
- [ ] Not available yet. **For the designer:** the *Join codes* list and the add sheet are not drawn.

### S8 · Approve people who asked to join ([[Screen Index#s15|s15]])

**As a** Ring owner **I want** to approve or decline each request **so that** a Ring that approves each one stays mine to fill.

Acceptance criteria:
- [ ] "**Waiting on you · N**" on s15, as [[S-16 Ring Members Story|Ring Members · S9]] draws it: the person (name, headline), **which code they used** ("asked with *Onboarding week*"), how long ago, **Add** and **Decline**.
- [ ] **Add** makes them a member at once, recorded as **joined knowingly**; **Decline** ends the request (they see "Not accepted", S5).
- [ ] Requests exist only while "approve each one" is on (the default); turning it off leaves the waiting ones to decide.
- [ ] Approved by the owner and admins at "can also manage who's in it" (A4).
- [ ] Not available yet: nothing makes requests (S3).

### S9 · Join with a join QR ([[Screen Index#s43|s43]] → [[Screen Index#s74|s74]])

**As an** employee **I want** one scan at the welcome desk to bring me to the company Ring **so that** joining is quick.

Acceptance criteria:
- [ ] **Show as QR** on an active join code (S7) shows it full screen as a QR, with the code's text under it for those who type it ([[D-35 A join code can be shown as a QR]]). Only whoever manages the codes can show one; a member can't.
- [ ] Scanning it with the app's scanner (s43) opens the S3 review for that Ring, and everything about the code applies: the policy, "approve each one", its end date, its use limit, the try limit and the one neutral message.
- [ ] A **personal badge never offers a Ring to join**, and nothing about a person's memberships is ever read from a scan (D-14): a badge only ever opens a person's card ([[S-37 Badge & QR Story]]).
- [ ] Not available yet. **For the designer:** the Show as QR screen is not drawn.

### S10 · Your card in this Ring (after *Join Ring*, [[Screen Index#s74|s74]]; then [[Screen Index#s17|s17]])

**As a** member of a Ring I joined **I want** to choose which of my own Rings its other members see **so that** joining doesn't expose my whole profile, and my company sees my work card.

Acceptance criteria:
- [ ] Right after joining, one step: "**Your card in Acme Team**", a choice among my own Rings, pre-set to my **default Ring** (what a stranger who scans me already sees); *Done* keeps it ([[D-34 A member shows one of their own Rings]]).
- [ ] Asked on every Ring I join; under the choice, one line says who sees it: "Members see this card" when the Ring lets members see each other, "Nobody sees it unless the owner lets members see each other" when it doesn't. The choice is saved either way.
- [ ] Changed later from the Ring's row on Shared with me: "**Your card here: <my Ring> ›**" (S1).
- [ ] Members see what that Ring shows **as it is now**; never its name, and never that I have other Rings.
- [ ] If the picked Ring is deleted, the card falls back to my default Ring, and I can pick again.
- [ ] The choice ends with the membership (leaving, removal, the Ring ending). One choice per membership; there is no card to build or edit for the Ring.
- [ ] Not available yet. **For the designer:** the step is not drawn.

### S11 · Inside the Ring ([[Screen Index#s17|s17]] → the person's card)

**As a** member **I want** to know what joining lets me see **so that** I'm not surprised by what others see of me.

Acceptance criteria:
- [ ] The owner's card as that Ring shows it, named (D-18).
- [ ] "Members can see each other" **off** (the default, enforced today): no roster, no count, no other member anywhere.
- [ ] **On**: "Members · N" on the card, then each member's card: the Ring that member picked (S10), never its name ([[S-16 Ring Members Story|Ring Members · S8]]).
- [ ] A member who is also my connection opens **the card they picked for this Ring** from the Ring's members, and **the card they share with me** everywhere else (Shared with me, Connections). The two are never merged.
- [ ] Leaving: *Leave this Ring* on the card ends my membership and my card choice; the owner isn't told. For a company, leaving the company ends all of it at once ([[S-29 Companies Story|Companies · P5]]).
- [ ] Not available yet: the member-facing roster route.

### S12 · Being told

**As a** joiner or an owner **I want** one notification when something waits on me or is answered **so that** I don't have to check.

Acceptance criteria:
- [ ] An invitation received; a join request approved (to the joiner); a join request waiting (to the owner and the admins who approve).
- [ ] Never a decline, a withdrawal, an expiry or a removal: those are silent.
- [ ] Sent once notifications exist ([[F-39 Notifications]]); no push carries a Ring's name except to someone who joined it knowingly. What the invitation notification says, and whether it carries a note from the inviter: still open (D-31).

## States and motion the design asks for

- States: invitation pending, accepted, declined, withdrawn, expired, no longer valid; code idle, checking, refused; request sent, declined; owner's Invited and Waiting lists; join codes active, off, ended, used up, at the limit of 10; Show as QR; "Your card in <Ring>" picking, saved.
- Motion: joining plays the **new ring forming** into Shared with me; declining collapses the row; reduced motion: a fade.

## Where the design disagrees (for the designer)

| Screen | The design | The story |
|---|---|---|
| s74 | *Join Ring* lands on My Rings (s16) | The "Your card" step, then Shared with me (s17): I don't own the Ring |
| s74 | "a QR from a colleague" as a way in | A **join QR** shown by the company (S9, D-35); a personal badge never offers a Ring |
| s74 | A work-email way in | Not in this version (S4, D-33) |
| s74 | The review shows "who it's for" | Never: the owner's alone (D-36); the bio says what the Ring is for |
| s15 | "Scanned your badge" in Waiting | A join request with the code they used (S8, S-16 S9) |
| s26 | No owner side for codes or invitations | The *Join codes* list, its add sheet and Show as QR (S7, S9), and *Invite* (S6) |
| — | No step after *Join Ring* | "Your card in <Ring>" (S10) |

## What the backend has to build

1. **Invitations** ([[D-31 An invitation is its own record]]): their own record (Ring, invitee, inviter, optional window, sent at, `PENDING` / `ACCEPTED` / `DECLINED` / `WITHDRAWN`); send (one per person), list mine (pending, with `business` on a company Ring and `valid`), accept (creates the membership in the same step), decline, dismiss; the owner's list with withdraw; expiry after 30 days; enforced against `membersCanInvite`. A pending invitation grants nothing.
2. **Joining records how**: a membership made by an accepted invitation or a join code is **joined knowingly**; `ringName` (and `memberCount` when members can see each other) then fill on Shared with me (`isRingNamedToMember`, [[BD-11 Rings Backend Delivery]]).
3. **Join codes** ([[D-32 Several join codes per Ring]], [[D-35 A join code can be shown as a QR]]): several per Ring, up to 10 active; each with a required label (≤ 40, owner-only), an optional end date and use limit, a uses count; make, turn off, list; resolve a typed or scanned code to the review; one neutral error for wrong, off, ended or used up; a try limit per person; refused under "only by invitation". A join QR carries the code (or a token for it) and goes through the same checks; the badge resolve route never returns a join offer.
4. **Join requests**: made by a code while "approve each one" is on, recording which code; the owner's list per Ring (who, which code, when), approve, decline; **mine**: `GET /rings/join-requests/mine` (`id`, `status`, `createdAt`, `business`, `ringName`) and `DELETE /rings/join-requests/:id` to cancel or dismiss ([[FR-15 Companies Frontend Requirements|FR-15]]).
5. **Work email**: nothing in this version ([[D-33 Work email joining waits for real emails and Companies]]).
6. **The member's card** ([[D-34 A member shows one of their own Rings]]): one pointer on the membership to one of the member's own live Rings, set and changed by the member, defaulting to their default Ring and falling back to it when the picked Ring is deleted; the **member-facing roster** when members can see each other, each member's card rendered from their picked Ring through the access engine, without its name or id.
7. **Leave a Ring** as a member.
8. **Notifications** of S12, with [[F-39 Notifications]].

## Rules the backend already enforces

- The six settings exist with D-04's defaults: `joinPolicy` `CODE_OR_INVITATION`, `requireApproval` on, `membersCanSeeEachOther` off, `membersCanInvite` off, `membersCanSaveAttachments` off, `purpose` empty; changed by the owner, or an admin at `CONTENT_MANAGER` or above ([[BI-08 Rings Backend Integration]]).
- `membersCanSeeEachOther` off means **no member-facing roster or count anywhere**; the other four are saved and enforced when this story ships.
- `purpose` is an owner-only label, never shown to a member or an invitee (D-36).
- Shared with me lists **people**, one row per owner, only live access (Ring live, membership live, no block either way); `ringName` and `memberCount` are `null` today; the row's `ringId` opens the card (D-15).
- Access is decided on every request: after *Join Ring* the card opens at once; after a removal it doesn't. An ended Ring answers 404 `E_RING_ACCESS_02` to a member: the "no longer valid" state.

## Open questions

All six questions this story raised are decided:

- [[D-31 An invitation is its own record]] (S1, S2, S6), from ND-31.
- [[D-32 Several join codes per Ring]] (S3, S7, S8), from ND-32.
- [[D-33 Work email joining waits for real emails and Companies]] (S4), from ND-33: a new needs-decision card when Code Delivery and the work-email domain exist.
- [[D-34 A member shows one of their own Rings]] (S10, S11), from ND-34.
- [[D-35 A join code can be shown as a QR]] (S9), from ND-35.
- [[D-36 Who it's for stays the owner's alone]] (S2), from ND-36.
- Also decided: [[D-04 Ring settings at launch and their defaults]], [[D-18 Ring names shown when joined knowingly]] (a member moved by the owner out of a Ring they joined knowingly reads as placed, D-18 *Still open*).

Left by those decisions, none blocking:

- The try limit's numbers (D-32): `/backend` proposes them.
- How the scanner tells a join QR from a badge (D-35): `/backend` writes it in BD-17.
- What the invitation notification says, and whether it carries a note (D-31): with [[F-39 Notifications]].
- Not drawn: the *Join codes* list and add sheet, Show as QR, the "Your card in <Ring>" step: a designer, or the app's own style until then.

## Log

- 2026-11-08 · `tickets/pm/M-03-shared-rings/F-17-ring-invitations/S-33-rewrite` · rewritten as one set of parts (S1–S12) against backend `main` @ `12172c6`, D-04 and D-18; the owner's side from S-16 S9 and S-18 (S6–S8), FR-15's company asks (S1, S5); ND-31 to ND-36 raised; the S-18 and S-16 flags answered and cleared; stays draft
- 2026-11-08 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: S-33 was rewritten (2026-11-08) as one set of parts S1-S12 against backend main 12172c6: invitations on s17 (by company for s72), review (s74), code, work email, my join requests (cancel, dismiss), the owner's Invite and Invited list, the join code on Joining and permissions, Waiting on you on s15, QR join, what a member shows, inside the Ring, notifications; six questions open as ND-31 to ND-36. The old S7-S9 (T-026 to T-028) are folded in
- 2026-11-08 · flagged [[BD-17 Ring Invitations & Join Backend Delivery]]: S-33 was rewritten (2026-11-08) as one set of parts S1-S12 against backend main 12172c6: invitations on s17 (by company for s72), review (s74), code, work email, my join requests (cancel, dismiss), the owner's Invite and Invited list, the join code on Joining and permissions, Waiting on you on s15, QR join, what a member shows, inside the Ring, notifications; six questions open as ND-31 to ND-36. The old S7-S9 (T-026 to T-028) are folded in
- 2026-11-08 · flagged [[F-17 Ring Invitations & Join]]: S-33 was rewritten (2026-11-08) as one set of parts S1-S12 against backend main 12172c6: invitations on s17 (by company for s72), review (s74), code, work email, my join requests (cancel, dismiss), the owner's Invite and Invited list, the join code on Joining and permissions, Waiting on you on s15, QR join, what a member shows, inside the Ring, notifications; six questions open as ND-31 to ND-36. The old S7-S9 (T-026 to T-028) are folded in
- 2026-11-08 · `tickets/pm/M-03-shared-rings/F-17-ring-invitations/S-33-decisions` · updated with D-31 to D-36: invitations as their own record with 30-day expiry and withdraw (S1, S2, S6); several labelled join codes, a list under Joining → Join codes (S3, S7, S8); work email left out of this version (S4); Show as QR on each code and a join QR, never a personal badge (S9); the "Your card in <Ring>" step and colleagues' cards, with the card picked for the Ring opening from its members and the directly shared card everywhere else (S10, S11); no purpose on the review (S2); the six D flags cleared; Open questions closed; stays draft
- 2026-11-08 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: S-33 updated with D-31 to D-36: invitation statuses and 30-day expiry, a Join codes list (labels, end date, use limit, Show as QR), no work email, the "Your card in <Ring>" step and the colleagues' cards, no purpose on the review
- 2026-11-08 · flagged [[BD-17 Ring Invitations & Join Backend Delivery]]: S-33 updated with D-31 to D-36: "What the backend has to build" now reads the invitation record, several join codes with QR, no work email, the member's card pointer and the member-facing roster
