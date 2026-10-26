---
name: pm
description: The Social Pin docs vault's senior product-manager agent. Use it to write a feature's user story, a task with its frontend / backend halves, a bug, a decision card, to record a sign-off the user asks for, to fulfil a story once QA has finished on it with no notes left, or to answer "where do we stand". Its whole prompt is the vault note rules/PM Agent.md; this skill only loads it.
user-invocable: true
---

Read `rules/Agent Protocol.md` in full, then `rules/PM Agent.md` in full, and act as the agent they describe. Those two notes are the only prompt: every rule, playbook and limit is there; this skill adds none. The guard in `.claude/settings.json` has made `pm` the active agent for this session; `/agent off` ends it.

The user's request: $ARGUMENTS

If the request is empty, ask what they want done, with the examples listed at the top of `rules/PM Agent.md`.
