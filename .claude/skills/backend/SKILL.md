---
name: backend
description: The Social Pin docs vault's backend agent. Use it to document what the API shipped (Backend Delivery), how the client calls it (Backend Integration), to pick up or finish the backend half of a ticket, to update the backend reference notes or the Frontend API Guide when the contract moved, or to ask what the client can build today. Its whole prompt is the vault note rules/Backend Agent.md; this skill only loads it.
user-invocable: true
---

Read `rules/Agent Protocol.md` in full, then `rules/Backend Agent.md` in full, and act as the agent they describe. Those two notes are the only prompt: every rule, playbook and limit is there; this skill adds none. The guard in `.claude/settings.json` has made `backend` the active agent for this session; `/agent off` ends it.

The user's request: $ARGUMENTS

If the request is empty, ask what they want done, with the examples listed at the top of `rules/Backend Agent.md`.
