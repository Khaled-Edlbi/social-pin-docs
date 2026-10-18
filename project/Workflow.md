---
type: project
updated: 2026-10-15
tags: [project]
---

# Workflow · ticket → branch → code → docs

How a feature moves through the two repositories. This is the vault-side copy
of the "Feature workflow" section in the backend's `CLAUDE.md`; when they
differ, `CLAUDE.md` wins.

## The two repositories

| Repo | Holds | Branch for a ticket |
|---|---|---|
| `social-pin` | the NestJS backend, `docs/` with the three mirrored files | `feat/T-NNN-<kebab-slug>` |
| `social-pin-docs` (this vault) | tickets, feature notes, frontend notes, decisions, design index | **the same name** |

Two branches with one name pair the code and its documentation. A pull request
in one links the pull request in the other.

## 1 · Ticket first

Every piece of work starts from a note in `tasks/` (`T-NNN <Title>.md`). It
names the feature, the screens, the dependencies and the definition of done.
Before coding, open the feature in the [[Docs Tree]] (or read `tree/tree.json`)
and read its four notes in order: Docs, Story, Requirements, Frontend; then the
ticket, the screens in [[Screen Index]] and any [[Decisions|decision]] it waits on. A ticket in ❓ *Needs a decision* or
⛔ *Blocked* is not workable; the decision comes first.

No ticket yet? Create one from `templates/Task Template.md` with the next free
number, add it to [[Task Board]], [[Backlog]] and the feature note's task table.

## 2 · Branch from the ticket

`feat/T-004-member-count-per-ring`: the ticket id, then a short slug of its
title. `fix/` for a bug fix, `docs/` for a docs-only change. One ticket per
branch. Commits name the ticket: `feat(ring): member count on list and detail
(T-004)`.

Set the ticket to `status: in-progress` and move its card to 🔵 *In progress*.

## 3 · Build

Per [[Architecture#Build order for a new feature]] and [[Ring Access Model]].
`pnpm typecheck && pnpm test` green before the docs step.

## 4 · Reflect it here — the definition of done

| # | Note | What changes |
|---|---|---|
| 1 | `tasks/T-NNN …` | `status: done`, tags, DoD boxes ticked, a `## Log` line: date · branch · what shipped |
| 2 | [[Task Board]], [[Backlog]] | card to ✅ Done; Backlog row status |
| 3 | `features/<Domain>/<Feature>.md` | status (frontmatter, tags, emoji), endpoint list, **`## How it works`**, *What exists*, *Gaps*, task table, `updated:`. New feature → new note from the template, plus [[Feature Tree]], [[Feature Graph]], [[Screen Index]] |
| 4 | `frontend/<Domain>/<Feature> Frontend.md` | the client's guide: screens → calls, flow, shapes, state, errors, rules, not-yet, checklist. New → from `templates/Frontend Template.md`, add to [[Frontend Index]] |
| 4a | `requirements/<Domain>/<Feature> Requirements.md` | flip the rows the task delivered to ✅ with the endpoint; `status: approved` only when product signed the requirements off |
| 4b | `stories/<Domain>/<Feature> Story.md` | `status: approved` when product signed off; otherwise update the acceptance criteria that changed |
| 5 | [[Feature Tree]], [[Home]], [[Frontend Contract]], [[Architecture]] | counts, "Where things stand", the endpoint table and total, the module table for a new module |
| 6 | `SPEC_MAP.md`, `FRONTEND_API_GUIDE.md`, `DEVELOPER_GUIDE.md` | mirrored in both repos; change both in the same change when the contract moved |
| 7 | every note touched | today's `updated:` |
| 8 | `tree/tree.json`, `tree/tree.md` | regenerated with `node scripts/build-tree.mjs` and committed with the notes; `--check` is what CI runs |

## 5 · Finish

Push both branches, open the two pull requests, reference the ticket in both.
Report what shipped and what stays open in the same words as the vault.

## Where to look for what

- Anyone → the [[Docs Tree]] page: project → domain → feature → Docs, Story,
  Requirements, Frontend, tasks, decisions, with a status chip on each.
- A frontend developer picking up a done feature → [[Frontend Index]] → the
  feature's frontend note → the feature note for the *How it works*.
- A backend developer picking up a ticket → [[Backlog]] → the ticket → the
  feature note → [[Ring Access Model]].
- Anyone checking status → [[Feature Tree]] and [[Home]].

Related: [[Docs Tree]] · [[Architecture]] · [[API Conventions]] · [[Frontend Contract]]
