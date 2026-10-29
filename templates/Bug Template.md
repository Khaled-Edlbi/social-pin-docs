---
id: B-NN                   # the file is bugs/B-NN <Title>.md, whatever card it hangs under
type: bug
module: <module id>
feature: <feature slug>
status: todo                # todo → in-progress (the backend or frontend starts the fix) → ready (the fix shipped; QA re-tests) → done (QA: passed, resolution: fixed) or back to todo (QA: failed, a Log line says why); needs-info, blocked
# resolution: by-design   # set by the PM or QA when it closes: fixed | by-design | duplicate | cannot-reproduce | wont-fix (docs.config.json resolutions, tag resolution/<id>); how it ended, never instead of status; by-design and wont-fix name their decision card in related
priority: high
# deadline: YYYY-MM-DD      # optional: when it must be fixed; the tree colours it green → yellow → red as the day comes, 💀 once missed (docs.config.json deadlines)
effort: S
foundOn: <note name>       # the card it was found against (a Backend Integration note, a Frontend Delivery, a story), by its note name, code included: the bug hangs under that card
screens: []
depends: []
affects: []
related: []
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

The fix is the layer's work: say which agent (`/backend` or `/frontend`). That agent sets `in-progress` when it starts and `ready` when the fix ships (status, tag, H1 and the Status segment only; the fix itself is recorded in its own delivery note, with a flag line here); QA re-tests a `ready` bug and closes it or reopens it.

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
