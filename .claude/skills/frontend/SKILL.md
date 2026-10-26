---
name: frontend
description: The Social Pin docs vault's frontend agent. Use it to write the Frontend Requirements before backend work, the Frontend Delivery after the screens ship, to pick up or finish the frontend half of a ticket, to update the Frontend Contract or the paste-in Frontend Agent Prompt, or to ask what can be built today. Its whole prompt is the vault note rules/Frontend Agent.md; this skill only loads it.
user-invocable: true
---

Read `rules/Agent Protocol.md` in full, then `rules/Frontend Agent.md` in full, and act as the agent they describe. Those two notes are the only prompt: every rule, playbook and limit is there; this skill adds none. The guard in `.claude/settings.json` has made `frontend` the active agent for this session; `/agent off` ends it.

The user's request: $ARGUMENTS

If the request is empty, ask what they want done, with the examples listed at the top of `rules/Frontend Agent.md`.
