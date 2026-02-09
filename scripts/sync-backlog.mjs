import fs from 'node:fs';
import path from 'node:path';
import {
  extractTodoLines,
  getRelative,
  sortByPriorityAndDue,
  walkMarkdownFiles,
  writeText,
} from './_common.mjs';

const root = process.cwd();
const noteDirs = [path.join(root, 'notes', 'books'), path.join(root, 'notes', 'business')];

let rows = [];
for (const dir of noteDirs) {
  for (const file of walkMarkdownFiles(dir)) {
    const content = fs.readFileSync(file, 'utf8');
    const todos = extractTodoLines(content);
    for (const t of todos) {
      rows.push({
        project: 'notes-engineering-mvp',
        source: getRelative(file),
        summary: t.summary.replace(/\|/g, '/'),
        priority: t.priority,
        status: t.done ? 'Done' : 'Todo',
        due: t.due,
      });
    }
  }
}

rows = sortByPriorityAndDue(rows);

const header = [
  '# Tasks',
  '',
  '## Active Queue',
  '',
  '| Task ID | Project | Source Note | Summary | Priority | Status | Due | Evidence |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
];

const body = rows.map((r, i) => `| T-${String(i + 1).padStart(3, '0')} | ${r.project} | ${r.source} | ${r.summary} | ${r.priority} | ${r.status} | ${r.due} |  |`);

const footer = [
  '',
  '## Status Legend',
  '',
  '- Todo',
  '- Doing',
  '- Blocked',
  '- Done',
  '',
  `> Last synced: ${new Date().toISOString()}`,
];

const output = [...header, ...body, ...footer].join('\n');
const target = path.join(root, 'projects', 'mission-mvp', 'Tasks.md');
writeText(target, output);

console.log(`Synced ${rows.length} TODOs to projects/mission-mvp/Tasks.md`);
