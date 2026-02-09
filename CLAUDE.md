# CLAUDE.md

## 项目概述

这是一个 Obsidian vault，用于个人知识管理，通过 iCloud 同步。

## 语言与风格

- 默认以**中文**进行对话和输出
- 英文专有名词保持原文，不做翻译（例如：TypeScript、React、Node.js、Obsidian、Claude Code、API、SDK 等）
- 输出风格为 Explanatory（详细解释型），提供充分的推理过程和背景说明

## 编码偏好

- 主要语言：TypeScript / JavaScript
- 优先使用现代 ES 语法（`const`/`let`、箭头函数、`async`/`await`、optional chaining）
- 偏好函数式风格，避免不必要的 class
- 使用严格的 TypeScript 类型，避免 `any`
- 命名规范：变量和函数使用 camelCase，类型和接口使用 PascalCase，常量使用 UPPER_SNAKE_CASE

## Obsidian Vault 规范

- 笔记文件名使用有意义的中文或英文短语，避免日期前缀（除非是日记）
- 善用 `[[双向链接]]` 建立笔记之间的关联
- 使用标签（`#标签`）进行分类，标签可以中英混用
- 文件夹结构按主题组织，保持扁平，避免过深嵌套

## 通用指南

- 编辑文件前先阅读已有内容，理解上下文
- 保持简洁，不做过度工程化
- 只在被明确要求时才创建新文件
