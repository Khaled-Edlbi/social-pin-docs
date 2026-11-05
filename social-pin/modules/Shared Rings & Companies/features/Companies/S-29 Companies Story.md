---
id: S-29
type: story
module: shared-rings
feature: companies
status: approved
scope: feature
screens: [s14, s15, s26, s38, s63, s68, s72, s73, s74]
approvedBy: "Omar Fostok"
approvedAt: 2026-11-05
owner: "Omar Fostok"
depends: []
affects: ["S-33 Ring Invitations & Join Story", "S-59 Exhibitor Story", "S-31 Delegated Admins Story", "S-16 Ring Members Story", "S-18 Rings Story", "S-03 Counts Story"]
related: ["D-02 One main profile every Ring starts from", "S-14 Profiles & Pin Name Story", "S-15 Ring Access Engine Story", "D-04 Ring settings at launch and their defaults", "D-14 Shared with me lists people, never the Ring", "D-15 Several Rings per connection, remove or disconnect", "D-16 Files load from signed links that expire in 15 minutes", "D-18 Ring names shown when joined knowingly", "Ring Access Model"]
pending: []
created: 2026-10-18
updated: 2026-11-05
tags: [story, story/approved, module/shared-rings, layer/business]
---

# Companies · User Story

**Feature:** [[F-15 Companies]] · **Status:** Approved 2026-11-05 by Omar Fostok · **Frontend Requirements:** [[FR-15 Companies Frontend Requirements]] · **Backend Integration:** not yet · **Verified by:** [[Companies QA Backend]], [[Companies QA Frontend]]

> **Rewritten 2026-11-05.** The earlier draft (S1–S6) was written before the design was checked, and still carried the merged task T-029 as S6. This version is one set of parts, ordered as the member's journey happens, checked against the design (s72, s73, s74 in the prototype; Wireframe Brief §9.1, §9.3), the backend as it is today ([[BD-15 Companies Backend Delivery]]: tables, no routes), the decisions D-04, D-14, D-16 and D-18, and the stories next to it (S-33 Invitations & Join, S-59 Exhibitor, S-31 Delegated Admins). Eight product questions had no answer; Omar Fostok decided them on 2026-11-05, and they are recorded **in this story** under *Decided in this story* (P1–P8), on purpose without decision cards. The old S6 (list, detail, leave, the business ↔ Ring link) is now S2, S5, S9 and P2.

A person's work identity comes from the companies they belong to: an employee of Acme Studio, an advisor to Northstar, a speaker an organizer brought into their business account. A company shows itself through its **company Rings** (`CORPORATE`, nested with `parentRingId`: a public card, an employees Ring, a leadership Ring). The member is in some of them. **My companies** (s72) is the list of those companies and my work identity; **Company detail** (s73) is one company from the member's side: who I am there, which of its Rings I'm in, my colleagues, and the way out.

**What exists today.** The backend has the tables (`Business`, `BusinessMember`, `BusinessTag`, `BusinessFile`) and **no route** for businesses. `CORPORATE` Rings can be made with `POST /rings` and a `parentRingId`, but nothing links a Ring to a business. In the app, s72, s73 and s74 exist as **sample screens** (Acme Studio, Northstar, Loop, Alma Group) and send nothing.

## Persona

- **The member**: an employee or associate who joined a company Ring by invitation, with a code, or with a work email. Not the owner. They check which companies they're attached to, open one, see their colleagues, and sometimes leave.
- **The company admin**: a member who also administers one or more of the company's Rings ([[F-16 Delegated Admins]]). Marked *Admin*; sees the roster.
- **The owner**: the person who created the business account ([[F-24 Exhibitor]]). Sees the company as *Owner*; can't leave it from here.

## Decided in this story

Decided 2026-11-05 by Omar Fostok. Each is a rule the design needs and no card had decided; they live here rather than on decision cards, so a story or a requirements list that relies on one links this section and the part it names.

| # | Question | Decided | Parts |
|---|---|---|---|
| P1 | **Who counts as part of a company?** | Only someone who **chose** to be: accepted an invitation, used a code, or verified a work email, into any of its Rings; or accepted the owner's invitation to the team ([[S-59 Exhibitor Story\|Exhibitor · S2]]). Someone the owner **placed** in a company Ring (added directly, or accepted their connection request into it) is not a company member: the company isn't on their s72, and they see its owner as a person on Shared with me, as D-14 says. | S2, S5, S6 |
| P2 | **How is a business linked to its Rings?** | Every company Ring carries its **business**. The business setup creates the business and its first Ring together ([[S-59 Exhibitor Story\|Exhibitor · S7]]); a Ring made later under it (`parentRingId`) belongs to the same business. This part is Companies'; Exhibitor · S7 builds on it. | S2, S5, S13 |
| P3 | **"Company · Your own Ring · uses the Acme logo"** (s73) | **Out of the MVP.** It's a Ring of mine branded with the company's logo; branding a personal Ring is not built anywhere. s73 lists only the company's own Rings. | S6 |
| P4 | **Work identity: whose is the title, and the two switches** (s72) | The title is **mine**: my profile's *Company & role* field, which I edit. *Show company on my Public Ring* is the same switch as that field on my Public Ring's *What this Ring shows* (s24), offered here as a shortcut. *Let Acme update my title* (the company keeps my title current) is **v1**: hidden in the MVP. | S4, S8 |
| P5 | **What leaving ends** | Every membership of mine in the company's Rings, my admin rights on them, my pending join requests to it, and my place in the company, **in one step**. My **connections stay**, and so do the Rings of mine people are in. The work email I verified for it stops counting for that company: joining again takes a new invitation, code or verification. **The owner can't leave.** | S9, S11 |
| P6 | **The company's domain on s73** | Shown as **"acme.co"**, **without the word *Verified*** in the MVP: the MVP only checks that the domain matches the business's website, which proves nothing. *Verified* comes back in v1 with a real proof of ownership (a DNS record, or an email to the domain's admin). | S5, S12 |
| P7 | **Moved between company Rings** (D-18's *Still open*) | Someone the owner **moves** from a Ring they joined knowingly into another company Ring reads as **placed** there: the new Ring stays unnamed ([[D-18 Ring names shown when joined knowingly]]). | S6 |
| P8 | **Handing a company to someone else, or deleting it** | **Not in the MVP**; it belongs with [[F-24 Exhibitor]] later. | S10, S11 |
| P9 | **Who can read the company's card** (the header tap on s73) | **Every member of the company** (P1) can read its card Ring, the top Ring with its about text, address, contacts, links and files, even when they're only in a lower Ring of it. Reading the card gives no membership in that Ring, no place in its roster and no other of the company's Rings; the access engine answers it like every other view ([[S-15 Ring Access Engine Story]]). | S5 |
| P10 | **A role field on the main profile** | The main profile ([[D-02 One main profile every Ring starts from]]) gets a **role** (job title, "Design lead") next to **company**; together they are the *Company & role* field P4 names. Mine to edit; a Ring shows them only where its *What this Ring shows* has them on. This adds to [[S-14 Profiles & Pin Name Story]]. | S4, S8 |
| P11 | **My title on a company row** (s72) | With one *Company & role* field (P4), my title shows **only on the company whose name matches my profile's company**; the other companies' rows show no title. Never a title per company. | S2, S4 |

Added 2026-11-05 by Omar Fostok: P9, P10, P11.

## Stories

### S1 · Where I find my companies ([[Screen Index#s38|s38]], [[Screen Index#s68|s68]])

**As a** member **I want** one place for my work identity **so that** I don't look for it Ring by Ring.

Acceptance criteria:
- [ ] **Companies** on Discover (s38) and a **Companies** row on Me (s68) open My companies (s72).
- [ ] Me shows the number of companies on the row ("Companies · 2") when there are any; nothing when there are none.
- [ ] Someone with no business account and no company sees *Create a business account* on Me, which starts the setup ([[S-59 Exhibitor Story|Exhibitor · S1]]).

### S2 · My companies ([[Screen Index#s72|s72]])

**As a** member **I want** the companies I belong to, each with who I am there **so that** I can open one.

Acceptance criteria:
- [ ] Title "My companies", "Where your work identity comes from". A **MEMBER OF · N** section lists my companies (P1), by name.
- [ ] Each row: the company's logo (its initial until files load, [[D-16 Files load from signed links that expire in 15 minutes]]), its name, **my title** ("Design lead") only on the company matching my profile's company (P11), **verified email** when I joined with one, and a badge: *Owner*, *Admin*, or none for a member.
- [ ] **The people count** on a row ("22 people") shows only where I may see them: I'm the owner or an admin of one of its Rings, or one of its Rings I'm in has "members can see each other" on ([[D-04 Ring settings at launch and their defaults]]). Otherwise no count.
- [ ] A row opens Company detail (s73).
- [ ] A company is listed while I have **at least one live membership** in its Rings. A company whose Rings I'm in have all ended, or that removed me, leaves the list (S10).
- [ ] Empty: "You're not part of a company yet", with *Join a company Ring* (s74, [[S-33 Ring Invitations & Join Story]]).
- [ ] *+ Join a company Ring*, "Invite code, work email or a QR from a colleague", always at the end of the list → s74 with nothing picked. Each way in follows [[S-33 Ring Invitations & Join Story]] (code: S3; work email: S4, needs S12 here; colleague's QR: S5, not built).
- [ ] The footnote: "Leaving a company removes its shared Rings. Connections you made stay yours."
- [ ] Refetches when the screen opens (an invitation, an approval or a removal can happen without me doing anything). Not available yet: the route.

### S3 · Waiting: invitations and my join requests ([[Screen Index#s72|s72]])

**As a** member **I want** what's waiting, on top **so that** I don't miss an invitation or forget a request.

Acceptance criteria:
- [ ] Above the list, only when not empty:
  - **An invitation I received**: "Alma Group invited you", what the Ring is for ("Company Ring · brand kit, directory, support line"), *Review* → s74 for it ([[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S2]]).
  - **A join request I sent** to a company Ring (with a code, while it waits for "approve each one"): "Loop · Requested 2 days ago · waiting on their admin", *Cancel*.
- [ ] *Cancel* withdraws the request at once; the row leaves. One that was answered a moment ago refreshes the list instead of failing.
- [ ] When my request is **approved**, the company moves into MEMBER OF on the next refetch; when **declined**, the row reads "Not approved" with *Dismiss*, and nothing says why.
- [ ] An invitation to a Ring that has since ended or been deleted reads "This invitation is no longer valid", *Dismiss* only (as S-33 S2).
- [ ] Not available yet: invitations, join requests and their cancel ([[S-33 Ring Invitations & Join Story]]); this part needs the list of both, by company.

### S4 · My work identity ([[Screen Index#s72|s72]])

**As a** member **I want** to see and set how I appear at work **so that** Rings that show my company show it right.

Acceptance criteria:
- [ ] **YOUR WORK IDENTITY**: *Shown as* "Design lead, Acme Studio", from my main profile's **role** and **company** (P10); tapping it edits them (P4). Not available yet: the role field ([[S-14 Profiles & Pin Name Story]]). "Used by Rings that show company & role."
- [ ] *Verified email* "noor@acme.co": the work address I verified, when I joined with one (S-33 S4); shown, not edited here.
- [ ] *Show company on my Public Ring*, "Strangers see where you work": a switch for *Company & role* on my Public Ring, the same one as on that Ring's *What this Ring shows* (s24). Turning it here turns it there, and the other way round. Saved at once. Not available yet if my Public Ring has no such field: the switch is hidden.
- [ ] *Let Acme Studio update my title* is **hidden** in the MVP (P4, v1).
- [ ] With several companies, *Shown as* is the one *Company & role* field; it isn't per company.

### S5 · Company detail ([[Screen Index#s73|s73]])

**As a** member **I want** one screen per company **so that** I see who I am there and what I'm part of.

Acceptance criteria:
- [ ] Header: the company's logo (initial until files load), name, and **its domain, "acme.co"**, when one is set (S12), **without the word *Verified*** in the MVP (P6); my title and **"joined 12 Feb 2026"** (when I first joined one of its Rings); my badge (*Owner* / *Admin*).
- [ ] Tapping the header opens the company's **public card** (its top Ring, s14), which every member of the company may read, whichever of its Rings they're in (P9; not available yet: today a view answers only members of that Ring), where its about text, address, contacts, links and files are. **s73 doesn't repeat them** (they belong to the business Ring the setup made, [[S-59 Exhibitor Story|Exhibitor · S1]]).
- [ ] Sections, in order: **RINGS IT SHARES WITH YOU** (S6), **PEOPLE** (S7), **MY ROLE HERE** (S8), *Leave company* (S9).
- [ ] Opening a company I'm no longer part of (removed while the screen was open, a stale link) reads "You're no longer part of this company" and goes back to s72.
- [ ] Not available yet: the route.

### S6 · The company's Rings I'm in, named or not ([[Screen Index#s73|s73]] → [[Screen Index#s14|s14]])

**As a** member of several Rings of one company **I want** each one listed and opened as itself **so that** "Acme Team" and the public card read as two views of one company.

Acceptance criteria:
- [ ] Lists only the company Rings **I'm a live member of**. Rings I'm not in aren't listed, and their number isn't shown.
- [ ] A Ring I **joined knowingly** (invitation, code, work email) shows **its name** ("Acme Team"); one I was **placed** in shows as "{Company} card", unnamed ([[D-18 Ring names shown when joined knowingly]]). A Ring I was **moved** into by the owner reads as placed, even when I joined the first one knowingly (P7). Never its colour, type, or place in the hierarchy. Not available yet: a membership doesn't record how it was made.
- [ ] Under the name, what it gives me when I may see it: "22 people · directory, brand kit, support line" (the count by S7's rule; the rest is the Ring's "who it's for" label, D-04).
- [ ] Ordered top Ring first, then by name. The parent and child structure is used **only to order**, never drawn as a tree.
- [ ] A row opens the Ring's card (s14) through the same view as a scan (`GET /views/ring/:ringId`). An ended Ring reads "This Ring has ended" and leaves the list on the next refetch.
- [ ] My own Rings branded with the company's logo ("Company · Your own Ring") are **not** listed (P3, v1).
- [ ] A membership with an end date shows it: "until 12 Nov".

### S7 · My colleagues ([[Screen Index#s73|s73]] → [[Screen Index#s15|s15]])

**As a** member **I want** to find my colleagues **so that** I can reach someone at work without scanning them.

Acceptance criteria:
- [ ] **PEOPLE · "22 colleagues"** shows only where I may see them:
  - I'm the **owner or an admin** at member level of one of its Rings: the roster of the Rings I administer, through the Ring people screen (s15, [[S-16 Ring Members Story]]);
  - or one of its Rings I'm in has **"members can see each other"** on: the other members' full cards for that Ring ([[S-16 Ring Members Story|Ring Members · S8]], D-04).
  - Otherwise the section is **hidden**, not "0" and not a sample.
- [ ] Each person is counted once however many of its Rings we share; I'm not counted.
- [ ] "**14 already in one of your Rings**": how many of those colleagues are in one of my own Rings, a number only; shown with the section, hidden at 0.
- [ ] Someone in a block with me, either way, is neither listed nor counted ([[Ring Access Model]]).
- [ ] Not available yet: the setting ([[S-18 Rings Story|Rings · S9]]), the members-facing list, names on the roster, the "already in your Rings" count. Until the setting exists, a plain member sees no colleagues and no count; only the owner and admins do.

### S8 · My role here ([[Screen Index#s73|s73]])

**As a** member **I want** to see what I am at this company **so that** I know what I can do.

Acceptance criteria:
- [ ] **MY ROLE HERE**: *Title* (my *Company & role* field, editable from here as in S4); *Verified email* when I joined with one; *Admin rights* when I administer one of its Rings, in words from the admin level ("Can edit what the Ring shows", "Can manage who's in it", [[S-31 Delegated Admins Story]]); none for a member.
- [ ] *Admin rights* for several Rings at different levels shows the highest, with the Ring's name when I joined it knowingly ("Can manage who's in Acme Team").
- [ ] Not available yet: admin levels by member ([[S-31 Delegated Admins Story|Delegated Admins · S6]]).

### S9 · Leave a company ([[Screen Index#s73|s73]] → [[Screen Index#s72|s72]])

**As a** member who moved on **I want** to leave in one action **so that** its Rings stop showing me and I stop seeing them.

Acceptance criteria:
- [ ] *Leave company* at the bottom, destructive, with a confirmation that says what ends (P5): "Leave Acme Studio? You leave its 2 Rings and lose your admin rights there. The connections you made stay yours."
- [ ] In **one step**: every membership of mine in its Rings ends, my admin rights on them end, my pending join requests to it close, my place in the company ends. All or nothing. Not available yet.
- [ ] My **connections stay**, and nothing changes in my own Rings (the colleagues I put in them stay there).
- [ ] The work email I verified stops counting for this company (P5).
- [ ] The company's owner and admins keep the record that I was there; they aren't notified.
- [ ] After leaving, s72 reloads without it (the row collapses out; reduced motion: a fade), and its Rings leave Shared with me on the next refetch.
- [ ] **The owner** can't leave: *Leave company* is hidden for them (P5, S11).
- [ ] **The last admin** may leave; the owner still runs the company.
- [ ] Offline or failed: "Couldn't leave. Try again." Nothing changes.
- [ ] Joining again takes a new invitation, code or verification.

### S10 · When a company leaves my list without me ([[Screen Index#s72|s72]])

**As a** member **I want** my list to stay honest **so that** I don't see a company I'm no longer part of.

Acceptance criteria:
- [ ] **Removed** by the owner or an admin from its last Ring: the company leaves my list on the next refetch; no notification.
- [ ] **Its Rings ended** (their end dates passed) or **were deleted**: the same.
- [ ] **A block** between me and the company's owner, either way: its Rings stop showing me and I them ([[Ring Access Model]]), so the company leaves my list. Nothing says "blocked".
- [ ] **The business is deleted** by its owner: it leaves every member's list. Deleting a business is not in the MVP (P8).
- [ ] A block between me and a **colleague** (not the owner) changes nothing about the company: we stop seeing each other (S7).

### S11 · The owner's and admins' view ([[Screen Index#s72|s72]], [[Screen Index#s73|s73]])

**As the** company's owner or an admin **I want** the same screens, with what I may do **so that** I don't need a second app.

Acceptance criteria:
- [ ] The owner sees their company on s72 marked *Owner*, with the people count; s73 lists **every** Ring of the company (they own them all), by name, top first.
- [ ] An admin sees *Admin*, the Rings they're in (S6) and the roster of the Rings they administer (S7).
- [ ] Inviting people and changing a Ring's settings happen on the Ring's own screens (s26, s27, [[S-31 Delegated Admins Story]]), not here.
- [ ] *Leave company* is hidden for the owner (P5). Handing the company to someone else, or deleting it, is not in the MVP (P8).

### S12 · Join with a work email: the company's domain ([[Screen Index#s26|s26]])

**As a** company's owner or admin **I want** to let anyone with an address at our domain join the employees Ring **so that** nobody has to invite each new hire.

Acceptance criteria:
- [ ] A company Ring's settings (s26) get **Required work email domain** ("acme.co"): the setting [[D-04 Ring settings at launch and their defaults]] left for this feature. The owner and the Ring's admins change it.
- [ ] Only on `CORPORATE` Rings. The domain is the company's: it must be the domain of the business's website.
- [ ] With it set, s74's *Work email* path works for that Ring ([[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S4]]): an address at the domain, a one-time code to that address, then the usual review and *Join Ring*. "Approve each one" still applies.
- [ ] s73 shows the domain, "acme.co", once it is set, **without *Verified*** in the MVP (P6). A real proof that the company owns the domain is v1.
- [ ] Clearing it stops new joins by work email; members who joined that way stay.
- [ ] Not available yet: the setting, the email verification for joining.

### S13 · A business forms after setup (from [[Screen Index#s63|s63]] to [[Screen Index#s72|s72]])

**As a** visitor who just created a business account **I want** the new business in My companies and its Ring in my Rings **so that** the business sits beside my personal Rings.

Acceptance criteria:
- [ ] When the setup of [[S-59 Exhibitor Story|Exhibitor · S1]] completes, the business and its first `CORPORATE` Ring exist together (P2); s72 lists the company with me as *Owner*; My Rings (s16) shows the Ring.
- [ ] The Ring-forming motion plays once for the new Ring; reduced motion: a fade.
- [ ] Colleagues added to the team on s63 get an **invitation** (S-33), and become members when they accept (P1); until invitations exist, the team step is skipped.

### S14 · When the account changes

**As a** member **I want** companies to follow me, not a name **so that** nothing points at the wrong person.

Acceptance criteria:
- [ ] Company membership is kept by user id; a new Pin name shows on the next fetch.
- [ ] Deleting my account ends my memberships and my place in every company; the owner keeps the record that I was there.
- [ ] Signing out keeps everything on the server; only the phone's caches clear.

## States and motion the design asks for

- **s72:** loading; MEMBER OF with companies; the waiting section (an invitation, a request with *Cancel*, "Not approved", "no longer valid"); work identity with the switch on or off, or hidden; empty; offline.
- **s73:** loading; header with or without the domain (never *Verified* in the MVP); Rings named and unnamed; PEOPLE shown or hidden; MY ROLE HERE with or without admin rights; leaving (progress); left; "no longer part of this company".
- **Motion:** a new business Ring forms with the Ring-creation motion (S13); a company row collapses out after leaving (S9); reduced motion fades both.
- No logos or photos until files load (D-16): initials everywhere.

## Where the design disagrees (for the designer)

| Screen | What's drawn | What the decisions need |
|---|---|---|
| s72 | "Northstar · 6 people share a Ring with you" for a plain member | No count unless I administer a Ring of it or "members can see each other" is on (D-04, S2) |
| s72 | *Let Acme Studio update my title* | Hidden in the MVP (P4) |
| s72 | The pending request has *Cancel* only | Also "Not approved" with *Dismiss*, and "no longer valid" (S3) |
| s73 | "Verified · acme.co" | "acme.co" without *Verified* in the MVP (P6) |
| s73 | "Company · Your own Ring · uses the Acme logo" | Not in the MVP (P3) |
| s73 | Ring rows with names only | A Ring I was placed in, or moved into, shows as "{Company} card", unnamed (D-18, P7, S6) |
| s73 | *Leave company* for everyone | Hidden for the owner; the confirmation names what ends (S9) |
| s73 | "Leaving removes Acme's shared Rings… connections stay" | Also: admin rights end; the verified email stops counting (P5) |
| s74 | *Join Ring* goes to My Rings (s16) | Shared with me (s17), as S-33 S2 says |
| s26 | No *Required work email domain* | The setting, on company Rings (S12) |
| — | No owner view of s72 / s73 | *Owner* badge, every Ring listed, no *Leave* (S11) |

## What the backend has to build

Not available yet, in the order the journey needs them:

1. **The business ↔ Ring link** (P2): a company Ring carries its business; the setup creates both in one step ([[S-59 Exhibitor Story|Exhibitor · S7]] uses it).
2. **How a membership was made** (invitation, code, work email, owner add, connection accept, owner move): needed to name a Ring (D-18, P7) and to decide who is part of a company (P1). Shared with [[F-09 Ring Members]] and [[F-17 Ring Invitations & Join]].
3. **My companies:** `GET /businesses/mine`: each company with name, logo, my title source, my badge (owner / admin / member), verified email, joined date, and the people count only where I may see it.
4. **Company detail:** `GET /businesses/:id`: the above, plus the company Rings I'm in (named or not, ordered top first, each with its end date for me), my admin level per Ring, the colleague count and the "already in your Rings" count where allowed; the domain.
5. **Waiting:** my invitations and my join requests by company, and cancelling a request ([[S-33 Ring Invitations & Join Story]]).
6. **Leave:** one call that ends every membership, admin right and pending request of mine in the company (P5); refused for the owner.
7. **The required work email domain** on a `CORPORATE` Ring, matched to the business's website, and joining by verified work email ([[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S4, S8]]).
8. **Colleagues for a plain member** when "members can see each other" is on ([[S-16 Ring Members Story|Ring Members · S8]]); names on the roster.
9. **Business error codes** (none defined yet): no such company or not part of it, the owner can't leave, a domain that isn't the company's.

## Rules the backend already enforces

- `CORPORATE` is an allowed type on `POST /rings`, with `parentRingId` required to be the caller's own (400 `E_RING_06`), so the hierarchy is owner-built ([[BI-08 Rings Backend Integration]]).
- `GET /rings/shared-with-me` lists only Rings whose access is live right now (Ring window, membership window, no block); it doesn't carry the business.
- A Ring's card is read with `GET /views/ring/:ringId`; an ended company Ring is 404 `E_RING_ACCESS_02` to a member.
- The roster (`GET /rings/:ringId/members`) is for the owner or an admin at `MEMBER_MANAGER` only (403 `E_RING_05`); a plain member can't count colleagues.
- A block is mutual and overrides membership both ways ([[Ring Access Model]]).
- Admin rights on a company Ring come from `RingAdmin` levels ([[F-16 Delegated Admins]]).

## Open questions

- **Whether a business has a Pin name** that resolves on Discover (the `!vertexlabs` path to s55, asked from [[S-42 Discover Hub & Search Story]]): not answered by this story.
- **Joining via a colleague's QR** (s74): not built in any form ([[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S5]]).
- **What you contribute to a company Ring** after joining (s74's *WHAT YOU CONTRIBUTE*): [[S-33 Ring Invitations & Join Story|Ring Invitations & Join · S6]], not built.

## Log

- 2026-11-05 · flagged [[FR-15 Companies Frontend Requirements]]: S-29 was rewritten as S1–S14 with its product rules decided inside the story (P1–P8, no decision cards). The old Companies · S6 (merged T-029) is gone: the list is S2, company detail S5, leave S9, and the business ↔ Ring link is decided as P2 (every company Ring carries its business; setup creates both). The domain shows as acme.co without Verified in the MVP (P6). Repoint the links that name Companies · S6.
- 2026-11-05 · flagged [[FR-19 Discover Hub & Search Frontend Requirements]]: S-29 was rewritten as S1–S14 with its product rules decided inside the story (P1–P8, no decision cards). The old Companies · S6 (merged T-029) is gone: the list is S2, company detail S5, leave S9, and the business ↔ Ring link is decided as P2 (every company Ring carries its business; setup creates both). The domain shows as acme.co without Verified in the MVP (P6). Repoint the links that name Companies · S6.
- 2026-11-05 · flagged [[FR-24 Exhibitor Frontend Requirements]]: S-29 was rewritten as S1–S14 with its product rules decided inside the story (P1–P8, no decision cards). The old Companies · S6 (merged T-029) is gone: the list is S2, company detail S5, leave S9, and the business ↔ Ring link is decided as P2 (every company Ring carries its business; setup creates both). The domain shows as acme.co without Verified in the MVP (P6). Repoint the links that name Companies · S6.
- 2026-11-05 · flagged [[S-42 Discover Hub & Search Story]]: S-29 was rewritten as S1–S14 with its product rules decided inside the story (P1–P8, no decision cards). The old Companies · S6 (merged T-029) is gone: the list is S2, company detail S5, leave S9, and the business ↔ Ring link is decided as P2 (every company Ring carries its business; setup creates both). The domain shows as acme.co without Verified in the MVP (P6). Repoint the links that name Companies · S6.
- 2026-11-05 · flagged [[S-59 Exhibitor Story]]: S-29 was rewritten as S1–S14 with its product rules decided inside the story (P1–P8, no decision cards). The old Companies · S6 (merged T-029) is gone: the list is S2, company detail S5, leave S9, and the business ↔ Ring link is decided as P2 (every company Ring carries its business; setup creates both). The domain shows as acme.co without Verified in the MVP (P6). Repoint the links that name Companies · S6.
- 2026-11-05 · flagged [[S-15 Ring Access Engine Story]]: S-29 P9 (decided in the story, 2026-11-05): every member of a company can read the company's card Ring (its top Ring), even when only in a lower Ring of it; reading gives no membership, no roster, no other Ring. The engine answers it like every other view.
- 2026-11-05 · flagged [[BD-08 Ring Access Engine Backend Delivery]]: S-29 P9 (decided in the story, 2026-11-05): every member of a company can read the company's card Ring (its top Ring), even when only in a lower Ring of it; reading gives no membership, no roster, no other Ring. The engine answers it like every other view.
- 2026-11-05 · flagged [[S-14 Profiles & Pin Name Story]]: S-29 P10 (decided in the story, 2026-11-05): the main profile gets a role field (job title) next to company; together they are the Company & role field Companies shows as the work identity (S-29 S4, S8).
- 2026-11-05 · flagged [[FR-07 Profiles & Pin Name Frontend Requirements]]: S-29 P10 (decided in the story, 2026-11-05): the main profile gets a role field (job title) next to company; together they are the Company & role field Companies shows as the work identity (S-29 S4, S8).
- 2026-11-05 · flagged [[FR-15 Companies Frontend Requirements]]: S-29 added P9 (every company member reads the company's card Ring), P10 (a role field on the main profile) and P11 (my title only on the company row matching my profile's company), all decided in the story; cite them.
- 2026-11-05 · flagged [[BD-15 Companies Backend Delivery]]: S-29 added P9 (every company member reads the company's card Ring, through the access engine) and P11 (the title shows only on the company matching the profile's company).
