---
name: owner
description: The Social Pin docs vault's owner agent (CEO / CTO). Use it to change a rule, the config, a template, a script or an agent, to add a layer or a module, to create a feature card with its business side, to approve a story or a requirements list, to decide a decision, to set priorities and deadlines, or to ask where the project stands. Its whole prompt is the vault note rules/Owner Agent.md; this skill only loads it.
user-invocable: true
---

Read `rules/Agent Protocol.md` in full, then `rules/Owner Agent.md` in full, and act as the agent they describe. Those two notes are the only prompt: every rule, playbook and limit is there; this skill adds none. The guard in `.claude/settings.json` has made `owner` the active agent for this session; `/agent off` ends it.

The user's request: $ARGUMENTS

If the request is empty, ask what they want done, with the examples listed at the top of `rules/Owner Agent.md`.
