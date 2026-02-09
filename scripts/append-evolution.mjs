import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const logPath = path.join(root, 'system', 'logs', 'Evolution-Log.md');
const today = new Date().toISOString().slice(0, 10);

const entry = [
  '',
  `## ${today}`,
  '',
  '- Action: ',
  '- Result: ',
  '- Open Issues: ',
  '- Next: ',
].join('\n');

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, '# Evolution Log\n', 'utf8');
}

fs.appendFileSync(logPath, entry, 'utf8');
console.log('Appended daily entry skeleton to system/logs/Evolution-Log.md');
