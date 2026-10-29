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

The vault has five agents, one per role, each a note in `rules/` that **is** its prompt and a `/skill` that loads it: [[Owner Agent]] (`/owner`), [[PM Agent]] (`/pm`), [[Backend Agent]] (`/backend`), [[Frontend Agent]] (`/frontend`), [[QA Agent]] (`/qa`); and one that is not a role, [[Admin Agent]] (`/admin`), the guard switched off, for the repairs and migrations no role may do. This note is the part they share: how a request is taken from the first word to the commit. An agent's own note says who it is, what it writes and its playbooks; the rules themselves stay in [[Agent Rules]], [[Workflow]] and [[Docs Tree]] and are linked, never copied ([[Agent Rules#7 · What never happens]]).

**The guard.** The agents are declared in `docs.config.json` under `agents.list`: the note, the layer and a `writes` block naming the note types, kinds and paths the agent may write. A hook in `.claude/settings.json` runs `scripts/agent-guard.mjs`: typing `/owner`, `/pm`, `/backend`, `/frontend`, `/qa` or `/admin` makes that agent active for that Claude Code session only (`/agent` shows which, `/agent off` clears it, a new session starts with none), and while one is active every Edit or Write outside its scope is refused with a message that names the agent who owns the file. Each session keeps its own agent, in `.claude/.active-agent/<session id>` (`agents.marker`, git-ignored), so several sessions may work in the same folder with different agents: starting a session, or typing `/pm` or `/agent off` in one, changes no other session's agent, and `node scripts/agent-guard.mjs status` run outside a session lists them all. **While no agent is active, every write is refused**, from the shell too: a request that would change anything is answered first with the question which agent the user will use, before any reading or analysis, and nothing else happens until the user types it as the next message (`/pm <the request>`); the agent never picks one for them. The admin's entry sets `writes.all` instead of a scope: the guard refuses it nothing, generated files, the shell and the verbatim brief included, and its note says when that is the right agent. Two edits are allowed to everyone on any note: a **flag line** `> ⚠ Affected by [[<the card you changed>]] (YYYY-MM-DD): <what changed>` inserted under the H1, and nothing else; and, for the agents whose entry lists the kind under `signs`, a **sign-off edit** that changes only `status:`, `approvedBy` / `approvedAt`, `decidedBy` / `decidedAt`, `updated:`, `tags:` and the H1. Nobody writes a generated file or `design/Wireframe Brief.md`. Shell commands that write files around the guard are refused too: new notes come from `node scripts/build-tree.mjs --scaffold …`, edits from Edit, commits from git.

## 1 · Load

1. Read `tree/tree.json` first ([[Docs Tree#For agents]]); do not walk the folders.
2. Read your own note and your entry in `docs.config.json` (`agents.list`): that is your scope, in the guard's words.
3. `node scripts/build-tree.mjs --check` must print 0 errors. If it does not, stop and report; nobody builds on a broken tree.

## 2 · Resolve what the user named

The user speaks in product words ("the speed search", "the rings module", "that ticket about counts"); the vault speaks in ids and cards. Before anything else, turn every noun in the request into a card:

- `node scripts/build-tree.mjs --find "<the words>"` lists the cards and concepts that match, best first, with their card code, kind, layer, feature and module. Run it once per noun.
- A module → its id in `docs.config.json` `modules[]` (identity, connections, shared-rings, discovery, events, meetings, commerce, platform). A feature → its `id:` and its `F-NN`. A piece of work → the feature's story and its part (`S-NN S7`); there are no tasks. A defect → its bug, `B-NN`. A screen → `sNN` from [[Screen Index]]. An endpoint or error code → the concept the tree knows, with the feature that owns it.
- Then `node scripts/build-tree.mjs --impact <the card>` for what you are about to change, and read what it lists in that order: the same feature's notes, the directly linked notes, the two-hop notes only when the change crosses a feature boundary ([[Agent Rules#3 · Relations]]).

Never invent a module, a feature id, a screen id, a ticket number, an endpoint or a code. When nothing matches, say so and ask.

## 3 · Align, in one message

Before you create or change anything, send **one** question message (one batch, not a dialogue) that carries:

1. **What you resolved**, for confirmation: "`speed search` → [[F-19 Discover Hub & Search]] (F-19, discovery); `that bug about the count` → B-03". When two cards fit, offer both.
2. **What your playbook still needs**, with the default you propose for each so the user can answer "yes": the fields your note's playbook lists (screens, priority, effort, which side, what it depends on, the build it was tested on, the endpoint that moved…).
3. **The files you will touch**, by path, and the notes you will only flag. If the request needs a file outside your scope, say which agent owns it and what the exact ask to that agent is; do not do it.
4. **What has to happen first**: an approval, a decision card, a hand-off that is not done (the card is ⛔ Blocked in the tree and stays so).

Wait for the answer. When two readings of the request would lead to materially different changes, ask; when the difference is routine, choose, say which you chose, and go on. A request that is only a question ("where do we stand", "what does the backend have for X") is answered from the tree and changes nothing.

## 4 · Act, inside your scope

- New notes: `node scripts/build-tree.mjs --scaffold <kind> <feature-id>`, `--scaffold feature …`, `--scaffold bug …`, `--scaffold needs-decision "<card>" "<title>"`, `--scaffold decision ND-NN "<the answer>"` ([[Docs Tree#For agents]]). Fill the template; do not reshape it. **Every card is born with its code in front of its file name** (`F-27 Payments & Orders`, `S-69 Payments & Orders Story`, `B-07 …`, `ND-21 …`): the scaffold takes the next free number and repoints the links written to the card's plain name while it was not written yet; never type a code into a file name, never rename a card, and link it by that full name ([[Agent Rules#2 · Codes, scopes and the "sum of" rule]]).
- Existing notes: Edit, the exact lines. Keep the frontmatter flat; declare `depends` / `affects` / `related`; every touched note gets today's `updated:`.
- A note you do not own that your change makes wrong: a flag line under its H1, and the note named in the `## Log` of the note you changed. The owning agent clears the flag when it has updated the note.
- A status change is four things together: `status:`, the `<kind>/<status>` tag, the H1 emoji, `updated:` ([[Agent Rules#4 · Statuses, blocking and sign-off]]). A feature's, a module's and the project's status is never typed.
- When the guard refuses an edit, read its message and do what it says: flag, or hand over. Never route around it with a shell command.

## 5 · Finish

1. `--impact` again on what you changed; update what you own, flag what you do not.
2. `node scripts/build-tree.mjs`, then `node scripts/build-tree.mjs --check`: 0 errors, 0 warnings, nothing stale. Fix; never silence.
3. Commit the notes **with** the generated files (`tree/`, [[Card Index]]) on the card's vault branch that `node scripts/build-tree.mjs --branch <agent> <card> [<what-you-do>]` prints, for every agent: `tickets/<agent>/…` for a story, a Frontend Requirements note, a needs-decision card or a bug, `docs/<agent>/…` for a delivery, integration or QA note, a decision card, a module or feature card and the rules. Code goes on `<module>/<F-NN>/<what-you-do>` in the code repositories, never in the vault. The shapes and the commit messages are in [[Workflow#2 · Branch from the feature]].
4. Report, in the vault's words: what you created or changed, by card code and path; what now waits on whom (an approval, a decision, another agent); what you flagged for another layer; what the user still has to answer.

## 6 · Hand-offs between agents

An agent never does another agent's work, even when asked nicely: it names the agent and the exact ask. The owner writes the rules and the config, shapes the modules and the feature cards, and signs; the PM shapes the feature stories (one per feature, all its work in it); any agent raises the needs-decision card its own card needs (draft, then open), and the PM or the owner decides it on its decision card (D-NN, set decided), after which the needs-decision card shows Fulfilled by itself ([[Agent Rules#4 · Statuses, blocking and sign-off]]); the backend and the frontend write their requirements, delivery and integration notes; QA writes the QA notes and files bugs. The flow in `docs.config.json` says who waits on whom; a card that is ⛔ Blocked is not worked on, whoever asks.

Related: [[Agent Rules]] · [[Workflow]] · [[Docs Tree]] · [[Owner Agent]] · [[PM Agent]] · [[Backend Agent]] · [[Frontend Agent]] · [[QA Agent]] · [[Admin Agent]]
