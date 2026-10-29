---
type: project
layer: shared
created: 2026-10-19
updated: 2026-10-29
depends: []
affects: ["Owner Agent", "PM Agent", "Backend Agent", "Frontend Agent", "QA Agent", "Admin Agent"]
related: ["Agent Rules", "Workflow", "Docs Tree"]
tags: [project, layer/shared, rules, agent]
---

# Agent Protocol · how every agent of this vault takes a request

The vault has five agents, one per role, each a note in `rules/` that **is** its prompt and a `/skill` that loads it: [[Owner Agent]] (`/owner`), [[PM Agent]] (`/pm`), [[Backend Agent]] (`/backend`), [[Frontend Agent]] (`/frontend`), [[QA Agent]] (`/qa`); and one that is not a product role, [[Admin Agent]] (`/admin`), the guard switched off: it owns the docs system (the rules, the agents, the config, the templates, the scripts, the tree page), a separate project from the product's cards, and does the repairs and migrations no role may do. The owner is the business owner: it owns cards and business notes, never the docs system. This note is the part they share: how a request is taken from the first word to the commit. An agent's own note says who it is, what it writes and its playbooks; the rules themselves stay in [[Agent Rules]], [[Workflow]] and [[Docs Tree]] and are linked, never copied ([[Agent Rules#7 · What never happens]]).

**The guard.** The agents are declared in `docs.config.json` under `agents.list`: the note, the layer and a `writes` block naming the note types, kinds and paths the agent may write. A hook in `.claude/settings.json` runs `scripts/agent-guard.mjs`: typing `/owner`, `/pm`, `/backend`, `/frontend`, `/qa` or `/admin` makes that agent active for that Claude Code session only (`/agent` shows which, `/agent off` clears it, a new session starts with none), and while one is active every Edit or Write outside its scope is refused with a message that names the agent who owns the file. Each session keeps its own agent, in `.claude/.active-agent/<session id>` (`agents.marker`, git-ignored), so several sessions may work in the same folder with different agents: starting a session, or typing `/pm` or `/agent off` in one, changes no other session's agent, and `node scripts/agent-guard.mjs status` run outside a session lists them all. **While no agent is active, every write is refused**, from the shell too: a request that would change anything is answered first with the question which agent the user will use, and nothing is written until the user types it as the next message (`/pm <the request>`); the agent never picks one for them. Reading is not refused meanwhile: `git status` / `log` / `diff` / `show`, `build-tree.mjs --find` / `--impact` / `--check` / `--branch` / `--list` and the plain read commands (`cat`, `head`, `grep`, `ls`, `wc`) pass, anything else in the shell does not. The admin's entry sets `writes.all` instead of a scope: the guard refuses it nothing, generated files, the shell and the verbatim brief included, and its note says when that is the right agent. Two edits are allowed to everyone on any note: a **flag line** `> ⚠ Affected by [[<the card you changed>]] (YYYY-MM-DD): <what changed>` inserted under the H1, and nothing else; and, for the agents whose entry lists the kind under `signs`, a **sign-off edit** that changes only `status:`, `approvedBy` / `approvedAt`, `decidedBy` / `decidedAt`, `updated:`, `tags:` and the H1. Nobody writes a generated file or `design/Wireframe Brief.md`. Shell commands that write files around the guard are refused too: new notes come from `node scripts/build-tree.mjs --scaffold …`, edits from Edit or from the build's one-call edits (`--set-status`, `--set`, `--flag`, which ask the guard the same question an Edit does and refuse what it refuses), commits from git.

## 1 · Load

1. Read your own note; your scope is your entry in `docs.config.json` (`agents.list`), which the guard prints when you are made active.
2. **Never read `tree/tree.json` whole** (it is some 60,000 lines) and do not walk the folders. Ask the build instead ([[Docs Tree#For agents]]): `--find "<words>"` to turn a name into a card, `--impact <card>` for what a change touches, `--list [filter]` for an overview, one line per card (`--list kind=bug status=todo`, `--list feature=auth`).
3. There is no separate check at load: `--find`, `--impact`, `--branch` and `--list` end with one `⚠ the tree is not clean …` line when the tree has errors or a stale generated file, and say nothing when it is clean. When you see that line, stop and report; nobody builds on a broken tree.

## 2 · Resolve what the user named

The user speaks in product words ("the speed search", "the rings module", "that ticket about counts"); the vault speaks in ids and cards. Before anything else, turn every noun in the request into a card:

- `node scripts/build-tree.mjs --find "<the words>"` lists the cards and concepts that match, best first, with their card code, kind, layer, feature and module. Run it once per noun.
- A module → its id in `docs.config.json` `modules[]` (identity, connections, shared-rings, discovery, events, meetings, commerce, platform). A feature → its `id:` and its `F-NN`. A piece of work → the feature's story and its part (`S-NN S7`); there are no tasks. A defect → its bug, `B-NN`. A screen → `sNN` from [[Screen Index]]. An endpoint or error code → the concept the tree knows, with the feature that owns it.
- Then `node scripts/build-tree.mjs --impact <the card>` for what you are about to change, and read what it lists in that order: the same feature's notes, the directly linked notes, the two-hop notes only when the change crosses a feature boundary ([[Agent Rules#3 · Relations]]).

Never invent a module, a feature id, a screen id, a ticket number, an endpoint or a code. When nothing matches, say so and ask.

## 3 · Align, in one message

**An exact request skips this step.** When the user names the card (its code or its full name) and the exact change (`B-06 → done`, `priority high on F-11`, `deadline 2026-11-15 on S-23`, `flag BD-02 from S-23: the count moved`), the card is inside your scope, nothing blocks it and the request can be read only one way, act at once and report at the end ([[#5 · Finish]]): the user's message is the word a sign-off or a close waits for. If the command refuses (the guard, a ⛔ Blocked card, a status the kind does not have), report what it said and stop; that refusal is the question.

The one-message align below stays for everything else: a new card, writing or changing a story, a change that crosses a feature boundary, a request that names no card or could mean two, and any change whose fields your playbook still needs.

Before you create or change anything, send **one** question message (one batch, not a dialogue) that carries:

1. **What you resolved**, for confirmation: "`speed search` → [[F-19 Discover Hub & Search]] (F-19, discovery); `that bug about the count` → B-03". When two cards fit, offer both.
2. **What your playbook still needs**, with the default you propose for each so the user can answer "yes": the fields your note's playbook lists (screens, priority, effort, which side, what it depends on, the build it was tested on, the endpoint that moved…).
3. **The files you will touch**, by path, and the notes you will only flag. If the request needs a file outside your scope, say which agent owns it and what the exact ask to that agent is; do not do it.
4. **What has to happen first**: an approval, a decision card, a hand-off that is not done (the card is ⛔ Blocked in the tree and stays so).

Wait for the answer. When two readings of the request would lead to materially different changes, ask; when the difference is routine, choose, say which you chose, and go on. A request that is only a question ("where do we stand", "what does the backend have for X") is answered from the tree and changes nothing.

## 4 · Act, inside your scope

- New notes: `node scripts/build-tree.mjs --scaffold <kind> <feature-id>`, `--scaffold feature …`, `--scaffold bug …`, `--scaffold needs-decision "<card>" "<title>"`, `--scaffold decision ND-NN "<the answer>"` ([[Docs Tree#For agents]]). Fill the template; do not reshape it. **Every card is born with its code in front of its file name** (`F-27 Payments & Orders`, `S-69 Payments & Orders Story`, `B-07 …`, `ND-21 …`): the scaffold takes the next free number and repoints the links written to the card's plain name while it was not written yet; never type a code into a file name, never rename a card, and link it by that full name ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]).
- Existing notes: Edit, the exact lines. Keep the frontmatter flat; declare `depends` / `affects` / `related`; every touched note gets today's `updated:`.
- The common edits are one command each ([[Docs Tree#For agents]]); each writes only what the guard lets the active agent write, refuses the rest with the guard's message, and puts the file back if the change would break the build:
  - **a status**: `node scripts/build-tree.mjs --set-status <card> <status>` writes `status:`, the `<kind>/<status>` tag, the H1 emoji, the *Status* segment of the first line (when it reads exactly the old status) and `updated:` together ([[Agent Rules#4 · Statuses, blocking and sign-off]]), and refuses a status the kind does not have, a computed one (a feature's, a module's, the project's, a requirements list's `delivered`) and work on a ⛔ Blocked card. A bug closed: `--resolution <id>`; a sign-off: `--by <name>` (`approvedBy` / `approvedAt`, or `decidedBy` / `decidedAt` on a decision card);
  - **a priority or a deadline**: `--set <card> priority <level>` or `--set <card> deadline <YYYY-MM-DD>` (`none` drops it, so the card inherits again): the field, its tag, its first-line segment and `updated:`;
  - **a flag**: `--flag <card you changed> <note> "<what changed>"` puts the line `> ⚠ Affected by [[<card>]] (date): …` under the note's H1 and names the note in the `## Log` of the card you changed. The owning agent clears the flag when it has updated the note.
- A feature's, a module's and the project's status is never typed.
- When the guard refuses an edit, read its message and do what it says: flag, or hand over. Never route around it with a shell command.

## 5 · Finish

1. `node scripts/build-tree.mjs --finish <agent> <card> [<what-you-do>]`, one call: it writes the generated files (the build), checks them (`--check`: 0 errors, nothing stale; a warning on a card you own is yours to fix, never to silence), lists the notes the change touches, the ones you own to update and the others to `--flag`, and prints the card's vault branch and its commit message (`tickets/<agent>/…` for a story, a Frontend Requirements note, a needs-decision card or a bug, `docs/<agent>/…` for the rest; the shapes are [[Workflow#2 · Branch from the feature]]). Update or flag what it lists that the change made wrong; if you changed anything after it, run it again.
2. Commit the notes **with** the generated files (`tree/`, [[Card Index]]) on the branch it printed, with the message it printed and the attribution line. Code goes on `<module>/<F-NN>/<what-you-do>` in the code repositories, never in the vault.
3. Report, in the vault's words: what you created or changed, by card code and path; what now waits on whom (an approval, a decision, another agent); what you flagged for another layer; what the user still has to answer.

## 6 · Hand-offs between agents

An agent never does another agent's work, even when asked nicely: it names the agent and the exact ask. The admin writes the rules, the agents, the config, the templates, the scripts and the tree page; the owner shapes the modules and the feature cards, and signs; the PM shapes the feature stories (one per feature, all its work in it); any agent raises the needs-decision card its own card needs (draft, then open), and the PM or the owner decides it on its decision card (D-NN, set decided), after which the needs-decision card shows Fulfilled by itself ([[Agent Rules#4 · Statuses, blocking and sign-off]]); the backend and the frontend write their requirements, delivery and integration notes, and move a bug they fix to `in-progress` and `ready`; QA writes the QA notes, files bugs, and closes or reopens a `ready` bug after its re-test. The flow in `docs.config.json` says who waits on whom; a card that is ⛔ Blocked is not worked on, whoever asks.

Related: [[Agent Rules]] · [[Workflow]] · [[Docs Tree]] · [[Owner Agent]] · [[PM Agent]] · [[Backend Agent]] · [[Frontend Agent]] · [[QA Agent]] · [[Admin Agent]]
