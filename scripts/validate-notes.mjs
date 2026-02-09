import fs from 'node:fs';
import path from 'node:path';
import { extractTodoLines, requiredSectionsPresent, walkMarkdownFiles } from './_common.mjs';

const root = process.cwd();
const dirs = [path.join(root, 'notes', 'books'), path.join(root, 'notes', 'business')];

let errors = [];
for (const dir of dirs) {
  for (const file of walkMarkdownFiles(dir)) {
    const rel = path.relative(root, file);
    const content = fs.readFileSync(file, 'utf8');

    const sections = requiredSectionsPresent(content);
    for (const s of sections) {
      if (!s.ok) {
        errors.push(`${rel}: missing required heading ${s.heading}`);
      }
    }

    const rawTodoLines = content
      .split(/\r?\n/)
      .filter((line) => line.trimStart().startsWith('- [') && line.includes(']['));

    const parsed = extractTodoLines(content);
    if (rawTodoLines.length !== parsed.length) {
      errors.push(`${rel}: invalid TODO format found. Expected '- [ ] [P1][YYYY-MM-DD] text'`);
    }
  }
}

if (errors.length) {
  console.error('Validation failed:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log('All notes passed template and TODO format validation.');
