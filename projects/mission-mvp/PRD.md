---
project: notes-engineering-mvp
status: active
priority: P0
owner: me
created_at: 2026-02-09
updated_at: 2026-02-09
target_date: 2026-02-23
links:
  - notes/books/
  - notes/business/
---

## 背景与问题

我希望把日常读书笔记与商业观察笔记统一到 GitHub 项目中，用工程化方式管理，并让 AI 对未解决 TODO 持续给出可执行推导建议。

## 目标与非目标

### Goals

- 在 2 周内打通笔记到任务闭环。
- 对每条 TODO 可以触发 AI 建议，且人工确认后回写。
- 每周稳定闭环 3-5 个任务。
- AI 建议采纳率达到 50% 以上。

### Non-Goals

- 不做全自动改写主文档。
- 不做多智能体编排。
- 不覆盖日记/灵感等其他笔记类型。

## 用户场景与关键流程

1. 写一篇读书或商业观察笔记。
2. 在 `## TODO` 中记录标准格式任务。
3. 运行同步脚本生成 `Tasks.md`。
4. 在 GitHub 工作流手动触发 AI 建议。
5. 人工确认建议后追加到笔记 `## AI建议区`。
6. 每周复盘采纳率与完成率。

## 方案细节（功能/交互/数据）

- 数据载体：Markdown + Frontmatter。
- 任务约定：`- [ ] [P1][YYYY-MM-DD] 内容`。
- 汇总视图：`projects/mission-mvp/Tasks.md` + `projects/mission-mvp/Weekly.md`。
- AI 输出：结构化建议块，不直接变更任务状态。

## 里程碑与任务拆解

- Week 1: 模板、目录、任务同步、质量校验。
- Week 2: GitHub AI 工作流、人工确认回写、周复盘。

## 验收标准（DoD）

- 可新增符合模板的笔记并通过校验。
- TODO 可被脚本正确汇总。
- AI 建议工作流可生成建议草稿。
- 周报中可计算采纳率与闭环率。

## 风险与回滚策略

- 风险：GitHub AI 接口权限不足。
- 回滚：保留建议模板，使用人工填充，流程仍可运行。

## 开放问题

- 后续是否接入自动定时触发（当前仅手动触发）。
