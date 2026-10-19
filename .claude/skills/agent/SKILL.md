---
name: agent
description: Shows which of the vault's agents is active in this session (owner, pm, backend, frontend, qa) and what it may write; "/agent off" clears it so the guard stops. The hook in .claude/settings.json handles the switch; this skill only reports.
user-invocable: true
---

Run `node scripts/agent-guard.mjs status` and report its output to the user in one or two lines. If the argument is `off`, the hook has already cleared the active agent: say that no agent is active and that edits are no longer guarded. Do nothing else.

Argument: $ARGUMENTS
