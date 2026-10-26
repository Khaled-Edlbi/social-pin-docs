---
type: bug
id: B-NN                   # the file is bugs/<Title>.md (title only), whatever card it hangs under
aliases: [B-NN]            # the code again, so Obsidian's quick switcher finds the bug by B-NN
status: todo
priority: high
# deadline: YYYY-MM-DD      # optional: when it must be fixed; the tree colours it green → yellow → red as the day comes, 💀 once missed (docs.config.json deadlines)
effort: S
feature: <feature slug>
module: <module id>
# parent: T-NNN            # found against a task: the bug is its sub-task (same feature) and hangs under it; the task cannot be done while the bug is open
# foundOn: <note name>     # found against any other card (a Backend Integration note, a Frontend Delivery, a story): the bug hangs under that card; parent or foundOn, never both
# labels: []               # optional: chore | spike | docs | frontend | backend (docs.config.json taskLabels); never bug, type: bug already says it
labels: []
screens: []
depends: []
affects: []
related: []
# resolution: by-design   # set by the PM or QA when it closes: fixed | by-design | duplicate | cannot-reproduce | wont-fix (docs.config.json resolutions, tag resolution/<id>); how it ended, never instead of status; by-design and wont-fix name their decision card in related
# pending: ["[[Note]]: what is left", "@who: what is left"]   # done, but a note is left for a card or a person → Partial until cleared
pending: []
created: <date>
tags: [bug, bug/todo, module/<module>, priority/high]
---

# ⬜ B-NN · <Title>

**Feature:** [[<Feature name>]] · **Status:** To do · **Priority:** High (`critical | high | medium | low`, from `docs.config.json`) · **Deadline:** — · **Effort:** S (S < 1 day, M 1–3 days, L > 3 days)

**Found by:** the QA note and row, on build `…`.

## What

**What happens.** What the build does, in product terms, with the call or the screen that shows it.

**What should happen.** The story's criterion or the contract row it breaks, linked.

**Where.** The screen id or the endpoint, and the code it touches.

**On which build.** The build it was seen on.

The fix is the layer's work: say which agent (`/backend` or `/frontend`).

## Design

- [[Screen Index#sNN|sNN]] …

## Impact

Output of `node scripts/build-tree.mjs --impact B-NN` when the bug was filed: the notes the fix touches and that must be updated or flagged when it ships.

- …

## Definition of done

- [ ] The behaviour is fixed, or the notes are corrected, as the decision says (`resolution:` set, the tag `resolution/<id>` with it)
- [ ] The QA row that found it re-run against the fix, on a named build
- [ ] `depends` / `affects` / `related` declared; notes listed by `--impact` updated or flagged
- [ ] `node scripts/build-tree.mjs` run; tree, board and backlog committed

## Log

- <date> · filed from …
