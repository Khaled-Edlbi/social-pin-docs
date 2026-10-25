# Social Pin · Docs vault — rules for anyone (or any agent) editing it

This repository is the documentation vault for Social Pin: the backend
(`github.com/Khaled-Edlbi/social-pin`), the frontend and the product share it.
It is plain Markdown with wikilinks and YAML frontmatter; it also reads on
GitHub. Start at `Home.md`. **The full rules are `project/Agent Rules.md`**;
this file is the short form and defers to it.

## What lives where

| Folder | One note per | Template |
|---|---|---|
| `business/` `frontend/` `backend/` | project reference for that layer: overview, glossary, contract, API guide, architecture, conventions, migrations, setup (`type: project`, `layer:`) | `templates/Project Note Template.md` |
| `project/` | the rules every layer follows: `Workflow`, `Agent Rules`, `Docs Tree`; the agents, one note per role that **is** its prompt: `Agent Protocol` (shared), `Owner Agent`, `PM Agent`, `Backend Agent`, `Frontend Agent`, `QA Agent` | — |
| `.claude/` | `skills/<id>/SKILL.md`: `/owner`, `/pm`, `/backend`, `/frontend`, `/qa` load the agent's note, `/admin` the unguarded one for repairs (`/agent` shows the active one, `/agent off` clears it); `settings.json`: the hooks that run `scripts/agent-guard.mjs`, which refuses every write while no agent is active (the first answer is then which agent to use) and lets an active agent write only the files its `agents.list` entry in `docs.config.json` names (plus a flag line under any H1, and sign-off lines where allowed; the admin, anything) | — |
| `modules/<Module>/<Module> Module.md` | module: the sum of its features (`type: module`) | `templates/Module Template.md` |
| `modules/<Module>/<Feature>/<Feature>.md` | feature: the business main node (`type: feature`, no `status:`: the chip is computed from its cards; `frontendOnly: true` when it has no backend part) | `templates/Feature Template.md` |
| `modules/<Module>/<Feature>/<Feature> <Kind>.md` | one note per layer kind: `Story`, `Frontend Requirements`, `Backend Delivery`, `Backend Integration`, `Frontend Delivery`, `QA Backend`, `QA Frontend` (`scope: feature`, `code: <feature id>`) | `templates/<Kind> Template.md` |
| `tasks/T-NNN <Title>.md` → `tasks/T-NNN <Title>/` | task (`type: task`, shown under the feature's story in the tree; `parent: T-NNN` makes it a sub-task of that task, same feature; `labels: [bug]` marks a bug, filed as a sub-task of the task it was found against); a build task is split into `T-NNN Story` plus `T-NNN-fe Frontend · …` and `T-NNN-be Backend · …` sub-tasks in its folder, one per side that has work; the same kinds of notes under its folder, `T-NNN <Kind>.md` (`scope: task`, `code: T-NNN`) | `templates/Task Template.md` + the kind templates |
| `decisions/` | the **needs-decision card** `D-NN …` (`type: decision`, `status: draft \| open`, shown ✅ Fulfilled by the build once answered; `blocks: ["<card>"]` the cards that need it, `decider:` who decides), raised by whichever agent owns the card that needs it, with `node scripts/build-tree.mjs --scaffold decision "<card>" "<title>"`; and its **decision card** `DR-NN …` (`type: decision-record`, `decision: D-NN`, `status: draft \| decided`, `--scaffold record D-NN "<the answer>"`), written and set `decided` by the PM or the owner only, on the user's word: what was decided, why, what it changes (`affects`) and what stays open; it hangs under the needs-decision card. The needs-decision card keeps the question and is never typed decided; while `draft` or `open` it hangs under each card in `blocks` and makes it **Blocked · D-NN**; once its decision card is decided it shows Fulfilled and the card returns to its own status on the next build | `templates/Decision Template.md`, `templates/Decision Record Template.md` |
| `design/` | the design as reference: screen index, navigation map, brief | — |
| `Card Index.md` → `tree/cards.json` | **generated**: one row per card with its unique code (`M-01`, `F-05`, `S-01`, `FR-05`, `BD-05`, `BI-01`, `FD-01`, `QB-01`, `QF-01`, `T-004`, `D-04`, `P-10`); related cards listed as `T-004 \| S-01`; the registry keeps every code ever given | — |
| `tree/` `scripts/` | the docs tree page (`index.html`, hand-written, the owner's), its generated index (`tree.json`, `tree.md`), the card-code registry (`cards.json`) and `build-tree.mjs` | — |

`docs.config.json` declares the layers, their kinds, statuses, the hand-off
flow, the default blocks, the card-code prefixes, the modules and the agents (who writes what). `tasks/Task Board.md`,
`tasks/Backlog.md`, `Card Index.md`, `tree/cards.json`, `tree/tree.json` and `tree/tree.md` are **generated**:
never edit them by hand.

## Read the tree first, then only what `--impact` lists

`tree/tree.json` is the whole vault as one object (nodes, edges, concepts). Read
it before walking folders. Before creating or changing any task or note, run
`node scripts/build-tree.mjs --impact "<note | T-NNN | feature id | endpoint | E_CODE>"`
and read what it returns: the same feature's notes, the directly linked notes,
the two-hop notes only when the change crosses a feature boundary. To turn the
words a person uses ("the speed search", "the rings module") into cards and ids:
`node scripts/build-tree.mjs --find "<words>"`. How to read the page and the
JSON: `project/Docs Tree.md`. How an agent takes a request (resolve, align in
one question, act in scope, finish): `project/Agent Protocol.md`.

## The workflow this vault enforces

`project/Workflow.md` is the sequence, `project/Agent Rules.md` the rules; the short form:

1. A ticket (`tasks/T-NNN …`) exists before code is written; its `## Impact` holds the `--impact` output.
2. The branch in every **code** repo is named after it: `<module>/<ticket-no>/<what-you-do>` (e.g. `ring/T-004/member-count`). In the vault, every agent's branch is named after the card, as deep as it sits: `tickets/<agent>/<M-NN>-<module-id>/<F-NN>-<feature-id>/<card>-<what>` for the cards that ask for or plan work (task, story, Frontend Requirements, decision), `docs/<agent>/…` for the archive (delivery, integration and QA notes, decision records, module and feature cards), `docs/<agent>/project/…` for the rules; `node scripts/build-tree.mjs --branch <agent> <card> [<what>]` prints the name (`project/Workflow.md` §2, `branches` in `docs.config.json`).
3. Each layer writes **its own notes only**, created with `node scripts/build-tree.mjs --scaffold <kind> T-NNN` (a task with its story and halves: `--scaffold task <feature-id> "<Title>"`; a feature: `--scaffold feature <module-id> "<Name>"`): frontend requirements before backend work; backend delivery + integration when the API ships; frontend delivery when the screens ship; QA notes (artefacts, never test code) when checks run. A feature-level note is the sum of its task-level notes and links them; the module note is the sum of its features.
4. Every card in the flow is blocked by default until the card before it is handed off (story and requirements at `approved`, the rest at done); a note's `blockedBy` overrides. A card that **needs a decision** gets a decision card under it (`--scaffold decision "<card>" "<title>"`: what has to be decided, notes, who decides) and is Blocked · D-NN until that card is `decided`, then returns to its own status by itself; never type `blocked` on the card for this. Every note declares `depends` / `affects` / `related` (and `blockedBy` when blocked, by any layer) in frontmatter; after the change, `--impact` again and update or flag (`> ⚠ Affected by [[T-NNN …]] (date): …`) every note it lists that you do not own.
5. `node scripts/build-tree.mjs` is run and the generated files are committed with the notes. CI runs `--check` on every pull request and fails on errors or drift.

## Conventions

- Frontmatter per note type: structural `type: module | feature | task | decision | project` and the kind ids from `docs.config.json` (`story`, `frontend-requirements`, `backend-delivery`, `backend-integration`, `frontend-delivery`, `qa-backend`, `qa-frontend`). Statuses: task `todo | needs-info | blocked | in-progress | done`, needs-decision card `draft | open` (shown ✅ Fulfilled, computed, once its decision card is decided), decision card `draft | decided`; each kind's statuses, *done* set and *handoff* set are in the config. A feature's, a module's and the project's status is **computed**: Done only when every card under it is done, Partial when the cards are done but carry notes, In progress while any card is open, Blocked · D-NN while a decision raised on the feature itself is open. A done task or layer note with a `pending: ["[[Note]]: what", "@who: what"]` list is **Partial** until the list is cleared. Tags mirror them (`task/blocked`, `story/approved`, `qa-backend/passing`, `module/<id>`, `layer/<id>`; a feature carries no status tag). Keep frontmatter flat: scalars, quoted strings and inline `[a, b]` lists only; the build script parses nothing else.
- **Priority and deadline on every card.** `priority: critical | high | medium | low` (the enum is `priorities` in `docs.config.json`; the old `P0`–`P3` are aliases the build still reads with a warning; the tag mirrors it, `priority/high`) and `deadline: YYYY-MM-DD`, both optional. A layer note without its own inherits its task's or feature's; a sub-task its parent's; a task its feature's (`inherits` in `tree/tree.json` names the source). The tree draws a **flag** in the level's colour and a **clock** coloured by how close the deadline is: the last `deadlines.windowDays` (3) before it split evenly over the zones, green *on track* → yellow *due soon* → red *last day*, a 💀 once the day is over. The colour is computed when the page is viewed, never written into a generated file.
- **Stage, release, environments.** The project's `stage: concept | prototype | mvp | beta | live | sunset` is typed by the owner in `business/Project Overview.md`, never computed, and sits beside the computed status; a feature's `release: mvp | v1 | later` (owner, feature cards only, inherited below) feeds the project card's release progress; `deployedTo: [dev, staging, prod]` on Backend and Frontend Delivery notes says where it runs. Enums in `docs.config.json` (`stages`, `releases`, `environments`); the rule is `project/Agent Rules.md` §4.
- Headings carry the status emoji: ✅ done · 🟡 partial / in progress · ⬜ todo · 🖼️ frontend only · 🔌 backend integration · 🧪 QA · ❓ decision. Story and requirements notes carry no emoji; their status is the chip in the tree.
- **Card codes.** Every card (one Markdown file in the tree) has one unique code, `<prefix>-<number>`, listed in `Card Index.md` and kept in `tree/cards.json`: a task's and a decision's code is its id (`T-004`, `D-04`); every other card got the next free number for its kind's prefix (`M` module, `F` feature, `S` story, `FR` frontend requirements, `BD` backend delivery, `BI` backend integration, `FD` frontend delivery, `QB` QA backend, `QF` QA frontend, `P` project note) the first time the build saw it and keeps it. A new card gets the next number, a deleted card's code is retired and never handed out again, and a duplicate, renumbered or wrong-prefix code fails the build. Refer to cards by code as `T-004 | S-01`; `--impact S-01` resolves a code.
- Wikilink by note name: `[[Rings]]`, `[[Rings Backend Integration]]`, `[[T-004 …]]` with the full title. Screen ids are the prototype's (`[[Screen Index#s44|s44]]`).
- Dates are `YYYY-MM-DD`. Every card carries `created:`, the day it was made: the scaffold or the template writes it once and nobody changes it (the cards made before the rule got the day git first saw the file). Every note touched gets today's `updated:`. The tree page filters on both.
- Describe things as they **are**. A gap written down is better than a feature described as done. Say "not available yet" and link the task.
- Project reference (stack, migrations, contracts) stays in `backend/`, `frontend/`, `business/`; feature and task behaviour stays in the feature's and task's notes. Never both.
- Never edit `design/Wireframe Brief.md`: it is a verbatim copy.
