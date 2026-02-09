import fs from 'node:fs';
import path from 'node:path';
import { requiredSectionsPresent, walkMarkdownFiles, writeText } from './_common.mjs';

const root = process.cwd();
const noteDirs = [path.join(root, 'notes', 'books'), path.join(root, 'notes', 'business')];

const issues = [];
for (const dir of noteDirs) {
  for (const file of walkMarkdownFiles(dir)) {
    const content = fs.readFileSync(file, 'utf8');
    const check = requiredSectionsPresent(content);
    for (const item of check) {
      if (!item.ok) {
        issues.push(`- Missing section ${item.heading} in ${path.relative(root, file)}`);
      }
    }
  }
}

const decision = issues.length ? 'Conditional Go' : 'Go';
const now = new Date().toISOString();

const report = [
  '# Review Check Report',
  '',
  `Generated at: ${now}`,
  '',
  '## Findings',
  '',
  ...(issues.length ? issues : ['- No structural issues found.']),
  '',
  '## Gate Decision',
  '',
  `- ${decision}`,
].join('\n');

const outPath = path.join(root, 'system', 'logs', 'review-check-latest.md');
writeText(outPath, report);
console.log(`Wrote ${path.relative(root, outPath)} with decision: ${decision}`);
