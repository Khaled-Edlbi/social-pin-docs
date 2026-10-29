#!/usr/bin/env node
/**
 * The agent guard: keeps each agent of the vault inside the files its layer owns.
 *
 *   node scripts/agent-guard.mjs prompt     UserPromptSubmit hook: "/owner", "/pm", "/backend", "/frontend", "/qa", "/admin" make that agent active;
 *                                            "/agent off" clears it; "/agent" prints the active one. A plain prompt keeps the active agent.
 *   node scripts/agent-guard.mjs session    SessionStart hook: a new session starts with no active agent
 *   node scripts/agent-guard.mjs check      PreToolUse hook on Edit / Write: exit 2 (blocked) when the active agent may not write that file
 *   node scripts/agent-guard.mjs bash       PreToolUse hook on Bash: exit 2 when an active agent tries to write files around the guard
 *   node scripts/agent-guard.mjs status     prints this session's agent and what it may write; outside a session, every session's agent
 *   node scripts/agent-guard.mjs selftest   runs the allow / deny matrix and the two-session rows; exit 1 on a mismatch (CI runs it)
 *
 * The agents and their scopes are `agents.list` in docs.config.json; the rules in words are rules/Agent Protocol.md.
 * The active agent is kept per Claude Code session: `agents.marker` is a folder with one file per session, named by the `session_id`
 * the hooks receive on stdin (from the shell, `CLAUDE_CODE_SESSION_ID`), so sessions sharing the folder never change each other's agent.
 * The old shared marker (a plain file at that path) counts for no session and is replaced by the folder on the next "/<agent>".
 * AGENT_GUARD_MARKER overrides the folder (the selftest's two-session rows use a temporary one).
 * No active agent → every Edit / Write and every writing shell command is refused with one instruction: ask the user which agent
 * they will use for the change and wait for them to type it (/owner …, /pm …, /admin …); nobody picks an agent for the user.
 * An agent whose `writes.all` is true (/admin, rules/Admin Agent.md) may write anything, generated files and the verbatim brief included,
 * from the shell too. Node 22 built-ins only.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cmd = process.argv[2] || 'status';

const readJson = (p, fallback) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; } };
const cfg = readJson(path.join(ROOT, 'docs.config.json'), {});
const agentsCfg = cfg.agents || {};
const AGENTS = agentsCfg.list || [];
const MARKER = process.env.AGENT_GUARD_MARKER ? path.resolve(process.env.AGENT_GUARD_MARKER) : path.join(ROOT, agentsCfg.marker || '.claude/.active-agent');
const PROTOCOL = agentsCfg.protocol || 'rules/Agent Protocol.md';
// the product's cards live in `projectDir`; the docs system (rules/, templates/, scripts/, tree/) at the root
const PROJECT_DIR = String(cfg.projectDir || '').replace(/^\/+|\/+$/g, '');
const prj = (rel) => (PROJECT_DIR ? `${PROJECT_DIR}/${rel}` : rel);
const GENERATED = ['tree/**', prj('Card Index.md')];
const HAND_WRITTEN = ['tree/index.html']; // the tree page is source, the admin's (the docs system); the build only copies it to site/
const VERBATIM = [prj('design/Wireframe Brief.md')];
const KINDS = []; // { id, file, layer }
for (const layer of cfg.layers || []) for (const k of layer.kinds || []) KINDS.push({ id: k.id, file: k.file, layer: layer.id });
const STRUCTURAL_LAYER = { module: 'business', feature: 'business', bug: 'business', 'needs-decision': 'business', 'decision': 'business', project: 'shared' };

const readStdin = () => { try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; } };
// the hooks get their JSON on stdin once; `status` and `selftest` run from a terminal and read none
const input = ['prompt', 'session', 'check', 'bash'].includes(cmd) ? readStdin() : {};
// the session this run is for: the hook's session_id, else the shell's; one marker file per session (a hook without one shares "default")
const SESSION = String(input.session_id || process.env.CLAUDE_CODE_SESSION_ID || '').replace(/[^A-Za-z0-9_-]/g, '') || null;
const markerDir = () => { try { return fs.statSync(MARKER).isDirectory(); } catch { return false; } };
const markerOf = (sid) => path.join(MARKER, sid || 'default');
const active = (sid = SESSION) => { if (!markerDir()) return null; try { return fs.readFileSync(markerOf(sid), 'utf8').trim() || null; } catch { return null; } };
const agentOf = (id) => AGENTS.find((a) => a.id === id) || null;
const setActive = (id, sid = SESSION) => {
  if (fs.existsSync(MARKER) && !markerDir()) fs.unlinkSync(MARKER); // the old shared marker file gives way to the per-session folder
  fs.mkdirSync(MARKER, { recursive: true }); fs.writeFileSync(markerOf(sid), `${id}\n`);
};
const clearActive = (sid = SESSION) => { try { fs.unlinkSync(markerOf(sid)); } catch {} };
const sessions = () => { if (!markerDir()) return []; return fs.readdirSync(MARKER).map((sid) => ({ sid, agent: active(sid) })).filter((s) => s.agent); };
// a session that ended without "/agent off" leaves its file behind; a new session sweeps those older than a month
const PRUNE_DAYS = 30;
const pruneStale = () => { if (!markerDir()) return; for (const f of fs.readdirSync(MARKER)) { try { const p = path.join(MARKER, f); if (Date.now() - fs.statSync(p).mtimeMs > PRUNE_DAYS * 864e5) fs.unlinkSync(p); } catch {} } };

// ---------------------------------------------------------------- what may an agent write, in words
function scopeWords(a) {
  const w = a.writes || {};
  if (w.all) return 'anything in the repository: the guard refuses you nothing (the generated files are still rewritten by node scripts/build-tree.mjs, and --check fails on a hand edit that drifts)';
  const parts = [];
  if (w.kinds?.length) parts.push(`${w.kinds.join(', ')} notes`);
  if (w.types?.length) parts.push(`${w.types.join(', ')} notes`);
  if (w.paths?.length) parts.push(w.paths.join(', ') + (w.except?.length ? ` (not ${w.except.join(', ')})` : ''));
  if (w.editOnly) { const e = []; if (w.editOnly.kinds?.length) e.push(...w.editOnly.kinds); if (w.editOnly.types?.length) e.push(...w.editOnly.types); if (e.length) parts.push(`edits (never rewrites) in ${e.join(', ')} notes`); }
  if (w.types?.includes('needs-decision') && !w.types?.includes('decision')) parts.push('needs-decision cards (ND-NN) to raise and fill, draft or open; the answer, the decision card D-NN, and setting it decided are the PM\'s or the owner\'s');
  if (a.signs?.length) parts.push(`sign-off lines on ${a.signs.join(', ')}`);
  if (a.bugStatuses?.length) parts.push(`a bug's status, to ${a.bugStatuses.join(' or ')} only (status, the bug/<status> tag, updated, the H1)`);
  if (a.fields?.length) parts.push(`${a.fields.join(' / ')} on any card`);
  const mine = Object.keys(RESERVED).filter((k) => RESERVED[k].includes(a.id));
  if (mine.length) parts.push(`${mine.map((k) => `${k}:`).join(' / ')} (reserved: nobody else may set ${mine.length === 1 ? 'it' : 'them'})`);
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
    // a bug (type: bug) is a node of kind `task` with `bug` in its labels inside the tree: to the guard it is the bug type, written by the agents with `bug` in their types
    else { out.type = node.kind === 'task' && out.labels.includes('bug') ? 'bug' : node.kind; out.layer = node.layer || STRUCTURAL_LAYER[out.type] || null; }
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
  const area = (cfg.projectAreas || []).find((a) => a.folder === path.posix.dirname(rel));
  if (area && rel.endsWith('.md')) { out.type = 'project'; out.layer = area.id; return out; }
  // inside the project folder the card folders sit as they always did
  rel = PROJECT_DIR ? (rel.startsWith(`${PROJECT_DIR}/`) ? rel.slice(PROJECT_DIR.length + 1) : `\u0000${rel}`) : rel;
  if (rel.endsWith('.md')) {
    for (const k of KINDS) if (base.endsWith(` ${k.file}`)) { out.kind = k.id; out.layer = k.layer; return out; }
    if (rel.startsWith('bugs/')) { out.type = 'bug'; out.layer = 'business'; return out; } // bugs/B-NN <Title>.md
    if (rel.startsWith('needs-decisions/')) { out.type = 'needs-decision'; out.layer = 'business'; return out; } // the question: needs-decisions/ND-NN <Title>.md
    if (rel.startsWith('decisions/')) { out.type = 'decision'; out.layer = 'business'; return out; } // the answer: decisions/D-NN <Title>.md
    if (/^modules\/[^/]+\/[^/]+ Module\.md$/.test(rel)) { out.type = 'module'; out.layer = 'business'; return out; }
    if (/^modules\/[^/]+\/features\/([^/]+)\/(?:F-\d+ )?\1\.md$/.test(rel)) { out.type = 'feature'; out.layer = 'business'; return out; }
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
// a bug the agent fixes (`bugStatuses`, the backend and the frontend): only status, updated, tags and the H1, from todo, in-progress or ready
// to one of its statuses; never done, never a resolution: QA re-tests the fix and closes or reopens it (Agent Rules §4)
const BUG_STATUS_LINES = /^(status|updated|tags):|^# /;
const statusOf = (l) => /^status:\s*"?([a-z-]+)"?\s*$/.exec(l.trim())?.[1] ?? null;
// the card's `**Found against:** … · **Status:** To do · …` line may change in its Status segment only
const withoutStatus = (l) => l.replace(/\*\*Status:\*\*[^·]*/, '**Status:**');
const isBugStatusEdit = (agent, edit) => {
  if (!edit) return false;
  const { added, removed } = changedLines(edit.old, edit.new);
  const was = new Set(removed.filter((l) => l.includes('**Status:**')).map(withoutStatus)), now = new Set(added.filter((l) => l.includes('**Status:**')).map(withoutStatus));
  const lineOk = (l, other) => BUG_STATUS_LINES.test(l) || (l.includes('**Status:**') && other.has(withoutStatus(l)));
  if (!added.every((l) => lineOk(l, was)) || !removed.every((l) => lineOk(l, now))) return false;
  const to = added.filter((l) => /^status:/.test(l)).map(statusOf), from = removed.filter((l) => /^status:/.test(l)).map(statusOf);
  if (!to.length || !to.every((s) => agent.bugStatuses.includes(s)) || !from.every((s) => ['todo', ...agent.bugStatuses].includes(s))) return false;
  return !added.some((l) => /^tags:/.test(l) && /\b(bug\/done|resolution\/)/.test(l));
};
// a needs-decision card (ND-NN) is draft or open; it is never typed decided or fulfilled and carries no decidedBy / decidedAt:
// the answer is taken on its decision card (D-NN), which only the PM and the owner write (Agent Rules §4)
const DECIDED_LINE = /^(status:\s*(decided|fulfilled)\b|decided(By|At):\s*(?!""|$)\S)/;
const introducesDecided = (edit) => { if (!edit) return false; const { added } = changedLines(edit.old, edit.new); return added.some((l) => DECIDED_LINE.test(l)); };
// reserved frontmatter keys (agents.reservedFields): a feature's release and the project's stage, set by the owner only (Agent Rules §4).
// A Write is compared with the file on disk, so rewriting a note that keeps the same release is not a change of it.
const RESERVED = Object.fromEntries(Object.entries(agentsCfg.reservedFields || {}).filter(([k, v]) => k !== 'description' && Array.isArray(v)));
const reservedTouched = (rel, op, edit) => {
  const keys = Object.keys(RESERVED);
  if (!keys.length || !edit) return [];
  let old = edit.old;
  if (op === 'write') { try { old = fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { old = ''; } }
  const lf = (s) => s.replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd()).join('\n'); // a CRLF file on disk against an LF rewrite is the same line
  const { added, removed } = changedLines(lf(old), lf(edit.new));
  const re = new RegExp(`^(${keys.join('|')}):`);
  return [...new Set([...added, ...removed].map((l) => re.exec(l)?.[1]).filter(Boolean))];
};

// ---------------------------------------------------------------- the decision
export function decide(agent, rel, op, edit) {
  // op: 'edit' (old/new strings) | 'write' (a whole file; new or rewritten)
  const w = agent.writes || {};
  if (w.all) return { allow: true }; // the admin: anything in the repository (Agent Protocol, "The guard")
  const c = classify(rel);
  const label = c.kind ? `${c.kind} note (${c.layer} layer)` : c.type ? `${c.type} note` : 'file';
  const deny = (why) => ({ allow: false, message: `${agent.id} agent: "${rel}" is a ${label}. ${why} Allowed for you: ${scopeWords(agent)}. The rules: ${PROTOCOL}.` });
  if (c.generated) return { allow: false, message: `${agent.id} agent: "${rel}" is generated by node scripts/build-tree.mjs; nobody edits it by hand. Run the build.` };
  if (c.verbatim) return { allow: false, message: `${agent.id} agent: "${rel}" is a verbatim copy that nobody edits.` };
  const inPaths = (w.paths || []).some((g) => glob(g, rel)) && !(w.except || []).some((g) => glob(g, rel));
  const inKinds = c.kind && (w.kinds || []).includes(c.kind);
  const inTypes = c.type && (w.types || []).includes(c.type);
  // a needs-decision card: anyone who writes decisions raises and fills it, draft or open; nobody types it decided or fulfilled (the build computes Fulfilled from its decision card, D-NN)
  if (c.type === 'needs-decision' && introducesDecided(edit)) {
    const deciders = AGENTS.filter((a) => (a.writes?.types || []).includes('decision')).map((a) => `/${a.id}`).join(' or ');
    return { allow: false, message: `${agent.id} agent: "${rel}" is a needs-decision card: it is draft or open, never typed decided or fulfilled, and carries no decidedBy / decidedAt. The answer goes on its decision card (D-NN), written and set decided by ${deciders} on the user's word; this card then shows Fulfilled by itself. The rules: ${PROTOCOL}.` };
  }
  const reserved = reservedTouched(rel, op, edit).filter((k) => !RESERVED[k].includes(agent.id));
  if (reserved.length) {
    const by = [...new Set(reserved.flatMap((k) => RESERVED[k]))].map((id) => `/${id}`).join(' or ');
    return { allow: false, message: `${agent.id} agent: ${reserved.map((k) => `"${k}:"`).join(' and ')} in "${rel}" ${reserved.length === 1 ? 'is' : 'are'} set by ${by} only, on the user's word (a feature's release, the project's stage). Hand that change to ${by}; the rest of your edit can go without that line. The rules: ${PROTOCOL}.` };
  }
  if (inPaths || inKinds || inTypes) return { allow: true };
  const eo = w.editOnly || {};
  const editOnly = (c.kind && (eo.kinds || []).includes(c.kind)) || (c.type && (eo.types || []).includes(c.type));
  if (editOnly && op === 'edit') return { allow: true };
  if (editOnly) return deny('You may edit lines in it, never rewrite it or create it: use Edit with the exact lines.');
  if (op === 'edit' && isFlagEdit(edit)) return { allow: true };
  if (op === 'edit' && c.type === 'bug' && agent.bugStatuses?.length && isBugStatusEdit(agent, edit)) return { allow: true };
  if (c.type === 'bug' && agent.bugStatuses?.length) return deny(`On a bug you may only move its status to ${agent.bugStatuses.join(' or ')} (from todo, in-progress or ready): an Edit of status:, the bug/<status> tag, updated: and the H1, nothing else. Closing it (done, resolution) is QA's after the re-test, or the PM's; record the fix in your own note and add a flag line under the bug's H1.`);
  if (op === 'edit' && c.kind && (agent.signs || []).includes(c.kind) && onlyLines(edit, SIGN_LINES)) return { allow: true };
  if (op === 'edit' && agent.fields?.length && onlyLines(edit, fieldLines(agent.fields))) return { allow: true };
  const owners = AGENTS.filter((a) => a.id !== agent.id && decideOwner(a, c)).map((a) => `/${a.id}`);
  const hint = owners.length ? `Hand the change to ${owners.join(' or ')}, or add a flag line (> ⚠ Affected by [[<card>]] (YYYY-MM-DD): …) under its H1.` : 'Nobody writes it from here; add a flag line under its H1 if it is a note.';
  return deny(hint);
}
const decideOwner = (a, c) => { const w = a.writes || {}; return (c.kind && (w.kinds || []).includes(c.kind)) || (c.type && (w.types || []).includes(c.type)) || (w.paths || []).some((g) => glob(g, c.rel)); };

// no agent active: nothing is written until the user has chosen one (Agent Protocol, "The guard")
const agentList = () => {
  const roles = AGENTS.filter((x) => !x.writes?.all).map((x) => `/${x.id}`).join(', ');
  const admins = AGENTS.filter((x) => x.writes?.all).map((x) => `/${x.id}`).join(', ');
  return admins ? `${roles} (${admins} may write anything)` : roles;
};
export const noAgent = () => ({ allow: false, message: `No agent is active, so nothing is written yet. Ask the user which agent they will use for this change — ${agentList()} — and wait for them to type it as the next message (e.g. "/pm <the request>"); do not choose for them and do not retry. The rules: ${PROTOCOL}.` });

const relOf = (p) => { if (!p) return null; const abs = path.isAbsolute(p) ? p : path.join(ROOT, p); const rel = path.relative(ROOT, abs).split(path.sep).join('/'); return rel.startsWith('..') ? null : rel; };

// ---------------------------------------------------------------- commands
if (cmd === 'prompt') {
  const { prompt = '' } = input;
  const m = /^\s*\/([a-z]+)\b\s*(.*)$/s.exec(prompt);
  if (m) {
    const [, name, rest] = m;
    if (agentOf(name)) { setActive(name); const a = agentOf(name); console.log(`Active agent: ${a.id} (${a.label}). Follow ${PROTOCOL} and ${a.note}. You may write: ${scopeWords(a)}. Everything else is denied by the guard.`); }
    else if (name === 'agent') {
      if (/^off\b/.test(rest.trim())) { clearActive(); console.log(`No agent is active in this session: every write is refused until the user starts one with ${agentList()}. Other sessions keep their own.`); }
      else { const a = agentOf(active() || ''); console.log(a ? `Active agent: ${a.id} (${a.label}); writes ${scopeWords(a)}. "/agent off" clears it.` : `No agent is active: every write is refused until the user starts one with ${agentList()}. Ask which one before anything else.`); }
    }
  }
  process.exit(0);
}
if (cmd === 'session') { clearActive(); pruneStale(); process.exit(0); } // this session's entry only: the others keep their agent
if (cmd === 'status') {
  if (!SESSION) {
    const all = sessions();
    console.log(all.length ? `Active agents, one per Claude Code session in this folder:\n${all.map((s) => `  ${s.sid}: ${s.agent}`).join('\n')}` : `No session has an active agent. Agents: ${agentList()}.`);
    process.exit(0);
  }
  const a = agentOf(active() || '');
  console.log(a ? `Active agent: ${a.id} (${a.label})\nwrites: ${scopeWords(a)}\nnote: ${a.note}\nprotocol: ${PROTOCOL}` : `No agent is active in this session: every write is refused until the user starts one. Agents: ${agentList()}. Ask which one before anything else.`);
  process.exit(0);
}
if (cmd === 'check') {
  const a = agentOf(active() || '');
  const { tool_name: tool = '', tool_input: ti = {} } = input;
  const rel = relOf(ti.file_path || ti.notebook_path);
  if (!rel) process.exit(0); // a file outside the repository is not the vault's business
  if (!a) { console.error(noAgent().message); process.exit(2); }
  let op = 'write', edit = null;
  if (tool === 'Edit' && typeof ti.old_string === 'string') { op = 'edit'; edit = { old: ti.old_string, new: ti.new_string ?? '' }; }
  else if (tool === 'MultiEdit' && Array.isArray(ti.edits)) { op = 'edit'; edit = { old: ti.edits.map((e) => e.old_string ?? '').join('\n'), new: ti.edits.map((e) => e.new_string ?? '').join('\n') }; }
  else if (typeof ti.content === 'string') edit = { old: '', new: ti.content }; // a Write: the whole file, so the decision rule can read its status
  const d = decide(a, rel, op, edit);
  if (d.allow) process.exit(0);
  console.error(d.message);
  process.exit(2);
}
if (cmd === 'bash') {
  const a = agentOf(active() || '');
  if (a?.writes?.all) process.exit(0); // the admin: the shell is not guarded either
  const { tool_input: ti = {} } = input;
  const c = String(ti.command || '').trim();
  const allowed = /^(node scripts\/(build-tree|agent-guard)\.mjs\b|git\b|ls\b|cat\b|head\b|tail\b|grep\b|rg\b|find\b|wc\b|diff\b|sed -n\b|pwd\b|echo\b[^>]*$)/;
  const writes = /(^|[^<>])>{1,2}(?!&)|\btee\b|\bsed\s+-[a-zA-Z]*i|\bperl\s+-[a-zA-Z]*i|\b(mv|cp|rm|touch|mkdir|rmdir|truncate|dd)\b|\bpython3?\b|\bnode\s+(?!scripts\/(build-tree|agent-guard)\.mjs)/;
  if (allowed.test(c) && !/&&|;|\|\s*(tee|sed|perl|python|node|sh|bash)\b/.test(c)) process.exit(0);
  if (!writes.test(c)) process.exit(0);
  if (!a) { console.error(noAgent().message); process.exit(2); } // no agent: a writing command is refused like an Edit would be
  console.error(`${a.id} agent: this command writes files around the guard. Use Edit or Write (the guard checks them), node scripts/build-tree.mjs --scaffold for new notes, and git for commits.`);
  process.exit(2);
}
if (cmd === 'selftest') {
  const E = (o, n) => ({ old: o, new: n });
  const story = 'social-pin/modules/Identity Core/features/Rings/S-18 Rings Story.md', fr = 'social-pin/modules/Identity Core/features/Rings/flow/FR-11 Rings Frontend Requirements.md', bd = 'social-pin/modules/Identity Core/features/Rings/flow/BD-11 Rings Backend Delivery.md';
  const feature = 'social-pin/modules/Identity Core/features/Rings/F-11 Rings.md', mod = 'social-pin/modules/Identity Core/M-01 Identity Core Module.md';
  const bi = 'social-pin/modules/Identity Core/features/Rings/flow/BI-08 Rings Backend Integration.md', fd = 'social-pin/modules/Identity Core/features/Account/flow/FD-04 Account Frontend Delivery.md';
  const newQa = 'social-pin/modules/Identity Core/features/Rings/flow/QB-99 Rings QA Backend.md', newBd = 'social-pin/modules/Identity Core/features/Account/flow/BD-99 Account Backend Delivery.md', newTask = 'social-pin/tasks/T-099 Something new.md';
  const flag = E('# Rings · User Story\n', '# Rings · User Story\n\n> ⚠ Affected by [[BI-08 Rings Backend Integration]] (2026-10-19): memberCount added\n');
  const sign = E('status: draft\napprovedBy: ""\napprovedAt: ""\nupdated: 2026-10-18\ntags: [story, story/draft, module/identity, layer/business]', 'status: approved\napprovedBy: "Khaled"\napprovedAt: 2026-10-19\nupdated: 2026-10-19\ntags: [story, story/approved, module/identity, layer/business]');
  const body = E('**As a** new user', '**As a** returning user');
  const prio = E('priority: high\nupdated: 2026-10-18', 'priority: critical\ndeadline: 2026-11-01\nupdated: 2026-10-19');
  const dec = 'social-pin/needs-decisions/ND-04 Ring settings.md', newDec = 'social-pin/needs-decisions/ND-99 A new question.md';
  const decideSign = E('status: open\nupdated: 2026-10-18\ntags: [decision, decision/open]', 'status: decided\ndecidedBy: "Khaled"\ndecidedAt: 2026-10-21\nupdated: 2026-10-21\ntags: [decision, decision/decided]');
  const fulfilSign = E('status: open\nupdated: 2026-10-18', 'status: fulfilled\nupdated: 2026-10-21');
  const openSign = E('status: draft\nupdated: 2026-10-18\ntags: [decision, decision/draft]', 'status: open\nupdated: 2026-10-21\ntags: [decision, decision/open]');
  const recDecide = E('status: draft\ndecidedBy: ""\ndecidedAt: ""', 'status: decided\ndecidedBy: "Khaled"\ndecidedAt: 2026-10-25');
  const decBody = E('## Options\n\n1. …', '## Options\n\n1. Per-Ring copies\n2. One field library');
  const newRec = 'social-pin/decisions/D-99 New answer.md', recWrite = E('', '---\ntype: decision\nid: D-99\ndecision: ND-99\n---\n');
  const openWrite = E('', '---\ntype: needs-decision\nid: ND-99\nstatus: draft\n---\n'), decidedWrite = E('', '---\ntype: needs-decision\nid: ND-99\nstatus: decided\n---\n');
  const overview = 'social-pin/business/Project Overview.md', stageSet = E('stage: mvp\nupdated: 2026-10-25', 'stage: beta\nupdated: 2026-10-26');
  const relSet = E('priority: critical\nrelease: mvp\nmodule: identity', 'priority: critical\nrelease: v1\nmodule: identity'), relKeep = E('priority: critical\nrelease: mvp\nupdated: 2026-10-25', 'priority: high\nrelease: mvp\nupdated: 2026-10-26');
  // a Write is compared with the file on disk: keeping the line is allowed, changing it is not (Rings is release: mvp)
  const bug = 'social-pin/bugs/B-02 Deleted account answers 401, not the documented 404 E_USER_01.md', newBug = 'social-pin/bugs/B-99 Something found.md';
  const bugEdit = (from, to, extra = '') => E(`# 🔴 B-02 · Bug\nstatus: ${from}\nupdated: 2026-10-28\ntags: [bug, bug/${from}, module/identity]`, `# 🔴 B-02 · Bug\nstatus: ${to}\nupdated: 2026-10-29\ntags: [bug, bug/${to}, module/identity]${extra}`);
  const bugStart = bugEdit('todo', 'in-progress'), bugReady = bugEdit('in-progress', 'ready'), bugDone = bugEdit('ready', 'done'), bugReopen = bugEdit('done', 'in-progress'), bugReopenTodo = bugEdit('ready', 'todo');
  const bugResolve = bugEdit('in-progress', 'ready', '\nresolution: fixed'), bugReadyBody = bugEdit('in-progress', 'ready', '\n**Fixed in** BD-02');
  const bugLine = (s, p = 'High') => `**Found against:** [[BI-01 Account Backend Integration]] · **Feature:** [[F-01 Account]] · **Status:** ${s} · **Priority:** ${p} · **Effort:** S`;
  const bugReadyLine = E(`status: in-progress\n${bugLine('In progress')}`, `status: ready\n${bugLine('Ready')}`), bugReadyPrio = E(`status: in-progress\n${bugLine('In progress')}`, `status: ready\n${bugLine('Ready', 'Low')}`);
  const relWriteSame = E('','---\ntype: feature\nid: rings\nrelease: mvp\n---\n'), relWriteNew = E('', '---\ntype: feature\nid: rings\nrelease: later\n---\n');
  const M = [
    // agent, path, op, edit, expected
    // the owner is the business owner: cards and business notes; the docs system (rules, config, templates, scripts, the tree page, the agents) is the admin's
    ['owner', 'rules/Agent Rules.md', 'write', null, false], ['owner', 'docs.config.json', 'write', null, false], ['owner', 'scripts/build-tree.mjs', 'edit', body, false], ['owner', 'templates/Bug Template.md', 'edit', body, false], ['owner', '.claude/settings.json', 'edit', body, false], ['owner', 'CLAUDE.md', 'edit', body, false],
    ['owner', overview, 'edit', body, true], ['owner', 'Home.md', 'edit', body, true], ['admin', 'tree/index.html', 'edit', body, true], ['admin', 'docs.config.json', 'write', null, true],
    ['owner', mod, 'write', null, true], ['owner', feature, 'write', null, true], ['owner', feature, 'edit', body, true], ['owner', 'social-pin/decisions/Ring settings.md', 'edit', body, true],
    ['owner', story, 'edit', sign, true], ['owner', story, 'edit', body, false], ['owner', bug, 'edit', prio, true], ['owner', bd, 'write', null, false], ['owner', 'tree/tree.json', 'write', null, false], ['owner', 'tree/index.html', 'edit', body, false], ['pm', 'tree/index.html', 'edit', body, false], ['backend', 'tree/index.html', 'edit', body, false],
    ['pm', feature, 'write', null, true], ['pm', story, 'edit', body, true], ['pm', newTask, 'write', null, false], ['pm', 'social-pin/needs-decisions/ND-99 A new question.md', 'write', null, true], ['pm', 'social-pin/design/Screen Index.md', 'edit', body, true],
    ['pm', bd, 'edit', body, false], ['pm', bd, 'edit', flag, true], ['pm', fr, 'edit', sign, true], ['pm', 'rules/Agent Rules.md', 'edit', body, false], ['pm', bi, 'edit', body, false], ['pm', 'social-pin/Card Index.md', 'edit', body, false],
    ['backend', bd, 'write', null, true], ['backend', newBd, 'write', null, true], ['backend', bi, 'edit', body, true], ['backend', 'social-pin/backend/Architecture.md', 'edit', body, true], ['backend', 'social-pin/frontend/Frontend API Guide.md', 'edit', body, true],
    ['backend', fr, 'edit', body, true], ['backend', fr, 'write', null, false], ['backend', feature, 'edit', body, true], ['backend', feature, 'write', null, false], ['backend', story, 'edit', body, false], ['backend', story, 'edit', flag, true],
    ['backend', fd, 'edit', body, false], ['backend', newQa, 'write', null, false], ['backend', 'social-pin/frontend/Frontend Contract.md', 'edit', body, false], ['backend', 'social-pin/design/Wireframe Brief.md', 'edit', body, false],
    ['frontend', fr, 'write', null, true], ['frontend', fd, 'edit', body, true], ['frontend', 'social-pin/frontend/Frontend Contract.md', 'edit', body, true], ['frontend', 'social-pin/frontend/Frontend API Guide.md', 'edit', body, false],
    ['frontend', bd, 'edit', body, false], ['frontend', bd, 'edit', flag, true], ['frontend', story, 'edit', sign, false],
    ['qa', newQa, 'write', null, true], ['qa', 'social-pin/modules/Identity Core/features/Rings/flow/QF-99 Rings QA Frontend.md', 'write', null, true], ['qa', story, 'edit', sign, false], ['qa', story, 'edit', body, false], ['qa', bd, 'edit', flag, true], ['qa', bd, 'edit', body, false],
    // needs-decision cards (ND-NN): anyone raises and fills them, draft or open; nobody types them decided or fulfilled, not even the PM or the owner (Agent Rules §4)
    ['owner', newDec, 'write', openWrite, true], ['owner', newDec, 'write', decidedWrite, false], ['owner', dec, 'edit', decideSign, false], ['owner', dec, 'edit', openSign, true],
    ['pm', newDec, 'write', decidedWrite, false], ['pm', dec, 'edit', decideSign, false], ['pm', dec, 'edit', fulfilSign, false], ['pm', dec, 'edit', openSign, true], ['pm', dec, 'edit', decBody, true],
    ['backend', newDec, 'write', openWrite, true], ['backend', dec, 'edit', decBody, true], ['backend', dec, 'edit', openSign, true], ['backend', dec, 'edit', decideSign, false], ['backend', newDec, 'write', decidedWrite, false],
    ['frontend', newDec, 'write', openWrite, true], ['frontend', dec, 'edit', decBody, true], ['frontend', dec, 'edit', decideSign, false],
    ['qa', newDec, 'write', openWrite, true], ['qa', dec, 'edit', decBody, true], ['qa', dec, 'edit', decideSign, false], ['qa', newDec, 'write', decidedWrite, false],
    // decision cards (D-NN) hold the answer: written, and set decided, by the PM or the owner only; the Decisions table is theirs too
    ['owner', newRec, 'write', recWrite, true], ['pm', newRec, 'write', recWrite, true], ['backend', newRec, 'write', recWrite, false], ['frontend', newRec, 'write', recWrite, false], ['qa', newRec, 'write', recWrite, false],
    ['pm', 'social-pin/decisions/D-09 30-minute hold tied to the Stripe checkout.md', 'edit', recDecide, true], ['owner', 'social-pin/decisions/D-09 30-minute hold tied to the Stripe checkout.md', 'edit', recDecide, true], ['backend', 'social-pin/decisions/D-09 30-minute hold tied to the Stripe checkout.md', 'edit', recDecide, false],
    ['pm', 'social-pin/decisions/Decisions.md', 'edit', body, true], ['owner', 'social-pin/decisions/Decisions.md', 'edit', body, true], ['backend', 'social-pin/decisions/Decisions.md', 'edit', body, false],
    // reserved fields: a feature's release and the project's stage are the owner's; everyone else's edit or rewrite that changes the line is refused
    ['owner', feature, 'edit', relSet, true], ['pm', feature, 'edit', relSet, false], ['backend', feature, 'edit', relSet, false], ['pm', feature, 'edit', relKeep, true],
    ['pm', feature, 'write', relWriteSame, true], ['pm', feature, 'write', relWriteNew, false], ['owner', feature, 'write', relWriteNew, true],
    ['owner', overview, 'edit', stageSet, true], ['pm', overview, 'edit', stageSet, false], ['pm', overview, 'edit', body, true], ['admin', overview, 'edit', stageSet, true], ['admin', feature, 'edit', relSet, true],
    // bug cards (type: bug, B-NN): QA files them and closes or reopens them after the re-test, the PM closes them too; no other role writes one
    ['qa', bug, 'edit', body, true], ['qa', newBug, 'write', null, true], ['pm', bug, 'edit', body, true], ['pm', newBug, 'write', null, true],
    ['backend', bug, 'edit', body, false], ['backend', bug, 'edit', flag, true], ['frontend', bug, 'edit', body, false], ['owner', bug, 'edit', body, false], ['backend', newBug, 'write', null, false],
    // ...but the backend and the frontend (bugStatuses) move a bug they fix to in-progress, then ready; never done, never back from done, never a resolution
    ['backend', bug, 'edit', bugStart, true], ['backend', bug, 'edit', bugReady, true], ['frontend', bug, 'edit', bugStart, true], ['frontend', bug, 'edit', bugReady, true],
    ['backend', bug, 'edit', bugDone, false], ['backend', bug, 'edit', bugReopen, false], ['backend', bug, 'edit', bugResolve, false], ['backend', bug, 'edit', bugReadyBody, false], ['backend', bug, 'edit', bugReadyLine, true], ['backend', bug, 'edit', bugReadyPrio, false],['backend', bug, 'write', null, false],
    ['owner', bug, 'edit', bugStart, false], ['pm', bug, 'edit', bugStart, true], ['qa', bug, 'edit', bugReopenTodo, true], ['qa', bug, 'edit', bugDone, true],
    // the admin (writes.all): the guard refuses it nothing, the generated files and the verbatim brief included
    ['admin', 'tree/tree.json', 'write', null, true], ['admin', 'social-pin/Card Index.md', 'edit', body, true], ['admin', 'social-pin/design/Wireframe Brief.md', 'edit', body, true], ['admin', 'rules/Agent Rules.md', 'write', null, true],
    ['admin', bd, 'write', null, true], ['admin', fd, 'edit', body, true], ['admin', story, 'edit', sign, true], ['admin', story, 'edit', body, true], ['admin', dec, 'edit', decideSign, true], ['admin', newDec, 'write', decidedWrite, true],
  ];
  let bad = 0;
  for (const [id, rel, op, edit, expected] of M) {
    const a = agentOf(id); if (!a) { console.error(`no agent ${id}`); bad++; continue; }
    const d = decide(a, rel, op, edit);
    const ok = d.allow === expected;
    if (!ok) bad++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${id.padEnd(8)} ${op.padEnd(5)} ${expected ? 'allow' : 'deny '} ${rel}${ok ? '' : `\n     got ${d.allow ? 'allow' : 'deny'}: ${d.message || ''}`}`);
  }
  // two sessions in one folder, with different agents: the real hooks run against a temporary marker folder, which starts as the old shared file
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-guard-'));
  const marker = path.join(tmp, '.active-agent');
  fs.writeFileSync(marker, 'owner\n');
  const hook = (hookCmd, sid, payload) => spawnSync(process.execPath, [fileURLToPath(import.meta.url), hookCmd], {
    input: JSON.stringify({ session_id: sid, ...payload }), encoding: 'utf8', env: { ...process.env, AGENT_GUARD_MARKER: marker, CLAUDE_CODE_SESSION_ID: '' },
  });
  const agentIn = (sid) => { try { return fs.readFileSync(path.join(marker, sid), 'utf8').trim() || null; } catch { return null; } };
  const write = (file) => ({ tool_name: 'Write', tool_input: { file_path: file, content: 'x\n' } });
  const S = [
    // session, hook, payload, expected exit, each session's agent afterwards
    ['A', 'check', write(overview), 2, { A: null, B: null }], // the old shared marker grants nobody
    ['A', 'prompt', { prompt: '/owner write the glossary' }, 0, { A: 'owner', B: null }],
    ['B', 'prompt', { prompt: '/backend write the delivery' }, 0, { A: 'owner', B: 'backend' }],
    ['A', 'check', write(overview), 0, { A: 'owner', B: 'backend' }],
    ['B', 'check', write(overview), 2, { A: 'owner', B: 'backend' }],
    ['B', 'check', write(bd), 0, { A: 'owner', B: 'backend' }],
    ['A', 'check', write(bd), 2, { A: 'owner', B: 'backend' }],
    ['C', 'session', {}, 0, { A: 'owner', B: 'backend', C: null }], // a third session starting clears only its own entry
    ['C', 'check', write(overview), 2, { A: 'owner', B: 'backend', C: null }],
    ['B', 'prompt', { prompt: '/agent off' }, 0, { A: 'owner', B: null }],
    ['B', 'check', write(bd), 2, { A: 'owner', B: null }],
    ['A', 'check', write(overview), 0, { A: 'owner', B: null }],
    ['B', 'prompt', { prompt: '/qa' }, 0, { A: 'owner', B: 'qa' }],
    ['A', 'session', {}, 0, { A: null, B: 'qa' }], // /clear or a restart of session A
  ];
  let sBad = 0;
  for (const [sid, hookCmd, payload, exit, want] of S) {
    const r = hook(hookCmd, sid, payload);
    const got = Object.fromEntries(Object.keys(want).map((k) => [k, agentIn(k)]));
    const ok = r.status === exit && Object.keys(want).every((k) => got[k] === want[k]);
    if (!ok) sBad++;
    const what = payload.prompt || payload.tool_input?.file_path || '';
    console.log(`${ok ? 'ok  ' : 'FAIL'} session ${sid} ${hookCmd.padEnd(7)} exit ${exit} ${what}${ok ? '' : `\n     got exit ${r.status}, agents ${JSON.stringify(got)}, want ${JSON.stringify(want)}${r.stderr ? `: ${r.stderr.trim()}` : ''}`}`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`${M.length - bad} of ${M.length} rows as expected; ${S.length - sBad} of ${S.length} two-session rows as expected`);
  process.exit(bad || sBad ? 1 : 0);
}
console.error(`unknown command "${cmd}": prompt | session | check | bash | status | selftest`);
process.exit(1);
