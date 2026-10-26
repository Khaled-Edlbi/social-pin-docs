---
type: decision-record
id: DR-18
decision: D-18
status: decided
decidedBy: "molham"
decidedAt: 2026-10-25
features: [companies, ring-invitations]
affects: ["Companies", "Ring Invitations & Join", "Rings", "Ring Members", "Ring Access Engine", "Companies Story", "Ring Invitations & Join Story"]
related: ["Company and invited Ring names shown to members", "DR-14 Shared with me lists people, never the Ring", "DR-04 Ring settings at launch and their defaults"]
owner: "khaled"
created: 2026-10-25
updated: 2026-10-26
tags: [decision-record, decision-record/decided]
---

# ⚖️ DR-18 · Ring names shown when joined knowingly

**Answers:** [[Company and invited Ring names shown to members]] · **Decided by:** molham · **On:** 2026-10-25 · **Feature:** [[Companies]], [[Ring Invitations & Join]]

> This card is the answer to [[Company and invited Ring names shown to members]]. The needs-decision card keeps the question, the facts and the options; this decision card says what was decided, why, and what it changes. `draft` while the answer is prepared; `decided` only by the PM or the owner, on the user's word, with `decidedBy` and `decidedAt`: then [[Company and invited Ring names shown to members]] shows Fulfilled by itself and the cards it blocked continue.

## What was decided

**Option 2 on D-18: a Ring's name is shown to a member who joined it knowingly, and never to one the owner placed in it.** This is the one exception to [[DR-14 Shared with me lists people, never the Ring]].

| How the person got into the Ring | They see its name |
|---|---|
| Accepted an invitation to it | yes, from the invitation on |
| Joined with a code | yes |
| Joined with a verified work email | yes |
| The owner accepted their connection request into it | **never** |
| The owner (or an admin) added them | **never** |

- An **invitation names the Ring** it is for (s17, s74), so the invitee knows what they are joining.
- **Company detail** (s73) names the company Rings the member joined knowingly ("Acme Team", "Company"); a company Ring the member was placed in is listed unnamed, as DR-14 says.
- Where a Ring is named, its **name** is shown; its colour, type and place in a company's hierarchy are not.
- Everything else in DR-14 holds: Shared with me lists people, and a connection-granted Ring is never named.

Options 1 (never, no exception) and 3 (a per-Ring setting for the owner) are ruled out.

Decided by molham on 2026-10-25, after the question was explained in product terms: DR-14 protects people from learning how an owner **grouped** them; a person who chose to join a named Ring already knows its name.

## Why

- The privacy concern behind DR-14 is a person **placed** in "Acquaintances" by the owner learning it. Someone who accepted an invitation to "TechSummit Speakers", or typed a company's code, learns nothing new from the name.
- Company and invited Rings are unusable without names: an employee in two Rings of one company could not tell them apart, and an invitee would accept without knowing what for.
- No new setting for owners to understand (option 3), and the design's s17, s72, s73 and s74 stay as drawn.
- Traded away: the membership has to remember **how it was created** (invitation, code, work email, connection accept, owner add), and every member-facing route has to check it before it names a Ring.

## What it changes

- [[Companies]]: s73 names the company Rings the member joined knowingly; [[Companies Story]] is no longer blocked and its S2 and S4 follow this card.
- [[Ring Invitations & Join]]: an invitation and the review screen name the Ring; a Ring joined by invitation, code or work email keeps showing its name; [[Ring Invitations & Join Story]] is no longer blocked and its S1 and S2 follow this card.
- [[Rings]]: `GET /rings/shared-with-me` may return a Ring's name only for a membership created by invitation, code or work email; never for a connection accept or an owner add.
- [[Ring Members]]: a membership records how it was created; reassigning someone into another Ring is an owner action, so the target Ring is never named to them.
- [[Ring Access Engine]]: decides, per membership, whether a Ring may be named to that member.

## Still open

- A person **reassigned** by the owner from a Ring they joined knowingly into another Ring: this card reads it as placed (the new Ring is never named). Confirm when the story that builds reassign is approved.
- Whether the Ring's "who it's for" label ([[DR-04 Ring settings at launch and their defaults]]) shows alongside the name on an invitation was not asked; the natural reading is yes for a Ring that is named.
- How a membership records its origin is the backend's to design (the [[Ring Members]] delivery note when built).
