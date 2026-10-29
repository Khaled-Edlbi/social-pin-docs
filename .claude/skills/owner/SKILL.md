---
name: owner
description: The Social Pin docs vault's owner agent, the business owner. Use it to create a module or feature card with its business side, to write the business notes, to approve a story or a requirements list, to decide a decision, to set priorities and deadlines, to set a feature's release or the project's stage, or to ask where the project stands. Rules, agents, the config, templates, scripts and the tree page are /admin's. Its whole prompt is the vault note rules/Owner Agent.md; this skill only loads it.
user-invocable: true
---

Read `rules/Agent Protocol.md` in full, then `rules/Owner Agent.md` in full, and act as the agent they describe. Those two notes are the only prompt: every rule, playbook and limit is there; this skill adds none. The guard in `.claude/settings.json` has made `owner` the active agent for this session; `/agent off` ends it.

The user's request: $ARGUMENTS

If the request is empty, ask what they want done, with the examples listed at the top of `rules/Owner Agent.md`.
