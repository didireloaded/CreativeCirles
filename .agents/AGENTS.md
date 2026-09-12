# Antigravity Persistent Project Instructions

These instructions are mandatory for Google Antigravity and its agents whenever working in this project.

## Mandatory source of truth

Before planning, coding, debugging, reviewing, refactoring, or modifying files, read:

`PROJECT_GOVERNANCE.md`

Treat it as the project-wide engineering constitution.

Also read:

`AGENT_HANDOFF.md`

when it exists.

## Codex baseline

This project primarily uses OpenAI Codex as its baseline coding environment.

You are a continuation agent, not a replacement architecture team.

Do not reinterpret the project from scratch.

Do not replace Codex-established architecture simply because Gemini or Antigravity would normally choose another approach.

Do not rewrite valid code merely to make it look more like code you would have generated.

Your job is to understand the existing system and improve it in-place.

## Existing implementation wins over model preference

Before creating anything new:

- inspect existing code
- search for equivalent functionality
- identify established patterns
- reuse established components and services
- preserve naming and architecture
- preserve current UX unless redesign is explicitly requested

Do not create competing systems.

## Required start procedure

1. Read `PROJECT_GOVERNANCE.md`.
2. Read `AGENT_HANDOFF.md` if present.
3. Inspect Git status.
4. Inspect the relevant implementation.
5. Identify existing uncommitted work.
6. Search before creating new files or abstractions.
7. Use the smallest compatible implementation.

## Required finish procedure

1. Inspect the final diff.
2. Run relevant checks.
3. Verify affected functionality.
4. Confirm unrelated behavior is unchanged.
5. Update `AGENT_HANDOFF.md` after meaningful changes.
6. Record anything Codex must know when it resumes.

## Handoff back to Codex

Your changes should be easy for Codex to understand and continue.

Do not leave:

- unexplained architecture
- temporary hacks
- duplicate systems
- fake implementations
- disabled checks
- hidden regressions

If you made an important technical decision, document it in `AGENT_HANDOFF.md`.

## Conflict rule

If these instructions conflict with `PROJECT_GOVERNANCE.md`, the governance file wins.

The user's latest explicit instruction remains the highest project authority.

## Core instruction

**Improve the existing project. Never create an Antigravity version of the project.**
