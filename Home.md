---
type: home
updated: 2026-10-15
tags: [map]
---

# Social Pin · Backend Docs Vault

> **Open this repository as an Obsidian vault.** It mirrors `docs/` in the backend repo (`social-pin`); the design files it references live there under `socialPin-design/`. Everything is plain Markdown with wikilinks, so it also reads fine on GitHub. Optional plugins that make it nicer: **Dataview** (live tables), **Kanban** (the [[Task Board]]). The canvas and graph colours work with Obsidian's core plugins only.

## What Social Pin is

A **digital-identity app built on Rings**. One account, many audience-bound perspectives of the same person. A user defines audiences (Family, E-commerce Clients, Company, an event, a meeting) and each Ring is bound to a specific view of their profile: which photo, bio, links, fields and files that audience gets, and whether sensitive fields (birthdate, gender, marital status, phone, email) are shared at all.

It is **not** a social network and **not** content-driven. There is no feed. A connection is an **access request**: on accept, the owner picks the Ring the person goes into, and the person only ever sees *what* is shared, never *which* Ring they are in.

The backend exists to answer one question on every request:

> *What is this viewer allowed to see about this person, in this context, at this moment?*

Full description: [[Project Overview]]. Vocabulary: [[Glossary]].

## Where things stand (2026-10-15)

| Area | Status |
|---|---|
| Identity core: auth, account, profiles, Rings, members, projections, View as, files, access engine | ✅ Done, 49 endpoints, 168 unit tests green (re-verified 2026-10-15); a frontend note per feature in [[Frontend Index]] |
| Error contract (`ErrorCode` on the wire), file bytes by id | 🟡 Found by the frontend pass: [[T-063 Put the ErrorCode on the error body]], [[T-062 Serve uploaded file bytes by id]] |
| Code delivery, counts, delegated admins, badge / QR, Event Ring, photo library, devices, interests, widgets, linked accounts | 🟡 Partial: tables exist, endpoints missing |
| Connections, shared Rings, companies, Discover, PinCast, events, meetings, exhibitor, post-event, payments, subscription, notifications, Gemma, audit log, cleanup jobs, e2e run | ❌ TODO: schema only (about 30 tables with no service) |
| Design vs backend disagreements | ❓ 6 open [[Decisions]] |

Numbers and the full tree: [[Feature Tree]]. The source comparison: [[Status Report 2026-10-15]].

## Map of the vault

```
social-pin-docs/   (= docs/ in the backend repo)
├── Home.md                      ← you are here
├── project/                     the product, the architecture, the rules
│   ├── Project Overview         what it is, user types, numbers
│   ├── Architecture             stack, folders, golden rules, shared kit, build order
│   ├── Ring Access Model        the central constraint (read before any read path)
│   ├── Auth Model               tokens, scopes, sign-up flow
│   ├── API Conventions          DTOs, entities, pagination, errors, transactions
│   ├── Database & Migrations    Prisma 7 rules, the three migrations, deploy-not-dev
│   ├── Developer Setup          first run, verification, demo accounts
│   ├── Frontend Contract        what a client must get right, endpoint summary
│   ├── Workflow                 ticket → branch → code → docs, in both repos
│   ├── Glossary
│   └── Status Report 2026-10-15 the backend vs design comparison this vault is built from
├── features/                    one note per feature, grouped by domain
│   ├── Feature Tree             ✅ 🟡 ❌ tree of every feature and task
│   ├── Feature Graph            Mermaid: relationships + dependency spine
│   ├── Feature Map.canvas       Obsidian canvas of the same graph
│   └── <Domain>/<Feature>.md    design screens · endpoints · how it works · gaps · tasks
├── frontend/                    one note per done feature, for the client
│   ├── Frontend Index           reading order, cross-cutting warnings
│   └── <Domain>/<Feature> Frontend.md  screens → calls · flow · shapes · state · errors · rules · not yet
├── tasks/                       one note per task (T-001 …)
│   ├── Task Board               Kanban columns: needs decision · blocked · backlog · in progress · done
│   └── Backlog                  priority-ordered table + suggested order of work
├── decisions/                   D-01 … D-06, where design and backend disagree
├── design/                      the design as reference
│   ├── Design Reference         which design file is what, how to open the prototype
│   ├── Screen Index             all 78 screens → features → status
│   ├── Navigation Map           the click-through map rendered
│   ├── Wireframe Brief          verbatim copy of the brief, linkable by section
│   └── Brief Section Map        brief § → features
├── templates/                   Feature / Task / Decision / Frontend templates
├── SPEC_MAP.md                  (original) spec entity → code map
├── DEVELOPER_GUIDE.md           (original) full setup guide
└── FRONTEND_API_GUIDE.md        (original) full client guide
```

## Start here, by role

- **Backend developer picking up work** → [[Backlog]] → the task's feature note → [[Ring Access Model]] → [[Architecture#Build order for a new feature]].
- **Product / design** → [[Decisions]] first (six answers unblock 20 tasks), then [[Screen Index]] to see what each screen can do today.
- **Frontend developer** → [[Frontend Contract]], then [[Frontend Index]] (one note per done feature), then `FRONTEND_API_GUIDE.md` for the long form.
- **Anyone new** → [[Project Overview]] → [[Glossary]] → [[Feature Graph]].

## How this vault is organised

- **Four note types, one frontmatter each**: `type: feature` (status `done | partial | todo | frontend`), `type: task` (status `todo | needs-info | blocked | in-progress | done`), `type: decision` (status `open | decided`), `type: frontend` (one per done feature). Tags mirror them (`#status/done`, `#task/blocked`, `#decision/open`, `#frontend`) so the graph view colours by state (`.obsidian/graph.json`).
- **Links are the graph.** A feature links its screens, tasks, decisions and related features; a task links its feature and dependencies; a decision links the features it blocks. Open Obsidian's graph view with filter `tag:#feature OR tag:#decision` to see the idea map.
- **Design ids are the prototype's.** `s44` means screen 44 in `socialPin-design/.proto2.json`. `[[Screen Index#s44]]` lands on it.
- **Updating.** The ticket comes first, the branch in both repos is named after it (`feat/T-NNN-slug`), and when the code ships the same change updates the task note, the [[Task Board]] and [[Backlog]], the feature note (status, endpoints, *How it works*, gaps), the frontend note, the [[Feature Tree]] counts and this page. The full procedure: [[Workflow]]. New work starts from `templates/`.
