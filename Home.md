---
type: home
updated: 2026-10-26
tags: [map]
---

# Social Pin · Docs Vault

> **Browse it as a tree:** `https://khaled-edlbi.github.io/social-pin-docs/` (or `node scripts/build-tree.mjs --serve` locally). Project → module → feature → one note per layer (story, frontend requirements, backend delivery, backend integration, frontend delivery, QA backend, QA frontend), then tasks and decisions, each with a status chip, as a tree, a relation graph or an outline; relations light up on hover; filter by module, layer, kind and status. How it works: [[Docs Tree]]. The rules every agent follows: [[Agent Rules]]. The sequence: [[Workflow]].
>
> **Open this repository as an Obsidian vault.** Everything is plain Markdown with wikilinks, so it also reads fine on GitHub. Optional plugins: **Kanban** (the generated [[Task Board]]), **Dataview**.

## What Social Pin is

A **digital-identity app built on Rings**. One account, many audience-bound perspectives of the same person. A user defines audiences (Family, E-commerce Clients, Company, an event, a meeting) and each Ring is bound to a specific view of their profile: which photo, bio, links, fields and files that audience gets, and whether sensitive fields (birthdate, gender, marital status, phone, email) are shared at all.

It is **not** a social network and **not** content-driven. There is no feed. A connection is an **access request**: on accept, the owner picks the Ring the person goes into, and the person only ever sees *what* is shared, never *which* Ring they are in.

The backend exists to answer one question on every request:

> *What is this viewer allowed to see about this person, in this context, at this moment?*

Full description: [[Project Overview]]. Vocabulary: [[Glossary]].

## Where things stand (2026-10-18)

| Area | Status |
|---|---|
| Identity core: auth, account, profiles, Rings, members, projections, View as, files, access engine | ✅ Backend done, 49 endpoints, 168 unit tests green; a Backend Integration note per feature ([[Frontend Contract]]) |
| User stories and frontend requirements | ✏️ Drafted for all 39 features, awaiting product sign-off (the ✏️ Draft chips in the [[Docs Tree]]) |
| Frontend delivery and QA notes | ∅ None yet: every feature shows the placeholders; the frontend repo's agent rules are in [[Frontend Agent Prompt]] |
| Error contract (`ErrorCode` on the wire), file bytes by id | 🟡 [[Error Contract Story|Error Contract · S4–S8]], [[T-062 Serve uploaded file bytes by id]] |
| Code delivery, counts, delegated admins, badge / QR, Event Ring, photo library, devices, interests, widgets, linked accounts | 🟡 Partial: tables exist, endpoints missing |
| Connections, shared Rings, companies, Discover, PinCast, events, meetings, exhibitor, post-event, payments, subscription, notifications, Gemma, audit log, cleanup jobs, e2e run | ❌ To do: schema only (about 30 tables with no service) |
| Design vs backend disagreements | ❓ 5 open [[Decisions]] (ND-01 passwordless: decided and shipped) |

Numbers per module: the eight module notes under `modules/`; the full list: [[Feature Tree]]. The source comparison: [[Status Report 2026-10-15]].

## Map of the vault

```
social-pin-docs/
├── Home.md                        ← you are here
├── docs.config.json               the layers, their note kinds and statuses, the hand-off flow, default blocks, card-code prefixes, modules; projectDir: social-pin
├── rules/                         RULES for every layer: Workflow · Agent Rules · Docs Tree · the agents (Agent Protocol · Owner · PM · Backend · Frontend · QA · Admin Agent): `/owner` `/pm` `/backend` `/frontend` `/qa`, `/admin` for repairs
├── templates/                     one per note kind (the scaffold command uses them)
├── tree/                          the docs tree page (index.html), its generated index (tree.json, tree.md) and the card-code registry (cards.json)
├── scripts/build-tree.mjs         build · --check · --serve · --impact · --scaffold (layer notes, task, bug, feature, needs-decision, decision)
│
└── social-pin/                    THE PRODUCT'S DOCS: every card lives here
    ├── Card Index.md              GENERATED: every card with its unique code (M-01, F-05, S-01, FR-05, BD-05, T-004, B-01, ND-04, D-04, P-10) and the cards it links to as T-004 | S-01
    ├── business/                  BUSINESS docs: Project Overview · Glossary · Feature Tree · Feature Graph · Feature Map.canvas · Status Report
    ├── frontend/                  FRONTEND docs: Frontend Contract · Frontend API Guide · Frontend Passwordless Migration · Frontend Agent Prompt
    ├── backend/                   BACKEND docs: Architecture · API Conventions · Auth Model · Ring Access Model · Database & Migrations · Developer Setup · Spec Map · Developer Guide
    ├── modules/<Module>/
    │   ├── <Module> Module.md     the module = the sum of its features
    │   └── features/<Feature>/    one folder per feature; anything else the module holds gets its own folder beside features/
    │       ├── <Feature>.md                       business: the main node (what it is for, screens, tasks, decisions)
    │       ├── <Feature> Story.md                 business · draft → approved → verified
    │       ├── <Feature> Frontend Requirements.md frontend · what the client asks of the backend
    │       ├── <Feature> Backend Delivery.md      backend  · what shipped, how it works, gaps
    │       ├── <Feature> Backend Integration.md   backend  · how the client calls it
    │       ├── <Feature> Frontend Delivery.md     frontend · what the client shipped
    │       ├── <Feature> QA Backend.md            qa       · expected API behaviour, verdict
    │       └── <Feature> QA Frontend.md           qa       · expected screen behaviour, verdict
    ├── tasks/
    │   ├── T-NNN <Title>.md       a task; becomes tasks/T-NNN <Title>/ with the same seven kinds of notes (code T-NNN) as teams pick it up
    │   ├── Task Board.md          GENERATED Kanban
    │   └── Backlog.md             GENERATED priority table with blockers
    ├── bugs/                      the bugs, B-NN <Title>.md
    ├── needs-decisions/           the needs-decision cards, ND-NN <Title>.md: the questions
    ├── decisions/                 the decision cards, D-NN <Title>.md: the answers; and the Decisions table
    └── design/                    Design Reference · Screen Index · Navigation Map · Wireframe Brief · Brief Section Map
```

## Start here, by role

- **Backend developer** → [[Backlog]] → the ticket → `node scripts/build-tree.mjs --impact T-NNN` → the feature's Backend Delivery and Frontend Requirements → [[Ring Access Model]] → [[Architecture#Build order for a new feature]]. To write the notes: `/backend …` ([[Backend Agent]]).
- **Frontend developer** → [[Frontend Contract]] → the feature's Backend Integration note → [[Frontend API Guide]]. The rules for the frontend repo's agent: [[Frontend Agent Prompt]]; to write the notes here: `/frontend …` ([[Frontend Agent]]). **Auth is passwordless since 2026-10-15**: [[Frontend Passwordless Migration]].
- **Product / design** → [[Decisions]] first (five answers unblock 19 tasks), the ✏️ Draft stories in the [[Docs Tree]] to approve, [[Screen Index]] for what each screen can do today. To create a feature with its business side: `/owner …` ([[Owner Agent]]); its story or a task: `/pm …` ([[PM Agent]]); a decision card is raised by whichever agent owns the card that needs it and decided by `/pm` or `/owner`; to approve, change a rule or set priorities: `/owner …` ([[Owner Agent]]).
- **QA** → a feature's two delivery notes and its story; `--scaffold qa-backend <feature>` / `qa-frontend` to start the artefacts, or `/qa …` ([[QA Agent]]).
- **Anyone new** → [[Project Overview]] → [[Glossary]] → [[Feature Graph]] → [[Docs Tree]]. How the agents take a request and stay inside their files: [[Agent Protocol]]. Nothing is written until an agent is chosen with its slash command; a broken tree or a rename across every layer is `/admin …` ([[Admin Agent]]).

## How this vault is organised

- **Layers are configuration.** `docs.config.json` declares the layers (business, frontend, backend, QA), each kind's statuses and *done* set, the hand-off flow and the default blocks. A new layer (DevOps, AI, Security) is a config entry and a template; the tree, its filter and its arrows follow ([[Agent Rules#5 · Adding a layer]]).
- **Codes.** A task's `T-NNN` is carried by every note written for it; a feature's id by its feature-level notes. The feature note of a kind is the sum of the task notes of that kind; the module note is the sum of its features. On top of that, every card has one unique **card code** (`S-01`, `BD-05`, `T-004`, `ND-04`…) that never changes and is never reused: the [[Card Index]] lists them all with their related cards as `T-004 | S-01` ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]).
- **Relations are the context.** Every note declares `depends`, `affects`, `related` (and `blockedBy` when something blocks it) in frontmatter; `--impact` lists what a change touches so nobody reads the whole vault ([[Agent Rules#3 · Relations]]).
- **Statuses and sign-off** are frontmatter on the cards (`status`, `approvedBy`, `approvedAt`, `pending`); the tree computes a feature's, a module's and the project's chip from the cards, *Blocked* from the hand-off flow and `depends` / `blockedBy`, and *Partial* from `pending`; the board and backlog are generated from the task notes.
- **Design ids are the prototype's.** `s44` means screen 44 in `socialPin-design/.proto2.json`. `[[Screen Index#s44]]` lands on it.
