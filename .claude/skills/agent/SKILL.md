---
name: agent
description: Shows which of the vault's agents is active in this session (owner, pm, backend, frontend, qa, admin) and what it may write; "/agent off" clears it so the guard refuses every write again. The hook in .claude/settings.json handles the switch; this skill only reports.
user-invocable: true
---

Run `node scripts/agent-guard.mjs status` and report its output to the user in one or two lines. If the argument is `off`, the hook has already cleared the active agent: say that no agent is active and that every write is refused until the user starts one (/owner, /pm, /backend, /frontend, /qa, or /admin for a repair). Do nothing else.

Argument: $ARGUMENTS
