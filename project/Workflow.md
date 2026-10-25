---
type: project
layer: shared
updated: 2026-10-25
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
| `social-pin-docs` (this vault) | tickets, modules, features, every layer's notes, decisions, design index, project docs | the card's branch, `tickets/<agent>/…` or `docs/<agent>/…` |

The code repositories share one name per ticket, so the backend and the client pull requests link each other and the ticket. The vault does not take that name: every agent's notes go on a branch named after the **card** they change, `tickets/…` for the cards that ask for or plan work and `docs/…` for the archive of what shipped ([[#Vault branches · every agent]]); the pull request links the code branch and the ticket.

## 1 · Ticket first (business)

Every piece of work starts from `tasks/T-NNN <Title>.md`: the feature, the screens, `depends`, the definition of done. Create it from `templates/Task Template.md` with the next free number; the generated [[Task Board]] and [[Backlog]] pick it up on the next build. Add it to the feature note's *Tasks* table. Then split it: `node scripts/build-tree.mjs --scaffold story T-NNN` for its user story, and a `T-NNN-fe Frontend · <title>` and a `T-NNN-be Backend · <title>` sub-task in its folder for the sides that have work ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]). `node scripts/build-tree.mjs --scaffold task <feature-id> "<Title>"` does all of that in one go (the next free number, the folder, the story, the halves, the impact list); the business layer's agent, [[PM Agent]], runs it on request (every agent's steps: [[Agent Protocol]]). A ticket in ❓ *Needs a decision* or ⛔ *Blocked* is not workable: the decision or the blocker comes first.

**When a card needs a decision**, at any step below: create the decision card from the card that needs it, `node scripts/build-tree.mjs --scaffold decision "<card>" "<title>"` (`decisions/D-NN <Title>.md`, `status: open`, `blocks: ["<card>"]`), write what has to be decided, the notes and who decides (`decider:`), then rebuild: the decision hangs under the card, the card shows **Blocked · D-NN** and everything after it waits. Do not touch the card's `status:`. When the decider takes the decision, the answer goes on its own card, the decision record (`node scripts/build-tree.mjs --scaffold record D-NN "<the answer>"`: what was decided, why, what it changes in `affects`, what stays open), and the decision card is signed off `decided` with a one-line *Decision* pointing at it; the next build returns the card to its own status and work continues, with the decision under the card and its record under the decision. The rule: [[Agent Rules#4 · Statuses, blocking and sign-off]].

Run `node scripts/build-tree.mjs --impact T-NNN` and paste what it lists into the ticket's `## Impact`: that is the reading list for everyone who picks it up.

## 2 · Branch from the ticket

`ring/T-004/member-count` in every code repository touched (the backend and the client; the vault's branches are below): the module (a backend `src/modules/<feature>` folder name or a cross-cutting area such as `prisma`, `common`, `docs`, `ci`), the ticket id exactly as the note spells it, a short kebab-case summary. Never invent a ticket id. One ticket per branch. Commits are `<type>(<module>): <message>` with the ticket in the body. Set the ticket to `status: in-progress`.

### Vault branches · every agent

Every agent's notes in the vault go on a branch named after the **card** the change is about, as deep as it sits and no deeper; the vault never takes the code repositories' `<module>/<T-NNN>/…` shape:

```
tickets/<agent>/<M-NN>-<module-id>/<F-NN>-<feature-id>/<last>
docs/<agent>/<M-NN>-<module-id>/<F-NN>-<feature-id>/<last>
```

- The prefix comes from the card's kind (`branches` in `docs.config.json`): **`tickets/`** for the cards that ask for or plan work, a task with its halves and bugs, a story, a Frontend Requirements note, a decision card; **`docs/`** for the archive of what is, a Backend Delivery, a Backend Integration, a Frontend Delivery, a QA Backend or QA Frontend note, a decision record, a module or feature card, and everything outside the modules (the rules, the reference notes).
- `<agent>` is the agent that writes it: `owner`, `pm`, `frontend`, `backend`, `qa`; `admin` for a repair or a migration by [[Admin Agent]].
- Then the card's path: `<M-NN>-<module-id>` when the card sits in a module, `/<F-NN>-<feature-id>` when it sits in a feature; the codes as [[Card Index]] lists them, the ids as `docs.config.json` spells them, never a backend folder.
- `<last>` is a short kebab-case `<what-you-do>` when the branch's card **is** the module or the feature, and `<card code>-<what-you-do>` for a card under them: a decision, a story sign-off, a task's priority.
- Outside a module: `docs/<agent>/project/<last>` for the rules, the config, the templates, the scripts, the agents, CI, [[Home]], the README, `CLAUDE.md`, and for a decision raised on any of them; `docs/<agent>/business/<last>` for the reference notes in `business/` ([[Project Overview]], [[Glossary]], [[Feature Tree]], the status reports).
- **One card per branch.** A request that touches three cards is three branches, merged in order; a decision raised and decided in one step is one card. A second story gets its own branch, even when the same request brought both.
- **Codes come from the build:** a new feature or decision has no code until `node scripts/build-tree.mjs` has run once. Scaffold, fill, build, then cut the branch; the working tree carries over.
- `node scripts/build-tree.mjs --branch <agent> <card> [<what-you-do>]` prints the name for any card ([[Docs Tree#For agents]]); nobody assembles the codes by hand.

| Change | Branch |
|---|---|
| the owner rewrites the module note M-09 | `docs/owner/M-09-payments-gateway/business-side` |
| the owner creates the feature F-41 | `docs/owner/M-09-payments-gateway/F-41-pay-for-an-order/create` |
| the owner raises D-07 under T-047 (feature `payments`, module `commerce`) | `tickets/owner/M-07-commerce/F-27-payments/D-07-payment-provider` |
| the PM records the answer on DR-09 | `docs/pm/M-09-payments-gateway/F-41-pay-for-an-order/DR-09-decided` |
| the owner raises a vault rule's decision card | `tickets/owner/project/D-08-flag-window` |
| the owner approves the story S-70 | `tickets/owner/M-07-commerce/F-27-payments/S-70-approved` |
| the owner sets T-047 to critical | `tickets/owner/M-07-commerce/F-27-payments/T-047-priority-critical` |
| the owner changes a rule | `docs/owner/project/owner-creates-features` |
| the owner adds a Glossary entry | `docs/owner/business/glossary-payment-terms` |
| the PM writes the feature story S-69 | `tickets/pm/M-07-commerce/F-27-payments/S-69-draft` |
| the PM files T-065 with its story and halves | `tickets/pm/M-09-payments-gateway/F-41-pay-for-an-order/T-065-filed` |
| the frontend writes Pay for an order Frontend Requirements (FR-41) | `tickets/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FR-41-draft` |
| the frontend records Pay for an order Frontend Delivery | `docs/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FD-NN-shipped` |
| the backend records Payments & Orders Backend Delivery (BD-27) | `docs/backend/M-07-commerce/F-27-payments/BD-27-shipped` |
| QA records a run on a QA Backend note | `docs/qa/M-NN-<module>/F-NN-<feature>/QB-NN-passing` |
| the admin repairs a stale tree after a merge | `docs/admin/project/repair-tree` |

**Commits on these branches**, one card per commit:

- a card: `<kind>(<module-id>): <card code> <card name> · <what changed>`, the kind being the card's (`module`, `feature`, `story`, `task`, `bug`, `decision`, or a layer note's kind: `frontend-requirements`, `backend-delivery`, `backend-integration`, `frontend-delivery`, `qa-backend`, `qa-frontend`), never `docs`: `decision(commerce): D-07 Payment provider · decided, Stripe for all four flows` · `story(commerce): S-70 T-047 Story · approved by khaled` · `feature(identity): F-40 Google Auth · T-071 added to the Tasks table`;
- a rule or any other vault change outside the cards: `rules(project): <what changed>`;
- a reference note in `business/`: `reference(business): <note name> · <what changed>`.

Per agent, branch and commit together (a decision record commits as `decision`, a task's half as `task`, a bug as `bug`):

| Agent | Branch | Commit subject |
|---|---|---|
| owner | `docs/owner/M-09-payments-gateway/F-41-pay-for-an-order/create` | `feature(payments-gateway): F-41 Pay for an order · created, business side written` |
| owner | `tickets/owner/M-07-commerce/F-27-payments/D-07-payment-provider` | `decision(commerce): D-07 Payment provider · raised from T-047` |
| owner | `docs/owner/project/<what>` | `rules(project): <what changed>` |
| pm | `tickets/pm/M-09-payments-gateway/F-41-pay-for-an-order/S-105-draft` | `story(payments-gateway): S-105 Pay for an order Story · draft written` |
| pm | `tickets/pm/M-09-payments-gateway/F-41-pay-for-an-order/T-065-filed` | `task(payments-gateway): T-065 Open a Stripe checkout for an order · filed under F-41, both halves` |
| pm | `docs/pm/M-09-payments-gateway/F-41-pay-for-an-order/DR-09-decided` | `decision(payments-gateway): DR-09 30-minute hold tied to the Stripe checkout · D-09 decided, option 2` |
| frontend | `tickets/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FR-41-draft` | `frontend-requirements(payments-gateway): FR-41 Pay for an order Frontend Requirements · draft written` |
| frontend | `docs/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FD-NN-shipped` | `frontend-delivery(payments-gateway): FD-NN Pay for an order Frontend Delivery · s51 shipped` |
| backend | `tickets/backend/M-09-payments-gateway/F-41-pay-for-an-order/FR-41-accepted` | `frontend-requirements(payments-gateway): FR-41 Pay for an order Frontend Requirements · accepted by the backend` |
| backend | `docs/backend/M-07-commerce/F-27-payments/BD-27-shipped` | `backend-delivery(commerce): BD-27 Payments & Orders Backend Delivery · checkout endpoint shipped` |
| qa | `docs/qa/M-09-payments-gateway/F-41-pay-for-an-order/QB-NN-passing` | `qa-backend(payments-gateway): QB-NN Pay for an order QA Backend · passing on <build>` |
| qa | `tickets/qa/M-09-payments-gateway/F-41-pay-for-an-order/T-066-filed` | `bug(payments-gateway): T-066 <title> · filed against T-065` (a bug takes the next free task number) |
| admin | `docs/admin/project/<what>` | `rules(project): <what changed>` |

The body: two or three lines on what changed and why, the other files touched, the trailers `Story: S-NN`, `Ticket: T-NNN`, `Decision: D-NN` when one is involved, then the attribution line. Rebuild before each commit and include the generated files, so every commit passes `--check` on its own. The bash guard reads the attribution line's angle brackets as a redirect: commit with `git commit -F <file outside the vault>`, or with a `git commit -F -` heredoc whose command starts with `git` and contains no `&&` or `;`.

## 3 · The layers, in flow order

```
Story ──▶ Frontend Requirements ──▶ Backend Delivery ──▶ Backend Integration ──▶ Frontend Delivery ──▶ QA Frontend ─┐
                                          └──────────▶ QA Backend ──────────────────────────────────────────────────┴──▶ Story (verified)
```

| Step | Layer | Note (task level; the feature level is its sum) | Done when |
|---|---|---|---|
| 1 | Business | `T-NNN Story` (or the feature's story, updated) | `approved` by product |
| 2 | Frontend | `T-NNN Frontend Requirements` | `approved` by the backend; ✅ `delivered` **on its own** once the backend cards of its scope (Backend Delivery `done`, Backend Integration `current`) are done with nothing pending: the build computes it, nobody types it (a `frontendOnly` feature has no backend cards and sets it by hand) |
| 3 | Backend | `T-NNN Backend Delivery` | `done`: code merged, `pnpm typecheck && pnpm test` green |
| 4 | Backend | `T-NNN Backend Integration` | `current`: matches `main`; the build adds "· verified" once the QA Backend passes and the Frontend Delivery is done (nothing pending) |
| 5 | Frontend | `T-NNN Frontend Delivery` | `done`: screens merged |
| 6 | QA | `T-NNN QA Backend`, `T-NNN QA Frontend` | `passing` on a named build |
| 7 | Business | the story | ✅ Fulfilled (`verified`): set by the **PM** once both QA notes pass with nothing pending; never by QA |

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
