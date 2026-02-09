import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const now = new Date();
const date = now.toISOString().slice(0, 10);

const dir = path.join(root, 'system', 'logs', 'claude-proposals');
fs.mkdirSync(dir, { recursive: true });

const file = path.join(dir, `${date}.md`);
if (fs.existsSync(file)) {
  console.log(`Proposal already exists: system/logs/claude-proposals/${date}.md`);
  process.exit(0);
}

const content = [
  `# CLAUDE Daily Proposal - ${date}`,
  '',
  '> 仅提案，不直接修改 CLAUDE.md。',
  '',
  '## 提案 1',
  '- 问题: ',
  '- 原因: ',
  '- 改进: ',
  '- 拟写入条目: ',
  '',
  '## 提案 2',
  '- 问题: ',
  '- 原因: ',
  '- 改进: ',
  '- 拟写入条目: ',
  '',
  '## 提案 3',
  '- 问题: ',
  '- 原因: ',
  '- 改进: ',
  '- 拟写入条目: ',
].join('\n');

fs.writeFileSync(file, content, 'utf8');
console.log(`Created system/logs/claude-proposals/${date}.md`);
