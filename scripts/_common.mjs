import fs from 'node:fs';
import path from 'node:path';

export const ROOT = process.cwd();

export const PRIORITY_ORDER = { P0: 0, P1: 1, P2: 2 };

export function walkMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

export function toPosixPath(p) {
  return p.split(path.sep).join('/');
}

export function getRelative(p) {
  return toPosixPath(path.relative(ROOT, p));
}

export function extractTodoLines(content) {
  const lines = content.split(/\r?\n/);
  const todos = [];
  const regex = /^- \[( |x|X)\] \[(P[0-2])\]\[(\d{4}-\d{2}-\d{2})\] (.+)$/;
  for (const line of lines) {
    const m = line.match(regex);
    if (m) {
      todos.push({
        done: m[1].toLowerCase() === 'x',
        priority: m[2],
        due: m[3],
        summary: m[4].trim(),
        raw: line,
      });
    }
  }
  return todos;
}

export function sortByPriorityAndDue(items) {
  return [...items].sort((a, b) => {
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (p !== 0) return p;
    return a.due.localeCompare(b.due);
  });
}

export function requiredSectionsPresent(content) {
  const required = [
    '## 核心观点',
    '## 未解决问题',
    '## TODO',
    '## AI建议区',
    '## 决策与结论',
  ];
  return required.map((h) => ({ heading: h, ok: content.includes(h) }));
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}
