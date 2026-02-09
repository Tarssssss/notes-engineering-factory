import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, writeText, today } from './_common.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/new-project.mjs <project-slug>');
  process.exit(1);
}

const projectDir = path.join(process.cwd(), 'projects', slug);
ensureDir(projectDir);

const prd = `---
project: ${slug}
status: draft
priority: P1
owner: me
created_at: ${today()}
updated_at: ${today()}
target_date:
links: []
---

## 背景与问题

## 目标与非目标

### Goals

### Non-Goals

## 用户场景与关键流程

## 方案细节（功能/交互/数据）

## 里程碑与任务拆解

## 验收标准（DoD）

## 风险与回滚策略

## 开放问题
`;

const tasks = `# Tasks

## Active Queue

| Task ID | Project | Source Note | Summary | Priority | Status | Due | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
`;

const review = `# Review

## Change Summary

## Risk Level

- High:
- Medium:
- Low:

## Findings

## Test Results

- Unit/Automation:
- Manual Critical Path:
- Regression:

## Gate Decision

- Go
- Conditional Go
- No-Go
`;

const weekly = `# Weekly Focus

## This Week Priorities

## P0 Must-Do

## Near-Due P1 (within 7 days)

## Carry Over

## Metrics

- Tasks closed:
- AI suggestion accepted:
- AI suggestion acceptance rate:
`;

writeText(path.join(projectDir, 'PRD.md'), prd);
writeText(path.join(projectDir, 'Tasks.md'), tasks);
writeText(path.join(projectDir, 'Review.md'), review);
writeText(path.join(projectDir, 'Weekly.md'), weekly);

console.log(`Created project scaffold at projects/${slug}`);
