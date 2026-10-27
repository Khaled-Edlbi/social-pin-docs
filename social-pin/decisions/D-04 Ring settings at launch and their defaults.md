---
type: decision
id: D-04
decision: ND-04
status: decided
decidedBy: "molham"
decidedAt: 2026-10-25
features: [companies, delegated-admins, ring-invitations, ring-members, rings]
affects: ["Rings", "Ring Members", "Ring Invitations & Join", "Delegated Admins", "Companies", "Ring Access Engine", "T-026 Ring invitations invite, review, decline", "T-027 Join a Ring with a code or verified work email", "Rings Story"]
related: ["ND-04 Ring settings", "Ring Access Model"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-27
tags: [decision, decision/decided]
---

# ⚖️ D-04 · Ring settings at launch and their defaults

**Answers:** [[ND-04 Ring settings]] · **Decided by:** molham · **On:** 2026-10-25 · **Feature:** [[Companies]], [[Delegated Admins]], [[Ring Invitations & Join]], [[Ring Members]], [[Rings]]

> This card is the answer to [[ND-04 Ring settings]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[ND-04 Ring settings]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Six settings at launch, three later, each with its default.**

| Setting | At launch | Default |
|---|---|---|
| Who it's for (a label: "Clients", "Investors") | yes | empty |
| Who can request to join: anyone who scans, only with a code, or only invited | yes | **only with a code or by invitation** |
| Auto-accept, or approve each one | yes | **approve each one** |
| Members can see each other | yes | **off** |
| Members can invite others | yes | **off** |
| Members can save attachments | yes | **off** |
| Required work email domain | later, with [[Companies]] | — |
| Members can message me | later, with messaging | — |
| See when I'm at an event | later, with events | — |

- **Members can see each other**, when the owner turns it on, shows members each other's **full cards**, not just names.
- **Who can change the settings:** the Ring's owner **and the Ring's admins** ([[Delegated Admins]]).
- The needs-decision card's options A (a JSON column) and B (typed columns) are about storage and were not put to product; the backend chooses, and the card's recommendation, B, stands unless the backend says why not.

Answered on the product-questions page, 2026-10-22 (defaults, what members see, who can change the settings), with the launch set and the remaining defaults proposed by the owner agent and accepted by molham on 2026-10-25.

## Why

- Approving each request and keeping members invisible to each other are the safe defaults: the owner chooses who gets in and members learn nothing about each other unless the owner turns it on, which keeps the rule that only the owner sees who is in a Ring as the default.
- Every default is the more private choice; an owner opens a Ring up, never has to close it.
- The three later settings depend on things not built yet (company domains, messaging, events), so building them now would be settings that do nothing.
- Letting admins change the settings is what makes a delegated admin useful for a company or community Ring.
- Traded away: a Ring that wants open joining has to change a setting.

## What it changes

- [[Rings]]: a Ring carries the six launch settings with these defaults; the edit-access and permissions screens (s19, s22, s26, s27) show those six.
- [[Ring Access Engine]]: "members can see each other", "members can invite" and "members can save attachments" are access rules it enforces; with the first off, only the owner sees who is in the Ring, as today.
- [[Ring Members]]: the members list is visible to members only when the Ring allows it, and then with full cards.
- [[Ring Invitations & Join]]: joining follows "who can request to join" and "approve each one"; [[T-026 Ring invitations invite, review, decline]] and [[T-027 Join a Ring with a code or verified work email]] are no longer waiting on this decision (T-027's verified work email waits for the domain setting, which comes later).
- [[Delegated Admins]]: an admin may change a Ring's settings.
- [[Companies]]: the required work email domain is part of the company work, not the launch set.
- [[Rings Story|Rings · Decide Ring settings]]: its decision is taken; the PM closes it.

## Still open

- **Whose card a member sees** when members can see each other: the card each member shares with that Ring is the natural reading; the Ring Members story says it, a needs-decision card if it is contested.
- Whether an admin may change *every* setting or only some (for example not "who it's for") was not asked; until it is, all of them.
- The storage choice (A or B on ND-04) is the backend's, recorded in its delivery note when built.
