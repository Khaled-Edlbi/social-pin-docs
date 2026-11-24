---
id: FD-20
type: frontend-delivery
module: shared-rings
feature: companies
status: todo
scope: feature
deployedTo: []
screens: [s72, s73, s74]
owner: "Omar Fostok"
depends: []
affects: []
related: ["FR-15 Companies Frontend Requirements", "S-29 Companies Story", "BD-15 Companies Backend Delivery", "FD-15 Ring Invitations & Join Frontend Delivery", "S-31 Delegated Admins Story", "D-33 Work email joining waits for real emails and Companies", "D-35 A join code can be shown as a QR", "D-36 Who it's for stays the owner's alone", "D-39 The company domain and the title switch show in the MVP"]
pending: []
created: 2026-11-15
updated: 2026-11-24
tags: [frontend-delivery, frontend-delivery/todo, module/shared-rings, layer/frontend]
---

# ⬜ Companies · Frontend Delivery

> Blocked by default until [[Companies Backend Integration]] is `current` (the hand-off order in `docs.config.json`); `blockedBy: []` opts out, `blockedBy: [...]` names other blockers.

**Feature:** [[F-15 Companies]] · **Status:** To do · **Built from:** [[Companies Backend Integration]] (not written: no company Ring API yet) · **Against:** [[S-29 Companies Story]] · **Requirements:** [[FR-15 Companies Frontend Requirements]] · **QA:** [[Companies QA Frontend]]

What the client has for companies, on `social_pin` `rings/F-11/honest-rings` (on `main` since 2026-11-24 at `866240a`): s72 My companies, s73 Company detail and s74 Join a company Ring, **on demo data only** (`my_companies_data.dart`, the TechSummit '26 demo world of `e03ddf9`). There is no company Ring API, so nothing here is delivered against a backend: the note stays `todo` and blocked by the flow until [[Companies Backend Integration]] exists, and records what the demo screens show so the story, the requirements and QA can read it. Recorded in [[FD-15 Ring Invitations & Join Frontend Delivery|FD-15]] until 2026-11-15; built in `dbef63e` and `778d9b4` (at `778d9b4`: `dart analyze` 0 errors, `flutter test` 1752 passed).

## Screens shipped

| Screen | State | Note |
|---|---|---|
| [[Screen Index#s72\|s72]] My companies | 🟡 demo | "Where your work identity comes from". **MEMBER OF · N**: each company with my role and "{role} · {people}"; an **OWNER** or **ADMIN** badge. An invitation row "{company} invited you" / "From {name} · {Ring name}" with *Review* → s74. The add row **"Join a company Ring"** / "Invitation, code or a join QR" (`dbef63e`); no verified work email row ([[D-33 Work email joining waits for real emails and Companies\|D-33]]). **YOUR WORK IDENTITY**: *Shown as* "{role}, {company}", *Show company on my Public Ring*. (S-29 S1, S2, S4) |
| [[Screen Index#s73\|s73]] Company detail | 🟡 demo | Subtitle **"Verified · {domain}"**, kept in the MVP ([[D-39 The company domain and the title switch show in the MVP\|D-39]]). **RINGS IT SHARES WITH YOU**: the company's own Rings only, by name and people, never what they are for ([[D-36 Who it's for stays the owner's alone\|D-36]]); **no row for a Ring of mine** with the company's logo (`778d9b4`, S-29 P3, S6). **YOUR COLLEAGUES · N** only for the owner or an admin, or when the Ring lets members see each other; otherwise hidden, never "0" (`778d9b4`, S7). **MY ROLE HERE**: *Title*; *Admin rights* in the level's words, **"Can manage who's in it"** or **"Can edit what the Ring shows"** ([[S-31 Delegated Admins Story\|S-31]]'s two levels), nothing for a member; no verified email line (D-33). The switch **"Let {company} update my title"** ("Admins keep your role current when it changes"), kept in the MVP (D-39): on by default and held on screen only, saved nowhere. **Leave company**: "Leave {company}?" / "You leave its {n} Rings. The connections you made stay yours.", and for an admin "… and lose your admin rights there. …"; then "You left {company}." The **owner** sees **"You own {company}. Hand it over before you leave."** and no *Leave* (`778d9b4`, S-29 P5, P8, S9, S11). |
| [[Screen Index#s74\|s74]] Join a company Ring | 🟡 demo | "Invited by {name} · {people}". **HOW TO JOIN**: only **This invitation**, **Invite code** (K7QM-4RXT: 8 characters, no 0/O/1/I, left to right in Arabic too, *Paste*) and **Join QR** ("Scan the join QR {company} shows you. It opens the same review as its code.", *Scan a join QR* opens the scanner) (`dbef63e`, [[D-35 A join code can be shown as a QR\|D-35]]). Gone: work email, *Scan a colleague*, the Ring's purpose, "What you contribute", the verified-domain line (D-33, D-36). *Join Ring* → "You joined {company}." → the "Your card in <Ring>" step ([[FD-15 Ring Invitations & Join Frontend Delivery\|FD-15]]) → Shared with me; *Decline* → "Invitation from {company} declined." (S-29 S3, S10) |

## Calls made

| Endpoint | Where | Notes (retries, cache keys, optimistic updates) |
|---|---|---|
| none | s72, s73, s74 | Demo data. The only real call is the card step's `GET` / `PUT /rings/:ringId/my-card` after *Join Ring*: the demo Ring id is unknown to the server, so it answers 404 and the step closes quietly. |

## State kept on the client

- `MyCompaniesBook` / `my_companies_data.dart` (the demo companies, their Rings, roles, colleagues and invitations), `MyCompaniesController`, `CompanyDetailController`, `JoinCompanyRingController`, under `lib/src/features/account/`.
- The title switch lives in `CompanyDetailController.letCompanyUpdateCubit` for the visit only.

## Deviations from the story or the integration note

- **Demo data, no API**: every company screen is a demo until [[FR-15 Companies Frontend Requirements|FR-15]]'s endpoints exist; on a real account s72 shows the demo companies.
- **The title switch is saved nowhere**: [[S-29 Companies Story|S-29 P4]] keeps it shown in the MVP (D-39) and leaves open whether its choice should be saved now.
- **An owner can't leave at all**: the line asks to hand the company over, which is not in the MVP (S-29 P8).

## Not done yet

- Every company read and write on a real backend → [[FR-15 Companies Frontend Requirements]], [[BD-15 Companies Backend Delivery]].
- A real proof of the domain behind "Verified", and the company updating my title, right after the MVP (D-39).
- Handing a company over (S-29 P8).

## Log

- 2026-11-15 · `rings/F-11/honest-rings` @ `dbef63e`, `778d9b4` (social_pin, on `main` since 2026-11-24 at `866240a`; at `778d9b4` `dart analyze` 0 errors, `flutter test` 1752 passed; tests `test/features/account/my_companies_demo_test.dart`) · S-29 S1–S4, S6, S7, S9–S11, P3–P5, P8 · s72, s73, s74 on demo data: roles owner / admin / member with the Owner badge and the rights lines, colleagues only when allowed, no own-Ring row, the owner line with no Leave, the Leave copy, s74 ways in (invitation, code, join QR), the card step after Join · written from what [[FD-15 Ring Invitations & Join Frontend Delivery|FD-15]] recorded until today; status stays `todo` (blocked by the flow: no company Ring API)
