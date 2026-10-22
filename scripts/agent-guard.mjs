#!/usr/bin/env node
/**
 * The agent guard: keeps each agent of the vault inside the files its layer owns.
 *
 *   node scripts/agent-guard.mjs prompt     UserPromptSubmit hook: "/owner", "/pm", "/backend", "/frontend", "/qa" make that agent active;
 *                                            "/agent off" clears it; "/agent" prints the active one. A plain prompt keeps the active agent.
 *   node scripts/agent-guard.mjs session    SessionStart hook: a new session starts with no active agent
 *   node scripts/agent-guard.mjs check      PreToolUse hook on Edit / Write: exit 2 (blocked) when the active agent may not write that file
 *   node scripts/agent-guard.mjs bash       PreToolUse hook on Bash: exit 2 when an active agent tries to write files around the guard
 *   node scripts/agent-guard.mjs status     prints the active agent and what it may write
 *   node scripts/agent-guard.mjs selftest   runs the allow / deny matrix; exit 1 on a mismatch (CI runs it)
 *
 * The agents and their scopes are `agents.list` in docs.config.json; the rules in words are project/Agent Protocol.md.
 * No active agent → nothing is guarded. Node 22 built-ins only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cmd = process.argv[2] || 'status';

const readJson = (p, fallback) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; } };
const cfg = readJson(path.join(ROOT, 'docs.config.json'), {});
const agentsCfg = cfg.agents || {};
const AGENTS = agentsCfg.list || [];
const MARKER = path.join(ROOT, agentsCfg.marker || '.claude/.active-agent');
const PROTOCOL = agentsCfg.protocol || 'project/Agent Protocol.md';
const GENERATED = ['tree/**', 'Card Index.md', 'tasks/Task Board.md', 'tasks/Backlog.md'];
const HAND_WRITTEN = ['tree/index.html']; // the tree page is source, the owner's (`paths` in its agents.list entry); the build only copies it to site/
const VERBATIM = ['design/Wireframe Brief.md'];
const KINDS = []; // { id, file, layer }
for (const layer of cfg.layers || []) for (const k of layer.kinds || []) KINDS.push({ id: k.id, file: k.file, layer: layer.id });
const STRUCTURAL_LAYER = { module: 'business', feature: 'business', task: 'business', decision: 'business', project: 'shared' };

const readStdin = () => { try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; } };
const active = () => { try { return fs.readFileSync(MARKER, 'utf8').trim() || null; } catch { return null; } };
const agentOf = (id) => AGENTS.find((a) => a.id === id) || null;
const setActive = (id) => { fs.mkdirSync(path.dirname(MARKER), { recursive: true }); fs.writeFileSync(MARKER, `${id}\n`); };
const clearActive = () => { try { fs.unlinkSync(MARKER); } catch {} };

// ---------------------------------------------------------------- what may an agent write, in words
function scopeWords(a) {
  const w = a.writes || {};
  const parts = [];
  if (w.kinds?.length) parts.push(`${w.kinds.join(', ')} notes (feature- and task-level)`);
  if (w.types?.length) parts.push(`${w.types.join(', ')} notes`);
  if (w.taskLabels?.length) parts.push(`task notes labelled ${w.taskLabels.join(' / ')}`);
  if (w.paths?.length) parts.push(w.paths.join(', ') + (w.except?.length ? ` (not ${w.except.join(', ')})` : ''));
  if (w.editOnly) { const e = []; if (w.editOnly.kinds?.length) e.push(...w.editOnly.kinds); if (w.editOnly.types?.length) e.push(...w.editOnly.types); if (e.length) parts.push(`edits (never rewrites) in ${e.join(', ')} notes`); }
  if (w.types?.includes('decision') && !(a.signs || []).includes('decision')) parts.push('decision cards to raise and fill, never to decide (status / decidedBy / decidedAt are the PM\'s or the owner\'s)');
  if (a.signs?.length) parts.push(`sign-off lines on ${a.signs.join(', ')}`);
  if (a.fields?.length) parts.push(`${a.fields.join(' / ')} on any card`);
  parts.push('a flag line (> ⚠ Affected by …) under any note\'s H1');
  return parts.join('; ');
}

// ---------------------------------------------------------------- classify a file: { type, kind, layer, labels, generated }
const glob = (pattern, rel) => {
  const re = '^' + pattern.split('**').map((seg) => seg.split('*').map((s) => s.replace(/[.+^${}()|[\]\\?]/g, '\\$&')).join('[^/]*')).join('.*') + '$';
  return new RegExp(re).test(rel);
};
function classify(rel) {
  const tree = readJson(path.join(ROOT, 'tree', 'tree.json'), null);
  const out = { rel, type: null, kind: null, layer: null, labels: [], generated: GENERATED.some((g) => glob(g, rel)) && !HAND_WRITTEN.includes(rel), verbatim: VERBATIM.includes(rel) };
  const node = tree ? Object.values(tree.nodes || {}).find((n) => n.path === rel) : null;
  if (node) {
    out.labels = node.labels || [];
    if (KINDS.some((k) => k.id === node.kind)) { out.kind = node.kind; out.layer = node.layer; }
    else { out.type = node.kind; out.layer = node.layer || STRUCTURAL_LAYER[node.kind] || null; }
    return out;
  }
  const f = tree?.files?.[rel];
  if (f?.type) {
    if (KINDS.some((k) => k.id === f.type)) { const k = KINDS.find((k) => k.id === f.type); out.kind = k.id; out.layer = k.layer; }
    else if (STRUCTURAL_LAYER[f.type]) { out.type = f.type; out.layer = STRUCTURAL_LAYER[f.type]; }
    return out;
  }
  // a file the tree does not know yet (being created): the same path rules the build uses
  const base = path.posix.basename(rel, '.md');
  if (rel.endsWith('.md')) {
    for (const k of KINDS) if (base.endsWith(` ${k.file}`)) { out.kind = k.id; out.layer = k.layer; return out; }
    if (rel.startsWith('tasks/')) { out.type = 'task'; out.layer = 'business'; const m = /^T-\d+[a-z]?-(fe|be)\b/.exec(base); if (m) out.labels = [m[1] === 'fe' ? 'frontend' : 'backend']; return out; }
    if (rel.startsWith('decisions/')) { out.type = 'decision'; out.layer = 'business'; return out; }
    if (/^modules\/[^/]+\/[^/]+ Module\.md$/.test(rel)) { out.type = 'module'; out.layer = 'business'; return out; }
    if (/^modules\/[^/]+\/([^/]+)\/\1\.md$/.test(rel)) { out.type = 'feature'; out.layer = 'business'; return out; }
    if (/^(project|business|frontend|backend)\//.test(rel)) { out.type = 'project'; out.layer = rel.split('/')[0] === 'project' ? 'shared' : rel.split('/')[0]; return out; }
  }
  return out;
}

// ---------------------------------------------------------------- the edit shapes every agent may make on a note it does not own
const FLAG = /^> ⚠ Affected by \[\[[^\]]+\]\] \(\d{4}-\d{2}-\d{2}\): /;
const SIGN_LINES = /^(status|approvedBy|approvedAt|decidedBy|decidedAt|updated|tags):|^# |^\*\*Status:\*\*/;
const changedLines = (oldS, newS) => {
  const a = oldS.split('\n'), b = newS.split('\n');
  const inA = new Map(); for (const l of a) inA.set(l, (inA.get(l) || 0) + 1);
  const added = []; for (const l of b) { if (inA.get(l)) inA.set(l, inA.get(l) - 1); else added.push(l); }
  const removed = [...inA.entries()].filter(([, n]) => n > 0).map(([l]) => l);
  return { added, removed };
};
const isFlagEdit = (edit) => { if (!edit) return false; const { added, removed } = changedLines(edit.old, edit.new); return removed.length === 0 && added.length >= 1 && added.every((l) => FLAG.test(l) || l.trim() === ''); };
const onlyLines = (edit, re) => { if (!edit) return false; const { added, removed } = changedLines(edit.old, edit.new); return [...added, ...removed].every((l) => re.test(l)); };
const fieldLines = (fields) => new RegExp(`^(${fields.join('|')}|updated|tags):`);
// the lines that take a decision: only an agent whose `signs` lists `decision` may change them (Agent Rules §4)
const DECIDE_LINES = /^(status|decidedBy|decidedAt):/;
const touchesDecide = (edit) => { if (!edit) return false; const { added, removed } = changedLines(edit.old, edit.new); return [...added, ...removed].some((l) => DECIDE_LINES.test(l)); };

// ---------------------------------------------------------------- the decision
export function decide(agent, rel, op, edit) {
  // op: 'edit' (old/new strings) | 'write' (a whole file; new or rewritten)
  const c = classify(rel);
  const w = agent.writes || {};
  const label = c.kind ? `${c.kind} note (${c.layer} layer)` : c.type ? `${c.type} note` : 'file';
  const deny = (why) => ({ allow: false, message: `${agent.id} agent: "${rel}" is a ${label}. ${why} Allowed for you: ${scopeWords(agent)}. The rules: ${PROTOCOL}.` });
  if (c.generated) return { allow: false, message: `${agent.id} agent: "${rel}" is generated by node scripts/build-tree.mjs; nobody edits it by hand. Run the build.` };
  if (c.verbatim) return { allow: false, message: `${agent.id} agent: "${rel}" is a verbatim copy that nobody edits.` };
  const inPaths = (w.paths || []).some((g) => glob(g, rel)) && !(w.except || []).some((g) => glob(g, rel));
  const inKinds = c.kind && (w.kinds || []).includes(c.kind);
  // a task note carrying a label another agent claims (the -fe / -be halves, bugs) belongs to that agent, not to whoever writes tasks in general
  const claimedElsewhere = c.type === 'task' && c.labels.some((l) => !(w.taskLabels || []).includes(l) && AGENTS.some((o) => o.id !== agent.id && (o.writes?.taskLabels || []).includes(l)));
  const inTypes = c.type && (w.types || []).includes(c.type) && !claimedElsewhere;
  const inLabels = c.type === 'task' && (w.taskLabels || []).some((l) => c.labels.includes(l));
  // a decision card: anyone who writes decisions raises and fills it; deciding it is for the agents that sign decisions
  if (c.type === 'decision' && !(agent.signs || []).includes('decision')) {
    const deciders = AGENTS.filter((a) => (a.signs || []).includes('decision')).map((a) => `/${a.id}`).join(' or ');
    if (op === 'edit' && touchesDecide(edit)) return { allow: false, message: `${agent.id} agent: "${rel}" is a decision card; you may raise and fill it, but status, decidedBy and decidedAt are set by ${deciders} on the user's word. The rules: ${PROTOCOL}.` };
    if (op === 'write' && edit && /^status:\s*decided\b/m.test(edit.new)) return { allow: false, message: `${agent.id} agent: "${rel}" would be written as decided; a decision is taken by ${deciders} on the user's word. Write it open, or hand it over. The rules: ${PROTOCOL}.` };
  }
  if (inPaths || inKinds || inTypes || inLabels) return { allow: true };
  const eo = w.editOnly || {};
  const editOnly = (c.kind && (eo.kinds || []).includes(c.kind)) || (c.type && (eo.types || []).includes(c.type));
  if (editOnly && op === 'edit') return { allow: true };
  if (editOnly) return deny('You may edit lines in it, never rewrite it or create it: use Edit with the exact lines.');
  if (op === 'edit' && isFlagEdit(edit)) return { allow: true };
  if (op === 'edit' && c.kind && (agent.signs || []).includes(c.kind) && onlyLines(edit, SIGN_LINES)) return { allow: true };
  if (op === 'edit' && c.type === 'decision' && (agent.signs || []).includes('decision') && onlyLines(edit, SIGN_LINES)) return { allow: true };
  if (op === 'edit' && agent.fields?.length && onlyLines(edit, fieldLines(agent.fields))) return { allow: true };
  const owners = AGENTS.filter((a) => a.id !== agent.id && decideOwner(a, c)).map((a) => `/${a.id}`);
  const hint = owners.length ? `Hand the change to ${owners.join(' or ')}, or add a flag line (> ⚠ Affected by [[T-NNN …]] (YYYY-MM-DD): …) under its H1.` : 'Nobody writes it from here; add a flag line under its H1 if it is a note.';
  return deny(hint);
}
const decideOwner = (a, c) => { const w = a.writes || {}; const claimed = c.type === 'task' && c.labels.some((l) => !(w.taskLabels || []).includes(l) && AGENTS.some((o) => o.id !== a.id && (o.writes?.taskLabels || []).includes(l))); return (c.kind && (w.kinds || []).includes(c.kind)) || (c.type && (w.types || []).includes(c.type) && !claimed) || (c.type === 'task' && (w.taskLabels || []).some((l) => c.labels.includes(l))) || (w.paths || []).some((g) => glob(g, c.rel)); };

const relOf = (p) => { if (!p) return null; const abs = path.isAbsolute(p) ? p : path.join(ROOT, p); const rel = path.relative(ROOT, abs).split(path.sep).join('/'); return rel.startsWith('..') ? null : rel; };

// ---------------------------------------------------------------- commands
if (cmd === 'prompt') {
  const { prompt = '' } = readStdin();
  const m = /^\s*\/([a-z]+)\b\s*(.*)$/s.exec(prompt);
  if (m) {
    const [, name, rest] = m;
    if (agentOf(name)) { setActive(name); const a = agentOf(name); console.log(`Active agent: ${a.id} (${a.label}). Follow ${PROTOCOL} and ${a.note}. You may write: ${scopeWords(a)}. Everything else is denied by the guard.`); }
    else if (name === 'agent') {
      if (/^off\b/.test(rest.trim())) { clearActive(); console.log('No agent is active: the guard is off.'); }
      else { const a = agentOf(active() || ''); console.log(a ? `Active agent: ${a.id} (${a.label}); writes ${scopeWords(a)}. "/agent off" clears it.` : 'No agent is active. Start one with /owner, /pm, /backend, /frontend or /qa.'); }
    }
  }
  process.exit(0);
}
if (cmd === 'session') { clearActive(); process.exit(0); }
if (cmd === 'status') {
  const a = agentOf(active() || '');
  console.log(a ? `Active agent: ${a.id} (${a.label})\nwrites: ${scopeWords(a)}\nnote: ${a.note}\nprotocol: ${PROTOCOL}` : 'No agent is active (no guard). Agents: ' + AGENTS.map((x) => `/${x.id}`).join(' '));
  process.exit(0);
}
if (cmd === 'check') {
  const a = agentOf(active() || '');
  if (!a) process.exit(0);
  const { tool_name: tool = '', tool_input: input = {} } = readStdin();
  const rel = relOf(input.file_path || input.notebook_path);
  if (!rel) process.exit(0);
  let op = 'write', edit = null;
  if (tool === 'Edit' && typeof input.old_string === 'string') { op = 'edit'; edit = { old: input.old_string, new: input.new_string ?? '' }; }
  else if (tool === 'MultiEdit' && Array.isArray(input.edits)) { op = 'edit'; edit = { old: input.edits.map((e) => e.old_string ?? '').join('\n'), new: input.edits.map((e) => e.new_string ?? '').join('\n') }; }
  else if (typeof input.content === 'string') edit = { old: '', new: input.content }; // a Write: the whole file, so the decision rule can read its status
  const d = decide(a, rel, op, edit);
  if (d.allow) process.exit(0);
  console.error(d.message);
  process.exit(2);
}
if (cmd === 'bash') {
  const a = agentOf(active() || '');
  if (!a) process.exit(0);
  const { tool_input: input = {} } = readStdin();
  const c = String(input.command || '').trim();
  const allowed = /^(node scripts\/(build-tree|agent-guard)\.mjs\b|git\b|ls\b|cat\b|head\b|tail\b|grep\b|rg\b|find\b|wc\b|diff\b|sed -n\b|pwd\b|echo\b[^>]*$)/;
  const writes = /(^|[^<>])>{1,2}(?!&)|\btee\b|\bsed\s+-[a-zA-Z]*i|\bperl\s+-[a-zA-Z]*i|\b(mv|cp|rm|touch|mkdir|rmdir|truncate|dd)\b|\bpython3?\b|\bnode\s+(?!scripts\/(build-tree|agent-guard)\.mjs)/;
  if (allowed.test(c) && !/&&|;|\|\s*(tee|sed|perl|python|node|sh|bash)\b/.test(c)) process.exit(0);
  if (writes.test(c)) { console.error(`${a.id} agent: this command writes files around the guard. Use Edit or Write (the guard checks them), node scripts/build-tree.mjs --scaffold for new notes, and git for commits.`); process.exit(2); }
  process.exit(0);
}
if (cmd === 'selftest') {
  const E = (o, n) => ({ old: o, new: n });
  const story = 'modules/Identity Core/Rings/Rings Story.md', fr = 'modules/Identity Core/Rings/Rings Frontend Requirements.md', bd = 'modules/Identity Core/Rings/Rings Backend Delivery.md';
  const feature = 'modules/Identity Core/Rings/Rings.md', mod = 'modules/Identity Core/Identity Core Module.md', task = 'tasks/T-004 Member count per Ring on list and detail/T-004 Member count per Ring on list and detail.md';
  const be = 'tasks/T-004 Member count per Ring on list and detail/T-004-be Backend · Member count per Ring on list and detail.md', fe = 'tasks/T-004 Member count per Ring on list and detail/T-004-fe Frontend · Member count per Ring on list and detail.md';
  const newQa = 'tasks/T-004 Member count per Ring on list and detail/T-004-be QA Backend.md', newBd = 'tasks/T-004 Member count per Ring on list and detail/T-004-be Backend Delivery.md', newTask = 'tasks/T-099 Something new/T-099 Something new.md';
  const flag = E('# Rings · User Story\n', '# Rings · User Story\n\n> ⚠ Affected by [[T-004 Member count per Ring on list and detail]] (2026-10-19): memberCount added\n');
  const sign = E('status: draft\napprovedBy: ""\napprovedAt: ""\nupdated: 2026-10-18\ntags: [story, story/draft, module/identity, layer/business]', 'status: approved\napprovedBy: "Khaled"\napprovedAt: 2026-10-19\nupdated: 2026-10-19\ntags: [story, story/approved, module/identity, layer/business]');
  const body = E('**As a** new user', '**As a** returning user');
  const prio = E('priority: high\nupdated: 2026-10-18', 'priority: critical\ndeadline: 2026-11-01\nupdated: 2026-10-19');
  const dec = 'decisions/D-04 Ring settings.md', newDec = 'decisions/D-99 New.md';
  const decideSign = E('status: open\ndecidedBy: ""\ndecidedAt: ""\nupdated: 2026-10-18\ntags: [decision, decision/open]', 'status: decided\ndecidedBy: "Khaled"\ndecidedAt: 2026-10-21\nupdated: 2026-10-21\ntags: [decision, decision/decided]');
  const decBody = E('## Options\n\n1. …', '## Options\n\n1. Per-Ring copies\n2. One field library');
  const openWrite = E('', '---\ntype: decision\nid: D-99\nstatus: open\n---\n'), decidedWrite = E('', '---\ntype: decision\nid: D-99\nstatus: decided\n---\n');
  const M = [
    // agent, path, op, edit, expected
    ['owner', 'project/Agent Rules.md', 'write', null, true], ['owner', 'docs.config.json', 'write', null, true], ['owner', mod, 'write', null, true], ['owner', feature, 'write', null, true], ['owner', feature, 'edit', body, true], ['owner', 'decisions/D-04 Ring settings.md', 'edit', body, true],
    ['owner', story, 'edit', sign, true], ['owner', story, 'edit', body, false], ['owner', task, 'edit', prio, true], ['owner', bd, 'write', null, false], ['owner', 'tree/tree.json', 'write', null, false], ['owner', 'tree/index.html', 'edit', body, true], ['pm', 'tree/index.html', 'edit', body, false], ['backend', 'tree/index.html', 'edit', body, false],
    ['pm', feature, 'write', null, true], ['pm', story, 'edit', body, true], ['pm', task, 'edit', body, true], ['pm', newTask, 'write', null, true], ['pm', 'decisions/D-99 New.md', 'write', null, true], ['pm', 'design/Screen Index.md', 'edit', body, true],
    ['pm', bd, 'edit', body, false], ['pm', bd, 'edit', flag, true], ['pm', fr, 'edit', sign, true], ['pm', 'project/Agent Rules.md', 'edit', body, false], ['pm', be, 'edit', body, false], ['pm', 'Card Index.md', 'edit', body, false],
    ['backend', bd, 'write', null, true], ['backend', newBd, 'write', null, true], ['backend', be, 'edit', body, true], ['backend', 'backend/Architecture.md', 'edit', body, true], ['backend', 'frontend/Frontend API Guide.md', 'edit', body, true],
    ['backend', fr, 'edit', body, true], ['backend', fr, 'write', null, false], ['backend', feature, 'edit', body, true], ['backend', feature, 'write', null, false], ['backend', story, 'edit', body, false], ['backend', story, 'edit', flag, true],
    ['backend', fe, 'edit', body, false], ['backend', newQa, 'write', null, false], ['backend', 'frontend/Frontend Contract.md', 'edit', body, false], ['backend', 'design/Wireframe Brief.md', 'edit', body, false],
    ['frontend', fr, 'write', null, true], ['frontend', fe, 'edit', body, true], ['frontend', 'frontend/Frontend Contract.md', 'edit', body, true], ['frontend', 'frontend/Frontend API Guide.md', 'edit', body, false],
    ['frontend', bd, 'edit', body, false], ['frontend', bd, 'edit', flag, true], ['frontend', story, 'edit', sign, false], ['frontend', task, 'edit', body, false],
    ['qa', newQa, 'write', null, true], ['qa', 'modules/Identity Core/Rings/Rings QA Frontend.md', 'write', null, true], ['qa', story, 'edit', sign, true], ['qa', story, 'edit', body, false], ['qa', bd, 'edit', flag, true], ['qa', bd, 'edit', body, false], ['qa', task, 'edit', body, false],
    // decision cards: anyone raises and fills; the PM and the owner decide, and may raise one already decided (Agent Rules §4)
    ['owner', newDec, 'write', openWrite, true], ['owner', newDec, 'write', decidedWrite, true], ['owner', dec, 'edit', decideSign, true], ['pm', newDec, 'write', decidedWrite, true], ['pm', dec, 'edit', decideSign, true], ['pm', dec, 'edit', decBody, true],
    ['backend', newDec, 'write', openWrite, true], ['backend', dec, 'edit', decBody, true], ['backend', dec, 'edit', decideSign, false], ['backend', newDec, 'write', decidedWrite, false],
    ['frontend', newDec, 'write', openWrite, true], ['frontend', dec, 'edit', decBody, true], ['frontend', dec, 'edit', decideSign, false],
    ['qa', newDec, 'write', openWrite, true], ['qa', dec, 'edit', decBody, true], ['qa', dec, 'edit', decideSign, false], ['qa', newDec, 'write', decidedWrite, false],
  ];
  let bad = 0;
  for (const [id, rel, op, edit, expected] of M) {
    const a = agentOf(id); if (!a) { console.error(`no agent ${id}`); bad++; continue; }
    const d = decide(a, rel, op, edit);
    const ok = d.allow === expected;
    if (!ok) bad++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${id.padEnd(8)} ${op.padEnd(5)} ${expected ? 'allow' : 'deny '} ${rel}${ok ? '' : `\n     got ${d.allow ? 'allow' : 'deny'}: ${d.message || ''}`}`);
  }
  console.log(`${M.length - bad} of ${M.length} rows as expected`);
  process.exit(bad ? 1 : 0);
}
console.error(`unknown command "${cmd}": prompt | session | check | bash | status | selftest`);
process.exit(1);
