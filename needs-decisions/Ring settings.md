---
type: needs-decision
id: ND-04
aliases: [ND-04]
status: open
features: [rings, ring-members, ring-invitations, delegated-admins, companies]
screens: [s19, s22, s26, s27]
created: 2026-10-15
updated: 2026-10-26
tags: [needs-decision, needs-decision/open]
---

# ✅ ND-04 · Ring settings

**Status:** decided (2026-10-25, the launch set and defaults; storage left to the backend) · **Decider:** product + backend lead · **Raised:** 2026-10-15

## Where the design and the backend disagree

The Edit Access / Permissions screens show settings the schema does not have: who the Ring is for, who can request to join, members can see each other, members can invite / save attachments / message me, see when I'm at an event, auto-accept vs approve each one, required verified email domain.

## Facts

- "Members can see each other" changes the rule in `CLAUDE.md` that only the owner can see who is in a Ring. It must be an explicit, default-off Ring setting enforced inside `RingAccessService`.
- Join rules (code, email domain, auto-accept) are prerequisites for [[Ring Invitations & Join]].

## Options

- **A. A `RingSettings` JSON column** on `Ring`: fast, but unvalidated at the DB.
- **B. Typed columns on `Ring`** (`audience`, `joinPolicy`, `membersVisible`, `membersCanInvite`, `membersCanSaveAttachments`, `membersCanMessage`, `showEventPresence`, `requiredEmailDomain`). Each becomes a DTO field and an access-engine input.

## Recommendation

B. These settings are access rules, and rule 8 wants them where the engine can read them.

## Affects

- [[Rings]]
- [[Ring Members]]
- [[Ring Invitations & Join]]
- [[Delegated Admins]]
- [[Companies]]

Screens: [[Screen Index#s19|s19]], [[Screen Index#s22|s22]], [[Screen Index#s26|s26]], [[Screen Index#s27|s27]]

## Tasks waiting on this

- [[T-026 Ring invitations invite, review, decline]]
- [[T-027 Join a Ring with a code or verified work email]]
- [[T-059 Decide Ring settings]]

## Decision

Fulfilled by [[D-04 Ring settings at launch and their defaults]], decided 2026-10-25 by molham: six settings at launch with private defaults; the storage option (A or B) is the backend's.
