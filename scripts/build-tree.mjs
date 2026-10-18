#!/usr/bin/env node
/**
 * Builds the docs tree from the vault's frontmatter.
 *
 *   node scripts/build-tree.mjs            writes tree/tree.json, tree/tree.md and site/
 *   node scripts/build-tree.mjs --check    validates and exits 1 on errors, 2 if tree/tree.json is stale
 *   node scripts/build-tree.mjs --serve    builds, then serves site/ on http://127.0.0.1:8787
 *   node scripts/build-tree.mjs --out DIR  writes the site somewhere else
 *
 * No dependencies: Node 22 built-ins only. The output is key-sorted and carries
 * no timestamps, so it changes only when a note changes.
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
const REPO = { owner: 'Khaled-Edlbi', name: 'social-pin-docs', branch: process.env.TREE_BRANCH || 'main' };
REPO.blobBase = `https://github.com/${REPO.owner}/${REPO.name}/blob/${REPO.branch}/`;

const SKIP_DIRS = new Set(['.git', '.obsidian', 'node_modules', 'site', 'tree', 'scripts', '.github']);
const DOMAINS = [
  ['Identity Core', 'identity', 'Account, profile, Rings, what each Ring shows, and the access engine.'],
  ['Connections', 'connections', 'Connect requests after a scan, accept into a Ring, blocks, contacts.'],
  ['Shared Rings & Companies', 'shared-rings', 'Rings owned by someone else that you belong to: invitations, joining, companies, delegated admins.'],
  ['Discovery', 'discovery', 'Badge / QR, Discover hub, PinCast proximity broadcast, nearby by Ring.'],
  ['Events', 'events', 'Before the event, during, exhibitor tools, post-event.'],
  ['Meetings', 'meetings', 'Availability slots, slot-based requests, temporary meeting Rings, calendar.'],
  ['Commerce', 'commerce', 'Orders, payments, Free vs Pro.'],
  ['Platform & Cross-cutting', 'platform', 'Notifications, Gemma, devices, interests, code delivery, errors, jobs, tests.'],
];
const DOMAIN_BY_FOLDER = new Map(DOMAINS.map(([f, s]) => [f, s]));
const DOMAIN_FOLDER = new Map(DOMAINS.map(([f, s]) => [s, f]));

const STATUS = {
  feature: { done: 'done', partial: 'partial', todo: 'todo', frontend: 'frontend-only' },
  task: { todo: 'todo', 'needs-info': 'needs-decision', blocked: 'blocked', 'in-progress': 'in-progress', done: 'done' },
  decision: { open: 'needs-decision', decided: 'approved' },
  story: { draft: 'draft', approved: 'approved' },
  requirements: { draft: 'draft', approved: 'approved' },
};
const LEGEND = {
  done: 'Done', partial: 'Partial', todo: 'To do', 'in-progress': 'In progress', blocked: 'Blocked',
  'needs-decision': 'Needs decision', draft: 'Draft', approved: 'Approved', 'frontend-only': 'Frontend only',
  missing: 'Not written yet', reference: 'Reference',
};
const EMOJI = {
  done: '✅', partial: '🟡', todo: '⬜', 'in-progress': '🔵', blocked: '⛔', 'needs-decision': '❓',
  draft: '✏️', approved: '✅', 'frontend-only': '🖼️', missing: '∅', reference: '📘',
};
const KIND_LABEL = { docs: 'Docs', story: 'User Story', requirements: 'Frontend Requirements', frontend: 'API Integration' };
const BAD_NAME = /[#?%\\]/;

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
    if (entry.name.startsWith('.') && entry.name !== '.github') { if (SKIP_DIRS.has(entry.name)) continue; }
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
  // target#heading|alias, with \| allowed inside tables
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

function sectionLinks(body, heading) {
  const re = new RegExp(`^##\\s+${heading}\\s*$`, 'm');
  const m = re.exec(body);
  if (!m) return [];
  const rest = body.slice(m.index + m[0].length);
  const end = rest.search(/^##?\s/m);
  const section = end >= 0 ? rest.slice(0, end) : rest;
  return [...section.matchAll(WIKI)].filter((x) => !x[1]).map((x) => parseWikilink(x[2]).target);
}

function loadNote(file) {
  const text = fs.readFileSync(file.abs, 'utf8');
  const { data, body, error } = parseFrontmatter(text);
  const stem = file.name.replace(/\.md$/, '');
  const links = [...body.matchAll(WIKI)].filter((x) => !x[1]).map((x) => parseWikilink(x[2]));
  return { ...file, stem, data, body, error, links, summary: firstParagraph(body), related: sectionLinks(body, 'Related') };
}

function readCanvas(fileByPath) {
  const p = path.join(ROOT, 'features', 'Feature Map.canvas');
  const pairs = [];
  const warnings = [];
  if (!fs.existsSync(p)) return { pairs, warnings };
  let canvas;
  try { canvas = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { warnings.push(`features/Feature Map.canvas: ${e.message}`); return { pairs, warnings }; }
  const byNode = new Map();
  for (const n of canvas.nodes || []) {
    if (n.type !== 'file') continue;
    const note = fileByPath.get(n.file);
    if (!note) { warnings.push(`features/Feature Map.canvas: node ${n.id} points at missing file ${n.file}`); continue; }
    byNode.set(n.id, note);
  }
  for (const e of canvas.edges || []) {
    const a = byNode.get(e.fromNode), b = byNode.get(e.toNode);
    if (a && b) pairs.push([a, b]);
  }
  return { pairs, warnings };
}

// ---------------------------------------------------------------- build
function build() {
  const errors = [];
  const warnings = [];
  const err = (f, m) => errors.push(`${f}: ${m}`);
  const warn = (f, m) => warnings.push(`${f}: ${m}`);

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
  const addNode = (n) => { if (nodes[n.id]) { err(n.path || n.id, `duplicate node id ${n.id}`); return nodes[n.id]; } nodes[n.id] = n; return n; };
  const edgeKey = new Set();
  const addEdge = (from, to, kind) => {
    if (!from || !to || from === to) return;
    const k = kind === 'tree' || kind === 'depends' || kind === 'decision' ? `${kind}|${from}|${to}` : `${kind}|${[from, to].sort().join('|')}`;
    if (edgeKey.has(k)) return;
    edgeKey.add(k);
    edges.push({ from, to, kind });
  };
  const base = (n, extra) => ({
    id: null, kind: null, title: n ? n.stem : null, path: n ? n.rel : null, status: null, effectiveStatus: null, blockedBy: null,
    priority: n?.data?.priority ?? null, effort: n?.data?.effort ?? null, domain: n?.data?.domain ?? null, feature: null,
    screens: Array.isArray(n?.data?.screens) ? n.data.screens : [], updated: n?.data?.updated ?? null, tags: Array.isArray(n?.data?.tags) ? n.data.tags : [],
    depends: [], children: [], parents: [], summary: n?.summary ?? null, label: null, ...extra,
  });

  // group notes by type
  const byType = (t) => notes.filter((n) => n.data && n.data.type === t && !n.rel.startsWith('templates/'));
  const requireKeys = (n, keys) => { for (const k of keys) if (n.data[k] === undefined || n.data[k] === null || n.data[k] === '') err(n.rel, `missing frontmatter key "${k}"`); };
  const normStatus = (n, type) => {
    const map = STATUS[type];
    const raw = n.data.status;
    if (raw === undefined || raw === null) { err(n.rel, 'missing frontmatter key "status"'); return null; }
    if (!map[raw]) { err(n.rel, `unknown status "${raw}" for type ${type} (allowed: ${Object.keys(map).join(', ')})`); return null; }
    return map[raw];
  };

  // root
  const root = addNode(base(byStem.get('Home') || null, {
    id: 'root', kind: 'root', title: 'Social Pin', path: null, file: byStem.get('Project Overview')?.rel ?? null, effectiveStatus: 'reference', label: 'Project',
    summary: byStem.get('Project Overview')?.summary ?? null,
  }));

  // domains
  const domainNode = new Map();
  for (const [folder, slug, blurb] of DOMAINS) {
    const d = addNode(base(null, { id: `domain:${slug}`, kind: 'domain', title: folder, domain: slug, summary: blurb, label: 'Domain', path: null, file: byStem.get('Feature Tree')?.rel ?? null, heading: folder }));
    domainNode.set(slug, d);
    root.children.push(d.id); d.parents.push(root.id); addEdge(root.id, d.id, 'tree');
  }

  // features
  const featureNodes = new Map();
  for (const n of byType('feature')) {
    requireKeys(n, ['id', 'status']);
    const folder = n.rel.split('/')[1];
    const slug = DOMAIN_BY_FOLDER.get(folder);
    if (!slug) err(n.rel, `feature folder "${folder}" is not a known domain (${[...DOMAIN_BY_FOLDER.keys()].join(', ')})`);
    else if (n.data.domain && n.data.domain !== slug) err(n.rel, `domain "${n.data.domain}" does not match folder "${folder}" (${slug})`);
    const status = normStatus(n, 'feature');
    const f = addNode(base(n, { id: `feature:${n.data.id}`, kind: 'feature', feature: n.data.id, status, effectiveStatus: status, domain: slug ?? n.data.domain, label: 'Feature', name: n.data.name ?? n.stem }));
    featureNodes.set(n.data.id, f);
    const d = domainNode.get(slug);
    if (d) { d.children.push(f.id); f.parents.push(d.id); addEdge(d.id, f.id, 'tree'); }
    if (!n.data.updated) warn(n.rel, 'missing "updated:"');
    // docs alias child
    const docs = addNode(base(n, { id: `docs:${n.data.id}`, kind: 'docs', feature: n.data.id, status, effectiveStatus: status, domain: f.domain, label: KIND_LABEL.docs, aliasOf: f.id }));
    f.children.push(docs.id); docs.parents.push(f.id); addEdge(f.id, docs.id, 'tree');
  }
  const featureIds = new Set(featureNodes.keys());

  // story / requirements / frontend, joined on id
  const attach = (type, kind) => {
    const seen = new Set();
    for (const n of byType(type)) {
      requireKeys(n, ['id']);
      const fid = n.data.id;
      const f = featureNodes.get(fid);
      if (!f) { err(n.rel, `id "${fid}" is not a feature id`); continue; }
      if (seen.has(fid)) { err(n.rel, `second ${type} note for feature "${fid}"`); continue; }
      seen.add(fid);
      if (type !== 'frontend') {
        requireKeys(n, ['feature', 'status']);
        if (n.data.feature !== fid) err(n.rel, `feature "${n.data.feature}" must equal id "${fid}"`);
      } else if (n.data.feature !== undefined && n.data.feature !== fid) {
        warn(n.rel, `feature: holds "${n.data.feature}" (a display name); use the id "${fid}"`);
      }
      if (n.data.domain && n.data.domain !== f.domain) err(n.rel, `domain "${n.data.domain}" does not match the feature's domain "${f.domain}"`);
      if (!n.data.updated) warn(n.rel, 'missing "updated:"');
      let status = null;
      if (type === 'frontend') status = null; else status = normStatus(n, type);
      const backendReady = f.effectiveStatus === 'done' || f.effectiveStatus === 'frontend-only';
      let effective = status ?? (backendReady ? 'done' : 'todo');
      let blockedBy = null;
      if (!backendReady) { effective = 'blocked'; blockedBy = 'backend'; }
      const c = addNode(base(n, { id: `${kind}:${fid}`, kind, feature: fid, status, effectiveStatus: effective, blockedBy, domain: f.domain, label: KIND_LABEL[kind] }));
      f.children.push(c.id); c.parents.push(f.id); addEdge(f.id, c.id, 'tree');
    }
    // placeholders
    for (const [fid, f] of featureNodes) {
      if (seen.has(fid)) continue;
      const tpl = { story: 'templates/Story Template.md', requirements: 'templates/Requirements Template.md', frontend: 'templates/Frontend Template.md' }[kind];
      warn(f.path, `no ${type} note yet (create it from ${tpl})`);
      const backendReady = f.effectiveStatus === 'done' || f.effectiveStatus === 'frontend-only';
      const c = addNode(base(null, {
        id: `${kind}:${fid}`, kind, feature: fid, title: `${f.name ?? f.title} ${{ story: 'Story', requirements: 'Requirements', frontend: 'Frontend' }[kind]}`,
        path: null, template: tpl, status: null, effectiveStatus: 'missing', blockedBy: backendReady ? null : 'backend', domain: f.domain, label: KIND_LABEL[kind],
        summary: `Not written yet. Create it from ${tpl}.`,
      }));
      f.children.push(c.id); c.parents.push(f.id); addEdge(f.id, c.id, 'tree');
    }
  };
  attach('story', 'story');
  attach('requirements', 'requirements');
  attach('frontend', 'frontend');

  // tasks
  const taskNodes = new Map();
  const taskNotes = byType('task').sort((a, b) => a.stem.localeCompare(b.stem, 'en', { numeric: true }));
  for (const n of taskNotes) {
    requireKeys(n, ['id', 'status', 'feature']);
    const status = normStatus(n, 'task');
    const t = addNode(base(n, { id: `task:${n.data.id}`, kind: 'task', feature: n.data.feature, status, effectiveStatus: status, label: 'Task', decision: n.data.decision ?? null }));
    taskNodes.set(n.data.id, t);
    if (!n.data.updated && !n.data.created) warn(n.rel, 'missing "created:"');
  }
  const decisionNodes = new Map();
  for (const n of byType('decision')) {
    requireKeys(n, ['id', 'status', 'features']);
    const status = normStatus(n, 'decision');
    const d = addNode(base(n, { id: `decision:${n.data.id}`, kind: 'decision', status, effectiveStatus: status, label: 'Decision', features: Array.isArray(n.data.features) ? n.data.features : [] }));
    decisionNodes.set(n.data.id, d);
  }
  const resolveRef = (ref) => (taskNodes.get(ref) || decisionNodes.get(ref) || null);

  for (const [, t] of taskNodes) {
    const f = featureNodes.get(t.feature);
    if (!f) { err(t.path, `feature "${t.feature}" is not a feature id`); continue; }
    f.children.push(t.id); t.parents.push(f.id); addEdge(f.id, t.id, 'tree');
    const note = fileByPath.get(t.path);
    const deps = Array.isArray(note.data.depends) ? note.data.depends : [];
    if (t.decision) deps.push(t.decision);
    for (const ref of deps) {
      const target = resolveRef(ref);
      if (!target) { err(t.path, `depends on "${ref}", which is not a task or decision id`); continue; }
      if (!t.depends.includes(target.id)) t.depends.push(target.id);
      addEdge(t.id, target.id, 'depends');
      if (target.kind === 'decision' && !target.parents.includes(f.id)) { f.children.push(target.id); target.parents.push(f.id); addEdge(f.id, target.id, 'tree'); }
    }
    if (t.status === 'todo' && t.depends.some((d) => nodes[d].kind === 'decision' && nodes[d].effectiveStatus === 'needs-decision')) {
      t.blockedBy = 'decision';
    }
    t.domain = t.domain ?? f.domain;
  }
  for (const [, d] of decisionNodes) {
    for (const fid of d.features) {
      const f = featureNodes.get(fid);
      if (!f) { err(d.path, `features: "${fid}" is not a feature id`); continue; }
      addEdge(d.id, f.id, 'decision');
      if (!d.parents.includes(f.id)) { f.children.push(d.id); d.parents.push(f.id); addEdge(f.id, d.id, 'tree'); }
    }
  }
  // order feature children: docs, story, requirements, frontend, tasks, decisions
  const rank = { docs: 0, story: 1, requirements: 2, frontend: 3, task: 4, decision: 5 };
  for (const [, f] of featureNodes) {
    f.children.sort((a, b) => (rank[nodes[a].kind] - rank[nodes[b].kind]) || nodes[a].title.localeCompare(nodes[b].title, 'en', { numeric: true }));
  }

  // project docs group
  const group = addNode(base(null, { id: 'group:project', kind: 'group', title: 'Project docs', effectiveStatus: 'reference', label: 'Group', summary: 'The product, the architecture, the Ring access model, conventions and the workflow.', path: null, file: byStem.get('Home')?.rel ?? null }));
  root.children.push(group.id); group.parents.push(root.id); addEdge(root.id, group.id, 'tree');
  for (const n of notes.filter((x) => x.rel.startsWith('project/') && x.data)) {
    const slug = n.stem.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const p = addNode(base(n, { id: `project:${slug}`, kind: 'project', effectiveStatus: 'reference', label: 'Project note' }));
    group.children.push(p.id); p.parents.push(group.id); addEdge(group.id, p.id, 'tree');
  }

  // byName (wikilink name -> node) and files (every md)
  const byName = {};
  const ownerOfPath = new Map();
  for (const n of Object.values(nodes)) {
    if (!n.path || n.aliasOf) continue;
    ownerOfPath.set(n.path, n.id);
  }
  for (const [stem, note] of byStem) { const id = ownerOfPath.get(note.rel); if (id) byName[stem] = id; }
  const filesIndex = {};
  for (const n of notes) filesIndex[n.rel] = { name: n.stem, type: n.data?.type ?? null };

  // wikilink and related edges
  const treePairs = new Set(edges.filter((e) => e.kind === 'tree').map((e) => [e.from, e.to].sort().join('|')));
  for (const n of notes) {
    const from = ownerOfPath.get(n.rel);
    if (!from) continue;
    const relatedSet = new Set(n.related);
    for (const l of n.links) {
      const target = byStem.get(l.target);
      if (!target) { if (!/^(https?:)|\.(canvas|png|jpg|svg)$/.test(l.target)) warn(n.rel, `wikilink [[${l.target}]] resolves to no note`); continue; }
      const to = ownerOfPath.get(target.rel);
      if (!to || to === from) continue;
      if (treePairs.has([from, to].sort().join('|'))) continue;
      addEdge(from, to, relatedSet.has(l.target) && nodes[from].kind === 'feature' && nodes[to].kind === 'feature' ? 'related' : 'wikilink');
    }
  }
  const canvas = readCanvas(fileByPath);
  warnings.push(...canvas.warnings);
  for (const [a, b] of canvas.pairs) {
    const from = ownerOfPath.get(a.rel), to = ownerOfPath.get(b.rel);
    if (from && to && !treePairs.has([from, to].sort().join('|'))) addEdge(from, to, 'related');
  }
  // a related pair wins over a wikilink pair
  const relatedPairs = new Set(edges.filter((e) => e.kind === 'related').map((e) => [e.from, e.to].sort().join('|')));
  for (let i = edges.length - 1; i >= 0; i--) {
    const e = edges[i];
    if (e.kind === 'wikilink' && relatedPairs.has([e.from, e.to].sort().join('|'))) edges.splice(i, 1);
  }

  // rollups
  const rollup = (id, seen = new Set()) => {
    const n = nodes[id];
    const counts = {};
    const visit = (cid) => {
      if (seen.has(cid)) return;
      seen.add(cid);
      const c = nodes[cid];
      counts[c.effectiveStatus] = (counts[c.effectiveStatus] || 0) + 1;
      for (const g of c.children) visit(g);
    };
    for (const c of n.children) visit(c);
    n.rollup = counts;
  };
  for (const [, f] of featureNodes) rollup(f.id);
  for (const [, d] of domainNode) {
    rollup(d.id);
    const feats = d.children.map((c) => nodes[c]);
    if (feats.length === 0) d.effectiveStatus = 'todo';
    else if (feats.every((f) => f.effectiveStatus === 'done' || f.effectiveStatus === 'frontend-only')) d.effectiveStatus = 'done';
    else if (Object.values(nodes).some((n) => n.kind === 'task' && n.domain === d.domain && n.effectiveStatus === 'in-progress')) d.effectiveStatus = 'in-progress';
    else if (feats.some((f) => f.effectiveStatus === 'done' || f.effectiveStatus === 'partial')) d.effectiveStatus = 'partial';
    else d.effectiveStatus = 'todo';
  }
  rollup(root.id);
  const doms = [...domainNode.values()];
  root.effectiveStatus = doms.every((d) => d.effectiveStatus === 'done') ? 'done' : doms.some((d) => d.effectiveStatus === 'in-progress') ? 'in-progress' : doms.some((d) => d.effectiveStatus === 'done' || d.effectiveStatus === 'partial') ? 'partial' : 'todo';

  const counts = {
    features: featureNodes.size, tasks: taskNodes.size, decisions: decisionNodes.size,
    stories: Object.values(nodes).filter((n) => n.kind === 'story' && n.path).length,
    requirements: Object.values(nodes).filter((n) => n.kind === 'requirements' && n.path).length,
    frontend: Object.values(nodes).filter((n) => n.kind === 'frontend' && n.path).length,
    placeholders: Object.values(nodes).filter((n) => n.effectiveStatus === 'missing').length,
    notes: notes.length, edges: edges.length,
  };
  // stable ordering of edges
  edges.sort((a, b) => a.kind.localeCompare(b.kind) || a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
  warnings.sort();
  errors.sort();

  return {
    json: { schema: 1, repo: REPO, rootId: 'root', counts, legend: LEGEND, nodes, edges, byName, files: filesIndex, diagnostics: { errors, warnings } },
    errors, warnings, notes,
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

function treeMarkdown(json) {
  const { nodes } = json;
  const lines = ['# Docs tree', '', 'Generated by `node scripts/build-tree.mjs` from the notes\' frontmatter. Do not edit; edit the notes. Status key: ' +
    Object.entries(EMOJI).map(([k, e]) => `${e} ${LEGEND[k]}`).join(' · '), ''];
  const seen = new Set();
  const walkNode = (id, depth) => {
    const n = nodes[id];
    const target = n.path || n.file;
    const link = target ? `[${n.title}](${target.split('/').map(encodeURIComponent).join('/')})` : `_${n.title}_`;
    const extra = [n.label && n.kind !== 'feature' && n.kind !== 'domain' ? n.label : null, n.priority, n.blockedBy ? `blocked by ${n.blockedBy}` : null].filter(Boolean).join(', ');
    lines.push(`${'  '.repeat(depth)}- ${EMOJI[n.effectiveStatus] || '•'} ${link}${extra ? ` (${extra})` : ''}`);
    if (seen.has(id) && n.children.length) { lines.push(`${'  '.repeat(depth + 1)}- (see above)`); return; }
    seen.add(id);
    for (const c of n.children) walkNode(c, depth + 1);
  };
  walkNode(json.rootId, 0);
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

// ---------------------------------------------------------------- main
const result = build();
const text = stableStringify(result.json);
for (const w of result.warnings) console.warn(`warning  ${w}`);
for (const e of result.errors) console.error(`error    ${e}`);
const c = result.json.counts;
console.log(`features ${c.features} · stories ${c.stories} · requirements ${c.requirements} · api notes ${c.frontend} · tasks ${c.tasks} · decisions ${c.decisions} · placeholders ${c.placeholders} · notes ${c.notes} · edges ${c.edges} · warnings ${result.warnings.length} · errors ${result.errors.length}`);

if (result.errors.length) { console.error('\nFix the errors above, then run again.'); process.exit(1); }

if (has('--check')) {
  const current = fs.existsSync(JSON_PATH) ? fs.readFileSync(JSON_PATH, 'utf8') : '';
  if (current !== text) {
    console.error('\ntree/tree.json is stale. Run `node scripts/build-tree.mjs` and commit tree/tree.json and tree/tree.md.');
    process.exit(2);
  }
  console.log('tree/tree.json is up to date.');
  process.exit(0);
}

fs.mkdirSync(TREE_DIR, { recursive: true });
fs.writeFileSync(JSON_PATH, text);
fs.writeFileSync(MD_PATH, treeMarkdown(result.json));
copySite(OUT_DIR, result.notes);
console.log(`wrote tree/tree.json, tree/tree.md and ${path.relative(ROOT, OUT_DIR)}/`);
if (has('--serve')) serve(OUT_DIR, Number(opt('--serve', '8787')) || 8787);
