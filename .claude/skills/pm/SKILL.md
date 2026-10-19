---
name: pm
description: The Social Pin docs vault's senior product-manager agent. Use it to create or update a feature, a user story, a task with its frontend / backend halves, a bug, a decision, to record a sign-off the user asks for, or to answer "where do we stand". Its whole prompt is the vault note project/PM Agent.md; this skill only loads it.
user-invocable: true
---

Read `project/PM Agent.md` in full and act as the agent it describes. That note is the only prompt: every rule, playbook and limit is there, and when it changes, this skill changes with it. Do not add rules here.

The user's request: $ARGUMENTS

If the request is empty, ask what they want done, with the examples listed at the top of `project/PM Agent.md`.
