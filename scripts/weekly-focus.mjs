import fs from 'node:fs';
import path from 'node:path';
import { PRIORITY_ORDER, writeText } from './_common.mjs';

const root = process.cwd();
const tasksPath = path.join(root, 'projects', 'mission-mvp', 'Tasks.md');
if (!fs.existsSync(tasksPath)) {
  console.error('Tasks file not found. Run sync-backlog first.');
  process.exit(1);
}

const content = fs.readFileSync(tasksPath, 'utf8');
const lines = content.split(/\r?\n/);
const rowRegex = /^\| (T-\d+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| (P[0-2]) \| ([^|]+) \| (\d{4}-\d{2}-\d{2}) \|/;

const rows = [];
for (const line of lines) {
  const m = line.match(rowRegex);
  if (m) {
    rows.push({
      id: m[1].trim(),
      project: m[2].trim(),
      source: m[3].trim(),
      summary: m[4].trim(),
      priority: m[5].trim(),
      status: m[6].trim(),
      due: m[7].trim(),
    });
  }
}

const today = new Date();
const weekLater = new Date(today.getTime() + 7 * 24 * 3600 * 1000);

const active = rows.filter((r) => r.status !== 'Done');
const p0 = active.filter((r) => r.priority === 'P0');
const nearDueP1 = active.filter((r) => r.priority === 'P1' && new Date(`${r.due}T00:00:00`) <= weekLater);

const sorted = [...active].sort((a, b) => {
  const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  if (p !== 0) return p;
  return a.due.localeCompare(b.due);
});

const closed = rows.filter((r) => r.status === 'Done').length;

const report = [
  '# Weekly Focus',
  '',
  '## This Week Priorities',
  '',
  ...sorted.slice(0, 8).map((r) => `- ${r.id} [${r.priority}] (${r.due}) ${r.summary}`),
  '',
  '## P0 Must-Do',
  '',
  ...(p0.length ? p0.map((r) => `- ${r.id} (${r.due}) ${r.summary}`) : ['- None']),
  '',
  '## Near-Due P1 (within 7 days)',
  '',
  ...(nearDueP1.length ? nearDueP1.map((r) => `- ${r.id} (${r.due}) ${r.summary}`) : ['- None']),
  '',
  '## Carry Over',
  '',
  '- Update during weekly review',
  '',
  '## Metrics',
  '',
  `- Tasks closed: ${closed}`,
  '- AI suggestion accepted: 0',
  '- AI suggestion acceptance rate: 0%',
  '',
  `> Generated at: ${new Date().toISOString()}`,
].join('\n');

writeText(path.join(root, 'projects', 'mission-mvp', 'Weekly.md'), report);
console.log('Updated projects/mission-mvp/Weekly.md');
