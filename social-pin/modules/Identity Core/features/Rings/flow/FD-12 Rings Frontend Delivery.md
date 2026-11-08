---
id: FD-12
type: frontend-delivery
module: identity
feature: rings
status: done
scope: feature
deployedTo: []
screens: [s08, s09, s16, s17, s18, s19, s20, s21, s22, s26, s27, s62]
owner: "Omar Fostok"
depends: ["BI-08 Rings Backend Integration"]
affects: []
related: ["FR-11 Rings Frontend Requirements", "S-18 Rings Story", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "FD-06 Counts Frontend Delivery", "FD-10 Ring Access Engine Frontend Delivery", "FD-11 Ring Projection Frontend Delivery", "S-23 Connections Story", "S-31 Delegated Admins Story", "S-33 Ring Invitations & Join Story"]
pending: []
created: 2026-11-08
updated: 2026-11-08
tags: [frontend-delivery, frontend-delivery/done, module/identity, layer/frontend]
---

# ✅ Rings · Frontend Delivery

**Feature:** [[F-11 Rings]] · **Status:** Done · **Built from:** [[BI-08 Rings Backend Integration]] · **Against:** [[S-18 Rings Story]] · **Requirements:** [[FR-11 Rings Frontend Requirements]] · **QA:** [[Rings QA Frontend]]

What the client shipped for owning Rings. On `social_pin` `main`: real Rings created, edited and deleted (`bdc8d18`, 2026-10-21), when a Ring is open and the default on Access (`00407c0`, `6970819`), one Edit Ring screen (`e2dd0ec`). On `rings/F-11/honest-rings` @ `bf5b5ae` (2026-11-08), not on `main` yet: ended Rings that say so (`acbd1ee`), Shared with me from the API's person rows, the six Ring settings, Copy an existing Ring, and the after-event choice. Counts are in [[FD-06 Counts Frontend Delivery]], what a Ring shows in [[FD-11 Ring Projection Frontend Delivery]]. The QA checklist is SH-03 and RS-01…RS-04 in the client's `docs/TEST_CASES_2026-10-18.md`, with the Maestro Ring flows (`3b82dc6`).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s08\|s08]], [[Screen Index#s09\|s09]] First Ring | ✅ | At sign-up: the Pin is live, then a first Ring named and coloured, with what it shows ([[FD-05 Auth & Sign-up Frontend Delivery]]). |
| [[Screen Index#s16\|s16]] My Rings | ✅ | Default first, then newest; DEFAULT, EVENT, "expires 16 Mar", "ended 16 Mar"; who it's for under the name. An ended event Ring still undecided shows **DECIDE** and "This event has ended — decide what happens". Archived Rings leave the list. "Join" says joining with an invitation or a code isn't in the app yet. |
| [[Screen Index#s17\|s17]] Shared with me | ✅ | People, from the API's person rows (one per person, no Ring name, colour, type or count); tapping opens their card ([[FD-10 Ring Access Engine Frontend Delivery]]). |
| [[Screen Index#s18\|s18]]–[[Screen Index#s21\|s21]] New Ring | ✅ | Name, colour, Blank or Event Ring (with dates), who it's for; what it shows from the library; the bio and photo. **Copy an existing Ring** on step 1: pick one → "Create copy" (settings, colour, bio, photo and what it shows; never its people). |
| [[Screen Index#s22\|s22]], [[Screen Index#s26\|s26]], [[Screen Index#s27\|s27]] → Edit Ring | ✅ | One screen: name, colour, who it's for (≤ 140, "Only you see this"); Starts and Expires; the default Ring section; delete; and **the six settings** ([[D-04 Ring settings at launch and their defaults]]): who can request to join (anyone who scans / only with a code or invitation / only by invitation), approve each one, members see each other's cards, members can invite, members can save files, who it's for. The four the backend stores but doesn't enforce yet say when they take effect. "Only the Ring's owner can change these." |
| [[Screen Index#s62\|s62]] Event ended | ✅ | From DECIDE: **Keep it** (a regular Ring, no end date), **Merge into…** (pick another of my Rings; everyone moves with the same dates; this one is archived), **Let it go** (archived, everyone loses access), each confirmed; or Later. |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| `GET /rings` | s16, Home, the wizard's copy list | Every page loaded; reloaded after create, copy, edit, delete and a disposition. |
| `GET /rings/shared-with-me` | s17 | The person rows as sent; no view call per person. Read again when the tab gains focus. |
| `POST /rings` | s09, New Ring | Name, colour, `isTemporary` and the dates, `purpose`; no settings sent (the server's defaults, D-04). Then what it shows ([[FD-11 Ring Projection Frontend Delivery]]). |
| `POST /rings/:id/copy` | New Ring, step 1 | The new name ("<Ring> copy" proposed). A gone source → "That Ring is gone. Pick another one." |
| `PATCH /rings/:id` | Edit Ring | Only what changed: name, colour, `purpose`, `startsAt` / `expiresAt` (`null` clears), the settings. |
| `POST /rings/:id/default` | Edit Ring | After a confirmation; a temporary Ring is refused by the app first. |
| `DELETE /rings/:id` | Edit Ring | Behind a confirmation. |
| `POST /rings/:id/disposition` | s62 | `KEEP`, `MERGE` with `mergedIntoRingId`, `AUTO_DELETE`; a refused merge target → "That Ring can't take them. Choose another of your Rings." |

## State kept on the client

- One list of my Rings for the app's lifetime, saved on the phone and shown first at startup; replaced on every reload.
- The wizard's draft lives until it closes; nothing is sent before the last step (or Create copy).

## Deviations from the story or the integration note

- **New Ring creates the Ring at the end, not in step 1** (S4), so Cancel has nothing to delete; Copy creates it at once from step 1.
- **The wizard has no settings** (S4, S9 ask for three on step 4): a new Ring takes the server's defaults; all six are changed on Edit Ring.
- **Who is in it (s19) sends nothing**: it says how to add people later, since there are no connections to pick from ([[S-23 Connections Story|Connections · S2–S7]]).
- **s22, s26 and s27 are one Edit Ring screen**, as [[S-31 Delegated Admins Story]] now describes.
- **A temporary Ring can't be the default**: the app refuses it, the backend doesn't yet (S7).

## Not done yet

- Joining, reviewing an invitation and "Join with a code" (s74, s17) → [[S-33 Ring Invitations & Join Story]]; the four settings take effect with them.
- A Ring's name on Shared with me for a Ring joined knowingly → [[F-09 Ring Members]] ([[BD-11 Rings Backend Delivery]] keeps it pending).
- Admins changing the settings → [[S-31 Delegated Admins Story]]; until then only the owner can.

## Log

- 2026-10-21 · `main` @ `bdc8d18` (social_pin) · create, rename, recolour and delete real Rings; Maestro Ring flows `3b82dc6` · flagged nothing
- 2026-11-03 · `main` @ `00407c0`, `6970819` · when a Ring is open; make a Ring the default · flagged nothing
- 2026-11-04 · `main` @ `e2dd0ec` · Edit a Ring in one screen · flagged nothing
- 2026-11-04 · `rings/F-11/honest-rings` @ `acbd1ee` · ended Rings say so; Join said what wasn't there yet · flagged nothing
- 2026-11-08 · `rings/F-11/honest-rings` @ `bf5b5ae` (social_pin, not on `main` yet) · Shared with me from person rows; the six settings; who it's for; Copy an existing Ring; DECIDE → Keep / Merge / Let it go; SH-03, RS-01…RS-04 · flagged nothing
