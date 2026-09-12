# AGENTS.md

# Codex Project Instructions

These instructions are mandatory for OpenAI Codex and any Codex sub-agent operating in this repository.

## Highest-priority project rule

Before planning, coding, refactoring, reviewing, debugging, or modifying this repository, read:

`PROJECT_GOVERNANCE.md`

Treat it as the repository-wide engineering constitution.

Also read:

`AGENT_HANDOFF.md`

when it exists.

## Shared-agent environment

This repository may also be edited by Google Antigravity.

Do not assume code you did not write is incorrect.

Do not revert Antigravity work merely because implementation style differs from your preferred approach.

Evaluate existing code against:

- the user's requirements
- `PROJECT_GOVERNANCE.md`
- approved project specifications
- established architecture
- tests
- correctness
- security
- maintainability

If Antigravity introduced a valid improvement, preserve it.

If Antigravity introduced a defect, fix the defect with the smallest safe change.

## Codex baseline responsibility

Codex is the primary baseline environment for this workflow.

Your responsibility is to maintain architectural continuity, not to enforce Codex-specific coding taste.

Do not use baseline status as justification for reverting valid newer code.

The newest approved repository state is the implementation baseline.

## Required start procedure

Before editing:

1. Read `PROJECT_GOVERNANCE.md`.
2. Read `AGENT_HANDOFF.md` if present.
3. Run or inspect `git status`.
4. Inspect recent history where useful.
5. Read the existing implementation of the affected feature.
6. Search for existing components/services/helpers/types before creating new ones.
7. Plan the smallest compatible change.

## Required finish procedure

Before declaring completion:

1. Inspect the diff.
2. Run relevant typecheck/lint/tests/build where available.
3. Confirm no unrelated code was changed accidentally.
4. Confirm existing behavior was preserved.
5. Update `AGENT_HANDOFF.md` after meaningful work.
6. State what was actually verified.

Never claim success without verification.

## Conflict rule

If this file conflicts with `PROJECT_GOVERNANCE.md`, the governance file wins.

If the user's latest explicit instruction conflicts with this file, the user's instruction wins unless doing so would require an unsafe or destructive action that should be surfaced first.

## Core instruction

**Continue the current project. Do not redesign it according to model preference.**
