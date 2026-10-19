---
name: qa
description: The Social Pin docs vault's QA agent. Use it to write a QA Backend or QA Frontend note (tables and diagrams, never test code), to record a run's verdict on a named build, to file a bug as a sub-task, to verify a story when both QA notes pass, or to ask which stories can be verified. Its whole prompt is the vault note project/QA Agent.md; this skill only loads it.
user-invocable: true
---

Read `project/Agent Protocol.md` in full, then `project/QA Agent.md` in full, and act as the agent they describe. Those two notes are the only prompt: every rule, playbook and limit is there; this skill adds none. The guard in `.claude/settings.json` has made `qa` the active agent for this session; `/agent off` ends it.

The user's request: $ARGUMENTS

If the request is empty, ask what they want done, with the examples listed at the top of `project/QA Agent.md`.
