#!/usr/bin/env node
/**
 * Builds the docs tree from the vault's frontmatter and docs.config.json.
 *
 *   node scripts/build-tree.mjs                      writes tree/tree.json, tree/tree.md, tasks/Task Board.md, tasks/Backlog.md and site/
 *   node scripts/build-tree.mjs --check              validates; exit 1 on errors, 2 if the generated files are stale
 *   node scripts/build-tree.mjs --serve [port]       builds, then serves site/ on http://127.0.0.1:8787
 *   node scripts/build-tree.mjs --out DIR            writes the site somewhere else
 *   node scripts/build-tree.mjs --impact "<note|code>"   what a change to that note touches (two hops), grouped by layer
 *   node scripts/build-tree.mjs --scaffold <kind> <feature-id|T-NNN>   creates a layer note from its template
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
const BOARD_PATH = path.join(ROOT, 'tasks', 'Task Board.md');
const BACKLOG_PATH = path.join(ROOT, 'tasks', 'Backlog.md');
const GENERATED = ['tree/tree.json', 'tree/tree.md', 'tasks/Task Board.md', 'tasks/Backlog.md'];
const REPO = { owner: 'Khaled-Edlbi', name: 'social-pin-docs', branch: process.env.TREE_BRANCH || 'main' };
REPO.blobBase = `https://github.com/${REPO.owner}/${REPO.name}/blob/${REPO.branch}/`;

const SKIP_DIRS = new Set(['.git', '.obsidian', 'node_modules', 'site', 'tree', 'scripts', '.github', 'new design']);
const BAD_NAME = /[#?%\\]/;

// Structural statuses (not layer-specific). Layer kinds take theirs from docs.config.json.
const STATUS = {
  feature: { done: 'done', partial: 'partial', todo: 'todo', frontend: 'frontend-only' },
  task: { todo: 'todo', 'needs-info': 'needs-decision', blocked: 'blocked', 'in-progress': 'in-progress', done: 'done' },
  decision: { open: 'needs-decision', decided: 'approved' },
};
const LEGEND = {
  done: 'Done', partial: 'Partial', todo: 'To do', 'in-progress': 'In progress', blocked: 'Blocked',
  'needs-decision': 'Needs decision', draft: 'Draft', approved: 'Approved', verified: 'Verified', delivered: 'Delivered',
  current: 'Current', passing: 'Passing', failing: 'Failing', 'frontend-only': 'Frontend only',
  missing: 'Not written yet', reference: 'Reference',
};
const EMOJI = {
  done: '✅', partial: '🟡', todo: '⬜', 'in-progress': '🔵', blocked: '⛔', 'needs-decision': '❓',
  draft: '✏️', approved: '✅', verified: '🏁', delivered: '📦', current: '✅', passing: '🟢', failing: '🔴',
  'frontend-only': '🖼️', missing: '∅', reference: '📘',
};
const DONE_STATUSES = new Set(['done', 'approved', 'verified', 'delivered', 'current', 'passing', 'frontend-only', 'reference']);

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
  return { ...cfg, kinds, kindOrder: [...kinds.keys()] };
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
  return { ...file, stem, data, body, error, links, summary: firstParagraph(body), relatedSection: sectionLinks(body, 'Related'), concepts: data ? concepts(body, data) : [] };
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
const isTaskId = (s) => /^T-\d+[a-z]?$/.test(s);
const isDecisionId = (s) => /^D-\d+$/.test(s);
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

  const nodes = {};
  const edges = [];
  const edgeByKey = new Map();
  const addNode = (n) => { if (nodes[n.id]) { err(n.path || n.id, `duplicate node id ${n.id}`); return nodes[n.id]; } nodes[n.id] = n; return n; };
  const DIRECTED = new Set(['tree', 'depends', 'decision', 'affects', 'flow', 'blocks']);
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
    screens: list(n?.data?.screens), updated: n?.data?.updated ?? n?.data?.created ?? null, tags: list(n?.data?.tags),
    depends: [], affects: [], related: [], children: [], parents: [], summary: n?.summary ?? null, label: null, ...extra,
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
  const root = addNode(base(null, { id: 'root', kind: 'root', title: cfg.project || 'Project', path: null, file: overview?.rel ?? null, effectiveStatus: 'reference', label: 'Project', summary: overview?.summary ?? null }));

  // modules
  const moduleNodes = new Map();
  const moduleNotes = new Map(byType('module').map((n) => [n.data.id, n]));
  for (const m of cfg.modules) {
    const note = moduleNotes.get(m.id);
    if (!note) warn(`modules/${m.name}`, `no module note yet (create modules/${m.name}/${m.name} Module.md from templates/Module Template.md)`);
    else if (note.rel !== `modules/${m.name}/${m.name} Module.md`) warn(note.rel, `module note expected at modules/${m.name}/${m.name} Module.md`);
    const d = addNode(base(note, { id: `module:${m.id}`, kind: 'module', title: note?.stem ?? `${m.name} Module`, name: m.name, module: m.id, summary: note?.summary ?? m.description, label: 'Module', path: note?.rel ?? null, template: note ? null : 'templates/Module Template.md' }));
    if (note) noteOf.set(d.id, note);
    moduleNodes.set(m.id, d);
    link(root, d);
  }
  for (const n of byType('module')) if (!MODULE_BY_ID.has(n.data.id)) err(n.rel, `module id "${n.data.id}" is not in docs.config.json modules`);

  // features
  const featureNodes = new Map();
  for (const n of byType('feature')) {
    requireKeys(n, ['id', 'status', 'module']);
    const parts = n.rel.split('/');
    const folderModule = MODULE_BY_NAME.get(parts[1]);
    if (parts[0] !== 'modules' || !folderModule) err(n.rel, `feature notes live in modules/<Module>/<Feature>/<Feature>.md`);
    else if (parts[2] !== n.stem || parts[3] !== n.name) warn(n.rel, `expected at modules/${parts[1]}/${n.stem}/${n.name}`);
    const mod = n.data.module;
    if (!MODULE_BY_ID.has(mod)) err(n.rel, `module "${mod}" is not in docs.config.json modules`);
    else if (folderModule && folderModule.id !== mod) err(n.rel, `module "${mod}" does not match folder "${parts[1]}" (${folderModule.id})`);
    const status = normStatus(n, 'feature');
    const f = addNode(base(n, { id: `feature:${n.data.id}`, kind: 'feature', layer: 'business', feature: n.data.id, code: n.data.id, status, effectiveStatus: status, module: mod, label: 'Feature', name: n.data.name ?? n.stem, dir: path.posix.dirname(n.rel) }));
    noteOf.set(f.id, n);
    if (featureNodes.has(n.data.id)) err(n.rel, `second feature note with id "${n.data.id}"`);
    featureNodes.set(n.data.id, f);
    const d = moduleNodes.get(mod);
    if (d) link(d, f);
    if (!n.data.updated) warn(n.rel, 'missing "updated:"');
  }

  // tasks and decisions (nodes first; edges after the layer notes exist)
  const taskNodes = new Map();
  const taskNotes = byType('task').sort((a, b) => a.stem.localeCompare(b.stem, 'en', { numeric: true }));
  for (const n of taskNotes) {
    requireKeys(n, ['id', 'status', 'feature']);
    const status = normStatus(n, 'task');
    const t = addNode(base(n, { id: `task:${n.data.id}`, kind: 'task', layer: 'business', feature: n.data.feature, code: n.data.id, status, effectiveStatus: status, label: 'Task', decision: n.data.decision ?? null, dir: null }));
    noteOf.set(t.id, n);
    if (taskNodes.has(n.data.id)) err(n.rel, `second task note with id "${n.data.id}"`);
    taskNodes.set(n.data.id, t);
    const expectedFlat = `tasks/${n.stem}.md`, expectedDir = `tasks/${n.stem}/${n.stem}.md`;
    if (n.rel !== expectedFlat && n.rel !== expectedDir) warn(n.rel, `expected at ${expectedFlat} or ${expectedDir}`);
    if (n.rel === expectedDir) t.dir = `tasks/${n.stem}`;
    if (!n.data.updated && !n.data.created) warn(n.rel, 'missing "created:"');
  }
  const decisionNodes = new Map();
  for (const n of byType('decision')) {
    requireKeys(n, ['id', 'status', 'features']);
    const status = normStatus(n, 'decision');
    const d = addNode(base(n, { id: `decision:${n.data.id}`, kind: 'decision', layer: 'business', code: n.data.id, status, effectiveStatus: status, label: 'Decision', features: list(n.data.features) }));
    noteOf.set(d.id, n);
    decisionNodes.set(n.data.id, d);
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
      const expected = `tasks/${tnote.stem}/${container.code} ${kind.file}.md`;
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

  // tasks under features; decisions under features
  for (const [, t] of taskNodes) {
    const f = featureNodes.get(t.feature);
    if (!f) { err(t.path, `feature "${t.feature}" is not a feature id`); continue; }
    link(f, t);
    t.module = t.module ?? f.module;
    if (noteOf.get(t.id).data.module && noteOf.get(t.id).data.module !== f.module) err(t.path, `module "${t.module}" does not match the feature's module "${f.module}"`);
  }
  for (const [, d] of decisionNodes) {
    for (const fid of d.features) {
      const f = featureNodes.get(fid);
      if (!f) { err(d.path, `features: "${fid}" is not a feature id`); continue; }
      addEdge(d.id, f.id, 'decision');
      if (!d.parents.includes(f.id)) link(f, d);
    }
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
    const folder = n.rel.split('/')[0];
    const area = areaByFolder.get(folder);
    if (!area || n.rel.includes('/', folder.length + 1)) continue;
    if (['module', 'feature', 'task', 'decision'].includes(n.data.type) || KIND.has(n.data.type)) continue;
    if (n.data.layer && n.data.layer !== area.id) err(n.rel, `layer "${n.data.layer}" does not match the folder "${folder}" (${area.id})`);
    const p = addNode(base(n, { id: `project:${slugify(n.stem)}`, kind: 'project', layer: area.id, effectiveStatus: 'reference', label: n.data.type === 'map' ? 'Map' : n.data.type === 'report' ? 'Report' : 'Reference' }));
    noteOf.set(p.id, n);
    link(areaNodes.get(area.id), p);
    if (n.stem === 'Home' || n.stem === 'README') continue;
  }
  for (const n of notes) {
    if (!n.data || n.rel.startsWith('templates/')) continue;
    const t = n.data.type;
    if (t && !['module', 'feature', 'task', 'decision', 'project', 'map', 'report', 'home', 'reference'].includes(t) && !KIND.has(t)) err(n.rel, `type "${t}" is not a structural type or a kind in docs.config.json`);
  }

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
    if (featureNodes.has(r)) return { ids: [featureNodes.get(r).id], via: null };
    if (moduleNodes.has(r)) return { ids: [moduleNodes.get(r).id], via: null };
    if (byName[r]) return { ids: [byName[r]], via: null };
    const target = byStem.get(r.replace(/\.md$/, ''));
    if (target && ownerOfPath.get(target.rel)) return { ids: [ownerOfPath.get(target.rel)], via: null };
    if (conceptIndex.has(r)) return { ids: [...conceptIndex.get(r)], via: r };
    return null;
  };
  const isDone = (n) => n.effectiveStatus !== 'missing' && (DONE_STATUSES.has(n.effectiveStatus) || (KIND.has(n.kind) && KIND.get(n.kind).done.includes(n.status)));

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
          if (key === 'depends' && n.kind === 'task' && nodes[to].kind === 'decision') { const f = featureNodes.get(n.feature); if (f && !nodes[to].parents.includes(f.id)) link(f, nodes[to]); }
        }
      }
    }
    // "## Related" section links count as related
    for (const target of note.relatedSection) {
      const t = byStem.get(target);
      const to = t ? ownerOfPath.get(t.rel) : null;
      if (!to || to === id) continue;
      if (!n.related.includes(to)) n.related.push(to);
      if (!nodes[to].related.includes(id)) nodes[to].related.push(id);
      addEdge(id, to, 'related');
    }
  }

  // ---------------------------------------------------------- blocking
  const blockReason = (target) => `${target.title} is ${String(LEGEND[target.effectiveStatus] ?? target.effectiveStatus).toLowerCase()}`;
  for (const n of layerNodes) {
    const note = noteOf.get(n.id);
    const explicit = note && Array.isArray(note.data.blockedBy) ? list(note.data.blockedBy) : null;
    const refs = explicit ?? (cfg.defaultBlocks || []).filter((b) => b.kind === n.kind).map((b) => b.by);
    const blockers = [];
    for (const ref of refs) {
      const r = resolve(ref, n);
      if (!r) { if (explicit) err(note.rel, `blockedBy: "${ref}" does not resolve`); continue; }
      for (const to of r.ids) if (to !== n.id && !isDone(nodes[to])) blockers.push(to);
    }
    for (const to of n.depends) if (!isDone(nodes[to])) blockers.push(to);
    n.blockedBy = [...new Set(blockers)].map((to) => ({ id: to, title: nodes[to].title, why: blockReason(nodes[to]) }));
    for (const b of n.blockedBy) addEdge(b.id, n.id, 'blocks');
    if (n.blockedBy.length && n.path && !isDone(n)) n.effectiveStatus = 'blocked';
  }
  for (const [, t] of taskNodes) {
    const note = noteOf.get(t.id);
    const blockers = [];
    for (const ref of list(note.data.blockedBy)) { const r = resolve(ref, t); if (!r) { err(note.rel, `blockedBy: "${ref}" does not resolve`); continue; } for (const to of r.ids) if (to !== t.id && !isDone(nodes[to])) blockers.push(to); }
    for (const to of t.depends) if (!isDone(nodes[to])) blockers.push(to);
    t.blockedBy = [...new Set(blockers)].map((to) => ({ id: to, title: nodes[to].title, why: blockReason(nodes[to]) }));
    for (const b of t.blockedBy) addEdge(b.id, t.id, 'blocks');
    if (t.blockedBy.length && t.status === 'todo') t.effectiveStatus = 'blocked';
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
  const kindRank = new Map(cfg.kindOrder.map((k, i) => [k, i]));
  const rank = (n) => (kindRank.has(n.kind) ? kindRank.get(n.kind) : n.kind === 'task' ? 100 : n.kind === 'decision' ? 200 : 300);
  for (const n of [...featureNodes.values(), ...taskNodes.values()]) {
    n.children.sort((a, b) => (rank(nodes[a]) - rank(nodes[b])) || nodes[a].title.localeCompare(nodes[b].title, 'en', { numeric: true }));
  }

  // ---------------------------------------------------------- wikilinks, canvas, shares
  const treePairs = new Set(edges.filter((e) => e.kind === 'tree').map((e) => [e.from, e.to].sort().join('|')));
  const placeholderTitles = new Set(Object.values(nodes).filter((n) => n.effectiveStatus === 'missing').map((n) => n.title));
  for (const [code] of taskNodes) for (const k of KIND.values()) placeholderTitles.add(`${code} ${k.file}`); // a task's future layer notes
  for (const [, f] of featureNodes) for (const k of KIND.values()) placeholderTitles.add(`${f.title} ${k.file}`);
  for (const [id, note] of noteOf) {
    for (const l of note.links) {
      const target = byStem.get(l.target);
      if (!l.target) continue; // [[#heading]] links to itself
      if (!target) { if (!placeholderTitles.has(l.target) && !/^(https?:)|\.(canvas|png|jpg|svg)$|^(T-NNN|D-NN|<)/.test(l.target)) warn(note.rel, `wikilink [[${l.target}]] resolves to no note`); continue; }
      const to = ownerOfPath.get(target.rel);
      if (!to || to === id) continue;
      if (treePairs.has([id, to].sort().join('|'))) continue;
      addEdge(id, to, 'wikilink');
    }
  }
  const canvas = readCanvas(fileByPath, 'business/Feature Map.canvas');
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
  const containerOf = (id) => { const n = nodes[id]; if (n.kind === 'feature' || n.kind === 'task' || n.kind === 'project' || n.kind === 'decision') return id; if (n.feature && featureNodes.has(n.feature)) return n.task ? `task:${n.task}` : `feature:${n.feature}`; return null; };
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
  for (const [, t] of taskNodes) rollup(t.id);
  for (const [, f] of featureNodes) rollup(f.id);
  for (const [, d] of moduleNodes) {
    rollup(d.id);
    const feats = d.children.map((c) => nodes[c]);
    if (feats.length === 0) d.effectiveStatus = 'todo';
    else if (feats.every((f) => f.effectiveStatus === 'done' || f.effectiveStatus === 'frontend-only')) d.effectiveStatus = 'done';
    else if (Object.values(nodes).some((n) => n.kind === 'task' && n.module === d.module && n.effectiveStatus === 'in-progress')) d.effectiveStatus = 'in-progress';
    else if (feats.some((f) => f.effectiveStatus === 'done' || f.effectiveStatus === 'partial')) d.effectiveStatus = 'partial';
    else d.effectiveStatus = 'todo';
  }
  rollup(root.id);
  const mods = [...moduleNodes.values()];
  root.effectiveStatus = mods.every((d) => d.effectiveStatus === 'done') ? 'done' : mods.some((d) => d.effectiveStatus === 'in-progress') ? 'in-progress' : mods.some((d) => d.effectiveStatus === 'done' || d.effectiveStatus === 'partial') ? 'partial' : 'todo';

  const byKind = {}, byLayer = {};
  for (const n of Object.values(nodes)) { if (!n.path) continue; byKind[n.kind] = (byKind[n.kind] || 0) + 1; if (n.layer) byLayer[n.layer] = (byLayer[n.layer] || 0) + 1; }
  const counts = {
    modules: moduleNodes.size, features: featureNodes.size, tasks: taskNodes.size, decisions: decisionNodes.size,
    layerNotes: layerNodes.filter((n) => n.path).length, taskLayerNotes: layerNodes.filter((n) => n.path && n.scope === 'task').length,
    placeholders: Object.values(nodes).filter((n) => n.effectiveStatus === 'missing').length,
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
      schema: 2, repo: REPO, rootId: 'root', counts, legend: LEGEND, emoji: EMOJI, layers: layersOut, flow: cfg.flow, defaultBlocks: cfg.defaultBlocks,
      modules: cfg.modules, generated: GENERATED, nodes, edges, concepts: conceptsOut, byName, files: filesIndex, diagnostics: { errors, warnings },
    },
    errors, warnings, notes, cfg,
  };
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

const mdLink = (n) => { const target = n.path || n.file; return target ? `[${n.title}](${target.split('/').map(encodeURIComponent).join('/')})` : `_${n.title}_`; };

function treeMarkdown(json) {
  const { nodes } = json;
  const lines = ['# Docs tree', '', 'Generated by `node scripts/build-tree.mjs` from the notes\' frontmatter and `docs.config.json`. Do not edit; edit the notes. Status key: ' +
    Object.entries(EMOJI).map(([k, e]) => `${e} ${LEGEND[k]}`).join(' · '), '',
    'Layers: ' + json.layers.map((l) => `**${l.label}** (${l.kinds.map((k) => k.label).join(', ')})`).join(' · '), ''];
  const seen = new Set();
  const walkNode = (id, depth) => {
    const n = nodes[id];
    const extra = [n.label && !['feature', 'module', 'task'].includes(n.kind) ? n.label : null, n.priority, n.blockedBy?.length ? `blocked by ${n.blockedBy.map((b) => b.title).join(', ')}` : null].filter(Boolean).join(', ');
    lines.push(`${'  '.repeat(depth)}- ${EMOJI[n.effectiveStatus] || '•'} ${mdLink(n)}${extra ? ` (${extra})` : ''}`);
    if (seen.has(id) && n.children.length) { lines.push(`${'  '.repeat(depth + 1)}- (see above)`); return; }
    seen.add(id);
    for (const c of n.children) walkNode(c, depth + 1);
  };
  walkNode(json.rootId, 0);
  lines.push('');
  return lines.join('\n');
}

const taskRows = (json) => Object.values(json.nodes).filter((n) => n.kind === 'task').sort((a, b) => a.code.localeCompare(b.code, 'en', { numeric: true }));
const prioRank = (p) => ({ P0: 0, P1: 1, P2: 2, P3: 3 }[p] ?? 9);
const wiki = (n, alias) => `[[${n.title}${alias ? `|${alias}` : ''}]]`;

function boardMarkdown(json) {
  const cols = [['needs-decision', '❓ Needs a decision / info'], ['blocked', '⛔ Blocked'], ['todo', '⬜ To do'], ['in-progress', '🔵 In progress'], ['done', '✅ Done']];
  const lines = ['---', '', 'kanban-plugin: board', '', '---', '', '<!-- Generated by `node scripts/build-tree.mjs` from the task notes. Do not edit; change the task\'s frontmatter. -->', ''];
  for (const [status, title] of cols) {
    lines.push(`## ${title}`, '');
    const rows = taskRows(json).filter((t) => t.effectiveStatus === status).sort((a, b) => prioRank(a.priority) - prioRank(b.priority) || a.code.localeCompare(b.code, 'en', { numeric: true }));
    for (const t of rows) lines.push(`- [${status === 'done' ? 'x' : ' '}] ${wiki(t)} #${t.priority ?? 'P?'} #${t.feature}`);
    lines.push('', '');
  }
  lines.push('%% kanban:settings', '```', '{"kanban-plugin":"board"}', '```', '%%', '');
  return lines.join('\n');
}

function backlogMarkdown(json) {
  const { nodes } = json;
  const featureTitle = (t) => { const f = nodes[`feature:${t.feature}`]; return f ? wiki(f) : t.feature; };
  const moduleName = (t) => json.modules.find((m) => m.id === t.module)?.name ?? t.module ?? '—';
  const dep = (t) => (t.depends.length ? t.depends.map((d) => wiki(nodes[d], nodes[d].code)).join(', ') : '—');
  const status = (t) => `${EMOJI[t.effectiveStatus]} ${LEGEND[t.effectiveStatus]}`;
  const lines = ['---', 'type: map', 'layer: shared', 'tags: [map]', '---', '', '# Backlog', '',
    'Generated by `node scripts/build-tree.mjs` from the task notes; do not edit, change the task\'s frontmatter. Every open task ordered by priority, then the done ones. Status key: ⬜ To do · ❓ Needs a decision / info · ⛔ Blocked · 🔵 In progress · ✅ Done. A task is ⛔ when something in `depends` or `blockedBy` is not done.', '',
    'Columns as a board: [[Task Board]] (Kanban plugin format; also readable as a plain checklist).', ''];
  const open = taskRows(json).filter((t) => t.effectiveStatus !== 'done');
  for (const p of ['P0', 'P1', 'P2', 'P3']) {
    const rows = open.filter((t) => (t.priority ?? 'P3') === p);
    if (!rows.length) continue;
    lines.push(`## ${p}`, '', '| Task | Feature | Module | Status | Effort | Depends on / blocked by |', '|---|---|---|---|---|---|');
    for (const t of rows) lines.push(`| ${wiki(t)} | ${featureTitle(t)} | ${moduleName(t)} | ${status(t)} | ${t.effort ?? '—'} | ${t.blockedBy.length ? t.blockedBy.map((b) => wiki(nodes[b.id], nodes[b.id].code ?? nodes[b.id].title)).join(', ') : dep(t)} |`);
    lines.push('');
  }
  const done = taskRows(json).filter((t) => t.effectiveStatus === 'done');
  lines.push('## Done', '', '| Task | Feature | Module | Effort |', '|---|---|---|---|');
  for (const t of done) lines.push(`| ${wiki(t)} | ${featureTitle(t)} | ${moduleName(t)} | ${t.effort ?? '—'} |`);
  lines.push('');
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
  const assets = path.join(ROOT, 'design', 'assets');
  if (fs.existsSync(assets)) fs.cpSync(assets, path.join(outDir, 'notes', 'design', 'assets'), { recursive: true });
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
  for (const n of Object.values(nodes)) if (n.title === q || n.code === q || n.path === q || n.id === q) { start = n; break; }
  if (!start) for (const n of Object.values(nodes)) if (n.title?.toLowerCase().startsWith(q.toLowerCase())) { start = n; break; }
  if (!start) return null;
  const REL = ['related', 'affects', 'depends', 'blocks', 'flow', 'shares', 'decision', 'wikilink'];
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
  const first = hop([...family]);
  for (const id of family) first.delete(id);
  const second = hop([...first.keys()]);
  for (const id of [...family, ...first.keys()]) second.delete(id);
  const dependents = Object.values(nodes).filter((n) => n.depends.includes(start.id) || n.blockedBy.some((b) => b.id === start.id));
  return { start, family: [...family].map((id) => nodes[id]), first, second, dependents };
}

function printImpact(json, r, query) {
  if (!r) { console.error(`nothing named "${query}" (try a note name, a task or decision id, a feature id, or a concept like E_RING_02 / "GET /rings/:id" / s14)`); process.exit(1); }
  const { nodes } = json;
  const layerOf = (n) => n.layer ?? 'business';
  const line = (n) => `${EMOJI[n.effectiveStatus] || '•'} ${n.title}${n.code && n.code !== n.title ? ` (${n.code})` : ''}${n.path ? ` — ${n.path}` : ''}`;
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

// ---------------------------------------------------------------- scaffold
function scaffold(result, kindId, code) {
  const { cfg, json } = result;
  const kind = cfg.kinds.get(kindId);
  if (!kind) { console.error(`unknown kind "${kindId}"; kinds in docs.config.json: ${cfg.kindOrder.join(', ')}`); process.exit(1); }
  const nodes = json.nodes;
  const template = fs.readFileSync(path.join(ROOT, kind.template), 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  let dest, fm, name, featureNode, taskNode = null;
  if (isTaskId(code)) {
    taskNode = nodes[`task:${code}`];
    if (!taskNode) { console.error(`no task ${code}`); process.exit(1); }
    featureNode = nodes[`feature:${taskNode.feature}`];
    const note = result.notes.find((n) => n.rel === taskNode.path);
    const dir = path.join(ROOT, 'tasks', note.stem);
    if (!taskNode.dir) { fs.mkdirSync(dir, { recursive: true }); fs.renameSync(note.abs, path.join(dir, note.name)); console.log(`moved ${note.rel} → tasks/${note.stem}/${note.name}`); }
    dest = path.join(dir, `${code} ${kind.file}.md`);
    name = `${code} · ${note.stem.replace(/^T-\d+[a-z]?\s+/, '')}`;
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
  const out = { ...data, ...fm, status, screens: featureNode?.screens ?? [], updated: today, tags: [kind.id, `${kind.id}/${status}`, `module/${fm.module}`, `layer/${kind.layer}`] };
  for (const k of ['depends', 'affects', 'related', 'blockedBy']) if (k in out) out[k] = [];
  const yaml = Object.entries(out).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(', ')}]` : typeof v === 'string' && (/[:#]/.test(v) || v === '') ? JSON.stringify(v) : v}`).join('\n');
  let text = body.replace(/<Feature name>/g, name).replace(/<date>/g, today).replace(/<feature id>/g, fm.feature).replace(/<module id>/g, fm.module).replace(/<module>/g, fm.module);
  if (taskNode) text = text.replace(/\*\*Feature:\*\* \[\[[^\]]+\]\]/, `**Task:** [[${result.notes.find((n) => n.rel === taskNode.path).stem}]] · **Feature:** [[${featureNode.title}]] · **Feature-level note:** [[${featureNode.title} ${kind.file}]]`).replace(/\[\[([^\]|]+?) (Story|Frontend Requirements|Backend Delivery|Backend Integration|Frontend Delivery|QA Backend|QA Frontend)\]\]/g, (m, who, k) => (who === name ? `[[${code} ${k}]]` : m));
  fs.writeFileSync(dest, `---\n${yaml}\n---\n${text}`);
  console.log(`wrote ${path.relative(ROOT, dest)} (status ${status}); fill it in, declare depends/affects/related, then run node scripts/build-tree.mjs`);
}

// ---------------------------------------------------------------- main
const result = build();
if (has('--scaffold')) {
  if (result.errors.length) { for (const e of result.errors) console.error(`error    ${e}`); process.exit(1); }
  const i = args.indexOf('--scaffold');
  scaffold(result, args[i + 1], args[i + 2]);
  process.exit(0);
}
if (has('--impact')) {
  if (result.errors.length) for (const e of result.errors) console.error(`error    ${e}`);
  const q = opt('--impact', '');
  printImpact(result.json, impact(result.json, q), q);
  process.exit(0);
}
const text = result.json ? stableStringify(result.json) : '';
for (const w of result.warnings) console.warn(`warning  ${w}`);
for (const e of result.errors) console.error(`error    ${e}`);
if (result.json) {
  const c = result.json.counts;
  console.log(`modules ${c.modules} · features ${c.features} · layer notes ${c.layerNotes} (${c.taskLayerNotes} task-level) · tasks ${c.tasks} · decisions ${c.decisions} · placeholders ${c.placeholders} · blocked ${c.blocked} · concepts ${c.concepts} · notes ${c.notes} · edges ${c.edges} · warnings ${result.warnings.length} · errors ${result.errors.length}`);
}
if (result.errors.length) { console.error('\nFix the errors above, then run again.'); process.exit(1); }

const outputs = [[JSON_PATH, text], [MD_PATH, treeMarkdown(result.json)], [BOARD_PATH, boardMarkdown(result.json)], [BACKLOG_PATH, backlogMarkdown(result.json)]];
if (has('--check')) {
  const stale = outputs.filter(([p, t]) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '') !== t).map(([p]) => path.relative(ROOT, p));
  if (stale.length) {
    console.error(`\nstale: ${stale.join(', ')}. Run \`node scripts/build-tree.mjs\` and commit ${GENERATED.join(', ')}.`);
    process.exit(2);
  }
  console.log('tree/tree.json, tree/tree.md, tasks/Task Board.md and tasks/Backlog.md are up to date.');
  process.exit(0);
}

fs.mkdirSync(TREE_DIR, { recursive: true });
for (const [p, t] of outputs) fs.writeFileSync(p, t);
copySite(OUT_DIR, result.notes);
console.log(`wrote ${GENERATED.join(', ')} and ${path.relative(ROOT, OUT_DIR)}/`);
if (has('--serve')) serve(OUT_DIR, Number(opt('--serve', '8787')) || 8787);
