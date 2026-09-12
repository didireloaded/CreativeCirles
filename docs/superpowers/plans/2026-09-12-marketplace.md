# Marketplace Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build jobs, applicant tracking, and talent discovery as connected local-preview workflows.
**Architecture:** Marketplace pages use shared domain selectors/actions and open existing Inbox, Tasks, and Workspace flows through route intents.
**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS.
**Spec:** `docs/superpowers/specs/2026-09-12-complete-frontend-product-design.md`

## Global Constraints

- Keep preview data deterministic and clearly local.
- Provide filter, populated, empty, and saved states.
- No payment or contract execution.

---

### Task 1: Jobs board and detail
- [ ] Add failing tests in `src/redesign/jobs/__tests__/jobs.test.tsx` for search, category/type filters, save/share, detail, and application draft.
- [ ] Implement `src/redesign/jobs/Jobs.tsx`, `JobDetail.tsx`, `JobApplication.tsx`, and `jobs.css` using domain actions.
- [ ] Verify `npm test -- jobs` and commit `feat: add jobs marketplace`.

### Task 2: Applicant tracking
- [ ] Add failing tests for applicant stage changes, notes, and opening a conversation/project.
- [ ] Implement `src/redesign/jobs/Applicants.tsx` with accessible status controls and local audit activity.
- [ ] Verify targeted tests and commit `feat: add applicant tracking preview`.

### Task 3: Talent finder
- [ ] Add failing tests in `src/redesign/talent/__tests__/talent.test.tsx` for filters, sort, grid/list, saves, compare, and collaboration requests.
- [ ] Implement `src/redesign/talent/TalentFinder.tsx`, `TalentCompare.tsx`, and `talent.css`.
- [ ] Wire collaboration to Inbox and project creation; verify targeted tests and commit `feat: add talent finder workflows`.

