#!/usr/bin/env node
/**
 * Builds the docs tree from the vault's frontmatter and docs.config.json.
 *
 *   node scripts/build-tree.mjs                      writes tree/tree.json, tree/tree.md, tree/cards.json, Card Index.md and site/
 *   node scripts/build-tree.mjs --check              validates; exit 1 on errors, 2 if the generated files are stale
 *   node scripts/build-tree.mjs --serve [port]       builds, then serves site/ on http://127.0.0.1:8787
 *   node scripts/build-tree.mjs --out DIR            writes the site somewhere else
 *   node scripts/build-tree.mjs --impact "<note|code>"   what a change to that note touches (two hops), grouped by layer; a card code (S-01) works too
 *   node scripts/build-tree.mjs --find "<words>"     the cards and concepts that match some words (a module, a feature, a screen, an endpoint): how an agent resolves what the user named
 *   node scripts/build-tree.mjs --scaffold <kind> <feature-id|T-NNN>   creates a layer note from its template
 *   node scripts/build-tree.mjs --scaffold task <feature-id> "<Title>" [--backend-only | --docs-only | --parent T-NNN] [--label <label>] [--priority high] [--effort M]
 *                                                    creates the task with the next free number, its story and its frontend / backend halves
 *   node scripts/build-tree.mjs --scaffold bug <feature-id> "<Title>" (--parent T-NNN | --found-on "<note name>") [--label <label>] [--priority high] [--effort S]
 *                                                    creates the bug (type: bug) with the next free B-NN, under the task or the card it was found against;
 *                                                    as bugs/B-NN <Title>.md
 *   node scripts/build-tree.mjs --scaffold feature <module-id> "<Name>" [--id <slug>] [--priority high] [--release later] [--frontend-only]   creates the feature note
 *   node scripts/build-tree.mjs --scaffold needs-decision "<card>" ["<title>"]   creates the needs-decision card a task, a layer note or a feature needs (draft; blocks it until fulfilled),
 *                                                    as needs-decisions/ND-NN <Title>.md
 *   node scripts/build-tree.mjs --scaffold decision ND-NN "<the answer>" [--by <name>]   creates the decision card D-NN (draft) that answers ND-NN: what was decided, why, what it changes
 *
 * No dependencies: Node 22 built-ins only. The output is key-sorted and carries
 * no timestamps, so it changes only when a note or the config changes.
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };

const OUT_DIR = path.resolve(ROOT, opt('--out', 'site'));
const TREE_DIR = path.join(ROOT, 'tree');
const JSON_PATH = path.join(TREE_DIR, 'tree.json');
const MD_PATH = path.join(TREE_DIR, 'tree.md');
const CONFIG_PATH = path.join(ROOT, 'docs.config.json');
// the product's cards live in `projectDir` (docs.config.json); the docs system (rules/, templates/, scripts/, tree/) stays at the root
const PROJECT_DIR = (() => { try { return String(JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')).projectDir || '').replace(/^\/+|\/+$/g, ''); } catch { return ''; } })();
const prj = (rel) => (PROJECT_DIR ? `${PROJECT_DIR}/${rel}` : rel); // a project-relative path, repo-relative
const PROJ = (...p) => path.join(ROOT, PROJECT_DIR, ...p); // the same, absolute
const inProject = (rel) => (!PROJECT_DIR ? rel : rel.startsWith(`${PROJECT_DIR}/`) ? rel.slice(PROJECT_DIR.length + 1) : null);
const CARDS_PATH = path.join(TREE_DIR, 'cards.json');
const INDEX_PATH = PROJ('Card Index.md');
const GENERATED = ['tree/tree.json', 'tree/tree.md', 'tree/cards.json', prj('Card Index.md')];
const REPO = { owner: 'Khaled-Edlbi', name: 'social-pin-docs', branch: process.env.TREE_BRANCH || 'main' };
REPO.blobBase = `https://github.com/${REPO.owner}/${REPO.name}/blob/${REPO.branch}/`;

const SKIP_DIRS = new Set(['.git', '.obsidian', '.claude', 'node_modules', 'site', 'tree', 'scripts', '.github']);
const BAD_NAME = /[#?%\\]/;

// Structural statuses (not layer-specific). Layer kinds take theirs from docs.config.json.
const STATUS = {
  task: { todo: 'todo', 'needs-info': 'needs-decision', blocked: 'blocked', 'in-progress': 'in-progress', done: 'done' },
  'needs-decision': { draft: 'draft', open: 'needs-decision' }, // the needs-decision card's own statuses; fulfilled (shown ✅) is computed once its decision card (D-NN) is decided; nobody types it
};
const LEGEND = {
  done: 'Done', partial: 'Partial', todo: 'To do', 'in-progress': 'In progress', blocked: 'Blocked',
  'needs-decision': 'Needs decision', draft: 'Draft', ready: 'Ready', approved: 'Approved', verified: 'Fulfilled', delivered: 'Delivered',
  current: 'Current', passing: 'Passing', failing: 'Failing', decided: 'Decided',
  missing: 'Not written yet', reference: 'Reference',
};
const EMOJI = {
  done: '✅', partial: '🟡', todo: '⬜', 'in-progress': '🔵', blocked: '⛔', 'needs-decision': '❓',
  draft: '✏️', ready: '📨', approved: '👍', verified: '✅', delivered: '✅', current: '🔵', passing: '🟢', failing: '🔴', decided: '⚖️',
  missing: '∅', reference: '📘',
};
const DONE_STATUSES = new Set(['done', 'approved', 'verified', 'delivered', 'current', 'passing', 'reference', 'decided']);
// a needs-decision card (ND-NN) reads Draft, Open or Fulfilled in a status column: its kind already says it needs a decision
const legendOf = (n) => (n.kind === 'needs-decision' && n.effectiveStatus === 'needs-decision' ? 'Open' : LEGEND[n.effectiveStatus] ?? n.effectiveStatus);
const emojiOf = (n) => EMOJI[n.effectiveStatus] || '•';
// the structural note types (not layer kinds); a decision record is the answer to a decided decision, on its own card under it
const STRUCTURAL = ['module', 'feature', 'task', 'bug', 'needs-decision', 'decision', 'project'];
// a bug is its own note type (type: bug), built as a task node with the label Bug and `bug` first in its labels: its own card prefix (B) and its own number sequence
const isBug = (n) => n.kind === 'task' && (n.labels || []).includes('bug');
const codeKind = (n) => (isBug(n) ? 'bug' : n.kind);
// the folder a task-like note lives in: bugs/ for a bug (type: bug), tasks/ for a task
const taskRoot = (note) => (note.data?.type === 'bug' ? 'bugs' : 'tasks');
const ID_CODED = new Set(['task', 'needs-decision', 'decision']); // the card code is the note's id

// ---------------------------------------------------------------- config
export function loadConfig(errors = []) {
  const err = (m) => errors.push(`docs.config.json: ${m}`);
  let cfg;
  try { cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch (e) { err(e.message); return null; }
  const kinds = new Map();
  const ids = new Set();
  for (const layer of cfg.layers || []) {
    if (!layer.id || ids.has(layer.id)) err(`layer id "${layer.id}" missing or duplicated`);
    ids.add(layer.id);
    for (const k of layer.kinds || []) {
      if (!k.id || kinds.has(k.id)) err(`kind id "${k.id}" in layer "${layer.id}" missing or duplicated`);
      if (!Array.isArray(k.statuses) || !k.statuses.length) err(`kind "${k.id}": statuses must be a non-empty list`);
      if (!Array.isArray(k.done) || !k.done.length) err(`kind "${k.id}": done must be a non-empty list`);
      else for (const s of k.done) if (!(k.statuses || []).includes(s)) err(`kind "${k.id}": done status "${s}" is not in statuses`);
      if (k.handoff !== undefined) { if (!Array.isArray(k.handoff) || !k.handoff.length) err(`kind "${k.id}": handoff must be a non-empty list`); else for (const s of k.handoff) if (!(k.statuses || []).includes(s)) err(`kind "${k.id}": handoff status "${s}" is not in statuses`); }
      if (!k.template) err(`kind "${k.id}": template is missing`);
      else if (!fs.existsSync(path.join(ROOT, k.template))) err(`kind "${k.id}": template ${k.template} does not exist`);
      if (!k.file) err(`kind "${k.id}": file (the note-name suffix) is missing`);
      kinds.set(k.id, { ...k, layer: layer.id, layerLabel: layer.label, color: layer.color });
      for (const s of k.statuses || []) if (!LEGEND[s]) { LEGEND[s] = s.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()); EMOJI[s] = EMOJI[s] || '•'; }
    }
  }
  for (const pair of cfg.flow || []) {
    if (!Array.isArray(pair) || pair.length !== 2) { err(`flow entry ${JSON.stringify(pair)} must be a [from, to] pair`); continue; }
    for (const k of pair) if (!kinds.has(k)) err(`flow names unknown kind "${k}"`);
  }
  for (const b of cfg.defaultBlocks || []) {
    if (!kinds.has(b.kind)) err(`defaultBlocks: unknown kind "${b.kind}"`);
    if (!kinds.has(b.by)) err(`defaultBlocks: unknown kind "${b.by}" in "by"`);
  }
  for (const k of cfg.requiredAtFeatureLevel || []) if (!kinds.has(k)) err(`requiredAtFeatureLevel names unknown kind "${k}"`);
  if (!Array.isArray(cfg.modules) || !cfg.modules.length) err('modules must be a non-empty list');
  if (!Array.isArray(cfg.projectAreas) || !cfg.projectAreas.length) err('projectAreas must be a non-empty list');
  // agents: one per role, each with the note that is its prompt and the files it may write (scripts/agent-guard.mjs enforces it)
  const agentList = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  const agentIds = new Set();
  const layerIds = new Set([...(cfg.layers || []).map((l) => l.id), 'shared']);
  for (const a of agentList) {
    if (!a || typeof a.id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(a.id)) { err(`agents.list: every agent needs a lowercase id (got ${JSON.stringify(a?.id)})`); continue; }
    if (agentIds.has(a.id)) err(`agents.list: agent "${a.id}" is listed twice`); agentIds.add(a.id);
    if (typeof a.note !== 'string' || !fs.existsSync(path.join(ROOT, a.note))) err(`agents.list: agent "${a.id}" names a note that does not exist (${a.note})`);
    if (a.layer && !layerIds.has(a.layer)) err(`agents.list: agent "${a.id}" names unknown layer "${a.layer}"`);
    const w = a.writes || {};
    for (const k of [...(w.kinds || []), ...(w.editOnly?.kinds || []), ...(a.signs || []).filter((x) => x !== 'needs-decision' && x !== 'decision')]) if (!kinds.has(k)) err(`agents.list: agent "${a.id}" names unknown kind "${k}"`);
    for (const t of [...(w.types || []), ...(w.editOnly?.types || [])]) if (!STRUCTURAL.includes(t)) err(`agents.list: agent "${a.id}" names unknown type "${t}"`);
  }
  if (cfg.agents?.protocol && !fs.existsSync(path.join(ROOT, cfg.agents.protocol))) err(`agents.protocol names a note that does not exist (${cfg.agents.protocol})`);
  const kindOrder = [...kinds.keys()];
  // the hand-off order: walk the flow from its first kind, breadth first; a flow pair that points at an earlier kind is a return (QA back to the story)
  const flow = (cfg.flow || []).filter((p) => Array.isArray(p) && p.length === 2 && kinds.has(p[0]) && kinds.has(p[1]));
  const flowOrder = [];
  const queue = [flow.length ? flow[0][0] : kindOrder[0]].filter(Boolean);
  while (queue.length) { const k = queue.shift(); if (flowOrder.includes(k)) continue; flowOrder.push(k); for (const [a, b] of flow) if (a === k && !flowOrder.includes(b)) queue.push(b); }
  for (const k of kindOrder) if (!flowOrder.includes(k)) flowOrder.push(k);
  const flowBack = flow.filter(([a, b]) => flowOrder.indexOf(a) >= flowOrder.indexOf(b));
  // every forward hand-off is also a block: a card waits for the card before it until that one is handed off (its handoff statuses, else its done set)
  const flowBlocks = flow.filter((p) => !flowBack.includes(p)).map(([by, kind]) => ({ kind, by }));
  const taskLabels = Array.isArray(cfg.taskLabels) ? cfg.taskLabels.filter((l) => typeof l === 'string') : [];
  // card codes: one prefix per kind (config) and per structural kind (cardCodes.structural); every prefix unique, a task's, a decision's and a decision record's code is its id
  const cardCodes = cfg.cardCodes || {};
  const structural = { module: 'M', feature: 'F', project: 'P', task: 'T', 'needs-decision': 'ND', 'decision': 'D', ...(cardCodes.structural || {}) };
  const prefixes = new Map(); // prefix -> kind id
  const PREFIX = /^[A-Z]{1,4}$/;
  const addPrefix = (kind, prefix) => {
    if (typeof prefix !== 'string' || !PREFIX.test(prefix)) { err(`card prefix for "${kind}" must be 1–4 capital letters (got ${JSON.stringify(prefix)})`); return; }
    if (prefixes.has(prefix)) err(`card prefix "${prefix}" is used by both "${prefixes.get(prefix)}" and "${kind}"; every prefix is unique`);
    prefixes.set(prefix, kind);
  };
  // listed in the index's order: module, feature, the kinds in hand-off order, then task, decision, decision record, project
  addPrefix('module', structural.module); addPrefix('feature', structural.feature);
  for (const id of flowOrder) { const k = kinds.get(id); if (k.prefix === undefined) err(`kind "${id}": prefix (its card-code prefix) is missing`); else addPrefix(id, k.prefix); }
  for (const kind of ['task', 'bug', 'needs-decision', 'decision', 'project']) addPrefix(kind, structural[kind]);
  for (const kind of Object.keys(structural)) if (!STRUCTURAL.includes(kind)) err(`cardCodes.structural: unknown kind "${kind}" (${STRUCTURAL.join(', ')})`);
  if (structural.task !== 'T') err('cardCodes.structural.task must be "T": a task\'s card code is its id');
  if (structural.bug !== 'B') err('cardCodes.structural.bug must be "B": a bug\'s card code is its id');
  if (structural['needs-decision'] !== 'ND') err('cardCodes.structural["needs-decision"] must be "ND": a needs-decision card\'s code is its id');
  if (structural['decision'] !== 'D') err('cardCodes.structural.decision must be "D": a decision card\'s code is its id');
  const pad = Number.isInteger(cardCodes.pad) && cardCodes.pad >= 1 ? cardCodes.pad : 2;
  const prefixOf = (kind) => structural[kind] ?? kinds.get(kind)?.prefix ?? null;
  const frontendOnlySkips = Array.isArray(cfg.frontendOnly?.skips) ? cfg.frontendOnly.skips : [];
  for (const k of frontendOnlySkips) if (!kinds.has(k)) err(`frontendOnly.skips names unknown kind "${k}"`);
  // taskFlow: the chain a task draws under itself, the feature's chain at task scope; `tasks` is "all" or the task ids that draw it for now
  const tf = cfg.taskFlow || {};
  const taskFlowKinds = Array.isArray(tf.kinds) ? tf.kinds.filter((k) => typeof k === 'string') : [];
  for (const k of taskFlowKinds) if (!kinds.has(k)) err(`taskFlow.kinds names unknown kind "${k}"`);
  let taskFlowTasks = null; // null = every task; a Set = those ids only
  if (tf.tasks === undefined || tf.tasks === null) taskFlowTasks = new Set();
  else if (tf.tasks === 'all') taskFlowTasks = null;
  else if (Array.isArray(tf.tasks)) {
    taskFlowTasks = new Set();
    for (const t of tf.tasks) { if (typeof t !== 'string' || !isTaskId(t)) err(`taskFlow.tasks: ${JSON.stringify(t)} is not a task id (T-NNN, T-NNN-fe, T-NNN-be)`); else taskFlowTasks.add(t); }
  } else err('taskFlow.tasks must be "all" or a list of task ids');
  const taskFlow = { kinds: taskFlowKinds, tasks: taskFlowTasks };
  // priorities: the enum every card may carry, highest first; `aliases` are old codes (P0 …) the build still reads, with a warning
  const ID = /^[a-z][a-z0-9-]*$/;
  const levels = Array.isArray(cfg.priorities?.levels) && cfg.priorities.levels.length ? cfg.priorities.levels : DEFAULT_PRIORITIES;
  const byPriority = new Map(), aliasOf = new Map();
  for (const l of levels) {
    if (!l || typeof l.id !== 'string' || !ID.test(l.id)) { err(`priorities.levels: id ${JSON.stringify(l?.id)} must be lowercase letters, digits and dashes`); continue; }
    if (byPriority.has(l.id)) err(`priorities.levels: id "${l.id}" is listed twice`);
    byPriority.set(l.id, { id: l.id, label: l.label || l.id.replace(/^./, (c) => c.toUpperCase()), color: l.color || null, description: l.description || '', aliases: Array.isArray(l.aliases) ? l.aliases.filter((a) => typeof a === 'string') : [] });
    for (const a of byPriority.get(l.id).aliases) { if (aliasOf.has(a) || byPriority.has(a)) err(`priorities.levels: alias "${a}" is given twice`); aliasOf.set(a, l.id); }
  }
  const priorities = { levels: [...byPriority.values()], byId: byPriority, aliasOf, rank: (id) => { const i = [...byPriority.keys()].indexOf(id); return i < 0 ? byPriority.size : i; } };
  // deadlines: the window before a deadline, split evenly over the zones (farthest first), then `missed`
  const dl = cfg.deadlines || {};
  const zones = Array.isArray(dl.zones) && dl.zones.length ? dl.zones : DEFAULT_DEADLINES.zones;
  for (const z of zones) if (!z || typeof z.id !== 'string' || !ID.test(z.id)) err(`deadlines.zones: id ${JSON.stringify(z?.id)} must be lowercase letters, digits and dashes`);
  const windowDays = Number.isFinite(dl.windowDays) && dl.windowDays > 0 ? dl.windowDays : DEFAULT_DEADLINES.windowDays;
  if (dl.windowDays !== undefined && !(Number.isFinite(dl.windowDays) && dl.windowDays > 0)) err('deadlines.windowDays must be a positive number of days');
  const deadlines = { windowDays, zones: zones.map((z) => ({ id: z.id, label: z.label || z.id, color: z.color || null })), missed: { ...DEFAULT_DEADLINES.missed, ...(dl.missed || {}) } };
  // staleness: how long a requirements list may sit `ready` before every build reports it (printed only: it depends on today)
  const st = cfg.staleness || {};
  if (st.readyDays !== undefined && !(Number.isFinite(st.readyDays) && st.readyDays > 0)) err('staleness.readyDays must be a positive number of days');
  const staleness = { readyDays: Number.isFinite(st.readyDays) && st.readyDays > 0 ? st.readyDays : 3 };
  // stages (typed on the project), release targets (on features) and environments (deployedTo on deliveries): three small enums, same shape
  const enumOf = (key, items, extra = () => ({})) => {
    const byId = new Map();
    for (const l of Array.isArray(items) ? items : []) {
      if (!l || typeof l.id !== 'string' || !ID.test(l.id)) { err(`${key}: id ${JSON.stringify(l?.id)} must be lowercase letters, digits and dashes`); continue; }
      if (byId.has(l.id)) err(`${key}: id "${l.id}" is listed twice`);
      byId.set(l.id, { id: l.id, label: l.label || l.id, color: l.color || null, description: l.description || '', ...extra(l) });
    }
    return { list: [...byId.values()], byId, rank: (id) => [...byId.keys()].indexOf(id) };
  };
  // resolutions: how a bug ended, on a bug card only; never a substitute for its status
  const resolutions = enumOf('resolutions.levels', cfg.resolutions?.levels ?? DEFAULT_RESOLUTIONS);
  const releases = enumOf('releases.targets', cfg.releases?.targets ?? DEFAULT_RELEASES);
  const stages = enumOf('stages.levels', cfg.stages?.levels ?? DEFAULT_STAGES, (l) => ({ exit: l.exit || '', requiresRelease: l.requiresRelease ?? null }));
  for (const s of stages.list) if (s.requiresRelease !== null && !releases.byId.has(s.requiresRelease)) err(`stages.levels: "${s.id}" requiresRelease "${s.requiresRelease}" is not a release target`);
  const environments = { ...enumOf('environments.list', cfg.environments?.list ?? DEFAULT_ENVIRONMENTS), kinds: Array.isArray(cfg.environments?.kinds) ? cfg.environments.kinds : ['backend-delivery', 'frontend-delivery'] };
  for (const k of environments.kinds) if (!kinds.has(k)) err(`environments.kinds names unknown kind "${k}"`);
  return { ...cfg, kinds, kindOrder, flowOrder, flowBack, flowBlocks, frontendOnlySkips, taskFlow, taskLabels, priorities, deadlines, staleness, stages, releases, environments, resolutions, cardCodes: { pad, structural, prefixes, prefixOf } };
}
const DEFAULT_PRIORITIES = [
  { id: 'critical', label: 'Critical', color: '#dc2626', aliases: ['P0'] }, { id: 'high', label: 'High', color: '#f97316', aliases: ['P1'] },
  { id: 'medium', label: 'Medium', color: '#eab308', aliases: ['P2'] }, { id: 'low', label: 'Low', color: '#64748b', aliases: ['P3'] },
];
const DEFAULT_STAGES = ['concept', 'prototype', 'mvp', 'beta', 'live', 'sunset'].map((id) => ({ id, label: id === 'mvp' ? 'MVP' : id.replace(/^./, (c) => c.toUpperCase()), ...(id === 'beta' || id === 'live' ? { requiresRelease: 'mvp' } : {}) }));
const DEFAULT_RELEASES = [{ id: 'mvp', label: 'MVP' }, { id: 'v1', label: 'v1' }, { id: 'later', label: 'Later' }];
const DEFAULT_RESOLUTIONS = [
  { id: 'fixed', label: 'Fixed', color: '#16a34a' }, { id: 'by-design', label: 'By design', color: '#0ea5e9' },
  { id: 'duplicate', label: 'Duplicate', color: '#64748b' }, { id: 'cannot-reproduce', label: 'Cannot reproduce', color: '#6b7280' },
  { id: 'wont-fix', label: "Won't fix", color: '#f59e0b' },
];
const DEFAULT_ENVIRONMENTS = [{ id: 'dev', label: 'Dev' }, { id: 'staging', label: 'Staging' }, { id: 'prod', label: 'Prod' }];
const DEFAULT_DEADLINES = { windowDays: 3, zones: [{ id: 'on-track', label: 'On track', color: '#16a34a' }, { id: 'due-soon', label: 'Due soon', color: '#eab308' }, { id: 'last-day', label: 'Last day', color: '#dc2626' }], missed: { id: 'missed', label: 'Missed', color: '#6b7280', icon: '💀' } };
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const isDate = (s) => { const m = typeof s === 'string' ? DATE.exec(s) : null; if (!m) return false; const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3]; };
/** Where a deadline stands at `now` (a Date): the zone from the config (the window before the deadline split evenly, the deadline day inclusive), or `missed`
 *  once the deadline day is over. Computed when asked, never stored: the generated files carry the date only. `daysLeft` counts calendar days, 0 on the deadline day. */
export function deadlineZone(deadline, now, deadlines = DEFAULT_DEADLINES) {
  if (!isDate(deadline)) return null;
  const [y, m, d] = deadline.split('-').map(Number);
  const end = new Date(y, m - 1, d + 1); // local midnight after the deadline day
  const left = (end - now) / 86400000;
  const daysLeft = Math.ceil(left) - 1;
  if (left <= 0) return { ...deadlines.missed, daysLeft, missed: true };
  const zones = deadlines.zones, n = zones.length;
  const idx = Math.max(0, n - 1 - Math.floor((left - 1e-9) * n / deadlines.windowDays));
  return { ...zones[Math.min(idx, n - 1)], daysLeft, missed: false };
}

// ---------------------------------------------------------------- frontmatter
function parseScalar(raw) {
  let v = raw.trim();
  if (v === '' || v === '~' || v === 'null') return null;
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1).replace(/\\"/g, '"');
  }
  if (v.startsWith('[')) {
    if (!v.endsWith(']')) throw new Error(`unterminated list: ${raw}`);
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    const items = [];
    let cur = '', q = null;
    for (const ch of inner) {
      if (q) { cur += ch; if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
      if (ch === ',') { items.push(parseScalar(cur)); cur = ''; continue; }
      cur += ch;
    }
    if (cur.trim()) items.push(parseScalar(cur));
    return items;
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

export function parseFrontmatter(text) {
  if (!text.startsWith('---')) return { data: null, body: text, error: null };
  const lines = text.split(/\r?\n/);
  if (lines[0].trim() !== '---') return { data: null, body: text, error: null };
  const data = {};
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') return { data, body: lines.slice(i + 1).join('\n'), error: null };
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = /^([A-Za-z_][\w-]*):(.*)$/.exec(line);
    if (!m) return { data: null, body: text, error: `unsupported YAML at line ${i + 1}: ${line}` };
    let raw = m[2];
    if (!/^\s*["'[]/.test(raw)) raw = raw.replace(/\s+#.*$/, '');
    else if (raw.trim().startsWith('[')) raw = raw.replace(/\]\s+#.*$/, ']');
    try { data[m[1]] = parseScalar(raw); }
    catch (e) { return { data: null, body: text, error: `${e.message} (line ${i + 1})` }; }
  }
  return { data: null, body: text, error: 'frontmatter never closed' };
}

// ---------------------------------------------------------------- vault
function walk(dir, rel = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    const r = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(abs, r));
    else out.push({ abs, rel: r, name: entry.name });
  }
  return out;
}

const WIKI = /(!?)\[\[([^\]\n]+?)\]\]/g;
function parseWikilink(inner) {
  const s = inner.replace(/\\\|/g, '|');
  const pipe = s.indexOf('|');
  const left = pipe >= 0 ? s.slice(0, pipe) : s;
  const hash = left.indexOf('#');
  return { target: (hash >= 0 ? left.slice(0, hash) : left).trim(), heading: hash >= 0 ? left.slice(hash + 1).trim() : null };
}

function firstParagraph(body) {
  const lines = body.split('\n');
  let i = 0;
  while (i < lines.length && !/^#\s/.test(lines[i])) i++;
  i++;
  const para = [];
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) { if (para.length) break; continue; }
    if (/^(\*\*|#|\||-|>|```|_|<|!\[)/.test(l)) { if (para.length) break; continue; }
    para.push(l);
  }
  let s = para.join(' ')
    .replace(/!?\[\[([^\]]+?)\]\]/g, (_, inner) => { const p = parseWikilink(inner); const alias = inner.replace(/\\\|/g, '|').split('|')[1]; return alias || p.target; })
    .replace(/[*_`]/g, '');
  if (s.length > 200) s = s.slice(0, 197).replace(/\s+\S*$/, '') + '…';
  return s || null;
}

function section(body, heading) {
  const re = new RegExp(`^##\\s+${heading}\\s*$`, 'm');
  const m = re.exec(body);
  if (!m) return '';
  const rest = body.slice(m.index + m[0].length);
  const end = rest.search(/^##?\s/m);
  return end >= 0 ? rest.slice(0, end) : rest;
}
const sectionLinks = (body, heading) => [...section(body, heading).matchAll(WIKI)].filter((x) => !x[1]).map((x) => parseWikilink(x[2]).target);

// concepts a note mentions: endpoints, error codes, screens
const ENDPOINT = /`(GET|POST|PUT|PATCH|DELETE)\s+(\/[^`\s]*)`/g;
const ERRCODE = /\bE_[A-Z0-9]+_\d+\b/g;
function concepts(body, data) {
  const out = new Set();
  for (const m of body.matchAll(ENDPOINT)) out.push ? null : out.add(`${m[1]} ${m[2].replace(/\/+$/, '')}`);
  for (const m of body.matchAll(ERRCODE)) out.add(m[0]);
  for (const s of Array.isArray(data?.screens) ? data.screens : []) if (typeof s === 'string') out.add(s);
  return [...out];
}
const conceptKind = (c) => (/^E_/.test(c) ? 'error' : /^s\d+$/.test(c) ? 'screen' : /^(GET|POST|PUT|PATCH|DELETE) /.test(c) ? 'endpoint' : 'other');

function loadNote(file) {
  const text = fs.readFileSync(file.abs, 'utf8');
  const { data, body, error } = parseFrontmatter(text);
  const stem = file.name.replace(/\.md$/, '');
  const links = [...body.matchAll(WIKI)].filter((x) => !x[1]).map((x) => parseWikilink(x[2]));
  return { ...file, prel: inProject(file.rel), stem, data, body, error, links, summary: firstParagraph(body), relatedSection: sectionLinks(body, 'Related'), concepts: data ? concepts(body, data) : [] };
}

function readCanvas(fileByPath, rel) {
  const p = path.join(ROOT, rel);
  const pairs = [];
  const warnings = [];
  if (!fs.existsSync(p)) return { pairs, warnings };
  let canvas;
  try { canvas = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { warnings.push(`${rel}: ${e.message}`); return { pairs, warnings }; }
  const byNode = new Map();
  for (const n of canvas.nodes || []) {
    if (n.type !== 'file') continue;
    const note = fileByPath.get(n.file);
    if (!note) { warnings.push(`${rel}: node ${n.id} points at missing file ${n.file}`); continue; }
    byNode.set(n.id, note);
  }
  for (const e of canvas.edges || []) {
    const a = byNode.get(e.fromNode), b = byNode.get(e.toNode);
    if (a && b) pairs.push([a, b]);
  }
  return { pairs, warnings };
}

const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()) : []);
const isTaskId = (s) => /^[TB]-\d+[a-z]?(-[a-z]{2})?$/.test(s); // T-017, T-020b, the halves T-017-fe / T-017-be, and a bug B-01
const isDecisionId = (s) => /^ND-\d+$/.test(s); // a needs-decision card: the question
const isRecordId = (s) => /^D-\d+$/.test(s); // a decision card: the answer, numbered like its question
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ---------------------------------------------------------------- build
export function build() {
  const errors = [];
  const warnings = [];
  const err = (f, m) => errors.push(`${f}: ${m}`);
  const warn = (f, m) => warnings.push(`${f}: ${m}`);
  const cfg = loadConfig(errors);
  if (!cfg) return { json: null, errors, warnings, notes: [] };
  const KIND = cfg.kinds;
  const MODULE_BY_ID = new Map(cfg.modules.map((m) => [m.id, m]));
  const MODULE_BY_NAME = new Map(cfg.modules.map((m) => [m.name, m]));

  const files = walk(ROOT).filter((f) => f.name.endsWith('.md'));
  const notes = files.map(loadNote);
  const fileByPath = new Map(notes.map((n) => [n.rel, n]));
  const byStem = new Map();
  for (const n of notes) {
    if (BAD_NAME.test(n.name)) err(n.rel, 'file name contains one of # ? % \\, which breaks URLs');
    if (n.error) err(n.rel, n.error);
    if (byStem.has(n.stem)) warn(n.rel, `duplicate note name "${n.stem}" (also ${byStem.get(n.stem).rel}); wikilinks are ambiguous`);
    else byStem.set(n.stem, n);
  }
  const byAlias = new Map(); // an alias (aliases: [B-01]) -> its note, so [[B-01]] resolves as it does in Obsidian
  for (const n of notes) for (const a of list(n.data?.aliases)) {
    if (byStem.has(a) && byStem.get(a) !== n) warn(n.rel, `aliases: "${a}" is also the name of ${byStem.get(a).rel}`);
    else if (byAlias.has(a) && byAlias.get(a) !== n) warn(n.rel, `aliases: "${a}" is also an alias of ${byAlias.get(a).rel}`);
    else byAlias.set(a, n);
  }
  const noteNamed = (name) => byStem.get(name) ?? byAlias.get(name);

  const nodes = {};
  const edges = [];
  const edgeByKey = new Map();
  const addNode = (n) => { if (nodes[n.id]) { err(n.path || n.id, `duplicate node id ${n.id}`); return nodes[n.id]; } nodes[n.id] = n; return n; };
  const DIRECTED = new Set(['tree', 'depends', 'decision', 'affects', 'flow', 'blocks', 'pending']);
  const addEdge = (from, to, kind, via) => {
    if (!from || !to || from === to) return;
    const k = DIRECTED.has(kind) ? `${kind}|${from}|${to}` : `${kind}|${[from, to].sort().join('|')}`;
    let e = edgeByKey.get(k);
    if (!e) { e = { from, to, kind }; edgeByKey.set(k, e); edges.push(e); }
    if (via) { e.via = e.via || []; if (!e.via.includes(via)) e.via.push(via); }
  };
  const link = (parent, child) => { parent.children.push(child.id); child.parents.push(parent.id); addEdge(parent.id, child.id, 'tree'); };
  const base = (n, extra) => ({
    id: null, kind: null, layer: null, title: n ? n.stem : null, path: n ? n.rel : null, status: null, effectiveStatus: null, blockedBy: [],
    priority: n?.data?.priority ?? null, effort: n?.data?.effort ?? null, module: n?.data?.module ?? null, feature: null, task: null, code: null, scope: null,
    screens: list(n?.data?.screens), created: n?.data?.created ?? null, updated: n?.data?.updated ?? n?.data?.created ?? null, tags: list(n?.data?.tags),
    deadline: n?.data?.deadline ?? null, release: null, inherits: {},
    depends: [], affects: [], related: [], children: [], parents: [], summary: n?.summary ?? null, label: null, parentTask: null, foundOn: null, pending: [], frontendOnly: false, labels: [], card: null, ...extra,
  });
  const byType = (t) => notes.filter((n) => n.data && n.data.type === t && !n.rel.startsWith('templates/'));
  const requireKeys = (n, keys) => { for (const k of keys) if (n.data[k] === undefined || n.data[k] === null || n.data[k] === '') err(n.rel, `missing frontmatter key "${k}"`); };
  const normStatus = (n, type) => {
    const map = STATUS[type];
    const raw = n.data.status;
    if (raw === undefined || raw === null) { err(n.rel, 'missing frontmatter key "status"'); return null; }
    if (!map[raw]) { err(n.rel, `unknown status "${raw}" for type ${type} (allowed: ${Object.keys(map).join(', ')})`); return null; }
    return map[raw];
  };
  const noteOf = new Map(); // node id -> note

  // root
  const overview = byStem.get('Project Overview') || null;
  const root = addNode(base(null, { id: 'root', kind: 'root', title: cfg.project || 'Project', path: null, file: overview?.rel ?? null, effectiveStatus: 'reference', label: 'Project', summary: overview?.summary ?? null, stage: null, releases: [], created: overview?.data?.created ?? null, updated: overview?.data?.updated ?? null }));
  // the stage is typed by the owner on the overview note, never computed
  const rawStage = overview?.data?.stage;
  if (rawStage === undefined || rawStage === null || rawStage === '') { if (overview) warn(overview.rel, `stage: missing; type one of ${cfg.stages.list.map((s) => s.id).join(', ')} (docs.config.json stages)`); }
  else if (typeof rawStage === 'string' && cfg.stages.byId.has(rawStage)) root.stage = rawStage;
  else err(overview.rel, `stage: ${JSON.stringify(rawStage)} is not one of ${cfg.stages.list.map((s) => s.id).join(', ')} (docs.config.json stages)`);

  // modules
  const moduleNodes = new Map();
  const moduleNotes = new Map(byType('module').map((n) => [n.data.id, n]));
  for (const m of cfg.modules) {
    const note = moduleNotes.get(m.id);
    if (!note) warn(prj(`modules/${m.name}`), `no module note yet (create ${prj(`modules/${m.name}/${m.name} Module.md`)} from templates/Module Template.md)`);
    else if (note.rel !== prj(`modules/${m.name}/${m.name} Module.md`)) warn(note.rel, `module note expected at ${prj(`modules/${m.name}/${m.name} Module.md`)}`);
    const d = addNode(base(note, { id: `module:${m.id}`, kind: 'module', title: note?.stem ?? `${m.name} Module`, name: m.name, module: m.id, summary: note?.summary ?? m.description, label: 'Module', path: note?.rel ?? null, template: note ? null : 'templates/Module Template.md' }));
    if (note) noteOf.set(d.id, note);
    moduleNodes.set(m.id, d);
    link(root, d);
  }
  for (const n of byType('module')) if (!MODULE_BY_ID.has(n.data.id)) err(n.rel, `module id "${n.data.id}" is not in docs.config.json modules`);

  // features
  const featureNodes = new Map();
  for (const n of byType('feature')) {
    requireKeys(n, ['id', 'module']);
    if (n.data.status !== undefined) err(n.rel, 'a feature\'s status is computed from its cards: remove "status:" (and the status/* tag); use "frontendOnly: true" for a feature with no backend part');
    else if (list(n.data.tags).some((t) => t.startsWith('status/'))) err(n.rel, 'a feature\'s status is computed from its cards: remove the status/* tag');
    const parts = (n.prel ?? '').split('/');
    const folderModule = MODULE_BY_NAME.get(parts[1]);
    if (parts[0] !== 'modules' || !folderModule) err(n.rel, `feature notes live in ${prj('modules/<Module>/features/<Feature>/<Feature>.md')}`);
    else if (parts[2] !== 'features' || parts[3] !== n.stem || parts[4] !== n.name || parts.length !== 5) warn(n.rel, `expected at ${prj(`modules/${parts[1]}/features/${n.stem}/${n.name}`)}: a module keeps its features in features/, beside its module note`);
    const mod = n.data.module;
    if (!MODULE_BY_ID.has(mod)) err(n.rel, `module "${mod}" is not in docs.config.json modules`);
    else if (folderModule && folderModule.id !== mod) err(n.rel, `module "${mod}" does not match folder "${parts[1]}" (${folderModule.id})`);
    const f = addNode(base(n, { id: `feature:${n.data.id}`, kind: 'feature', layer: 'business', feature: n.data.id, code: n.data.id, status: null, effectiveStatus: 'todo', module: mod, label: 'Feature', name: n.data.name ?? n.stem, dir: path.posix.dirname(n.rel), frontendOnly: n.data.frontendOnly === true }));
    noteOf.set(f.id, n);
    if (featureNodes.has(n.data.id)) err(n.rel, `second feature note with id "${n.data.id}"`);
    featureNodes.set(n.data.id, f);
    const d = moduleNodes.get(mod);
    if (d) link(d, f);
    if (!n.data.updated) warn(n.rel, 'missing "updated:"');
  }

  // tasks and decisions (nodes first; edges after the layer notes exist)
  const taskNodes = new Map();
  // a bug note (type: bug) is built with the tasks: the same statuses, parents and boards
  const byNoteId = (a, b) => String(a.data.id ?? a.stem).localeCompare(String(b.data.id ?? b.stem), 'en', { numeric: true });
  // every card coded by its id starts its file name with that code, in every folder: tasks/T-NNN …, bugs/B-NN …, needs-decisions/ND-NN …, decisions/D-NN …
  const codeNamed = (n, what) => {
    const id = String(n.data.id ?? '');
    if (id && !n.stem.startsWith(`${id} `) && n.stem !== id) warn(n.rel, `${what}'s file name starts with its code: rename to ${n.rel.split('/').slice(0, -1).join('/')}/${id} ${n.stem}.md and update the links`);
  };
  const taskNotes = [...byType('task'), ...byType('bug')].sort(byNoteId);
  for (const n of taskNotes) {
    requireKeys(n, ['id', 'status', 'feature']);
    const status = normStatus(n, 'task');
    const parent = typeof n.data.parent === 'string' && n.data.parent.trim() ? n.data.parent.trim() : null;
    const bug = n.data.type === 'bug';
    if (bug) codeNamed(n, 'a bug');
    const own = [...new Set(list(n.data.labels).map((l) => l.trim().toLowerCase()))];
    for (const l of own) {
      if (l === 'bug') err(n.rel, bug ? 'labels: "bug" — type: bug already says it; remove the label' : 'labels: [bug] — a bug is its own type now: write type: bug (tags bug, bug/<status>) and remove the label');
      else if (!cfg.taskLabels.includes(l)) err(n.rel, `labels: "${l}" is not in docs.config.json taskLabels (${cfg.taskLabels.join(', ')})`);
    }
    // the node still lists `bug` among its labels, so the page filters and tags bugs as before
    const labels = bug ? ['bug', ...own.filter((l) => l !== 'bug')] : own.filter((l) => l !== 'bug');
    const foundOn = typeof n.data.foundOn === 'string' && n.data.foundOn.trim() ? n.data.foundOn.trim() : null;
    if (foundOn && !bug) err(n.rel, 'foundOn: only a bug (type: bug) names the card it was found against');
    const t = addNode(base(n, { id: `task:${n.data.id}`, kind: 'task', layer: 'business', feature: n.data.feature, code: n.data.id, status, effectiveStatus: status, label: bug ? 'Bug' : 'Task', decision: n.data.decision ?? null, dir: null, parentTask: parent, foundOn, labels }));
    noteOf.set(t.id, n);
    if (taskNodes.has(n.data.id)) err(n.rel, `second task note with id "${n.data.id}"`);
    taskNodes.set(n.data.id, t);
    // a bug lives in bugs/, whatever it hangs under; a task in tasks/
    const root = taskRoot(n);
    const expectedFlat = prj(`${root}/${n.stem}.md`), expectedDir = prj(`${root}/${n.stem}/${n.stem}.md`);
    const parentNote = parent && !bug ? taskNotes.find((x) => x.data.id === parent) : null;
    const expectedUnderParent = parentNote ? prj(`tasks/${parentNote.stem}/${n.stem}.md`) : null; // a sub-task may live in its parent's folder
    if (n.rel !== expectedFlat && n.rel !== expectedDir && n.rel !== expectedUnderParent) warn(n.rel, `expected at ${expectedFlat} or ${expectedDir}${expectedUnderParent ? ` or ${expectedUnderParent}` : ''}`);
    if (n.rel === expectedDir) t.dir = prj(`${root}/${n.stem}`);
  }
  const decisionNodes = new Map();
  for (const n of byType('needs-decision').sort(byNoteId)) {
    requireKeys(n, ['id', 'status']);
    codeNamed(n, 'a needs-decision card');
    if (n.rel !== prj(`needs-decisions/${n.name}`)) warn(n.rel, `expected at ${prj(`needs-decisions/${n.name}`)}: a needs-decision card lives in its own folder, its answer (D-NN) in decisions/`);
    if (!list(n.data.blocks).length) requireKeys(n, ['features']); // a decision names the cards that need it (`blocks`) or the features it belongs to
    if (!isDecisionId(n.data.id)) err(n.rel, `id "${n.data.id}" is not a decision id (ND-NN)`);
    if (['fulfilled', 'decided'].includes(n.data.status)) err(n.rel, `status "${n.data.status}" is not typed on a needs-decision card: it is draft or open, and shows Fulfilled by itself once its decision card (D-NN) is decided`);
    for (const k of ['decidedBy', 'decidedAt']) if (n.data[k]) err(n.rel, `${k} lives on the decision card (D-NN), not on the needs-decision card`);
    const status = ['fulfilled', 'decided'].includes(n.data.status) ? 'needs-decision' : normStatus(n, 'needs-decision');
    const d = addNode(base(n, { id: `needs-decision:${n.data.id}`, kind: 'needs-decision', layer: 'business', code: n.data.id, status, effectiveStatus: status, label: 'Needs decision', features: list(n.data.features), blocks: [], decider: typeof n.data.decider === 'string' && n.data.decider.trim() ? n.data.decider.trim() : null }));
    noteOf.set(d.id, n);
    if (decisionNodes.has(n.data.id)) err(n.rel, `second decision note with id "${n.data.id}"`);
    decisionNodes.set(n.data.id, d);
  }
  // decision records: the answer to a decision, on its own card (D-NN answers ND-NN); it hangs under its decision once the decisions are placed
  const recordNodes = new Map();
  for (const n of byType('decision')) {
    requireKeys(n, ['id', 'decision', 'status']);
    const rstatus = n.data.status === 'decided' ? 'decided' : n.data.status === 'draft' ? 'draft' : null;
    if (n.data.status !== undefined && !rstatus) err(n.rel, `unknown status "${n.data.status}" for a decision card (allowed: draft, decided)`);
    if (rstatus === 'decided') requireKeys(n, ['decidedBy', 'decidedAt']); // only the PM or the owner set it decided, on the user's word
    const id = String(n.data.id ?? ''), dec = typeof n.data.decision === 'string' ? n.data.decision.trim() : '';
    if (!isRecordId(id)) err(n.rel, `id "${id}" is not a decision record id (D-NN)`);
    else if (isDecisionId(dec) && id !== `D-${dec.slice(3)}`) err(n.rel, `id "${id}" must be D-${dec.slice(3)}: a record carries the number of the decision it takes`);
    if (n.data.decidedAt && !isDate(n.data.decidedAt)) err(n.rel, `decidedAt: ${JSON.stringify(n.data.decidedAt)} must be a date YYYY-MM-DD`);
    const r = addNode(base(n, { id: `decision:${id}`, kind: 'decision', layer: 'business', code: id, status: rstatus, effectiveStatus: rstatus || 'draft', label: 'Decision', decides: dec || null, features: [], decidedBy: n.data.decidedBy ?? null, decidedAt: n.data.decidedAt ?? null }));
    noteOf.set(r.id, n);
    if (recordNodes.has(id)) err(n.rel, `second decision record with id "${id}"`);
    recordNodes.set(id, r);
    if (n.rel !== prj(`decisions/${n.name}`)) warn(n.rel, `expected at ${prj(`decisions/${n.name}`)}`);
  }

  // layer notes (feature-level and task-level), joined by frontmatter
  const layerNodes = []; // existing + placeholders
  const siblings = new Map(); // container id -> Map(kind -> node)
  const sib = (container) => { if (!siblings.has(container.id)) siblings.set(container.id, new Map()); return siblings.get(container.id); };
  for (const n of notes) {
    if (!n.data || n.rel.startsWith('templates/') || !KIND.has(n.data.type)) continue;
    const kind = KIND.get(n.data.type);
    requireKeys(n, ['code', 'scope', 'feature', 'status']);
    const scope = n.data.scope;
    let container = null;
    if (scope === 'feature') {
      container = featureNodes.get(n.data.feature) || null;
      if (!container) { err(n.rel, `feature "${n.data.feature}" is not a feature id`); continue; }
      if (n.data.code !== n.data.feature) err(n.rel, `code "${n.data.code}" must equal the feature id "${n.data.feature}" on a feature-level note`);
      const expected = `${container.dir}/${container.title} ${kind.file}.md`;
      if (n.rel !== expected) warn(n.rel, `expected at ${expected}`);
    } else if (scope === 'task') {
      requireKeys(n, ['task']);
      if (n.data.code !== n.data.task) err(n.rel, `code "${n.data.code}" must equal the task id "${n.data.task}" on a task-level note`);
      container = taskNodes.get(n.data.task) || null;
      if (!container) { err(n.rel, `task "${n.data.task}" is not a task id`); continue; }
      if (container.feature !== n.data.feature) err(n.rel, `feature "${n.data.feature}" does not match the task's feature "${container.feature}"`);
      const tnote = noteOf.get(container.id);
      const expected = prj(`${taskRoot(tnote)}/${tnote.stem}/${container.code} ${kind.file}.md`);
      if (n.rel !== expected) warn(n.rel, `expected at ${expected}`);
    } else { err(n.rel, `scope must be "feature" or "task" (got "${scope}")`); continue; }
    const f = featureNodes.get(n.data.feature);
    if (n.data.module && f && n.data.module !== f.module) err(n.rel, `module "${n.data.module}" does not match the feature's module "${f.module}"`);
    const raw = n.data.status;
    let status = raw;
    if (!kind.statuses.includes(raw)) { err(n.rel, `unknown status "${raw}" for ${kind.id} (allowed: ${kind.statuses.join(', ')})`); status = null; }
    if (!n.data.updated) warn(n.rel, 'missing "updated:"');
    const s = sib(container);
    if (s.has(kind.id)) { err(n.rel, `second ${kind.id} note for ${container.code} (also ${s.get(kind.id).path})`); continue; }
    const c = addNode(base(n, { id: `${kind.id}:${n.data.code}`, kind: kind.id, layer: kind.layer, feature: n.data.feature, task: scope === 'task' ? n.data.task : null, code: n.data.code, scope, status, effectiveStatus: status, module: f?.module ?? n.data.module ?? null, label: kind.label }));
    noteOf.set(c.id, n);
    s.set(kind.id, c);
    layerNodes.push(c);
    link(container, c);
  }
  // placeholders at feature level
  for (const [fid, f] of featureNodes) {
    const s = sib(f);
    for (const kid of cfg.requiredAtFeatureLevel || []) {
      if (s.has(kid)) continue;
      if (f.frontendOnly && cfg.frontendOnlySkips.includes(kid)) continue;
      const kind = KIND.get(kid);
      const c = addNode(base(null, {
        id: `${kid}:${fid}`, kind: kid, layer: kind.layer, feature: fid, code: fid, scope: 'feature', title: `${f.title} ${kind.file}`, path: null, template: kind.template,
        status: null, effectiveStatus: 'missing', module: f.module, label: kind.label,
        summary: `Not written yet. Create it with: node scripts/build-tree.mjs --scaffold ${kid} ${fid}`,
      }));
      s.set(kid, c);
      layerNodes.push(c);
      link(f, c);
    }
  }
  // placeholders at task level: the same chain, under the task, for the tasks taskFlow names (all of them when `tasks` is "all")
  for (const [tid, t] of taskNodes) {
    if (cfg.taskFlow.tasks && !cfg.taskFlow.tasks.has(tid)) continue;
    const f = featureNodes.get(t.feature);
    const s = sib(t);
    for (const kid of cfg.taskFlow.kinds) {
      if (s.has(kid)) continue;
      if (f?.frontendOnly && cfg.frontendOnlySkips.includes(kid)) continue;
      const kind = KIND.get(kid);
      const c = addNode(base(null, {
        id: `${kid}:${tid}`, kind: kid, layer: kind.layer, feature: t.feature, task: tid, code: tid, scope: 'task', title: `${tid} ${kind.file}`, path: null, template: kind.template,
        status: null, effectiveStatus: 'missing', module: t.module ?? f?.module ?? null, label: kind.label,
        summary: `Not written yet. Create it with: node scripts/build-tree.mjs --scaffold ${kid} ${tid}`,
      }));
      s.set(kid, c);
      layerNodes.push(c);
      link(t, c);
    }
  }

  // tasks under features (a sub-task under its parent task); decisions under features
  // note name -> node, for `foundOn`: the cards a bug can hang under all exist by now (byName below is built too late for this loop)
  const nodeByStem = new Map();
  for (const n of Object.values(nodes)) if (n.path) nodeByStem.set(path.basename(n.path).replace(/\.md$/, '').toLowerCase(), n);
  for (const [, t] of taskNodes) {
    const f = featureNodes.get(t.feature);
    if (!f) { err(t.path, `feature "${t.feature}" is not a feature id`); continue; }
    let container = siblings.get(f.id)?.get('story') ?? f; // a task hangs under its feature's story (the placeholder while the story is not written yet); a sub-task under its parent
    // a bug hangs under the card it was found against, named by note name in `foundOn` (codes are handed out after the tree is built, so they cannot be resolved here)
    if (t.foundOn) {
      const fn = nodeByStem.get(t.foundOn.toLowerCase()) ?? null;
      if (!fn) err(t.path, `foundOn: "${t.foundOn}" is not a note name in this vault`);
      else if (fn.id === t.id) err(t.path, 'foundOn: a bug cannot be found against itself');
      else if (fn.kind === 'task') err(t.path, `foundOn: "${t.foundOn}" is a task; a bug found against a task is its sub-task (parent: ${fn.code}), not foundOn`);
      else if (fn.feature && fn.feature !== t.feature) err(t.path, `foundOn: "${t.foundOn}" belongs to feature "${fn.feature}", not "${t.feature}"; a bug stays in the feature of the card it was found against`);
      else container = fn;
    }
    if (t.parentTask) {
      const p = taskNodes.get(t.parentTask);
      if (!p) { err(t.path, `parent: "${t.parentTask}" is not a task id`); t.parentTask = null; }
      else if (p.id === t.id) { err(t.path, 'parent: a task cannot be its own parent'); t.parentTask = null; }
      else if (p.feature !== t.feature) { err(t.path, `parent: ${t.parentTask} belongs to feature "${p.feature}", not "${t.feature}"; a sub-task stays in its parent's feature`); t.parentTask = null; }
      else {
        let a = p, depth = 0, cyclic = false;
        while (a && a.parentTask) { if (a.parentTask === t.code || ++depth > 50) { cyclic = true; break; } a = taskNodes.get(a.parentTask); }
        if (cyclic) { err(t.path, `parent: ${t.parentTask} makes a cycle of sub-tasks`); t.parentTask = null; }
        else container = p;
      }
    }
    link(container, t);
    t.module = t.module ?? f.module;
    if (noteOf.get(t.id).data.module && noteOf.get(t.id).data.module !== f.module) err(t.path, `module "${t.module}" does not match the feature's module "${f.module}"`);
  }

  // project notes under area groups
  const areaNodes = new Map();
  for (const a of cfg.projectAreas) {
    const g = addNode(base(null, { id: `group:${a.id}`, kind: 'group', layer: a.id, title: a.label, effectiveStatus: 'reference', label: 'Docs', summary: a.description, path: null, file: null, folder: a.folder }));
    areaNodes.set(a.id, g);
    link(root, g);
  }
  const areaByFolder = new Map(cfg.projectAreas.map((a) => [a.folder, a]));
  for (const n of notes) {
    if (!n.data || n.rel.startsWith('templates/')) continue;
    const folder = path.posix.dirname(n.rel);
    const area = areaByFolder.get(folder);
    if (!area) continue;
    if (STRUCTURAL.includes(n.data.type) && n.data.type !== 'project' || KIND.has(n.data.type)) continue;
    if (n.data.layer && n.data.layer !== area.id) err(n.rel, `layer "${n.data.layer}" does not match the folder "${folder}" (${area.id})`);
    const p = addNode(base(n, { id: `project:${slugify(n.stem)}`, kind: 'project', layer: area.id, effectiveStatus: 'reference', label: n.data.type === 'map' ? 'Map' : n.data.type === 'report' ? 'Report' : 'Reference' }));
    noteOf.set(p.id, n);
    link(areaNodes.get(area.id), p);
    if (n.stem === 'Home' || n.stem === 'README') continue;
  }
  for (const n of notes) {
    if (!n.data || n.rel.startsWith('templates/')) continue;
    const t = n.data.type;
    if (t && ![...STRUCTURAL, 'map', 'report', 'home', 'reference'].includes(t) && !KIND.has(t)) err(n.rel, `type "${t}" is not a structural type or a kind in docs.config.json`);
  }

  // ---------------------------------------------------------- priority and deadline: validated on every card, inherited down the tree
  // a layer note without its own takes its task's or feature's; a sub-task its parent's; a task its feature's. `inherits` names the source.
  for (const [id, note] of noteOf) {
    const n = nodes[id];
    const raw = note.data.priority;
    if (raw === undefined || raw === null || raw === '') n.priority = null;
    else if (typeof raw !== 'string') { err(note.rel, `priority: ${JSON.stringify(raw)} is not one of ${cfg.priorities.levels.map((l) => l.id).join(', ')}`); n.priority = null; }
    else if (cfg.priorities.byId.has(raw)) n.priority = raw;
    else if (cfg.priorities.aliasOf.has(raw)) { n.priority = cfg.priorities.aliasOf.get(raw); warn(note.rel, `priority: "${raw}" is an old code; write "${n.priority}" (and the tag priority/${n.priority})`); }
    else { err(note.rel, `priority: "${raw}" is not one of ${cfg.priorities.levels.map((l) => l.id).join(', ')} (docs.config.json priorities)`); n.priority = null; }
    const dl = note.data.deadline;
    if (dl === undefined || dl === null || dl === '') n.deadline = null;
    else if (!isDate(dl)) { err(note.rel, `deadline: ${JSON.stringify(dl)} must be a date YYYY-MM-DD`); n.deadline = null; }
    else n.deadline = dl;
    // release: a feature's own scope, inherited below it; deployedTo: the environments a delivery runs on
    const rel = note.data.release;
    if (rel === undefined || rel === null || rel === '') n.release = null;
    else if (n.kind !== 'feature') { err(note.rel, `release: belongs on the feature card only; this ${n.kind} inherits its feature's`); n.release = null; }
    else if (typeof rel === 'string' && cfg.releases.byId.has(rel)) n.release = rel;
    else { err(note.rel, `release: ${JSON.stringify(rel)} is not one of ${cfg.releases.list.map((r) => r.id).join(', ')} (docs.config.json releases)`); n.release = null; }
    const dep = note.data.deployedTo;
    if (dep !== undefined && dep !== null) {
      if (!cfg.environments.kinds.includes(n.kind)) err(note.rel, `deployedTo: only on ${cfg.environments.kinds.join(', ')} notes`);
      else {
        n.deployedTo = [];
        for (const e of list(dep)) { if (cfg.environments.byId.has(e)) { if (!n.deployedTo.includes(e)) n.deployedTo.push(e); } else err(note.rel, `deployedTo: "${e}" is not one of ${cfg.environments.list.map((x) => x.id).join(', ')} (docs.config.json environments)`); }
      }
    }
    // resolution: how a bug ended. A bug card only, and never instead of its status: a done bug with a pending list is still Partial.
    const res = note.data.resolution;
    const resIds = () => cfg.resolutions.list.map((r) => r.id).join(', ');
    if (res === undefined || res === null || res === '') n.resolution = null;
    else if (!isBug(n)) { err(note.rel, `resolution: belongs on a bug card only (type: bug); this ${n.kind} carries none`); n.resolution = null; }
    else if (typeof res === 'string' && cfg.resolutions.byId.has(res)) n.resolution = res;
    else { err(note.rel, `resolution: ${JSON.stringify(res)} is not one of ${resIds()} (docs.config.json resolutions)`); n.resolution = null; }
    if (isBug(n) && n.status === 'done' && !n.resolution) warn(note.rel, `a bug closed with status: done says how it ended in resolution: ${resIds()} (docs.config.json resolutions)`);
  }
  const inherit = (n, from) => { if (!from) return; for (const k of ['priority', 'deadline', 'release']) if (n[k] === null && from[k] !== null) { n[k] = from[k]; n.inherits[k] = from.inherits[k] || from.id; } };
  for (const t of [...taskNodes.values()].sort((a, b) => { const depth = (x) => { let d = 0, a = x; while (a && a.parentTask && d < 60) { a = taskNodes.get(a.parentTask); d++; } return d; }; return depth(a) - depth(b); })) inherit(t, t.parentTask ? taskNodes.get(t.parentTask) : featureNodes.get(t.feature));
  for (const n of layerNodes) if (n.path) inherit(n, n.task ? taskNodes.get(n.task) : featureNodes.get(n.feature));

  // ---------------------------------------------------------- lookups
  const ownerOfPath = new Map();
  for (const n of Object.values(nodes)) if (n.path) ownerOfPath.set(n.path, n.id);
  const byName = {};
  for (const [stem, note] of byStem) { const id = ownerOfPath.get(note.rel); if (id) byName[stem] = id; }
  const conceptIndex = new Map(); // concept -> Set(node id)
  for (const [id, note] of noteOf) for (const c of note.concepts) { if (!conceptIndex.has(c)) conceptIndex.set(c, new Set()); conceptIndex.get(c).add(id); }
  // endpoint owners: the backend-delivery note whose "Endpoints" bullets list it
  const endpointOwner = new Map();
  const isDoneStatus = (n) => (KIND.has(n.kind) && KIND.get(n.kind).done.includes(n.status) ? 1 : 0);
  // first writer wins; done deliveries are read first so a feature that merely mentions another's endpoint does not claim it
  const deliveries = layerNodes.filter((n) => n.kind === 'backend-delivery' && n.path && n.scope === 'feature').sort((a, b) => (isDoneStatus(b) - isDoneStatus(a)) || a.title.localeCompare(b.title));
  for (const n of deliveries) {
    const body = noteOf.get(n.id).body;
    const sec = section(body, 'Endpoints, tables and code') || section(body, 'Backend state');
    for (const m of sec.matchAll(ENDPOINT)) { const c = `${m[1]} ${m[2].replace(/\/+$/, '')}`; if (!endpointOwner.has(c)) endpointOwner.set(c, n.feature); }
  }
  const resolve = (ref, ctx) => {
    // -> { ids: [...], via } ; ctx = the node declaring the relation (for sibling kind ids)
    if (typeof ref !== 'string') return null;
    const r = ref.trim();
    if (KIND.has(r) && ctx) {
      const container = ctx.scope ? nodes[ctx.parents.find((p) => nodes[p].kind === 'feature' || nodes[p].kind === 'task')] : (ctx.kind === 'feature' || ctx.kind === 'task' ? ctx : null);
      const s = container ? siblings.get(container.id) : null;
      const n = s?.get(r);
      return n ? { ids: [n.id], via: null } : null;
    }
    if (isTaskId(r) && taskNodes.has(r)) return { ids: [taskNodes.get(r).id], via: null };
    if (isDecisionId(r) && decisionNodes.has(r)) return { ids: [decisionNodes.get(r).id], via: null };
    if (isRecordId(r) && recordNodes.has(r)) return { ids: [recordNodes.get(r).id], via: null };
    if (featureNodes.has(r)) return { ids: [featureNodes.get(r).id], via: null };
    if (moduleNodes.has(r)) return { ids: [moduleNodes.get(r).id], via: null };
    if (byName[r]) return { ids: [byName[r]], via: null };
    const target = noteNamed(r.replace(/\.md$/, ''));
    if (target && ownerOfPath.get(target.rel)) return { ids: [ownerOfPath.get(target.rel)], via: null };
    if (conceptIndex.has(r)) return { ids: [...conceptIndex.get(r)], via: r };
    return null;
  };
  // a story is done only when fulfilled (`verified`, set by the PM): `approved` hands it off to the next card but does not finish it
  // a Backend Integration note is done only when the build delivers it (QA Backend passing, Frontend Delivery done): `current` hands it off, in use, not done
  const isDone = (n) => n.effectiveStatus !== 'missing' && (n.kind === 'story' ? n.status === 'verified' : n.kind === 'backend-integration' ? n.effectiveStatus === 'delivered' : (DONE_STATUSES.has(n.effectiveStatus) || (KIND.has(n.kind) && KIND.get(n.kind).done.includes(n.status))));

  // ---------------------------------------------------------- explicit relations
  for (const [id, note] of noteOf) {
    const n = nodes[id];
    for (const [key, kind] of [['depends', 'depends'], ['affects', 'affects'], ['related', 'related']]) {
      const refs = list(note.data[key]);
      if (key === 'depends' && n.decision) refs.push(n.decision);
      for (const ref of refs) {
        const r = resolve(ref, n);
        if (!r) { err(note.rel, `${key}: "${ref}" is not a note name, task, decision, feature, module, sibling kind or known concept`); continue; }
        for (const to of r.ids) {
          if (to === id) continue;
          if (key === 'depends' && !n.depends.includes(to)) n.depends.push(to);
          if (key === 'affects' && !n.affects.includes(to)) n.affects.push(to);
          if (key === 'related' && !n.related.includes(to)) { n.related.push(to); if (!nodes[to].related.includes(id)) nodes[to].related.push(id); }
          addEdge(id, to, kind, r.via);
          if (key === 'depends' && n.kind === 'task' && nodes[to].kind === 'needs-decision') { const f = featureNodes.get(n.feature); if (f && !nodes[to].parents.includes(f.id)) link(f, nodes[to]); }
        }
      }
    }
    // "## Related" section links count as related
    for (const target of note.relatedSection) {
      const t = noteNamed(target);
      const to = t ? ownerOfPath.get(t.rel) : null;
      if (!to || to === id) continue;
      if (!n.related.includes(to)) n.related.push(to);
      if (!nodes[to].related.includes(id)) nodes[to].related.push(id);
      addEdge(id, to, 'related');
    }
  }

  // ---------------------------------------------------------- decisions: a decision hangs under every card that needs it (`blocks`), else under its features;
  // each card in `blocks` is Blocked while the decision is open and returns to its own status once it is decided
  const decisionBlockers = new Map(); // target id -> [decision ids]
  for (const [, d] of decisionNodes) {
    const note = noteOf.get(d.id);
    const covered = new Set(); // features reached through a blocked card: the decision is not repeated under them
    for (const ref of list(note.data.blocks)) {
      const r = resolve(ref, d);
      if (!r || r.via) { err(note.rel, `blocks: "${ref}" is not a task, a layer note or a feature`); continue; }
      for (const to of r.ids) {
        const t = nodes[to];
        if (to === d.id || !(t.kind === 'task' || t.kind === 'feature' || (KIND.has(t.kind) && t.path))) { err(note.rel, `blocks: "${ref}" is ${t.kind === 'needs-decision' ? 'a decision' : `a ${t.label?.toLowerCase() ?? t.kind}`}; a decision blocks a task, a layer note or a feature`); continue; }
        if (d.blocks.includes(to)) continue;
        d.blocks.push(to);
        addEdge(d.id, to, 'decision');
        if (!d.parents.includes(to)) link(t, d);
        if (!decisionBlockers.has(to)) decisionBlockers.set(to, []);
        decisionBlockers.get(to).push(d.id);
        const fid = t.kind === 'feature' ? t.feature : t.feature;
        if (fid) { covered.add(fid); if (!d.features.includes(fid)) d.features.push(fid); }
      }
    }
    for (const fid of d.features) {
      const f = featureNodes.get(fid);
      if (!f) { err(d.path, `features: "${fid}" is not a feature id`); continue; }
      addEdge(d.id, f.id, 'decision');
      if (!covered.has(fid) && !d.parents.includes(f.id)) link(f, d);
    }
    d.features.sort();
  }
  // a needs-decision card is answered by one decision card (D-NN); once that card is decided, the question shows Fulfilled and releases the cards it blocks (Agent Rules §4)
  const recordOf = new Map(); // decision id -> record node
  for (const [, r] of recordNodes) {
    const d = r.decides && isDecisionId(r.decides) ? decisionNodes.get(r.decides) : null;
    if (!d) { err(r.path, `decision: "${r.decides ?? ''}" is not a decision id (ND-NN)`); continue; }
    if (recordOf.has(d.id)) { err(r.path, `${d.code} already has a record (${recordOf.get(d.id).path}); one decision, one record`); continue; }
    recordOf.set(d.id, r);
    link(d, r);
    r.features = [...d.features];
    if (r.status !== 'decided') continue;
    if (d.status === 'draft') err(r.path, `${d.code} is still a draft: open the needs-decision card before its answer is decided`);
    d.effectiveStatus = 'verified'; d.fulfilledBy = r.id; // Fulfilled: computed, never typed
  }

  // ---------------------------------------------------------- pending: done, but a note is left for a card or a person → Partial until cleared
  const PENDING_NOTE = /^\[\[([^\]]+?)\]\]\s*:?\s*(.*)$/, PENDING_PERSON = /^@([\w.-]+)\s*:?\s*(.*)$/;
  for (const [id, note] of noteOf) {
    const n = nodes[id];
    if (!(n.kind === 'task' || KIND.has(n.kind))) continue;
    for (const raw of list(note.data.pending)) {
      let m, item = { text: raw.trim(), to: null, person: null };
      if ((m = PENDING_NOTE.exec(raw.trim()))) {
        const r = resolve(parseWikilink(m[1]).target, n);
        if (!r) { err(note.rel, `pending: "[[${m[1]}]]" is not a note name, task, decision, feature or sibling kind`); continue; }
        item = { text: m[2].trim(), to: r.ids[0], person: null };
        addEdge(id, r.ids[0], 'pending');
      } else if ((m = PENDING_PERSON.exec(raw.trim()))) item = { text: m[2].trim(), to: null, person: m[1] };
      n.pending.push(item);
    }
    if (n.pending.length && isDone(n)) n.effectiveStatus = 'partial';
  }
  // a card is handed off (and stops blocking the next one) at its handoff statuses, else when done
  const handedOff = (n) => isDone(n) || (KIND.has(n.kind) && (KIND.get(n.kind).handoff || []).includes(n.status));

  // a requirements list is delivered on its own: once it is approved and the backend cards of its scope (Backend Delivery and Backend Integration,
  // task T-NNN-fe ↔ T-NNN-be, feature ↔ feature) are done with nothing pending, it counts as `delivered`; nobody types it (a frontendOnly feature has no backend cards: it stays by hand)
  const backendDone = (n) => !!n && !!n.path && KIND.has(n.kind) && KIND.get(n.kind).done.includes(n.status) && !n.pending.length;
  for (const fr of Object.values(nodes)) {
    if (fr.kind !== 'frontend-requirements' || !fr.path || fr.status !== 'approved' || fr.frontendOnly || fr.pending.length) continue;
    const code = fr.scope === 'task' ? String(fr.code).replace(/-fe$/, '-be') : fr.code;
    const of = (kind) => Object.values(nodes).find((x) => x.kind === kind && x.path && x.scope === fr.scope && x.code === code);
    if (backendDone(of('backend-delivery')) && backendDone(of('backend-integration'))) { fr.effectiveStatus = 'delivered'; fr.autoDelivered = true; }
  }

  // a Backend Integration note is delivered on its own: `current` (in use, handed off) with nothing pending, and in its scope
  // (task T-NNN-be ↔ T-NNN-be QA Backend and T-NNN-fe Frontend Delivery; feature ↔ feature) the QA Backend is passing and the Frontend Delivery done, both with nothing pending.
  // Nobody types `delivered`: the file stays `current`, and a note set back to `draft` loses it on the next build
  for (const bi of Object.values(nodes)) {
    if (bi.kind !== 'backend-integration' || !bi.path || bi.status !== 'current' || bi.pending.length) continue;
    const fe = bi.scope === 'task' ? String(bi.code).replace(/-be$/, '-fe') : bi.code;
    const of = (kind, code) => Object.values(nodes).find((x) => x.kind === kind && x.path && x.scope === bi.scope && x.code === code);
    if (backendDone(of('qa-backend', bi.code)) && backendDone(of('frontend-delivery', fe))) { bi.effectiveStatus = 'delivered'; bi.autoDelivered = true; }
  }

  // stale statuses (rules/Agent Rules.md §4, Status transitions): a Backend Delivery left behind by the work it describes.
  // Both checks read only the notes, so they are ordinary warnings; the time-based one (a list `ready` too long) is staleNotices, printed only
  const MERGED_LOG = /merged (?:in)?to `?main`?|\bmain @ `?[0-9a-f]{7}/i;
  for (const bd of Object.values(nodes)) {
    if (bd.kind !== 'backend-delivery' || !bd.path) continue;
    const bi = Object.values(nodes).find((x) => x.kind === 'backend-integration' && x.path && x.scope === bd.scope && x.code === bd.code);
    if (bd.status === 'in-progress') {
      const log = noteOf.get(bd.id).body.split(/^## Log[ \t]*$/m)[1] || '';
      if (bi && bi.status === 'current') warn(bd.path, 'status: in-progress, but its Backend Integration is `current` (it matches `main`), so the work is merged: set `done`');
      else if (MERGED_LOG.test(log)) warn(bd.path, 'status: in-progress, but its ## Log records a merge to `main`: set `done`');
    }
    if (bd.status === 'done' && !(bi && bi.status === 'current')) warn(bd.path, `status: done, but its Backend Integration is ${bi ? `\`${bi.status}\`` : 'not written'}: the requirements of this scope cannot reach \`delivered\` until it is \`current\``);
  }

  // a story is fulfilled (`verified`) by the PM only once QA has finished on its scope: every QA note it needs is passing with nothing pending
  const QA_KINDS = { backend: 'qa-backend', frontend: 'qa-frontend' };
  for (const s of Object.values(nodes)) {
    if (s.kind !== 'story' || s.status !== 'verified' || !s.path) continue;
    let need = [];
    if (s.scope === 'task') {
      for (const h of Object.values(nodes)) if (h.kind === 'task' && h.id.startsWith(`task:${s.code}-`)) for (const [label, kind] of Object.entries(QA_KINDS)) if ((h.labels || []).includes(label)) need.push({ kind, find: (q) => q.kind === kind && q.task === h.code, where: h.code });
    } else {
      const skips = s.frontendOnly ? (cfg.frontendOnly?.skips || []) : [];
      for (const kind of Object.values(QA_KINDS)) if (!skips.includes(kind)) need.push({ kind, find: (q) => q.kind === kind && q.scope === 'feature' && q.feature === s.feature, where: s.feature });
    }
    for (const r of need) {
      const q = Object.values(nodes).find((x) => x.path && r.find(x));
      const label = KIND.get(r.kind)?.label || r.kind;
      if (!q) err(s.path, `status is verified (fulfilled) but ${label} for ${r.where} is not written yet: the PM fulfils a story only when QA has finished`);
      else if (!KIND.get(r.kind).done.includes(q.status)) err(s.path, `status is verified (fulfilled) but ${q.title} is ${q.status}: the PM fulfils a story only when every QA note of its scope is passing`);
      else if (q.pending.length) err(s.path, `status is verified (fulfilled) but ${q.title} still has ${q.pending.length} pending note${q.pending.length === 1 ? '' : 's'}: the PM fulfils a story only when QA has finished with no notes left`);
    }
  }

  // ---------------------------------------------------------- blocking
  const blockReason = (target) => (target.kind === 'needs-decision' && !isDone(target) ? `needs decision ${target.code} (${target.status === 'draft' ? 'draft' : 'open'})` : `${target.title} is ${String(LEGEND[target.effectiveStatus] ?? target.effectiveStatus).toLowerCase()}`);
  for (const n of layerNodes) {
    const note = noteOf.get(n.id);
    const explicit = note && Array.isArray(note.data.blockedBy) ? list(note.data.blockedBy) : null;
    const refs = explicit ?? [...cfg.flowBlocks, ...(cfg.defaultBlocks || [])].filter((b) => b.kind === n.kind).map((b) => b.by);
    const blockers = [];
    for (const ref of refs) {
      const r = resolve(ref, n);
      if (!r) { if (explicit) err(note.rel, `blockedBy: "${ref}" does not resolve`); continue; }
      for (const to of r.ids) if (to !== n.id && !handedOff(nodes[to])) blockers.push(to);
    }
    for (const to of n.depends) if (!handedOff(nodes[to])) blockers.push(to);
    for (const to of decisionBlockers.get(n.id) || []) if (!handedOff(nodes[to])) blockers.push(to);
    n.blockedBy = isDone(n) ? [] : [...new Set(blockers)].map((to) => ({ id: to, title: nodes[to].title, why: blockReason(nodes[to]) }));
    for (const b of n.blockedBy) addEdge(b.id, n.id, 'blocks');
    if (n.blockedBy.length && n.path && n.effectiveStatus !== 'partial') n.effectiveStatus = 'blocked';
  }
  for (const [, t] of taskNodes) {
    const note = noteOf.get(t.id);
    const blockers = [];
    for (const ref of list(note.data.blockedBy)) { const r = resolve(ref, t); if (!r) { err(note.rel, `blockedBy: "${ref}" does not resolve`); continue; } for (const to of r.ids) if (to !== t.id && !handedOff(nodes[to])) blockers.push(to); }
    for (const to of t.depends) if (!handedOff(nodes[to])) blockers.push(to);
    const openDecisions = (decisionBlockers.get(t.id) || []).filter((to) => !handedOff(nodes[to]));
    blockers.push(...openDecisions);
    t.blockedBy = isDone(t) ? [] : [...new Set(blockers)].map((to) => ({ id: to, title: nodes[to].title, why: blockReason(nodes[to]) }));
    for (const b of t.blockedBy) addEdge(b.id, t.id, 'blocks');
    if (t.blockedBy.length && (t.status === 'todo' || (openDecisions.length && t.effectiveStatus !== 'partial'))) t.effectiveStatus = 'blocked';
  }

  // ---------------------------------------------------------- flow edges, "sum of" links, children order
  for (const [cid, s] of siblings) {
    for (const [a, b] of cfg.flow || []) { const x = s.get(a), y = s.get(b); if (x && y && x.path && y.path) addEdge(x.id, y.id, 'flow'); }
    void cid;
  }
  for (const n of layerNodes) {
    if (n.scope !== 'task' || !n.path) continue;
    const f = featureNodes.get(n.feature);
    const fl = f ? siblings.get(f.id)?.get(n.kind) : null;
    if (!fl) continue;
    addEdge(fl.id, n.id, 'related', 'sum-of');
    if (fl.path && isDone(n)) {
      const body = noteOf.get(fl.id).body;
      if (!body.includes(`[[${n.title}`)) warn(fl.path, `does not link [[${n.title}]], a done task-level note: a feature note is the sum of its tasks`);
    }
  }
  const kindRank = new Map(cfg.flowOrder.map((k, i) => [k, i]));
  const rank = (n) => (kindRank.has(n.kind) ? kindRank.get(n.kind) : n.kind === 'task' ? 100 : n.kind === 'needs-decision' ? 200 : n.kind === 'decision' ? 250 : 300);
  for (const n of [...featureNodes.values(), ...taskNodes.values(), ...layerNodes.filter((l) => l.children.length)]) {
    n.children.sort((a, b) => (rank(nodes[a]) - rank(nodes[b])) || nodes[a].title.localeCompare(nodes[b].title, 'en', { numeric: true }));
  }

  // ---------------------------------------------------------- wikilinks, canvas, shares
  const treePairs = new Set(edges.filter((e) => e.kind === 'tree').map((e) => [e.from, e.to].sort().join('|')));
  const placeholderTitles = new Set(Object.values(nodes).filter((n) => n.effectiveStatus === 'missing').map((n) => n.title));
  for (const [code] of taskNodes) for (const k of KIND.values()) placeholderTitles.add(`${code} ${k.file}`); // a task's future layer notes
  for (const [, f] of featureNodes) for (const k of KIND.values()) placeholderTitles.add(`${f.title} ${k.file}`);
  for (const [id, note] of noteOf) {
    for (const l of note.links) {
      const target = noteNamed(l.target);
      if (!l.target) continue; // [[#heading]] links to itself
      if (!target) { if (!placeholderTitles.has(l.target) && !/^(https?:)|\.(canvas|png|jpg|svg)$|^(T-NNN|ND-NN|<)/.test(l.target)) warn(note.rel, `wikilink [[${l.target}]] resolves to no note`); continue; }
      const to = ownerOfPath.get(target.rel);
      if (!to || to === id) continue;
      if (treePairs.has([id, to].sort().join('|'))) continue;
      addEdge(id, to, 'wikilink');
    }
  }
  const canvas = readCanvas(fileByPath, prj('business/Feature Map.canvas'));
  warnings.push(...canvas.warnings);
  for (const [a, b] of canvas.pairs) {
    const from = ownerOfPath.get(a.rel), to = ownerOfPath.get(b.rel);
    if (from && to && !treePairs.has([from, to].sort().join('|'))) addEdge(from, to, 'related');
  }
  // a related pair wins over a wikilink pair
  const relatedPairs = new Set(edges.filter((e) => e.kind === 'related').map((e) => [e.from, e.to].sort().join('|')));
  for (let i = edges.length - 1; i >= 0; i--) {
    const e = edges[i];
    if (e.kind === 'wikilink' && relatedPairs.has([e.from, e.to].sort().join('|'))) { edges.splice(i, 1); edgeByKey.delete(`wikilink|${[e.from, e.to].sort().join('|')}`); }
  }
  // shares: features (and tasks, project notes) that mention the same endpoint or error code
  const containerOf = (id) => { const n = nodes[id]; if (n.kind === 'feature' || n.kind === 'task' || n.kind === 'project' || n.kind === 'needs-decision' || n.kind === 'decision') return id; if (n.feature && featureNodes.has(n.feature)) return n.task ? `task:${n.task}` : `feature:${n.feature}`; return null; };
  const conceptsOut = {};
  for (const [c, ids] of conceptIndex) {
    const containers = [...new Set([...ids].map(containerOf).filter(Boolean))].sort();
    conceptsOut[c] = { kind: conceptKind(c), owner: endpointOwner.has(c) ? `feature:${endpointOwner.get(c)}` : null, notes: [...ids].sort(), containers };
    if (conceptKind(c) === 'screen') continue;
    for (let i = 0; i < containers.length; i++) for (let j = i + 1; j < containers.length; j++) {
      const a = containers[i], b = containers[j];
      if (nodes[a].kind === 'task' && nodes[b].kind === 'task') continue;
      if (treePairs.has([a, b].sort().join('|'))) continue;
      addEdge(a, b, 'shares', c);
    }
  }
  // missing explicit cross-feature links
  const explicitPair = new Set();
  for (const e of edges) if (['related', 'affects', 'depends', 'wikilink', 'decision'].includes(e.kind)) explicitPair.add([containerOf(e.from), containerOf(e.to)].sort().join('|'));
  const warnedPairs = new Set();
  for (const [id, note] of noteOf) {
    const from = containerOf(id);
    if (!from || !nodes[from].feature) continue;
    for (const c of note.concepts) {
      const owner = endpointOwner.get(c);
      if (!owner || owner === nodes[from].feature) continue;
      const to = `feature:${owner}`;
      const key = [from, to].sort().join('|');
      if (explicitPair.has(key) || warnedPairs.has(key)) continue;
      warnedPairs.add(key);
      warn(note.rel, `uses \`${c}\`, owned by ${nodes[to].title}, but nothing in ${nodes[from].title} declares related/affects/depends to it`);
    }
  }

  // ---------------------------------------------------------- rollups
  const rollup = (id) => {
    const seen = new Set();
    const counts = {};
    const visit = (cid) => { if (seen.has(cid)) return; seen.add(cid); const c = nodes[cid]; counts[c.effectiveStatus] = (counts[c.effectiveStatus] || 0) + 1; for (const g of c.children) visit(g); };
    for (const c of nodes[id].children) visit(c);
    nodes[id].rollup = counts;
  };
  // a container (task with cards, feature, module, project) is Done only when every card is; Partial when every card is done or partial;
  // In progress when any card is active or the cards are a mix; To do otherwise (Blocked when every card waits on something,
  // or, for a feature, when an open decision was raised on the feature itself: Blocked · ND-NN, whatever its cards short of done)
  // a handed-off card that is not done yet (an approved story or requirements list, a current integration note) is work in flight: active
  const classify = (c) => (c.effectiveStatus === 'partial' ? 'partial' : isDone(c) ? 'done' : c.effectiveStatus === 'in-progress' || handedOff(c) ? 'active' : c.effectiveStatus === 'blocked' ? 'blocked' : 'todo');
  const summarize = (ids) => {
    if (!ids.length) return 'todo';
    const k = ids.map((id) => classify(nodes[id]));
    if (k.every((x) => x === 'done')) return 'done';
    if (k.every((x) => x === 'done' || x === 'partial')) return 'partial';
    if (k.some((x) => x === 'active' || x === 'done' || x === 'partial')) return 'in-progress';
    if (k.every((x) => x === 'blocked')) return 'blocked';
    return 'todo';
  };
  const taskDepth = (t) => { let d = 0, a = t; while (a && a.parentTask && d < 60) { a = taskNodes.get(a.parentTask); d++; } return d; };
  for (const t of [...taskNodes.values()].sort((a, b) => taskDepth(b) - taskDepth(a))) {
    if (!t.children.length) continue;
    const s = summarize(t.children);
    if (t.effectiveStatus === 'done' && s !== 'done') { warn(t.path, `status is done but its cards are not (${s}): a task is done when every card under it is`); t.effectiveStatus = s === 'partial' ? 'partial' : 'in-progress'; }
  }
  // a feature's cards: its layer notes and decisions, plus the tasks that hang under its story
  // a feature's cards: its own children, plus the tasks hanging under any of them — under the story as a rule, under the card a bug was found against (`foundOn`)
  const featureCards = (f) => [...f.children, ...f.children.flatMap((c) => nodes[c].children.filter((g) => nodes[g].kind === 'task'))];
  for (const [, f] of featureNodes) {
    f.effectiveStatus = summarize(featureCards(f));
    // a decision raised on the feature (`blocks: [<feature id>]`) blocks the feature while it is open (Agent Rules §4), like a task or a layer note
    const open = (decisionBlockers.get(f.id) || []).filter((to) => !handedOff(nodes[to]));
    if (open.length && f.effectiveStatus !== 'done' && f.effectiveStatus !== 'partial') {
      f.blockedBy = open.map((to) => ({ id: to, title: nodes[to].title, why: blockReason(nodes[to]) }));
      for (const b of f.blockedBy) addEdge(b.id, f.id, 'blocks');
      f.effectiveStatus = 'blocked';
    }
  }
  for (const [, d] of moduleNodes) d.effectiveStatus = summarize(d.children);
  root.effectiveStatus = summarize([...moduleNodes.values()].map((d) => d.id));
  // release progress on the project card: per target, the features Done (and Partial) out of the total; then the stage's own check
  const featureList = [...featureNodes.values()];
  root.releases = [...cfg.releases.list.map((r) => r.id), null].map((id) => {
    const fs_ = featureList.filter((f) => f.release === id);
    return { id, total: fs_.length, done: fs_.filter((f) => f.effectiveStatus === 'done').length, partial: fs_.filter((f) => f.effectiveStatus === 'partial').length };
  }).filter((r) => r.id !== null || r.total > 0);
  const needs = root.stage ? cfg.stages.byId.get(root.stage).requiresRelease : null;
  if (needs) {
    const open = featureList.filter((f) => f.release === needs && f.effectiveStatus !== 'done');
    if (open.length) warn(overview.rel, `stage: "${root.stage}" needs every ${needs} feature Done; ${open.length} ${open.length === 1 ? 'is' : 'are'} not: ${open.map((f) => f.title).join(', ')}`);
  }
  for (const [, t] of taskNodes) rollup(t.id);
  for (const [, f] of featureNodes) rollup(f.id);
  for (const [, d] of moduleNodes) rollup(d.id);
  rollup(root.id);

  // ---------------------------------------------------------- card codes: one unique code per card, kept in tree/cards.json, never reused
  const registry = loadCards(errors);
  const cards = assignCards({ nodes, rootId: root.id, cfg, registry, err: (m) => errors.push(`tree/cards.json: ${m}`) });
  // every card says when it was made: created: YYYY-MM-DD, set once by the scaffold or the template and never changed
  for (const n of Object.values(nodes)) {
    if (!n.card || !n.path) continue;
    if (!n.created) warn(n.path, 'missing "created:" (YYYY-MM-DD, the day the card was made)');
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(n.created))) err(n.path, `created: ${JSON.stringify(n.created)} is not a YYYY-MM-DD date`);
  }

  const byKind = {}, byLayer = {};
  for (const n of Object.values(nodes)) { if (!n.path) continue; byKind[n.kind] = (byKind[n.kind] || 0) + 1; if (n.layer) byLayer[n.layer] = (byLayer[n.layer] || 0) + 1; }
  const counts = {
    modules: moduleNodes.size, features: featureNodes.size, tasks: taskNodes.size, decisions: decisionNodes.size, records: recordNodes.size,
    layerNotes: layerNodes.filter((n) => n.path).length, taskLayerNotes: layerNodes.filter((n) => n.path && n.scope === 'task').length,
    placeholders: Object.values(nodes).filter((n) => n.effectiveStatus === 'missing').length,
    partial: Object.values(nodes).filter((n) => n.effectiveStatus === 'partial').length,
    blocked: Object.values(nodes).filter((n) => n.effectiveStatus === 'blocked').length,
    notes: notes.length, edges: edges.length, concepts: Object.keys(conceptsOut).length, byKind, byLayer,
  };
  for (const e of edges) if (e.via) e.via.sort();
  edges.sort((a, b) => a.kind.localeCompare(b.kind) || a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
  warnings.sort();
  errors.sort();
  const filesIndex = {};
  for (const n of notes) filesIndex[n.rel] = { name: n.stem, type: n.data?.type ?? null };
  const layersOut = cfg.layers.map((l) => ({ id: l.id, label: l.label, color: l.color, description: l.description, kinds: l.kinds.map((k) => ({ id: k.id, label: k.label, file: k.file, statuses: k.statuses, done: k.done, template: k.template, description: k.description })) }));

  return {
    json: {
      schema: 2, repo: REPO, rootId: 'root', counts, legend: LEGEND, emoji: EMOJI, layers: layersOut, flow: cfg.flow, flowOrder: cfg.flowOrder, flowBack: cfg.flowBack, taskLabels: cfg.taskLabels, defaultBlocks: [...cfg.flowBlocks, ...(cfg.defaultBlocks || [])], frontendOnly: { skips: cfg.frontendOnlySkips },
      modules: cfg.modules, priorities: cfg.priorities.levels, deadlines: cfg.deadlines, stages: cfg.stages.list, releases: cfg.releases.list, resolutions: cfg.resolutions.list, environments: { kinds: cfg.environments.kinds, list: cfg.environments.list }, agents: (cfg.agents?.list || []).map((a) => ({ id: a.id, label: a.label, note: a.note, layer: a.layer ?? null })), generated: GENERATED, nodes, edges, concepts: conceptsOut, byName, files: filesIndex, cards: cards.byCode, cardPrefixes: cards.prefixes, diagnostics: { errors, warnings },
    },
    errors, warnings, notes, cfg, cards: cards.registry,
  };
}

// ---------------------------------------------------------------- card codes
// A card is a node with a file: a module, a feature, a layer note, a task, a decision, a project note. Its code is `<prefix>-<number>`:
// a task's and a decision's is its id (T-004, ND-04); every other card gets the next free number for its kind's prefix the first time
// the build sees it, in tree order, and keeps it for good in tree/cards.json. A code is handed out once: when a card disappears its
// code moves to `retired` and is never reused. The registry is generated, but it is memory: never renumber it by hand.
function loadCards(errors) {
  const empty = { schema: 1, cards: {}, retired: {} };
  if (!fs.existsSync(CARDS_PATH)) return empty;
  try {
    const r = JSON.parse(fs.readFileSync(CARDS_PATH, 'utf8'));
    return { schema: 1, cards: r.cards && typeof r.cards === 'object' ? r.cards : {}, retired: r.retired && typeof r.retired === 'object' ? r.retired : {} };
  } catch (e) { errors.push(`tree/cards.json: ${e.message}`); return empty; }
}

const CARD_KINDS = new Set(STRUCTURAL);
function assignCards({ nodes, rootId, cfg, registry, err }) {
  const { pad, prefixes, prefixOf } = cfg.cardCodes;
  const isCard = (n) => !!n.path && (CARD_KINDS.has(n.kind) || cfg.kinds.has(n.kind));
  const CODE = /^([A-Z]{1,4})-(\d+)([a-z]?(?:-[a-z]{2})?)$/;
  const cardsOut = {}; // node id -> code
  const byCode = {}; // code -> node id
  const taken = new Set(Object.keys(registry.retired)); // codes that can never be handed out again
  const claim = (code, id) => {
    if (byCode[code]) { err(`code ${code} is given to both ${byCode[code]} and ${id}; every card code is unique`); return false; }
    if (registry.retired[code] && registry.retired[code] !== id) { err(`code ${code} was retired with ${registry.retired[code]} and cannot be given to ${id}; a code is never reused`); return false; }
    byCode[code] = id; cardsOut[id] = code; taken.add(code); nodes[id].card = code;
    return true;
  };
  // 1 · tasks, decisions and decision records: the code is the id
  for (const n of Object.values(nodes)) {
    if (!isCard(n) || !ID_CODED.has(n.kind)) continue;
    const kept = registry.cards[n.id];
    if (kept !== undefined && kept !== n.code) err(`${n.id} is listed as ${kept}, but a ${n.kind}'s card code is its id ${n.code}`);
    // the id carries the prefix of what the card is: a bug (type: bug) is B-NN, a task T-NNN
    const wantPrefix = prefixOf(codeKind(n)), gotPrefix = CODE.exec(n.code)?.[1];
    if (gotPrefix && wantPrefix && gotPrefix !== wantPrefix) {
      err(`${n.id}: the id carries prefix ${gotPrefix}, but ${isBug(n) ? 'a bug (type: bug) is numbered B-NN' : `a ${n.kind} is numbered ${wantPrefix}-NNN`}`);
      continue;
    }
    claim(n.code, n.id);
  }
  // 2 · every other card keeps the code the registry gives it
  for (const [id, code] of Object.entries(registry.cards)) {
    const n = nodes[id];
    if (!n || !isCard(n) || ID_CODED.has(n.kind)) continue; // gone: retired below
    const m = typeof code === 'string' ? CODE.exec(code) : null;
    const want = prefixOf(n.kind);
    if (!m) { err(`${id}: "${code}" is not a card code (<PREFIX>-<number>)`); continue; }
    if (m[1] !== want) { err(`${id}: code ${code} carries prefix ${m[1]}, but a ${n.kind} card's prefix is ${want}`); continue; }
    claim(code, id);
  }
  // 3 · new cards: the next free number for the prefix, in tree order
  const next = new Map(); // prefix -> highest number seen (claimed or retired)
  const note = (code) => { const m = CODE.exec(code); if (m && !m[3]) next.set(m[1], Math.max(next.get(m[1]) || 0, Number(m[2]))); };
  for (const c of taken) note(c);
  const seen = new Set();
  const walkNode = (id) => {
    if (seen.has(id)) return;
    seen.add(id);
    const n = nodes[id];
    if (isCard(n) && !n.card && !ID_CODED.has(n.kind)) {
      const prefix = prefixOf(n.kind);
      if (!prefix) err(`${id}: kind "${n.kind}" has no card prefix`);
      else {
        let num = (next.get(prefix) || 0) + 1, code;
        do { code = `${prefix}-${String(num).padStart(pad, '0')}`; num++; } while (taken.has(code) || byCode[code]);
        next.set(prefix, num - 1);
        claim(code, id);
      }
    }
    for (const c of n.children) walkNode(c);
  };
  walkNode(rootId);
  for (const n of Object.values(nodes)) if (isCard(n) && !n.card && !ID_CODED.has(n.kind)) walkNode(n.id); // a card not reachable from the root (should not happen)
  // 4 · the registry to write back: current cards, plus every code that was ever given and is no longer held
  const retired = { ...registry.retired };
  for (const [id, code] of Object.entries(registry.cards)) if (cardsOut[id] !== code && !byCode[code]) retired[code] = id;
  for (const code of Object.keys(retired)) if (byCode[code] === retired[code]) delete retired[code]; // came back under the same id: not retired after all
  const prefixesOut = {};
  for (const [prefix, kind] of prefixes) prefixesOut[prefix] = kind;
  return { registry: { schema: 1, cards: cardsOut, retired }, byCode, prefixes: prefixesOut };
}

// ---------------------------------------------------------------- emit
function stableStringify(value, indent = 2) {
  const sortKeys = (v) => {
    if (Array.isArray(v)) return v.map(sortKeys);
    if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]));
    return v;
  };
  return JSON.stringify(sortKeys(value), null, indent) + '\n';
}

const mdLink = (n, from = '') => { const target = ((t) => (t && from && t.startsWith(`${from}/`) ? t.slice(from.length + 1) : t))(n.path || n.file); return target ? `[${n.title}](${target.split('/').map(encodeURIComponent).join('/')})` : `_${n.title}_`; };

function treeMarkdown(json) {
  const { nodes } = json;
  const lines = ['# Docs tree', '', 'Generated by `node scripts/build-tree.mjs` from the notes\' frontmatter and `docs.config.json`. Do not edit; edit the notes. Status key: ' +
    Object.entries(EMOJI).map(([k, e]) => `${e} ${LEGEND[k]}`).join(' · '), '',
    'Layers: ' + json.layers.map((l) => `**${l.label}** (${l.kinds.map((k) => k.label).join(', ')})`).join(' · '), ''];
  const seen = new Set();
  const walkNode = (id, depth) => {
    const n = nodes[id];
    const extra = [n.card && !n.title.startsWith(n.card) ? n.card : null, n.label && !['feature', 'module', 'task'].includes(n.kind) ? n.label : null, n.kind === 'root' ? stageText(json, n) : null, n.kind === 'feature' ? `release ${releaseLabel(json, n.release)}` : null, n.deployedTo?.length ? `on ${n.deployedTo.join(', ')}` : null, n.parentTask ? `sub-task of ${n.parentTask}` : null, ...(n.labels || []), n.resolution ? resolutionLabel(json, n.resolution) : null, n.frontendOnly ? 'frontend only' : null, n.pending?.length ? `${n.pending.length} pending note${n.pending.length === 1 ? '' : 's'}` : null, priorityLabel(json, n), n.deadline ? `due ${n.deadline}` : null, n.blockedBy?.length ? `blocked by ${n.blockedBy.map((b) => b.title).join(', ')}` : null].filter(Boolean).join(', ');
    lines.push(`${'  '.repeat(depth)}- ${emojiOf(n)} ${mdLink(n)}${extra ? ` (${extra})` : ''}`);
    if (seen.has(id) && n.children.length) { lines.push(`${'  '.repeat(depth + 1)}- (see above)`); return; }
    seen.add(id);
    for (const c of n.children) walkNode(c, depth + 1);
  };
  walkNode(json.rootId, 0);
  lines.push('');
  return lines.join('\n');
}

const releaseLabel = (json, id) => (id ? (json.releases || []).find((r) => r.id === id)?.label ?? id : 'No release');
const stageText = (json, n) => [n.stage ? `stage ${(json.stages || []).find((s) => s.id === n.stage)?.label ?? n.stage}` : 'no stage', ...(n.releases || []).map((r) => `${releaseLabel(json, r.id)} ${r.done}/${r.total} done${r.partial ? ` (${r.partial} partial)` : ''}`)].join(', ');
const priorityLabel = (json, n) => { const l = n.priority ? (json.priorities || []).find((x) => x.id === n.priority) : null; return l ? l.label : n.priority; };
const resolutionLabel = (json, id) => (id ? (json.resolutions || []).find((r) => r.id === id)?.label ?? id : null);
const wiki = (n, alias) => `[[${n.title}${alias ? `|${alias}` : ''}]]`;
const codedWiki = (n) => `${n.code && !n.title.startsWith(n.code) ? `${n.code} ` : ''}${wiki(n)}`; // the code in front of a link whose title does not carry it

function cardIndexMarkdown(json) {
  const { nodes, cardPrefixes } = json;
  const prefixOrder = Object.keys(cardPrefixes);
  const parse = (code) => { const m = /^([A-Z]+)-(\d+)(.*)$/.exec(code); return m ? [prefixOrder.indexOf(m[1]), Number(m[2]), m[3]] : [99, 0, code]; };
  const byCode = (a, b) => { const [pa, na, sa] = parse(a), [pb, nb, sb] = parse(b); return pa - pb || na - nb || sa.localeCompare(sb); };
  const codes = (ids) => [...new Set(ids.map((id) => nodes[id]?.card).filter(Boolean))].sort(byCode).join(' \\| ') || '—';
  const REL = new Set(['related', 'affects', 'depends', 'decision', 'pending']);
  const relOf = new Map();
  for (const e of json.edges) {
    if (!REL.has(e.kind)) continue;
    if (!relOf.has(e.from)) relOf.set(e.from, new Set());
    if (!relOf.has(e.to)) relOf.set(e.to, new Set());
    relOf.get(e.from).add(e.to); relOf.get(e.to).add(e.from);
  }
  const status = (n) => `${emojiOf(n)} ${legendOf(n)}${n.pending?.length ? ` (${n.pending.length} note${n.pending.length === 1 ? '' : 's'})` : ''}`;
  const kindName = (kind) => (nodes && (Object.values(nodes).find((n) => n.kind === kind)?.label)) || kind;
  const groupLabel = { module: 'Modules', feature: 'Features', task: 'Tasks', 'needs-decision': 'Decisions needed', 'decision': 'Decisions', project: 'Project reference notes' };
  const lines = ['---', 'type: map', 'layer: shared', 'tags: [map]', '---', '', '# Card Index', '',
    'Generated by `node scripts/build-tree.mjs` from the notes and `tree/cards.json`; do not edit, run the build. **One row per card, one code per card, every code unique and never reused.** A card is one Markdown file in the [[Docs Tree]]: a module, a feature, a layer note (story, requirements, deliveries, integration, QA), a task, a decision, a decision record or a project reference note. The code is `<prefix>-<number>`: a task\'s, a decision\'s and a decision record\'s code is its id (`T-004`, `ND-04`, `D-04`); every other card got the next free number for its kind the first time the build saw it and keeps it for good. A card that is deleted takes its code with it (`retired` in `tree/cards.json`): the number is never handed out again, and renumbering by hand is a build error. Codes list the cards a row is connected to as `T-004 | S-01`: *Under* is the card it hangs from in the tree, *Related* the cards it declares `related` / `affects` / `depends` / `pending` to (and a decision\'s features), *Blocked by* what stops it now. Look a code up with `node scripts/build-tree.mjs --impact S-01`.', '',
    '| Prefix | Cards | Count |', '|---|---|---|'];
  const all = Object.values(nodes).filter((n) => n.card).sort((a, b) => byCode(a.card, b.card));
  const byPrefix = new Map(prefixOrder.map((p) => [p, []]));
  for (const n of all) { const p = parse(n.card); byPrefix.get(prefixOrder[p[0]])?.push(n); }
  for (const [prefix, rows] of byPrefix) { const kind = cardPrefixes[prefix]; lines.push(`| \`${prefix}-\` | ${groupLabel[kind] ?? kindName(kind)} (\`${kind}\`) | ${rows.length} |`); }
  lines.push('');
  for (const [prefix, rows] of byPrefix) {
    if (!rows.length) continue;
    const kind = cardPrefixes[prefix];
    lines.push(`## ${prefix} · ${groupLabel[kind] ?? kindName(kind)}`, '', '| Code | Card | Status | Under | Related | Blocked by |', '|---|---|---|---|---|---|');
    for (const n of rows) {
      const extra = [n.scope === 'task' ? `task ${n.task}` : n.scope === 'feature' ? 'feature level' : null, n.parentTask ? `sub-task of ${n.parentTask}` : null, ...(n.labels || []).map((l) => `\`${l}\``), priorityLabel(json, n), n.kind === 'feature' ? `release ${releaseLabel(json, n.release)}` : null, n.deadline ? `due ${n.deadline}` : null, n.frontendOnly ? 'frontend only' : null].filter(Boolean).join(', ');
      lines.push(`| ${n.card} | ${mdLink(n, PROJECT_DIR)}${extra ? ` (${extra})` : ''} | ${status(n)} | ${codes(n.parents)} | ${codes([...(relOf.get(n.id) || [])])} | ${codes((n.blockedBy || []).map((b) => b.id))} |`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function copySite(outDir, notes) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, 'notes'), { recursive: true });
  fs.copyFileSync(path.join(TREE_DIR, 'index.html'), path.join(outDir, 'index.html'));
  fs.copyFileSync(JSON_PATH, path.join(outDir, 'tree.json'));
  fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
  for (const n of notes) {
    const dest = path.join(outDir, 'notes', n.rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(n.abs, dest);
  }
  const assets = PROJ('design', 'assets');
  if (fs.existsSync(assets)) fs.cpSync(assets, path.join(outDir, 'notes', prj('design/assets')), { recursive: true });
}

function serve(outDir, port) {
  const MIME = { '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.css': 'text/css', '.js': 'text/javascript' };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(outDir, path.normalize(p));
    if (!file.startsWith(outDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  server.listen(port, '127.0.0.1', () => console.log(`Docs tree at http://127.0.0.1:${port}/  (Ctrl+C to stop)`));
}

// ---------------------------------------------------------------- impact
export function impact(json, query) {
  const { nodes, edges } = json;
  const q = query.trim();
  let start = null;
  if (json.concepts[q]) return { concept: q, ...json.concepts[q], notes: json.concepts[q].notes.map((id) => nodes[id]) };
  for (const n of Object.values(nodes)) if (n.title === q || n.code === q || n.card === q || n.path === q || n.id === q) { start = n; break; }
  if (!start) for (const n of Object.values(nodes)) if (n.title?.toLowerCase().startsWith(q.toLowerCase())) { start = n; break; }
  if (!start) return null;
  const REL = ['related', 'affects', 'depends', 'blocks', 'flow', 'shares', 'decision', 'wikilink', 'pending'];
  const hop = (ids) => {
    const out = new Map(); // id -> [{kind, dir, via, from}]
    for (const e of edges) {
      if (!REL.includes(e.kind)) continue;
      for (const id of ids) {
        if (e.from === id && e.to !== id) { if (!out.has(e.to)) out.set(e.to, []); out.get(e.to).push({ kind: e.kind, dir: 'out', via: e.via ?? null, from: id }); }
        else if (e.to === id && e.from !== id) { if (!out.has(e.from)) out.set(e.from, []); out.get(e.from).push({ kind: e.kind, dir: 'in', via: e.via ?? null, from: id }); }
      }
    }
    return out;
  };
  const family = new Set([start.id, ...start.children, ...(start.kind === 'feature' || start.kind === 'task' ? [] : start.parents)]);
  if (start.kind === 'feature') for (const c of start.children) for (const g of nodes[c].children) if (nodes[g].kind === 'task') family.add(g); // the tasks under the feature's cards: under its story, and the bugs under the card they were found against
  const first = hop([...family]);
  for (const id of family) first.delete(id);
  const second = hop([...first.keys()]);
  for (const id of [...family, ...first.keys()]) second.delete(id);
  const dependents = Object.values(nodes).filter((n) => n.depends.includes(start.id) || n.blockedBy.some((b) => b.id === start.id));
  return { start, family: [...family].map((id) => nodes[id]), first, second, dependents };
}

const nodeLine = (n) => `${emojiOf(n)} ${n.title}${n.card ? ` [${n.card}]` : ''}${n.code && n.code !== n.title && n.code !== n.card ? ` (${n.code})` : ''}${n.path ? ` — ${n.path}` : ''}`;

// ---------------------------------------------------------------- find: the cards and concepts that match some words
export function find(json, query, limit = 12) {
  const words = query.toLowerCase().split(/[^a-z0-9!:/_-]+/).filter((w) => w.length > 1);
  if (!words.length) return { nodes: [], concepts: [] };
  const score = (fields) => {
    const text = fields.filter(Boolean).join(' \n ').toLowerCase();
    let s = 0;
    for (const w of words) { if (!text.includes(w)) continue; s += 1; if (fields[0]?.toLowerCase().includes(w)) s += 2; if (fields[0]?.toLowerCase() === w || fields[1]?.toLowerCase() === w) s += 3; }
    return s;
  };
  const moduleName = (id) => json.modules.find((m) => m.id === id)?.name ?? '';
  const nodes = Object.values(json.nodes).filter((n) => n.path || n.kind === 'module').map((n) => ({ n, s: score([n.title, n.code, n.card, n.id, n.summary, (n.screens || []).join(' '), moduleName(n.module), n.feature, n.kind]) })).filter((x) => x.s > 0);
  nodes.sort((a, b) => b.s - a.s || (a.n.kind === 'feature' ? -1 : 0) - (b.n.kind === 'feature' ? -1 : 0) || a.n.title.localeCompare(b.n.title));
  const concepts = Object.entries(json.concepts).map(([name, c]) => ({ name, c, s: score([name, c.kind]) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 8);
  return { nodes: nodes.slice(0, limit), concepts };
}
function printFind(json, query) {
  const r = find(json, query);
  if (!r.nodes.length && !r.concepts.length) { console.log(`nothing matches "${query}"; try a module name, a feature, a screen id (s44), an endpoint or a code (T-004, S-01)`); return; }
  console.log(`Cards matching "${query}" (best first):`);
  for (const { n } of r.nodes) console.log(`  ${nodeLine(n)}${n.kind ? ` · ${n.kind}${n.layer ? ` / ${n.layer}` : ''}` : ''}${n.feature && n.kind !== 'feature' ? ` · feature ${n.feature}` : ''}${n.module ? ` · module ${n.module}` : ''}`);
  if (r.concepts.length) { console.log('Concepts:'); for (const { name, c } of r.concepts) console.log(`  ${name} (${c.kind}${c.owner ? `, owned by ${json.nodes[c.owner]?.title}` : ''}) · mentioned by ${c.notes.length} notes`); }
}

// ---------------------------------------------------------------- branch: every agent's vault branch for a card, tickets/ or docs/ by the card's kind (Workflow §2)
export function branchName(json, agent, query, what, branches = {}) {
  const { nodes } = json;
  if (!/^[a-z][a-z0-9-]*$/.test(agent || '')) return { error: `give the agent first: --branch <owner|pm|frontend|backend|qa|admin> <card> [<what-you-do>]` };
  const q = (query || '').trim();
  if (!q) return { error: 'give the card: a code (F-41, ND-07, S-70, T-047, M-09), a feature id, or a note name' };
  let n = null;
  for (const x of Object.values(nodes)) if (x.title === q || x.code === q || x.card === q || x.path === q || x.id === q) { n = x; break; }
  if (!n) for (const x of Object.values(nodes)) if (x.title?.toLowerCase() === q.toLowerCase()) { n = x; break; }
  if (!n || !n.card) return { error: `nothing named "${q}" with a card code (try --find "${q}")` };
  const kebab = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const titleWords = n.title.replace(/^[A-Z]+-\d+[a-z-]*\s*[·:]?\s*/, '');
  // the card's place: its feature, then its module (a decision takes them from the cards it blocks; a decision record from its decision)
  const d = n.kind === 'decision' ? nodes[`needs-decision:${n.decides}`] || n : n;
  let featureId = n.kind === 'feature' ? n.code : n.feature || null;
  if (!featureId && d.kind === 'needs-decision') featureId = (d.blocks || []).map((id) => nodes[id]?.feature || (nodes[id]?.kind === 'feature' ? nodes[id].code : null)).find(Boolean) || (d.features || [])[0] || null; // the first card it blocks, then its declared features
  const feature = featureId ? Object.values(nodes).find((x) => x.kind === 'feature' && x.code === featureId) : null;
  let moduleId = n.kind === 'module' ? n.id.replace(/^module:/, '') : n.module || feature?.module || null;
  if (!moduleId && d.kind === 'needs-decision') moduleId = (d.blocks || []).map((id) => nodes[id]?.module).find(Boolean) || null;
  const mod = moduleId ? nodes[`module:${moduleId}`] : null;
  const tickets = Array.isArray(branches.tickets) ? branches.tickets : ['task', 'bug', 'story', 'frontend-requirements', 'needs-decision'];
  const parts = [`${tickets.includes(n.kind) || tickets.includes(codeKind(n)) ? 'tickets' : branches.default || 'docs'}/${agent}`];
  if (mod) {
    parts.push(`${mod.card}-${moduleId}`);
    if (feature && n.kind !== 'module') parts.push(`${feature.card}-${feature.code}`);
    if (n.kind === 'module' || n.kind === 'feature') { if (!what) return { error: `${n.card} is the ${n.kind} itself: add what you do, e.g. --branch ${agent} ${n.card} ${n.kind === 'module' ? 'business-side' : 'create'}` }; parts.push(kebab(what)); }
    else parts.push(`${n.card}-${kebab(what || titleWords)}`);
  } else {
    parts.push(n.kind === 'project' && n.layer === 'business' ? 'business' : 'project');
    if (n.kind === 'needs-decision' || n.kind === 'decision') parts.push(`${n.card}-${kebab(what || titleWords)}`);
    else { if (!what) return { error: `${n.card} sits outside the modules: add what you do, e.g. --branch ${agent} "${n.title}" flag-window` }; parts.push(kebab(what)); }
  }
  return { branch: parts.join('/'), card: n.card, title: n.title };
}

function printImpact(json, r, query) {
  if (!r) { console.error(`nothing named "${query}" (try a note name, a task or decision id, a feature id, or a concept like E_RING_02 / "GET /rings/:id" / s14)`); process.exit(1); }
  const { nodes } = json;
  const layerOf = (n) => n.layer ?? 'business';
  const now = new Date();
  const due = (n) => { if (!n.deadline) return ''; const z = deadlineZone(n.deadline, now, json.deadlines); return ` · due ${n.deadline} (${z.missed ? `${z.icon || ''} ${z.label}, ${-z.daysLeft} day${-z.daysLeft === 1 ? '' : 's'} ago`.trim() : `${z.label}, ${z.daysLeft} day${z.daysLeft === 1 ? '' : 's'} left`})`; };
  const line = (n) => `${emojiOf(n)} ${n.title}${n.card ? ` [${n.card}]` : ''}${n.code && n.code !== n.title && n.code !== n.card ? ` (${n.code})` : ''}${n.priority ? ` · ${priorityLabel(json, n)}` : ''}${due(n)}${n.path ? ` — ${n.path}` : ''}`;
  if (r.concept) {
    console.log(`Concept ${r.concept} (${r.kind})${r.owner ? `, owned by ${nodes[r.owner].title}` : ''} is mentioned by ${r.notes.length} notes:`);
    for (const n of r.notes) console.log(`  ${line(n)}`);
    return;
  }
  console.log(`Impact of a change to ${line(r.start)}`);
  if (r.family.length > 1) { console.log(`\nSame feature/task (always read these):`); for (const n of r.family) if (n.id !== r.start.id) console.log(`  ${line(n)}`); }
  const group = (map, title) => {
    if (!map.size) return;
    console.log(`\n${title}:`);
    const byLayer = new Map();
    for (const [id, reasons] of map) { const l = layerOf(nodes[id]); if (!byLayer.has(l)) byLayer.set(l, []); byLayer.get(l).push([nodes[id], reasons]); }
    for (const l of [...byLayer.keys()].sort()) {
      console.log(`  [${l}]`);
      for (const [n, reasons] of byLayer.get(l).sort((a, b) => a[0].title.localeCompare(b[0].title))) {
        const why = [...new Set(reasons.map((x) => `${x.kind}${x.dir === 'in' ? ' ←' : ' →'}${x.via ? ` via ${x.via.join(', ')}` : ''}${x.from !== r.start.id ? ` (through ${nodes[x.from].title})` : ''}`))].join('; ');
        console.log(`    ${line(n)}\n      ${why}`);
      }
    }
  };
  group(r.first, 'Directly linked (update or flag these)');
  group(r.second, 'Two hops away (read if the change crosses a feature boundary)');
  if (r.dependents.length) { console.log(`\nWaiting on this (depends / blocked by):`); for (const n of r.dependents) console.log(`  ${line(n)}`); }
}

// ---------------------------------------------------------------- scaffold · structural notes (task, feature, decision)
const die = (m) => { console.error(m); process.exit(1); };
const today = () => new Date().toISOString().slice(0, 10);
// the same flat YAML the vault's notes use: scalars, quoted strings and inline lists
const yamlOf = (out, quote = []) => Object.entries(out).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(', ')}]` : typeof v === 'string' && (quote.includes(k) || /[:#]/.test(v) || v === '') ? JSON.stringify(v) : v}`).join('\n');
const fill = (text, map) => Object.entries(map).reduce((t, [k, v]) => t.split(k).join(v), text);
const writeNote = (dest, fm, body, quote) => { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, `---\n${yamlOf(fm, quote)}\n---\n${body}`); return path.relative(ROOT, dest); };
// the next free number for a structural prefix (T, D): higher than every code in the tree, in the registry and among the retired codes
function nextNumber(result, prefix, width) {
  const re = new RegExp(`^${prefix}-(\\d+)`);
  let max = 0;
  const seen = (c) => { const m = re.exec(String(c ?? '')); if (m) max = Math.max(max, Number(m[1])); };
  for (const n of Object.values(result.json.nodes)) { seen(n.code); seen(n.card); }
  const reg = result.cards ?? loadCards([]);
  for (const c of Object.values(reg.cards ?? {})) seen(c);
  for (const c of Object.keys(reg.retired ?? {})) seen(c);
  return `${prefix}-${String(max + 1).padStart(width, '0')}`;
}
const screenLinks = (screens) => (screens.length ? screens.map((s) => `[[Screen Index#${s}|${s}]]`).join(', ') : '[[Screen Index#sNN|sNN]] …');

// a bug (type: bug) is scaffolded here too: the same frontmatter as a task, its own template, its own B-NN sequence, and it names where it was found
function scaffoldTask(result, featureId, title, bug = false) {
  const { cfg, json } = result;
  const usage = bug
    ? 'usage: node scripts/build-tree.mjs --scaffold bug <feature-id> "<Title>" (--parent T-NNN | --found-on "<note name>") [--label <label>] [--priority critical|high|medium|low] [--effort S|M|L]'
    : 'usage: node scripts/build-tree.mjs --scaffold task <feature-id> "<Title>" [--backend-only | --docs-only | --parent T-NNN] [--label <label>] [--priority critical|high|medium|low] [--effort S|M|L]';
  if (!featureId || !title) die(usage);
  const f = json.nodes[`feature:${featureId}`];
  if (!f) die(`no feature with id "${featureId}" (feature ids are the \`id:\` of modules/<Module>/features/<Feature>/<Feature>.md; see tree/tree.json)`);
  if (BAD_NAME.test(title)) die('the title cannot contain # ? % or \\');
  const parentCode = opt('--parent', null);
  const parent = parentCode ? json.nodes[`task:${parentCode}`] : null;
  if (parentCode && !parent) die(`no task ${parentCode}`);
  if (parent && parent.feature !== featureId) die(`${parentCode} belongs to feature "${parent.feature}"; a sub-task stays in its parent's feature`);
  const label = opt('--label', null);
  if (label === 'bug') die(`a bug is its own type, not a label: node scripts/build-tree.mjs --scaffold bug ${featureId} "${title}" (--parent T-NNN | --found-on "<note name>")`);
  if (label && !cfg.taskLabels.includes(label)) die(`label "${label}" is not in docs.config.json taskLabels (${cfg.taskLabels.join(', ')})`);
  const priority = opt('--priority', 'high'), effort = opt('--effort', bug ? 'S' : 'M');
  if (!cfg.priorities.levels.some((l) => l.id === priority)) die(`priority "${priority}": ${cfg.priorities.levels.map((l) => l.id).join(', ')}`);
  if (!/^[SML]$/.test(effort)) die(`effort "${effort}": S, M or L`);
  const backendOnly = has('--backend-only'), docsOnly = has('--docs-only');
  // a bug found against a card that is not a task names it with --found-on "<note name>" and hangs under it; one found against a task stays its sub-task
  const foundOn = opt('--found-on', null);
  if (foundOn && !bug) die(`--found-on is for a bug: node scripts/build-tree.mjs --scaffold bug ${featureId} "${title}" --found-on "${foundOn}"`);
  if (foundOn && parentCode) die('--found-on and --parent are the two ways a bug hangs somewhere: pass one');
  if (foundOn && !json.byName[foundOn]) die(`--found-on "${foundOn}" is not a note name in this vault`);
  if (bug && parentCode) die('a bug hangs on the card it was found against: --found-on "<note name>" (the story, a delivery, integration or QA note); --parent is for legacy tasks, which are retired (rules/Agent Rules.md §2)');
  if (bug && !foundOn && !parentCode) die('a bug names where it was found: --parent T-NNN for one found against a task, or --found-on "<note name>" for the card it was found against');
  const split = !parent && !docsOnly && !bug; // a build task gets its story and its halves; a sub-task, a docs-only task or a bug does not
  const code = bug ? nextNumber(result, 'B', 2) : nextNumber(result, 'T', 3);
  const stem = `${code} ${title}`; // tasks/T-NNN <Title>.md, bugs/B-NN <Title>.md
  if (/^[A-Z]+-\d+\s/.test(title)) die(`give the title without a code: the scaffold puts ${code} in front of "${title}"`);
  const date = today();
  const screens = f.screens ?? [];
  let dir, pnote = null;
  if (parent) pnote = result.notes.find((n) => n.rel === parent.path);
  if (bug) dir = PROJ('bugs'); // a bug lives in bugs/, also when it is a task's sub-task: the tree hangs it under the parent
  else if (parent) {
    dir = PROJ('tasks', pnote.stem);
    if (!parent.dir) { fs.mkdirSync(dir, { recursive: true }); fs.renameSync(pnote.abs, path.join(dir, pnote.name)); console.log(`moved ${pnote.rel} → ${prj(`tasks/${pnote.stem}/${pnote.name}`)}`); }
  } else dir = split ? PROJ('tasks', stem) : PROJ('tasks');
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, `${stem}.md`);
  if (fs.existsSync(dest)) die(`${path.relative(ROOT, dest)} already exists`);
  const type = bug ? 'bug' : 'task';
  const { body } = parseFrontmatter(fs.readFileSync(path.join(ROOT, `templates/${bug ? 'Bug' : 'Task'} Template.md`), 'utf8'));
  const fm = { type, id: code, status: 'todo', priority, effort, feature: featureId, module: f.module };
  if (parent) fm.parent = parentCode;
  if (foundOn) fm.foundOn = foundOn;
  Object.assign(fm, { labels: label ? [label] : [], screens, depends: [], affects: [], related: foundOn ? [foundOn] : [], pending: [], created: date, updated: date, tags: [type, `${type}/todo`, `module/${f.module}`, `priority/${priority}`, ...(label ? [label] : [])] });
  let text = fill(body, { 'T-NNN': code, 'B-NN': code, '<Title>': title, '<Feature name>': f.title, '<date>': date, '- [[Screen Index#sNN|sNN]] …': `- ${screenLinks(screens)}` })
    .replace('**Status:** To do · **Priority:** P1 · **Effort:** M', `**Status:** To do · **Priority:** ${priority} · **Effort:** ${effort}`)
    .replace(bug ? 'filed from …' : 'created from …', `${bug ? 'filed' : 'created'} with --scaffold ${type}${parent ? ` as a sub-task of ${parentCode}` : ''}${foundOn ? `, found against ${foundOn}` : ''}`);
  if (parent) text = text.replace('**Feature:**', `**Parent:** [[${pnote.stem}]] · **Feature:**`);
  if (foundOn) text = text.replace('**Feature:**', `**Found against:** [[${foundOn}]] · **Feature:**`);
  if (split) {
    const halves = [...(backendOnly ? [] : [`[[${code}-fe Frontend · ${title}|Frontend]]`]), `[[${code}-be Backend · ${title}|Backend]]`].join(' · ');
    text = text.replace(/\*\*Layer notes\*\*[^\n]*\n/, `**Sub-tasks:** ${halves} · **Story:** [[${code} Story]]\n`);
  }
  const written = [writeNote(dest, fm, text)];
  if (split) {
    for (const side of backendOnly ? ['be'] : ['fe', 'be']) {
      const Side = side === 'fe' ? 'Frontend' : 'Backend';
      const h = parseFrontmatter(fs.readFileSync(path.join(ROOT, `templates/Task ${Side} Half Template.md`), 'utf8'));
      const hcode = `${code}-${side}`;
      const hfm = { type: 'task', id: hcode, status: 'todo', priority, effort, feature: featureId, module: f.module, parent: code, labels: [side === 'fe' ? 'frontend' : 'backend'], screens, depends: side === 'fe' ? [`${code}-be`] : [], affects: [], related: [], pending: [], created: date, updated: date, tags: ['task', 'task/todo', `module/${f.module}`, `priority/${priority}`, side === 'fe' ? 'frontend' : 'backend'] };
      const htext = fill(h.body, { 'T-NNN': code, '<Title>': title, '<Feature name>': f.title, '<date>': date, '<priority>': priority, '<effort>': effort, '<screens>': screenLinks(screens) });
      written.push(writeNote(path.join(dir, `${hcode} ${Side} · ${title}.md`), hfm, htext));
    }
  }
  console.log(`wrote ${written.join(', ')}`);
  // the story, then the impact list pasted into the task's ## Impact (the reading list for whoever picks it up)
  let latest = build();
  if (latest.errors.length) { for (const e of latest.errors) console.error(`error    ${e}`); die(`the vault has errors after writing ${stem}; fix them, then run node scripts/build-tree.mjs --scaffold story ${code}`); }
  if (split) { scaffold(latest, 'story', code); latest = build(); }
  const imp = latest.json ? impact(latest.json, code) : null;
  if (imp && !imp.concept) {
    const lines = [];
    const li = (n, why) => { if (n?.path && n.id !== imp.start.id) lines.push(`- [[${n.title}]]${n.card ? ` · ${n.card}` : ''} — ${why}`); };
    for (const n of imp.family) li(n, 'same task');
    for (const [id, reasons] of imp.first) li(latest.json.nodes[id], [...new Set(reasons.map((x) => `${x.kind}${x.dir === 'in' ? ' ←' : ' →'}`))].join(', '));
    if (lines.length) fs.writeFileSync(dest, fs.readFileSync(dest, 'utf8').replace('\n- …\n', `\n${lines.join('\n')}\n`));
  }
  console.log(`next: fill What, Design and the Definition of done in ${path.relative(ROOT, dest)}${split ? `, write ${code} Story` : ''}, add the row to the Tasks table of [[${f.title}]], declare depends / affects / related, then node scripts/build-tree.mjs`);
}

function scaffoldFeature(result, moduleId, name) {
  const { cfg, json } = result;
  if (!moduleId || !name) die('usage: node scripts/build-tree.mjs --scaffold feature <module-id> "<Name>" [--id <slug>] [--priority critical|high|medium|low] [--release mvp|v1|later] [--frontend-only]');
  const m = cfg.modules.find((x) => x.id === moduleId);
  if (!m) die(`no module "${moduleId}"; modules in docs.config.json: ${cfg.modules.map((x) => x.id).join(', ')}`);
  if (BAD_NAME.test(name)) die('the name cannot contain # ? % or \\');
  const id = opt('--id', slugify(name));
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) die(`feature id "${id}" must be a lowercase slug`);
  if (json.nodes[`feature:${id}`]) die(`feature id "${id}" is taken (${json.nodes[`feature:${id}`].path})`);
  if (json.byName?.[name]) die(`a note named "${name}" already exists (${json.nodes[json.byName[name]].path})`);
  const priority = opt('--priority', 'high');
  if (!cfg.priorities.levels.some((l) => l.id === priority)) die(`priority "${priority}": ${cfg.priorities.levels.map((l) => l.id).join(', ')}`);
  const release = opt('--release', 'later');
  if (!cfg.releases.byId.has(release)) die(`release "${release}": ${cfg.releases.list.map((r) => r.id).join(', ')}`);
  const date = today();
  const dest = PROJ('modules', m.name, 'features', name, `${name}.md`);
  if (fs.existsSync(dest)) die(`${path.relative(ROOT, dest)} already exists`);
  const { body } = parseFrontmatter(fs.readFileSync(path.join(ROOT, 'templates/Feature Template.md'), 'utf8'));
  const fm = { type: 'feature', id, name, priority, release, module: moduleId };
  if (has('--frontend-only')) fm.frontendOnly = true;
  Object.assign(fm, { screens: [], depends: [], affects: [], related: [], created: date, updated: date, tags: ['feature', `module/${moduleId}`, `priority/${priority}`, `release/${release}`] });
  const text = fill(body, { '<Feature name>': name, '<Module name>': m.name, '<date>': date })
    .replace('**Priority:** High', `**Priority:** ${cfg.priorities.byId.get(priority).label}`).replace('**Release:** Later', `**Release:** ${cfg.releases.byId.get(release).label}`);
  const rel = writeNote(dest, fm, text, ['name']);
  console.log(`wrote ${rel} (feature ${id} in ${m.name})\nnext: node scripts/build-tree.mjs --scaffold story ${id}; fill the note (what it is for, the screens, the product rules); add the row to [[${m.name} Module]] and the feature to its screens in [[Screen Index]]; then node scripts/build-tree.mjs`);
}

// ---------------------------------------------------------------- scaffold · the decision card a card needs

function scaffoldDecision(result, ref, title) {
  const { cfg, json } = result;
  const nodes = json.nodes;
  const q = (ref || '').trim();
  const isTarget = (n) => n.path && (n.kind === 'task' || n.kind === 'feature' || cfg.kinds.has(n.kind));
  let target = null;
  for (const n of Object.values(nodes)) if (isTarget(n) && (n.title === q || n.code === q || n.card === q || n.id === q)) { target = n; break; }
  if (!target) for (const n of Object.values(nodes)) if (isTarget(n) && n.title.toLowerCase() === q.toLowerCase()) { target = n; break; }
  if (!target) { console.error(`no task, layer note or feature named "${ref}" (use the note name, T-NNN, a feature id or a card code)`); process.exit(1); }
  const taken = new Set(Object.keys(result.cards.retired)); // a retired ND-NN is never handed out again
  for (const n of Object.values(nodes)) if (n.kind === 'needs-decision') taken.add(n.code);
  let num = 1;
  while (taken.has(`ND-${String(num).padStart(2, '0')}`)) num++;
  const id = `ND-${String(num).padStart(2, '0')}`;
  const t = (title || `Decide for ${target.title}`).trim().replace(/\s+/g, ' ');
  if (BAD_NAME.test(t) || /[/:]/.test(t)) { console.error(`title "${t}" cannot contain / : # ? % \\`); process.exit(1); }
  if (/^[A-Z]+-\d+\s/.test(t)) { console.error(`give the title without a code: the scaffold puts ${id} in front of "${t}"`); process.exit(1); }
  const dest = PROJ('needs-decisions', `${id} ${t}.md`); // needs-decisions/ND-NN <Title>.md
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) { console.error(`${path.relative(ROOT, dest)} already exists`); process.exit(1); }
  const today = new Date().toISOString().slice(0, 10);
  const { data, body } = parseFrontmatter(fs.readFileSync(path.join(ROOT, 'templates', 'Needs Decision Template.md'), 'utf8'));
  const feature = target.kind === 'feature' ? target.code : target.feature;
  const blocks = target.kind === 'task' ? target.code : target.kind === 'feature' ? target.code : target.title; // a task by id, a feature by id, a note by name
  const out = { ...data, id, status: 'draft', features: feature ? [feature] : [], blocks: [blocks], decider: '', screens: target.screens ?? [], affects: [], related: [], created: today, tags: ['needs-decision', 'needs-decision/draft'] };
  const item = (v) => (/^[\w./-]+$/.test(v) ? v : JSON.stringify(v));
  const yaml = Object.entries(out).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.map(item).join(', ')}]` : typeof v === 'string' && (/[:#]/.test(v) || v === '') ? JSON.stringify(v) : v}`).join('\n');
  const text = body.replace(/ND-NN/g, id).replace(/<Title>/g, t).replace(/<date>/g, today).replace(/<card>/g, `[[${target.title}]]`).replace(/<feature>/g, feature ? `[[${nodes[`feature:${feature}`]?.title ?? feature}]]` : '—');
  fs.writeFileSync(dest, `---\n${yaml}\n---\n${text}`);
  console.log(`wrote ${path.relative(ROOT, dest)} (draft; blocks ${target.title}); write what has to be decided and who decides (decider), set status: open when it is ready for the decider, then run node scripts/build-tree.mjs: ${target.title} waits on ${id} until its decision card is decided`);
}

// ---------------------------------------------------------------- scaffold · the decision record that takes a decision
function scaffoldRecord(result, ref, title) {
  const { json } = result;
  const q = (ref || '').trim();
  const usage = 'usage: node scripts/build-tree.mjs --scaffold decision ND-NN "<the answer>" [--by <name>]';
  if (!isDecisionId(q) || !title || title.startsWith('--')) die(usage);
  const d = json.nodes[`needs-decision:${q}`];
  if (!d) die(`no decision ${q} (see decisions/)`);
  const rec = d.children.map((c) => json.nodes[c]).find((c) => c.kind === 'decision');
  if (rec) die(`${q} already has its decision card: ${rec.path}; one question, one answer`);
  const id = `D-${q.slice(3)}`;
  const t = title.trim().replace(/\s+/g, ' ');
  if (BAD_NAME.test(t) || /[/:]/.test(t)) die(`title "${t}" cannot contain / : # ? % \\`);
  const dest = PROJ('decisions', `${id} ${t}.md`);
  if (fs.existsSync(dest)) die(`${path.relative(ROOT, dest)} already exists`);
  const dnote = result.notes.find((n) => n.rel === d.path);
  const date = today();
  const by = opt('--by', null) ?? '';
  const at = '';
  const { body } = parseFrontmatter(fs.readFileSync(path.join(ROOT, 'templates', 'Decision Template.md'), 'utf8'));
  const featureTitles = (d.features || []).map((f) => json.nodes[`feature:${f}`]?.title).filter(Boolean);
  const fm = { type: 'decision', id, decision: q, status: 'draft', decidedBy: by, decidedAt: at, features: d.features || [], affects: [], related: [d.title], owner: '', created: date, updated: date, tags: ['decision', 'decision/draft'] };
  const item = (v) => (/^[\w./-]+$/.test(v) ? v : JSON.stringify(v));
  const yaml = Object.entries(fm).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.map(item).join(', ')}]` : typeof v === 'string' && (/[:#]/.test(v) || v === '' || ['decidedBy', 'decidedAt', 'owner'].includes(k)) ? JSON.stringify(v) : v}`).join('\n');
  const text = body.replace(/ND-NN/g, q).replace(/\bD-NN/g, id).replace(/<Title>/g, t).replace(/<decision>/g, d.title).replace(/<who>/g, by || '—').replace(/<date>/g, at || '—').replace(/<feature>/g, featureTitles.length ? featureTitles.map((x) => `[[${x}]]`).join(', ') : '—');
  fs.writeFileSync(dest, `---\n${yaml}\n---\n${text}`);
  console.log(`wrote ${path.relative(ROOT, dest)} (the decision card answering ${q}, draft)\nnext: fill what was decided, why and what it changes, list every feature and task it changes in affects; on the user's word, the PM or the owner sets it decided (status: decided, decidedBy, decidedAt, the tag decision/decided); ${q} then shows Fulfilled by itself (point its ## Decision at [[${id} ${t}]] and give its H1 ✅); then node scripts/build-tree.mjs, --impact ${id}, and flag what it lists that you do not own`);
}

// ---------------------------------------------------------------- scaffold · layer notes
function scaffold(result, kindId, code) {
  const extra = args[args.indexOf('--scaffold') + 3];
  // one story per feature, one flow (rules/Agent Rules.md §2, since 2026-10-27): no new tasks, no task-level notes
  if (kindId === 'task') die('tasks are retired: one story per feature, one flow (rules/Agent Rules.md §2). Add the work as a new part of the feature\'s story (/pm), then its rows to the feature\'s Frontend Requirements (/frontend).');
  if (kindId !== 'bug' && isTaskId(code)) die(`task-level notes are retired: write the feature's note instead, node scripts/build-tree.mjs --scaffold ${kindId} <feature-id> (rules/Agent Rules.md §2)`);
  if (kindId === 'task' || kindId === 'bug') return scaffoldTask(result, code, extra && !extra.startsWith('--') ? extra : null, kindId === 'bug');
  if (kindId === 'feature') return scaffoldFeature(result, code, extra && !extra.startsWith('--') ? extra : null);
  if (kindId === 'needs-decision') return scaffoldDecision(result, code, extra);
  if (kindId === 'decision') return scaffoldRecord(result, code, extra);
  const { cfg, json } = result;
  const kind = cfg.kinds.get(kindId);
  if (!kind) { console.error(`unknown kind "${kindId}"; kinds in docs.config.json: ${cfg.kindOrder.join(', ')}; structural: task, bug, feature, needs-decision, decision`); process.exit(1); }
  const nodes = json.nodes;
  const template = fs.readFileSync(path.join(ROOT, kind.template), 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  let dest, fm, name, featureNode, taskNode = null;
  if (isTaskId(code)) {
    taskNode = nodes[`task:${code}`];
    if (!taskNode) { console.error(`no task ${code}`); process.exit(1); }
    featureNode = nodes[`feature:${taskNode.feature}`];
    const note = result.notes.find((n) => n.rel === taskNode.path);
    const root = taskRoot(note);
    const dir = PROJ(root, note.stem);
    if (!taskNode.dir) { fs.mkdirSync(dir, { recursive: true }); fs.renameSync(note.abs, path.join(dir, note.name)); console.log(`moved ${note.rel} → ${prj(`${root}/${note.stem}/${note.name}`)}`); }
    dest = path.join(dir, `${code} ${kind.file}.md`);
    name = `${code} · ${note.stem.replace(/^[TB]-\d+[a-z]?\s+/, '')}`;
    fm = { type: kind.id, code, scope: 'task', task: code, feature: taskNode.feature, module: featureNode?.module ?? taskNode.module };
  } else {
    featureNode = nodes[`feature:${code}`];
    if (!featureNode) { console.error(`no feature with id "${code}"`); process.exit(1); }
    dest = path.join(ROOT, featureNode.dir, `${featureNode.title} ${kind.file}.md`);
    name = featureNode.title;
    fm = { type: kind.id, code, scope: 'feature', feature: code, module: featureNode.module };
  }
  if (fs.existsSync(dest)) { console.error(`${path.relative(ROOT, dest)} already exists`); process.exit(1); }
  const status = kind.statuses[0];
  const { data, body } = parseFrontmatter(template);
  const out = { ...data, ...fm, status, screens: featureNode?.screens ?? [], created: today, updated: today, tags: [kind.id, `${kind.id}/${status}`, `module/${fm.module}`, `layer/${kind.layer}`] };
  for (const k of ['depends', 'affects', 'related', 'blockedBy']) if (k in out) out[k] = [];
  const yaml = yamlOf(out);
  let text = body.replace(/<Feature name>/g, name).replace(/<date>/g, today).replace(/<feature id>/g, fm.feature).replace(/<module id>/g, fm.module).replace(/<module>/g, fm.module);
  if (taskNode) text = text.replace(/\*\*Feature:\*\* \[\[[^\]]+\]\]/, `**Task:** [[${result.notes.find((n) => n.rel === taskNode.path).stem}]] · **Feature:** [[${featureNode.title}]] · **Feature-level note:** [[${featureNode.title} ${kind.file}]]`).replace(/\[\[([^\]|]+?) (Story|Frontend Requirements|Backend Delivery|Backend Integration|Frontend Delivery|QA Backend|QA Frontend)\]\]/g, (m, who, k) => (who === name ? `[[${code} ${k}]]` : m));
  fs.writeFileSync(dest, `---\n${yaml}\n---\n${text}`);
  console.log(`wrote ${path.relative(ROOT, dest)} (status ${status}); fill it in, declare depends/affects/related, then run node scripts/build-tree.mjs`);
}

// ---------------------------------------------------------------- main
const result = build();
if (has('--scaffold')) {
  const i = args.indexOf('--scaffold');
  // the decision card is what clears "decided but has no record", so that error does not stop its own scaffold
  const blocking = args[i + 1] === 'decision' ? result.errors.filter((e) => !e.includes('is decided but has no record')) : result.errors;
  if (blocking.length) { for (const e of blocking) console.error(`error    ${e}`); process.exit(1); }
  scaffold(result, args[i + 1], args[i + 2]);
  process.exit(0);
}
if (has('--find')) {
  if (result.errors.length) for (const e of result.errors) console.error(`error    ${e}`);
  if (!result.json) process.exit(1);
  printFind(result.json, opt('--find', ''));
  process.exit(0);
}
if (has('--branch')) {
  if (result.errors.length) for (const e of result.errors) console.error(`error    ${e}`);
  if (!result.json) process.exit(1);
  const i = args.indexOf('--branch');
  const r = branchName(result.json, args[i + 1], args[i + 2], args[i + 3], loadConfig([])?.branches || {});
  if (r.error) { console.error(r.error); process.exit(1); }
  console.log(r.branch);
  process.exit(0);
}
if (has('--impact')) {
  if (result.errors.length) for (const e of result.errors) console.error(`error    ${e}`);
  const q = opt('--impact', '');
  printImpact(result.json, impact(result.json, q), q);
  process.exit(0);
}
const text = result.json ? stableStringify(result.json) : '';
// a requirements list left `ready` for staleness.readyDays or more since its `updated:`: it depends on today,
// so it is printed on every build and never written into tree.json (or `--check` would drift day by day)
const staleNotices = (() => {
  if (!result.json) return [];
  const days = result.cfg?.staleness?.readyDays ?? 3, now = Date.parse(today());
  return Object.values(result.json.nodes)
    .filter((n) => n.kind === 'frontend-requirements' && n.path && n.status === 'ready' && n.updated)
    .map((n) => ({ n, age: Math.floor((now - Date.parse(String(n.updated))) / 86_400_000) }))
    .filter((x) => x.age >= days)
    .sort((a, b) => b.age - a.age)
    .map(({ n, age }) => `${n.path}: \`ready\` since ${n.updated} (${age} days) and not reviewed: \`/backend\` approves it or sends it back to \`draft\``);
})();
for (const w of result.warnings) console.warn(`warning  ${w}`);
for (const s of staleNotices) console.warn(`stale    ${s}`);
for (const e of result.errors) console.error(`error    ${e}`);
if (result.json) {
  const c = result.json.counts;
  console.log(`modules ${c.modules} · features ${c.features} · layer notes ${c.layerNotes} (${c.taskLayerNotes} task-level) · tasks ${c.tasks} · decisions ${c.decisions} · placeholders ${c.placeholders} · blocked ${c.blocked} · concepts ${c.concepts} · notes ${c.notes} · edges ${c.edges} · warnings ${result.warnings.length} · stale ${staleNotices.length} · errors ${result.errors.length}`);
}
if (result.errors.length) { console.error('\nFix the errors above, then run again.'); process.exit(1); }

const outputs = [[JSON_PATH, text], [MD_PATH, treeMarkdown(result.json)], [CARDS_PATH, stableStringify(result.cards)], [INDEX_PATH, cardIndexMarkdown(result.json)]];
if (has('--check')) {
  const stale = outputs.filter(([p, t]) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '') !== t).map(([p]) => path.relative(ROOT, p));
  if (stale.length) {
    console.error(`\nstale: ${stale.join(', ')}. Run \`node scripts/build-tree.mjs\` and commit ${GENERATED.join(', ')}.`);
    process.exit(2);
  }
  console.log(`${GENERATED.join(', ')} are up to date.`);
  process.exit(0);
}

fs.mkdirSync(TREE_DIR, { recursive: true });
for (const [p, t] of outputs) fs.writeFileSync(p, t);
copySite(OUT_DIR, result.notes);
console.log(`wrote ${GENERATED.join(', ')} and ${path.relative(ROOT, OUT_DIR)}/`);
if (has('--serve')) serve(OUT_DIR, Number(opt('--serve', '8787')) || 8787);
