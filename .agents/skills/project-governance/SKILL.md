---
name: project-governance
description: Mandatory repository governance for all coding, debugging, refactoring, reviewing, architecture, UI, backend, database, dependency, testing, and implementation tasks. Use this skill whenever any source code, configuration, schema, dependency, UI, backend, or project file may be created, changed, removed, reviewed, or fixed.
---

# Project Governance Enforcement

Before doing any implementation work in this repository:

1. Read `/PROJECT_GOVERNANCE.md` in full.
2. Read `/AGENT_HANDOFF.md` if it exists.
3. Follow `.agents/AGENTS.md`.
4. Inspect the existing repository and Git state before editing.

`PROJECT_GOVERNANCE.md` is the authoritative shared engineering policy for this project.

This repository is shared between OpenAI Codex and Google Antigravity.

Do not build an alternative Antigravity interpretation of the application.

Do not rewrite Codex-established architecture merely because another solution seems preferable.

Do not overwrite valid changes made by another agent.

Use existing architecture, components, services, types, schemas, design language, and conventions wherever possible.

Make the smallest safe change that satisfies the user's request.

Before completion:

- inspect the diff
- run relevant validation
- check for regressions
- update `AGENT_HANDOFF.md` after meaningful work
- report only verification that was actually performed

If any instruction in this skill conflicts with `PROJECT_GOVERNANCE.md`, the governance file wins.
