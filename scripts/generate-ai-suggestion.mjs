import fs from 'node:fs';
import path from 'node:path';

function usage() {
  console.error('Usage: node scripts/generate-ai-suggestion.mjs --note <path> [--todo "text"] [--model model] [--writeback]');
  process.exit(1);
}

const args = process.argv.slice(2);
function argValue(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

const notePathArg = argValue('--note');
const todoText = argValue('--todo') || '';
const model = argValue('--model') || process.env.GITHUB_MODELS_MODEL || 'openai/gpt-4.1-mini';
const writeBack = args.includes('--writeback');

if (!notePathArg) usage();

const root = process.cwd();
const notePath = path.resolve(root, notePathArg);
if (!fs.existsSync(notePath)) {
  console.error(`Note not found: ${notePathArg}`);
  process.exit(1);
}

const content = fs.readFileSync(notePath, 'utf8');

function section(title) {
  const pattern = new RegExp(`## ${title}\\n([\\s\\S]*?)(?=\\n## |$)`, 'm');
  const m = content.match(pattern);
  return m ? m[1].trim() : '';
}

const payloadContext = {
  notePath: notePathArg,
  corePoints: section('核心观点'),
  unresolved: section('未解决问题'),
  todo: section('TODO'),
  targetTodo: todoText,
};

const prompt = [
  '你是一个研究助理。请根据上下文只输出一个 Markdown 建议块，严格包含以下字段：',
  '- 时间戳',
  '- 目标 TODO',
  '- 推导摘要',
  '- 可执行下一步(30-90分钟)',
  '- 风险/反例',
  '- 置信度(Low/Med/High)',
  '',
  '上下文 JSON:',
  JSON.stringify(payloadContext, null, 2),
].join('\n');

async function generate() {
  const endpoint = process.env.GITHUB_MODELS_ENDPOINT || 'https://models.github.ai/inference/chat/completions';
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

  if (!token) {
    throw new Error('Missing GITHUB_TOKEN/GH_TOKEN');
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub Models API failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const output = data?.choices?.[0]?.message?.content;
  if (!output) {
    throw new Error('No content returned from model');
  }
  return output.trim();
}

function fallbackSuggestion() {
  const timestamp = new Date().toISOString();
  return [
    '### AI 建议草稿（Fallback）',
    '',
    `- 时间戳: ${timestamp}`,
    `- 目标 TODO: ${todoText || '未指定，需人工补充'}`,
    '- 推导摘要: GitHub AI 接口不可用，先使用人工推导模板。',
    '- 可执行下一步(30-90分钟): 明确问题边界，收集2-3条证据后再重试。',
    '- 风险/反例: 当前建议缺乏模型推理支持，可能偏离上下文重点。',
    '- 置信度: Low',
  ].join('\n');
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join(root, 'system', 'logs', 'ai-suggestions');
fs.mkdirSync(outDir, { recursive: true });

let block;
try {
  block = await generate();
} catch (err) {
  console.warn(String(err.message || err));
  block = fallbackSuggestion();
}

const outputFile = path.join(outDir, `${timestamp}-${path.basename(notePath, '.md')}.md`);
fs.writeFileSync(outputFile, `${block}\n`, 'utf8');

if (writeBack) {
  const anchor = '## AI建议区';
  if (content.includes(anchor)) {
    const updated = content.replace(anchor, `${anchor}\n\n${block}\n`);
    fs.writeFileSync(notePath, updated, 'utf8');
  }
}

console.log(`Suggestion written to ${path.relative(root, outputFile)}`);
if (writeBack) {
  console.log(`Write-back enabled for ${notePathArg}`);
}
