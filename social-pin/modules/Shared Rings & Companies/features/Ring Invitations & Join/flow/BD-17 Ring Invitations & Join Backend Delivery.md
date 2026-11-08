---
id: BD-17
type: backend-delivery
module: shared-rings
feature: ring-invitations
status: todo
scope: feature
screens: [s17, s74]
created: 2026-10-18
updated: 2026-10-29
tags: [backend-delivery, backend-delivery/todo, module/shared-rings, layer/backend]
---

# ⬜ Ring Invitations & Join · Backend Delivery

> ⚠ Affected by [[D-33 Work email joining waits for real emails and Companies]] (2026-11-08): ND-33 decided "not now": nothing to build for work-email joining in this version (no verification route, no address on the membership); it waits on Code Delivery (S-78) and Companies S-29 S12

> ⚠ Affected by [[D-32 Several join codes per Ring]] (2026-11-08): ND-32 decided 2026-11-08 by Omar Fostok, option 2: several join codes per Ring (up to 10 active), each 8 characters without look-alikes (K7QM-4RXT) with a required owner-only label, an optional end date and an optional use limit; Turn off per code, Make a new code adds one; one neutral message for a wrong, off, ended or used-up code, tries limited per person; with approve-each-one on a code makes a join request showing which code was used; managed under Edit Ring → Joining → Join codes by the owner (later admins who manage who's in it)

> ⚠ Affected by [[D-31 An invitation is its own record]] (2026-11-08): ND-31 decided 2026-11-08 by Omar Fostok, option 1: an invitation is its own record (Ring, invitee, inviter, optional window, PENDING/ACCEPTED/DECLINED/WITHDRAWN), never a membership while pending; accept creates the membership recorded as joined knowingly; decline, withdraw, 30-day expiry, valid:false on an ended Ring

> ⚠ Affected by [[S-33 Ring Invitations & Join Story]] (2026-11-08): S-33 was rewritten (2026-11-08) as one set of parts S1-S12 against backend main 12172c6: invitations on s17 (by company for s72), review (s74), code, work email, my join requests (cancel, dismiss), the owner's Invite and Invited list, the join code on Joining and permissions, Waiting on you on s15, QR join, what a member shows, inside the Ring, notifications; six questions open as ND-31 to ND-36. The old S7-S9 (T-026 to T-028) are folded in

> ⚠ Affected by [[D-04 Ring settings at launch and their defaults]] (2026-10-25): ND-04 decided, six Ring settings at launch with private defaults (join with a code or invite, approve each one, members can't see each other, invite or save attachments); the owner and the Ring's admins change them; members who may see each other see full cards.

**Feature:** [[F-17 Ring Invitations & Join]] · **Status:** To do · **Integration guide:** [[Ring Invitations & Join Backend Integration]] · **Requirements:** [[FR-17 Ring Invitations & Join Frontend Requirements]] · **QA:** [[Ring Invitations & Join QA Backend]]

What the backend shipped for this feature and how it works. The sum of this feature's task-level Backend Delivery notes (see the *Tasks* table below).

## Endpoints, tables and code

**Endpoints**

- `GET /rings/shared-with-me (list only)`

**Tables / models:** `RingMember`, `Ring`

### What exists

- The shared-with-me list.

### Gaps

- Invitation object (or a `RingMember` in an INVITED state) with accept / decline.
- Join code and required verified email domain: both need Ring settings, see [[ND-04 Ring settings]].
- "What you contribute" is a member-side projection into a shared Ring: new concept, not in the schema.

## Log

- 2026-10-18 · split out of [[F-17 Ring Invitations & Join]] when the vault moved to layers
