# Notes Engineering MVP

This vault is structured as an engineering-style note system for books and business observations.

## Goals

- Track unresolved thinking as executable TODOs
- Generate AI suggestions in review mode (human confirmation required)
- Keep progress visible in backlog and weekly focus notes

## Main Directories

- `notes/books/`
- `notes/business/`
- `projects/mission-mvp/`
- `system/templates/`
- `system/playbooks/`
- `system/logs/`
- `scripts/`
- `.github/workflows/`

## Quick Start

1. Use templates in `system/templates/` to create or normalize notes.
2. Run `node scripts/sync-backlog.mjs` to aggregate TODOs into project tasks.
3. Run `node scripts/weekly-focus.mjs` to generate this week's priorities.
4. Trigger GitHub workflow `ai-todo-suggestion` manually to generate AI suggestion drafts.

## Required TODO Format

```md
- [ ] [P1][2026-02-16] Validate the distribution assumption
```

Priority must be one of `P0`, `P1`, `P2`.
Date must use `YYYY-MM-DD`.
