---
type: decision
id: D-18
status: open
features: [companies, ring-invitations]
blocks: ["Companies Story", "Ring Invitations & Join Story"]
decider: "owner"
screens: [s17, s72, s73, s74]
affects: ["Companies", "Ring Invitations & Join"]
related: ["DR-14 Shared with me lists people, never the Ring", "Companies", "Ring Invitations & Join", "Rings"]
owner: "omar"
created: 2026-10-25
updated: 2026-10-25
tags: [decision, decision/open]
---

# ✅ D-18 · Company and invited Ring names shown to members

**Status:** open · **Decider:** owner · **Raised:** 2026-10-25 · **Needed by:** [[Companies Story]], [[Ring Invitations & Join Story]] · **Feature:** [[Companies]], [[Ring Invitations & Join]]

> The needs-decision card: `draft` while the question is written, `open` once it is ready for the decider; it shows **Fulfilled** by itself once its decision card (DR-NN) is `decided`. The cards in `blocks` are **Blocked · D-18** while this is `draft` or `open` and return to their own status once it is fulfilled. Nobody edits their `status:` for this, and nobody types `fulfilled` or `decided` here.

## What has to be decided

Whether a member may ever see the **name** of a Ring they are in, when they joined it knowingly: a company Ring ("Acme Team", "Company") reached by invitation, code or verified work email, or any Ring whose invitation they accepted. [[DR-14 Shared with me lists people, never the Ring]] says a member never sees a Ring's name, colour or type, and leaves exactly this case open. The design names the Rings on My companies and Company detail ([[Screen Index#s72|s72]], [[Screen Index#s73|s73]]), on the invitations of Shared with me ([[Screen Index#s17|s17]]) and on the review screen ([[Screen Index#s74|s74]]). If names are never shown, a member of two Rings of one company cannot tell "Company" (public) from "Acme Team" (employees), and an invitee accepts without knowing what they join. If they are shown, the rule of DR-14 gets an exception that has to be drawn precisely, or a person placed in "Acquaintances" by a connection accept could learn it.

## Notes

- Today the two stories follow DR-14: [[Companies Story]] S2 and S4 show company Rings without their names; [[Ring Invitations & Join Story]] S1 and S2 show the owner and the inviter, never the Ring's name, colour, type or "who it's for" label.
- The concern behind DR-14 is a person **placed** in a Ring by its owner (a connection accepted into "Acquaintances", a member added by the owner) learning how the owner groups them. A person who **chose** to join a named Ring already knows its name: the invitation or the code told them.
- `GET /rings/shared-with-me` returns the Ring's name to every member today; DR-14 asks [[Rings]] to stop that. Whatever is decided here is an exception to that change, so the backend needs it before building it.
- The Ring settings of [[DR-04 Ring settings at launch and their defaults]] have no "show the name to members" switch; option 3 would add one.
- Company Rings are `CORPORATE`, nested with `parentRingId` ([[Companies Story]]); the parent / child structure is never shown to a member as a tree.

## Options

1. **Never**, as DR-14 reads today. Company detail lists the company's Rings I am in as the company's cards, unnamed; an invitation names the owner and the inviter only. The design's names are dropped.
2. **Named when joined knowingly.** A Ring shows its name to a member who joined it through an invitation they accepted, a code or a verified work email (company Rings included); never to someone the owner placed in it (a connection accept, an owner add). The invitation and the review screen name the Ring. Needs the membership to record how it was created.
3. **Owner's choice per Ring.** A new Ring setting, "members see this Ring's name", off by default; company and community Rings turn it on. Adds a seventh setting to the launch set of DR-04.

Recommendation: option 2. It keeps DR-14's promise where it matters (nobody learns how the owner grouped them) and lets company and invited Rings read as the design draws them, without one more setting for owners to understand.

## Responsible

`decider` above: the owner, before [[Companies Story]] and [[Ring Invitations & Join Story]] are approved, after hearing from the backend whether a membership can record how it was created (invite, code, work email, accept, owner add).

## Decision

Fulfilled by [[DR-18 Ring names shown when joined knowingly]], decided 2026-10-25 by molham: option 2.
