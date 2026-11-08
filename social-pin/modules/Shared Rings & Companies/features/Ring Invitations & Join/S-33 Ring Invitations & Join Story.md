---
id: S-33
type: story
module: shared-rings
feature: ring-invitations
status: draft
scope: feature
screens: [s15, s17, s19, s26, s43, s72, s73, s74]
owner: "Omar Fostok"
related: ["D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-18 Ring names shown when joined knowingly", "ND-31 What an invitation is", "ND-32 How a Ring's join code works", "ND-33 When a work email is checked", "ND-34 What a member contributes to a shared Ring", "ND-35 A colleague's QR offering their company Ring", "ND-36 Whether an invitee sees who a Ring is for", "S-16 Ring Members Story", "S-18 Rings Story", "S-29 Companies Story", "S-31 Delegated Admins Story", "S-37 Badge & QR Story", "BI-08 Rings Backend Integration", "FR-15 Companies Frontend Requirements"]
created: 2026-10-18
updated: 2026-11-08
tags: [story, story/draft, module/shared-rings, layer/business]
---

# Ring Invitations & Join · User Story

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** Draft (rewritten 2026-11-08, six questions open) · **Frontend Requirements:** [[FR-17 Ring Invitations & Join Frontend Requirements]] · **API Integration:** not yet (backend not built)

> **Rewritten 2026-11-08** as one set of parts, ordered as the journey happens, against backend `main` @ `12172c6` ([[BI-08 Rings Backend Integration]]), [[D-04 Ring settings at launch and their defaults]] and [[D-18 Ring names shown when joined knowingly]]. The merged tasks T-026 to T-028 (old S7–S9) are folded into the parts below. The owner's side, which [[S-16 Ring Members Story]] and [[S-18 Rings Story]] handed to this story, is S6–S8; the company asks of [[FR-15 Companies Frontend Requirements]] are in S1 and S5. Six questions are open as needs-decision cards (ND-31 to ND-36); every part that waits on one says so.

Being let into someone else's Ring **knowingly**. A company invites its new hire into "Acme Team"; an organizer invites a speaker into "TechSummit Speakers"; a colleague hands over a join code; an employee proves their work address. The person sees what they are joining, accepts or declines, or asks to join and waits for the owner. Who may ask and whether the owner approves each one are the Ring's settings ([[D-04 Ring settings at launch and their defaults]]). Because the person chose to join, the Ring keeps its **name** for them on Shared with me, the one exception to [[D-14 Shared with me lists people, never the Ring]] ([[D-18 Ring names shown when joined knowingly]]).

**What exists today** (backend `main` @ `12172c6`): the six Ring settings, saved with their defaults; "members can see each other" **enforced**, the other four saved and enforced only when this story ships; Shared with me as **people**, each row with a `ringName` and a `memberCount` that are always `null` until a membership records how it was made ([[BI-08 Rings Backend Integration]]). No invitation, code, join request or work-email check exists.

## Persona

- **The joiner**: a personal user invited into a Ring they don't own, or holding a code from a company, or with a work address at its domain. On Shared with me ([[Screen Index#s17|s17]]), My companies ([[Screen Index#s72|s72]]) or the join screen ([[Screen Index#s74|s74]]).
- **The owner**, and the Ring's admins at "can also manage who's in it" ([[S-31 Delegated Admins Story|Delegated Admins · A4]]): who invite, manage the code and approve requests, from the Ring's people ([[Screen Index#s15|s15]]) and Edit Ring's *Joining and permissions* ([[Screen Index#s26|s26]]).

## Stories

### S1 · Shared with me: my invitations, and the Rings I joined ([[Screen Index#s17|s17]])

**As a** joiner **I want** my pending invitations above the people who share with me **so that** I settle them where I look for what's shared with me.

Acceptance criteria:
- [ ] An **Invitations** section above the list: each pending invitation with the Ring's **name** (an invitation names its Ring, D-18), the owner's name, who invited me and when; *Review* → s74 for it. Hidden while empty. What an invitation is: [[ND-31 What an invitation is]].
- [ ] An invitation to a company Ring also carries the company (`business { id, name, logoFileId }`), so s72 can list it **by company** ([[S-29 Companies Story|Companies · S3]], [[FR-15 Companies Frontend Requirements|FR-15]]).
- [ ] The people list is `GET /rings/shared-with-me` as it is: one row per person (exists). On a row I **joined knowingly**, `ringName` is shown with the person ("Acme Team · Shared by Acme Studio"), and "· N people" only when `memberCount` is not `null` (the Ring lets members see each other). Never its colour or type. Not available yet: `ringName` and `memberCount` are always `null` until joining records how it was made (S2–S4).
- [ ] *Join with a code* opens s74 with the code field ready.
- [ ] An invitation to a Ring that ended or was deleted reads "This invitation is no longer valid" with *Dismiss* only (`valid: false`, FR-15).
- [ ] The two load separately: one failing doesn't blank the other. Empty: "Nothing shared with you yet" and *Join with a code*.

### S2 · Review an invitation ([[Screen Index#s74|s74]])

**As a** joiner **I want** to see what I'm joining before I accept **so that** I never join a Ring blindly.

Acceptance criteria:
- [ ] Shows the Ring's **name**, the owner (name, Pin name, photo), who invited me (the owner, an admin, or a member when the Ring lets members invite others), and the access window if the invitation carries one. Never the Ring's colour or type.
- [ ] Whether the Ring's "who it's for" line shows here: [[ND-36 Whether an invitee sees who a Ring is for]]. As built it is the owner's alone ("Only you see this").
- [ ] **Join Ring** accepts: I become a member recorded as **joined knowingly**; the owner is on Shared with me with the Ring's name and their card opens. The design's path to s16 (My Rings) is a slip: the destination is s17.
- [ ] **Decline** closes it; the owner may invite me again; back to where I came from (s17 or s72).
- [ ] An invitation that is no longer valid (S1) offers only *Dismiss*.
- [ ] Not available yet: invitations ([[ND-31 What an invitation is]]).

### S3 · Join with a code ([[Screen Index#s74|s74]])

**As a** new employee holding a code **I want** to type it and land in the company Ring **so that** nobody has to invite me by hand.

Acceptance criteria:
- [ ] A code field with paste; submit resolves the code to one Ring and shows the S2 review before anything happens, never a silent join.
- [ ] A wrong, replaced or turned-off code gets one message, "This code doesn't work", and never confirms that a Ring is behind a partial code; tries are limited.
- [ ] A code works only where the Ring's "who can request to join" allows it: anyone who scans, or with a code or invitation (the default); never "only by invitation".
- [ ] With "approve each one" on (the default), *Join Ring* sends a **join request** and shows "Request sent: {owner} will approve it" (S5, S8); off, I join at once.
- [ ] What a code is: [[ND-32 How a Ring's join code works]]. Not available yet.

### S4 · Join with a verified work email ([[Screen Index#s74|s74]])

**As an** employee **I want** to prove I own an address at my company's domain **so that** I join its Ring without a code.

Acceptance criteria:
- [ ] I type my work address; its domain must be the Ring's **required work email domain** ([[S-29 Companies Story|Companies · S12]]); a six-digit code goes to that address and is typed on the same screen.
- [ ] Then the S2 review; *Join Ring* joins, or sends a request when the Ring approves each one.
- [ ] A domain that doesn't match gets the same neutral message as a wrong code.
- [ ] The address is never added to my profile; Company detail shows it ([[S-29 Companies Story|Companies · S5]]). When it is checked, and whether ever again: [[ND-33 When a work email is checked]].
- [ ] Not available yet: the domain setting (S-29 S12), and code delivery by email ([[S-78 Code Delivery Story|Code Delivery · S6]]).

### S5 · My join requests: waiting, cancelled, declined ([[Screen Index#s72|s72]], [[Screen Index#s17|s17]])

**As a** joiner **I want** to see the requests I sent and cancel one **so that** I know where I stand.

Acceptance criteria:
- [ ] My pending and declined requests, newest first: the Ring's name, the company when it is a company Ring, when I asked, and the status (`PENDING`, `DECLINED`). On s72 by company ([[S-29 Companies Story|Companies · S3]]); on s17 under Invitations.
- [ ] **Cancel** a pending request; **Dismiss** a declined one. Both remove it from my list.
- [ ] Approved: the request is not listed any more, and the Ring is on Shared with me (and the company on s72) on the next refetch.
- [ ] A declined request tells me only "Not accepted": never why.
- [ ] Not available yet.

### S6 · Invite someone into my Ring ([[Screen Index#s15|s15]], [[Screen Index#s19|s19]], [[Screen Index#s26|s26]])

**As a** Ring owner **I want** to invite a person into a Ring by name **so that** they join knowingly and see what they joined.

Acceptance criteria:
- [ ] *Invite* on the Ring's people (s15), and in the New Ring wizard's step 2 (s19): pick a connection, or type a Pin name; an optional access window. Sent as one invitation per person ([[ND-31 What an invitation is]]).
- [ ] Beside it, one line: "**People who join this way will see this Ring's name.**" ([[D-18 Ring names shown when joined knowingly]]), matching the Ring's name copy ("Only you see this name, unless someone joins it with an invitation or a code.", [[S-18 Rings Story|Rings · S1, S5]]).
- [ ] Who may invite: the owner; an admin at "can also manage who's in it" ([[S-31 Delegated Admins Story|Delegated Admins · A4]]); a member only when "members can invite others" is on (off by default, D-04).
- [ ] **Invited · N** on s15: the invitations I sent and haven't been answered, each with *Withdraw*; a declined one shows as declined, never why. They are never counted as members.
- [ ] An invitation works whatever the Ring's "who can request to join" says: the policy limits who may **ask**, never whom the owner invites.
- [ ] Not available yet.

### S7 · The Ring's join code (Edit Ring · *Joining and permissions*, [[Screen Index#s26|s26]])

**As a** Ring owner **I want** a code I can hand out **so that** people join without me inviting each one.

Acceptance criteria:
- [ ] Under *Joining and permissions*, when the policy allows codes: the Ring's code, **Share**, **Make a new code** (the old one stops working at once) and **Turn off**; with the D-18 line under it.
- [ ] Changed by the owner and admins at "can also manage who's in it" (A4); hidden when the policy is "only by invitation".
- [ ] Its shape, end and revoke: [[ND-32 How a Ring's join code works]]. Not available yet. **For the designer:** the owner's code section is not drawn.

### S8 · Approve people who asked to join ([[Screen Index#s15|s15]])

**As a** Ring owner **I want** to approve or decline each request **so that** a Ring that approves each one stays mine to fill.

Acceptance criteria:
- [ ] "**Waiting on you · N**" on s15, as [[S-16 Ring Members Story|Ring Members · S9]] draws it: the person (name, headline), how they asked ("with your code", "with a work email at acme.co"), how long ago, **Add** and **Decline**.
- [ ] **Add** makes them a member at once, recorded as **joined knowingly**; **Decline** ends the request (they see "Not accepted", S5).
- [ ] Requests exist only while "approve each one" is on (the default); turning it off leaves the waiting ones to decide.
- [ ] Approved by the owner and admins at "can also manage who's in it" (A4).
- [ ] Not available yet: nothing makes requests (S3, S4).

### S9 · Join from a QR ([[Screen Index#s43|s43]] → [[Screen Index#s74|s74]])

**As an** employee **I want** one scan at the desk to bring me to the company Ring **so that** joining is quick.

Acceptance criteria:
- [ ] Which QR, and whether at all: [[ND-35 A colleague's QR offering their company Ring]]. A personal badge never offers a Ring: that would tell a stranger which Ring its holder is in (D-14).
- [ ] Not built; shown nowhere until decided.

### S10 · What I show the Ring's members (after *Join Ring*, [[Screen Index#s74|s74]])

**As a** member of a company Ring **I want** to choose what the other members see of me **so that** joining doesn't expose my whole profile.

Acceptance criteria:
- [ ] Asked only on a Ring that lets members see each other; on any other Ring there is nothing to choose and nothing is shown.
- [ ] What I choose: [[ND-34 What a member contributes to a shared Ring]]. The default shows nothing more of me than a stranger who scans me already sees.
- [ ] Not built.

### S11 · Inside the Ring ([[Screen Index#s17|s17]] → the person's card)

**As a** member **I want** to know what joining lets me see **so that** I'm not surprised by what others see of me.

Acceptance criteria:
- [ ] The owner's card as that Ring shows it, named (D-18).
- [ ] "Members can see each other" **off** (the default, enforced today): no roster, no count, no other member anywhere.
- [ ] **On**: "Members · N" on the card, then each member's card ([[S-16 Ring Members Story|Ring Members · S8]]; whose card: ND-34). Not available yet: the member-facing roster route.
- [ ] Leaving: *Leave this Ring* on the card ends my membership; the owner isn't told. For a company, leaving the company ends all of it at once ([[S-29 Companies Story|Companies · P5]]).

### S12 · Being told

**As a** joiner or an owner **I want** one notification when something waits on me or is answered **so that** I don't have to check.

Acceptance criteria:
- [ ] An invitation received; a join request approved (to the joiner); a join request waiting (to the owner and the admins who approve).
- [ ] Never a decline, a withdrawal or a removal: those are silent.
- [ ] Sent once notifications exist ([[F-39 Notifications]]); no push carries a Ring's name except to someone who joined it knowingly.

## States and motion the design asks for

- States: invitation pending, accepted, declined, withdrawn, no longer valid; code idle, checking, refused; request sent, declined; owner's Invited and Waiting lists; the code section on, off.
- Motion: joining plays the **new ring forming** into Shared with me; declining collapses the row; reduced motion: a fade.

## Where the design disagrees (for the designer)

| Screen | The design | The story |
|---|---|---|
| s74 | *Join Ring* lands on My Rings (s16) | Shared with me (s17): I don't own the Ring |
| s74 | "a QR from a colleague" as a way in | Waits on ND-35; a personal badge never offers a Ring |
| s15 | "Scanned your badge" in Waiting | A join request with how they asked (S8, S-16 S9) |
| s26 | No owner side for codes or invitations | The code section (S7) and *Invite* (S6) |
| s74 | The review shows "who it's for" | Waits on ND-36; owner-only as built |

## What the backend has to build

1. **Invitations** ([[ND-31 What an invitation is]]): send (one per person, optional window), list mine (pending, with `business` on a company Ring and `valid`), accept, decline, dismiss; the owner's list with withdraw; enforced against `joinPolicy` and `membersCanInvite`.
2. **Joining records how**: a membership made by an accepted invitation, a code or a work email is **joined knowingly**; `ringName` (and `memberCount` when members can see each other) then fill on Shared with me (`isRingNamedToMember`, [[BD-11 Rings Backend Delivery]]).
3. **The join code** ([[ND-32 How a Ring's join code works]]): one per Ring, make new, turn off, resolve to the review, a try limit, refused under "only by invitation".
4. **Join requests**: made by a code or work email while "approve each one" is on; the owner's list per Ring (who, how, when), approve, decline; **mine**: `GET /rings/join-requests/mine` (`id`, `status`, `createdAt`, `business`, `ringName`) and `DELETE /rings/join-requests/:id` to cancel or dismiss ([[FR-15 Companies Frontend Requirements|FR-15]]).
5. **Work email** ([[ND-33 When a work email is checked]]): a code to the address, matched against the Ring's required domain ([[S-29 Companies Story|Companies · S12]]).
6. **The member-facing roster** when members can see each other, and what each member shows ([[ND-34 What a member contributes to a shared Ring]]).
7. **Leave a Ring** as a member.
8. **Notifications** of S12, with [[F-39 Notifications]].

## Rules the backend already enforces

- The six settings exist with D-04's defaults: `joinPolicy` `CODE_OR_INVITATION`, `requireApproval` on, `membersCanSeeEachOther` off, `membersCanInvite` off, `membersCanSaveAttachments` off, `purpose` empty; changed by the owner, or an admin at `CONTENT_MANAGER` or above ([[BI-08 Rings Backend Integration]]).
- `membersCanSeeEachOther` off means **no member-facing roster or count anywhere**; the other four are saved and enforced when this story ships.
- `purpose` is an owner-only label, never shown to a member (ND-36).
- Shared with me lists **people**, one row per owner, only live access (Ring live, membership live, no block either way); `ringName` and `memberCount` are `null` today; the row's `ringId` opens the card (D-15).
- Access is decided on every request: after *Join Ring* the card opens at once; after a removal it doesn't. An ended Ring answers 404 `E_RING_ACCESS_02` to a member: the "no longer valid" state.

## Open questions

- [[ND-31 What an invitation is]] (S1, S2, S6) · recommended: its own record.
- [[ND-32 How a Ring's join code works]] (S3, S7) · recommended: one code per Ring.
- [[ND-33 When a work email is checked]] (S4) · recommended: once, at joining.
- [[ND-34 What a member contributes to a shared Ring]] (S10, S11) · recommended: one of my own Rings.
- [[ND-35 A colleague's QR offering their company Ring]] (S9) · recommended: the Ring's join QR.
- [[ND-36 Whether an invitee sees who a Ring is for]] (S2) · recommended: owner-only, as built.
- Decided: [[D-04 Ring settings at launch and their defaults]], [[D-18 Ring names shown when joined knowingly]] (a member moved by the owner out of a Ring they joined knowingly reads as placed, D-18 *Still open*).

## Log

- 2026-11-08 · `tickets/pm/M-03-shared-rings/F-17-ring-invitations/S-33-rewrite` · rewritten as one set of parts (S1–S12) against backend `main` @ `12172c6`, D-04 and D-18; the owner's side from S-16 S9 and S-18 (S6–S8), FR-15's company asks (S1, S5); ND-31 to ND-36 raised; the S-18 and S-16 flags answered and cleared; stays draft
- 2026-11-08 · flagged [[FR-17 Ring Invitations & Join Frontend Requirements]]: S-33 was rewritten (2026-11-08) as one set of parts S1-S12 against backend main 12172c6: invitations on s17 (by company for s72), review (s74), code, work email, my join requests (cancel, dismiss), the owner's Invite and Invited list, the join code on Joining and permissions, Waiting on you on s15, QR join, what a member shows, inside the Ring, notifications; six questions open as ND-31 to ND-36. The old S7-S9 (T-026 to T-028) are folded in
- 2026-11-08 · flagged [[BD-17 Ring Invitations & Join Backend Delivery]]: S-33 was rewritten (2026-11-08) as one set of parts S1-S12 against backend main 12172c6: invitations on s17 (by company for s72), review (s74), code, work email, my join requests (cancel, dismiss), the owner's Invite and Invited list, the join code on Joining and permissions, Waiting on you on s15, QR join, what a member shows, inside the Ring, notifications; six questions open as ND-31 to ND-36. The old S7-S9 (T-026 to T-028) are folded in
- 2026-11-08 · flagged [[F-17 Ring Invitations & Join]]: S-33 was rewritten (2026-11-08) as one set of parts S1-S12 against backend main 12172c6: invitations on s17 (by company for s72), review (s74), code, work email, my join requests (cancel, dismiss), the owner's Invite and Invited list, the join code on Joining and permissions, Waiting on you on s15, QR join, what a member shows, inside the Ring, notifications; six questions open as ND-31 to ND-36. The old S7-S9 (T-026 to T-028) are folded in
