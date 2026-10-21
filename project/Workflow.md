---
type: project
layer: shared
updated: 2026-10-21
related: ["Agent Rules", "Docs Tree"]
tags: [project, layer/shared]
---

# Workflow · ticket → branch → layers → docs

How a piece of work moves through the repositories and the layers. The rules behind each step are in [[Agent Rules]]; this note is the sequence.

## The repositories

| Repo | Holds | Branch for a ticket |
|---|---|---|
| `social-pin` (backend) | the NestJS API; `docs/README.md` points here | `<module>/<ticket-no>/<what-you-do>` |
| the frontend repo | the client; its agent rules are in [[Frontend Agent Prompt]] | **the same name** |
| `social-pin-docs` (this vault) | tickets, modules, features, every layer's notes, decisions, design index, project docs | **the same name** |

Branches with one name pair the code and its documentation; pull requests link each other and the ticket.

## 1 · Ticket first (business)

Every piece of work starts from `tasks/T-NNN <Title>.md`: the feature, the screens, `depends`, the definition of done. Create it from `templates/Task Template.md` with the next free number; the generated [[Task Board]] and [[Backlog]] pick it up on the next build. Add it to the feature note's *Tasks* table. Then split it: `node scripts/build-tree.mjs --scaffold story T-NNN` for its user story, and a `T-NNN-fe Frontend · <title>` and a `T-NNN-be Backend · <title>` sub-task in its folder for the sides that have work ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]). `node scripts/build-tree.mjs --scaffold task <feature-id> "<Title>"` does all of that in one go (the next free number, the folder, the story, the halves, the impact list); the business layer's agent, [[PM Agent]], runs it on request (every agent's steps: [[Agent Protocol]]). A ticket in ❓ *Needs a decision* or ⛔ *Blocked* is not workable: the decision or the blocker comes first.

**When a card needs a decision**, at any step below: create the decision card from the card that needs it, `node scripts/build-tree.mjs --scaffold decision "<card>" "<title>"` (`decisions/D-NN <Title>.md`, `status: open`, `blocks: ["<card>"]`), write what has to be decided, the notes and who decides (`decider:`), then rebuild: the decision hangs under the card, the card shows **Blocked · D-NN** and everything after it waits. Do not touch the card's `status:`. When the decider sets the decision `decided` (with `decidedBy`, `decidedAt`, the *Decision* and `affects`), the next build returns the card to its own status and work continues; the decision stays under the card as the record. The rule: [[Agent Rules#4 · Statuses, blocking and sign-off]].

Run `node scripts/build-tree.mjs --impact T-NNN` and paste what it lists into the ticket's `## Impact`: that is the reading list for everyone who picks it up.

## 2 · Branch from the ticket

`ring/T-004/member-count` in every repo touched: the module (a backend `src/modules/<feature>` folder name or a cross-cutting area such as `prisma`, `common`, `docs`, `ci`), the ticket id exactly as the note spells it, a short kebab-case summary. Never invent a ticket id. One ticket per branch. Commits are `<type>(<module>): <message>` with the ticket in the body. Set the ticket to `status: in-progress`.

## 3 · The layers, in flow order

```
Story ──▶ Frontend Requirements ──▶ Backend Delivery ──▶ Backend Integration ──▶ Frontend Delivery ──▶ QA Frontend ─┐
                                          └──────────▶ QA Backend ──────────────────────────────────────────────────┴──▶ Story (verified)
```

| Step | Layer | Note (task level; the feature level is its sum) | Done when |
|---|---|---|---|
| 1 | Business | `T-NNN Story` (or the feature's story, updated) | `approved` by product |
| 2 | Frontend | `T-NNN Frontend Requirements` | `approved` by the backend, `delivered` when every row is ✅ |
| 3 | Backend | `T-NNN Backend Delivery` | `done`: code merged, `pnpm typecheck && pnpm test` green |
| 4 | Backend | `T-NNN Backend Integration` | `current`: matches `main` |
| 5 | Frontend | `T-NNN Frontend Delivery` | `done`: screens merged |
| 6 | QA | `T-NNN QA Backend`, `T-NNN QA Frontend` | `passing` on a named build |
| 7 | Business | the story | `verified` |

Create each note with `node scripts/build-tree.mjs --scaffold <kind> T-NNN`; the first one moves the task into its folder. The order is the default from `docs.config.json` and **each step is blocked until the step before it is handed off** (the story and the requirements at `approved`, the others at their done status): the tree shows the card as ⛔ Blocked with the reason until then. A layer may be blocked by any other through `blockedBy` ([[Agent Rules#4 · Statuses, blocking and sign-off]]), and a new layer slots into the flow by config ([[Agent Rules#5 · Adding a layer]]).

A docs-only or infrastructure task (like [[T-064 Restructure the docs vault]]) has a task note and no layer notes.

## 4 · Roll up — the feature is the sum of its tasks

When a task-level note reaches its done status, the same layer updates the feature-level note of the same kind (`modules/<Module>/<Feature>/<Feature> <Kind>.md`) and links the task note in its *Tasks delivered* table; the build warns otherwise. The feature's chip is computed: Done only when every card under it is done, Partial when the cards are done but carry `pending` notes, In progress while any card is open; nobody types it. When what the backend shipped changes, the backend updates the module note's *Backend* column and the feature note's `**Backend:**` line. Cross-cutting reference (stack, migrations, contracts) goes to the layer's project docs (`backend/`, `frontend/`, `business/`), never into the feature.

## 5 · Finish

1. `--impact` again; update or flag every note it lists that the change made wrong.
2. Task note: `status: done`, DoD boxes, `## Log` line (date · branch · what shipped, which notes were flagged). Anything left for another card or a person goes in `pending:` (the task shows 🟡 Partial until it is cleared); nothing is typed into the feature note's status.
3. Every touched note: today's `updated:`.
4. `node scripts/build-tree.mjs`; commit `tree/tree.json`, `tree/tree.md`, `tree/cards.json`, `Card Index.md`, `tasks/Task Board.md`, `tasks/Backlog.md` with the notes (a new note gets its card code here, see [[Card Index]]). `--check` is what CI runs.
5. Push every branch; open the pull requests; link them to each other and to the ticket. Report what shipped and what stays open in the vault's words.

## Where to look for what

- Anyone → the [[Docs Tree]] page: project → module → feature → the layer notes (the tasks under the story), decisions; filter by layer.
- A frontend developer → [[Frontend Contract]] → the feature's Backend Integration note → [[Frontend API Guide]].
- A backend developer → [[Backlog]] → the ticket → `--impact` → the feature's Backend Delivery and Frontend Requirements → [[Ring Access Model]].
- Product → [[Decisions]], the ✏️ Draft stories in the tree, [[Screen Index]].
- QA → the feature's two delivery notes and its story; the QA templates.
- Status → [[Home]] and the module notes.

Related: [[Agent Rules]] · [[Docs Tree]] · [[Agent Protocol]] · [[PM Agent]] · [[Architecture]] · [[Frontend Contract]]
