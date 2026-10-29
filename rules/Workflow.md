---
type: project
layer: shared
created: 2026-10-15
updated: 2026-10-29
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

## 1 · Story first (business)

Every piece of work starts from **the feature's story**, `S-NN <Feature> Story` (one per feature, since 2026-10-27): a new screen, a change or a gap is a new part of that story (`### S7 · <screen or journey>`, with its acceptance criteria), written by the PM ([[PM Agent]]), approved by product. There are no tasks ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]). From the story the work runs through the feature's one flow (§3): the frontend adds what the new part needs to the feature's Frontend Requirements and sets it `ready`, the backend approves it and builds it, and so on. The feature card carries the priority and the deadline. A story or a card in ❓ *Needs a decision* or ⛔ *Blocked* is not workable: the decision or the blocker comes first.

**When a card needs a decision**, at any step below: create the needs-decision card from the card that needs it, `node scripts/build-tree.mjs --scaffold needs-decision "<card>" "<title>"` (`needs-decisions/ND-NN <Title>.md`, `status: draft`, `blocks: ["<card>"]`), write what has to be decided, the notes and who decides (`decider:`), set it `open` when it is ready for the decider, then rebuild: it hangs under the card, the card shows **Blocked · ND-NN** (from `draft` on) and everything after it waits. Do not touch the card's `status:`. The answer goes on its own card, the decision card (`node scripts/build-tree.mjs --scaffold decision ND-NN "<the answer>"`, `draft`: what was decided, why, what it changes in `affects`, what stays open); when the user decides, the PM or the owner sets it `decided` (`decidedBy`, `decidedAt`). The needs-decision card then shows ✅ **Fulfilled** by itself (nobody types it; its *Decision* section becomes one line pointing at the decision card), the next build returns the card to its own status and work continues, with the needs-decision card under the card and the decision card under it. The rule: [[Agent Rules#4 · Statuses, blocking and sign-off]].

Run `node scripts/build-tree.mjs --impact "S-NN <Feature> Story"` before writing the new part: what it lists is the reading list for everyone who picks the work up.

## 2 · Branch from the feature

`ring/F-11/member-count` in every code repository touched (the backend and the client; the vault's branches are below): the module (a backend `src/modules/<feature>` folder name or a cross-cutting area such as `prisma`, `common`, `docs`, `ci`), the feature's card code exactly as [[Card Index]] lists it, a short kebab-case summary of the story part being built. Never invent a code. One story part per branch. Commits are `<type>(<module>): <message>` with the feature and the story part in the body (`Feature: F-11`, `Story: S-11 S7`). Set the layer note you are building to `in-progress` (Backend Delivery, Frontend Delivery), or add the part to its `pending` list when the note is already done (Partial, [[Agent Rules#2 · Codes, scopes and the "sum of" rule]]).

### Vault branches · every agent

Every agent's notes in the vault go on a branch named after the **card** the change is about, as deep as it sits and no deeper; the vault never takes the code repositories' `<module>/<F-NN>/…` shape:

```
tickets/<agent>/<M-NN>-<module-id>/<F-NN>-<feature-id>/<last>
docs/<agent>/<M-NN>-<module-id>/<F-NN>-<feature-id>/<last>
```

- The prefix comes from the card's kind (`branches` in `docs.config.json`): **`tickets/`** for the cards that ask for or plan work, a story, a bug, a Frontend Requirements note, a needs-decision card; **`docs/`** for the archive of what is, a Backend Delivery, a Backend Integration, a Frontend Delivery, a QA Backend or QA Frontend note, a decision card, a module or feature card, and everything outside the modules (the rules, the reference notes).
- `<agent>` is the agent that writes it: `owner`, `pm`, `frontend`, `backend`, `qa`; `admin` for the docs system (the rules, the config, the templates, the scripts, the tree page, the agents) and for a repair or a migration, by [[Admin Agent]].
- Then the card's path: `<M-NN>-<module-id>` when the card sits in a module, `/<F-NN>-<feature-id>` when it sits in a feature; the codes as [[Card Index]] lists them, the ids as `docs.config.json` spells them, never a backend folder.
- `<last>` is a short kebab-case `<what-you-do>` when the branch's card **is** the module or the feature, and `<card code>-<what-you-do>` for a card under them: a decision, a story sign-off.
- Outside a module: `docs/<agent>/project/<last>` for the rules, the config, the templates, the scripts, the agents, CI, [[Home]], the README, `CLAUDE.md`, and for a decision raised on any of them; `docs/<agent>/business/<last>` for the reference notes in `business/` ([[Project Overview]], [[Glossary]], [[Feature Tree]], the status reports).
- **One card per branch.** A request that touches three cards is three branches, merged in order; a decision raised and decided in one step is one card. A second story gets its own branch, even when the same request brought both.
- **Codes come from the build:** a new feature or decision has no code until `node scripts/build-tree.mjs` has run once. Scaffold, fill, build, then cut the branch; the working tree carries over.
- `node scripts/build-tree.mjs --branch <agent> <card> [<what-you-do>]` prints the name for any card ([[Docs Tree#For agents]]); nobody assembles the codes by hand.

| Change | Branch |
|---|---|
| the owner rewrites the module note M-09 | `docs/owner/M-09-payments-gateway/business-side` |
| the owner creates the feature F-41 | `docs/owner/M-09-payments-gateway/F-41-pay-for-an-order/create` |
| the owner raises ND-07 under the Payments & Orders story (feature `payments`, module `commerce`) | `tickets/owner/M-07-commerce/F-27-payments/ND-07-payment-provider` |
| the PM records the answer on D-09 | `docs/pm/M-09-payments-gateway/F-41-pay-for-an-order/D-09-decided` |
| the admin raises a vault rule's decision card | `tickets/admin/project/ND-08-flag-window` |
| the owner approves the story S-70 | `tickets/owner/M-07-commerce/F-27-payments/S-70-approved` |
| the owner sets Payments & Orders to critical | `docs/owner/M-07-commerce/F-27-payments/priority-critical` |
| the admin changes a rule | `docs/admin/project/owner-creates-features` |
| the owner adds a Glossary entry | `docs/owner/business/glossary-payment-terms` |
| the PM writes the feature story S-69 | `tickets/pm/M-07-commerce/F-27-payments/S-69-draft` |
| the PM adds a part to the story S-105 | `tickets/pm/M-09-payments-gateway/F-41-pay-for-an-order/S-105-s7-refunds` |
| the frontend writes Pay for an order Frontend Requirements (FR-41) | `tickets/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FR-41-draft` |
| the frontend records Pay for an order Frontend Delivery | `docs/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FD-NN-shipped` |
| the backend records Payments & Orders Backend Delivery (BD-27) | `docs/backend/M-07-commerce/F-27-payments/BD-27-shipped` |
| QA records a run on a QA Backend note | `docs/qa/M-NN-<module>/F-NN-<feature>/QB-NN-passing` |
| the backend sets the bug B-06 ready once its fix ships | `tickets/backend/M-01-identity/F-02-auth/B-06-ready` |
| QA closes or reopens B-06 after the re-test | `tickets/qa/M-01-identity/F-02-auth/B-06-closed`, `…/B-06-reopened` |
| the admin repairs a stale tree after a merge | `docs/admin/project/repair-tree` |

**Commits on these branches**, one card per commit:

- a card: `<kind>(<module-id>): <card code> <card name> · <what changed>`, the kind being the card's (`module`, `feature`, `story`, `bug`, `needs-decision`, `decision`, or a layer note's kind: `frontend-requirements`, `backend-delivery`, `backend-integration`, `frontend-delivery`, `qa-backend`, `qa-frontend`), never `docs`: `needs-decision(commerce): ND-07 Payment provider · raised from S-27` · `story(commerce): S-27 Payments & Orders Story · S7 refunds added` · `feature(identity): F-40 Google Auth · priority critical`;
- a rule or any other vault change outside the cards: `rules(project): <what changed>`;
- a reference note in `business/`: `reference(business): <note name> · <what changed>`.

Per agent, branch and commit together (a decision card commits as `decision`, a bug as `bug`):

| Agent | Branch | Commit subject |
|---|---|---|
| owner | `docs/owner/M-09-payments-gateway/F-41-pay-for-an-order/create` | `feature(payments-gateway): F-41 Pay for an order · created, business side written` |
| owner | `tickets/owner/M-07-commerce/F-27-payments/ND-07-payment-provider` | `needs-decision(commerce): ND-07 Payment provider · raised from S-27` |
| owner | `docs/owner/business/<what>` | `reference(business): <note name> · <what changed>` |
| pm | `tickets/pm/M-09-payments-gateway/F-41-pay-for-an-order/S-105-draft` | `story(payments-gateway): S-105 Pay for an order Story · draft written` |
| pm | `tickets/pm/M-09-payments-gateway/F-41-pay-for-an-order/S-105-s7-refunds` | `story(payments-gateway): S-105 Pay for an order Story · S7 refunds added` |
| pm | `docs/pm/M-09-payments-gateway/F-41-pay-for-an-order/D-09-decided` | `decision(payments-gateway): D-09 30-minute hold tied to the Stripe checkout · ND-09 decided, option 2` |
| frontend | `tickets/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FR-41-draft` | `frontend-requirements(payments-gateway): FR-41 Pay for an order Frontend Requirements · draft written` |
| frontend | `docs/frontend/M-09-payments-gateway/F-41-pay-for-an-order/FD-NN-shipped` | `frontend-delivery(payments-gateway): FD-NN Pay for an order Frontend Delivery · s51 shipped` |
| backend | `tickets/backend/M-09-payments-gateway/F-41-pay-for-an-order/FR-41-accepted` | `frontend-requirements(payments-gateway): FR-41 Pay for an order Frontend Requirements · accepted by the backend` |
| backend | `docs/backend/M-07-commerce/F-27-payments/BD-27-shipped` | `backend-delivery(commerce): BD-27 Payments & Orders Backend Delivery · checkout endpoint shipped` |
| qa | `docs/qa/M-09-payments-gateway/F-41-pay-for-an-order/QB-NN-passing` | `qa-backend(payments-gateway): QB-NN Pay for an order QA Backend · passing on <build>` |
| qa | `tickets/qa/M-09-payments-gateway/F-41-pay-for-an-order/B-07-filed` | `bug(payments-gateway): B-07 <title> · filed against QB-41` (a bug has its own `B` number and hangs on the card it was found against: `--found-on "<note name>"`) |
| backend | `tickets/backend/M-01-identity/F-02-auth/B-06-ready` | `bug(identity): B-06 <title> · ready, fixed in BD-02` (the fixing layer sets `in-progress` and `ready` only; QA closes it) |
| admin | `docs/admin/project/<what>` | `rules(project): <what changed>` |

The body: two or three lines on what changed and why, the other files touched, the trailers `Feature: F-NN`, `Story: S-NN`, `Decision: ND-NN` when one is involved, then the attribution line. Rebuild before each commit and include the generated files, so every commit passes `--check` on its own. The bash guard reads the attribution line's angle brackets as a redirect: commit with `git commit -F <file outside the vault>`, or with a `git commit -F -` heredoc whose command starts with `git` and contains no `&&` or `;`.

## 3 · The layers, in flow order

```
Story ──▶ Frontend Requirements ──▶ Backend Delivery ──▶ Backend Integration ──▶ Frontend Delivery ──▶ QA Frontend ─┐
                                          └──────────▶ QA Backend ──────────────────────────────────────────────────┴──▶ Story (verified)
```

| Step | Layer | Note (one per feature) | Done when |
|---|---|---|---|
| 1 | Business | `S-NN <Feature> Story`, with the new part added | `approved` by product |
| 2 | Frontend | `FR-NN <Feature> Frontend Requirements` | `ready` (📨) by the frontend when the list is complete; `approved` by the backend, or back to `draft` with what is missing; ✅ `delivered` **on its own** once the backend cards of its scope (Backend Delivery `done`, Backend Integration `current`) are done with nothing pending: the build computes it, nobody types it (a `frontendOnly` feature has no backend cards and sets it by hand) |
| 3 | Backend | `BD-NN <Feature> Backend Delivery` | `done`: code merged, `pnpm typecheck && pnpm test` green |
| 4 | Backend | `BI-NN <Feature> Backend Integration` | 🔵 `current`: matches `main`, handed off (the frontend and QA use it); ✅ Delivered **on its own** once the QA Backend passes and the Frontend Delivery is done, nothing pending: the build computes it, nobody types it |
| 5 | Frontend | `FD-NN <Feature> Frontend Delivery` | `done`: screens merged |
| 6 | QA | `QB-NN <Feature> QA Backend`, `QF-NN <Feature> QA Frontend` | `passing` on a named build |
| 7 | Business | the story | ✅ Fulfilled (`verified`): set by the **PM** once both QA notes pass with nothing pending; never by QA |

Create each note with `node scripts/build-tree.mjs --scaffold <kind> <feature-id>` the first time; after that, a new part of the story is added to the same notes, and a note already done takes it as a `pending` entry (Partial) until it is built ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]). The order is the default from `docs.config.json` and **each step is blocked until the step before it is handed off** (the story and the requirements at `approved`, the others at their done status): the tree shows the card as ⛔ Blocked with the reason until then. A layer may be blocked by any other through `blockedBy` ([[Agent Rules#4 · Statuses, blocking and sign-off]]), and a new layer slots into the flow by config ([[Agent Rules#5 · Adding a layer]]).

Work with no screen and no story part (provider wiring, a job, a migration, CI) goes into the feature's Backend Delivery as a `pending` entry or, outside any feature, into the project notes; it never gets a card of its own.

## 4 · The feature holds the work

There is nothing to roll up: the story, the requirements, the deliveries and the QA notes are the feature's own, one of each. When a layer finishes a part of the story, it updates its note (what shipped, `## Log`) and clears the `pending` entry that part had opened. The feature's chip is computed: Done only when every card under it is done, Partial when the cards are done but carry `pending` notes, In progress while any card is open; nobody types it. When what the backend shipped changes, the backend updates the module note's *Backend* column and the feature note's `**Backend:**` line. Cross-cutting reference (stack, migrations, contracts) goes to the layer's project docs (`backend/`, `frontend/`, `business/`), never into the feature.

## 5 · Finish

1. `node scripts/build-tree.mjs --finish <agent> <card> [<what-you-do>]` does steps 1 and 4 in one call and prints the branch and the commit message ([[Agent Protocol#5 · Finish]]): update or flag (`--flag`) every note it lists that the change made wrong.
2. The layer note you built: `status: done` (or the `pending` entry for the part removed), a `## Log` line (date · branch · story part · what shipped, which notes were flagged). Anything left for another card or a person goes in `pending:` (the note shows 🟡 Partial until it is cleared); nothing is typed into the feature note's status.
3. Every touched note: today's `updated:`.
4. The build (`--finish` runs it); commit `tree/tree.json`, `tree/tree.md`, `tree/cards.json`, `Card Index.md` with the notes (a new note gets its card code here, see [[Card Index]]). `--check` is what CI runs.
5. Push every branch; open the pull requests; link them to each other and to the feature's story. Report what shipped and what stays open in the vault's words.

## Where to look for what

- Anyone → the [[Docs Tree]] page: project → module → feature → the layer notes, decisions; filter by layer.
- A frontend developer → [[Frontend Contract]] → the feature's Backend Integration note → [[Frontend API Guide]].
- A backend developer → the feature's approved Frontend Requirements → its story → `--impact` → the feature's Backend Delivery → [[Ring Access Model]].
- Product → [[Decisions]], the ✏️ Draft stories in the tree, [[Screen Index]].
- QA → the feature's two delivery notes and its story; the QA templates.
- Status → [[Home]] and the module notes.

Related: [[Agent Rules]] · [[Docs Tree]] · [[Agent Protocol]] · [[PM Agent]] · [[Architecture]] · [[Frontend Contract]]
