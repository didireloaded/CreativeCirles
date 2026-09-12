# Product Foundation and Tools Hub Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a typed local product repository, secondary route model, and polished Tools hub without changing the five primary tabs.
**Architecture:** Extend the existing React Router shell with explicit secondary pages. New feature screens consume a versioned repository through a React provider rather than reading raw localStorage.
**Tech Stack:** React 18, TypeScript, React Router, Vitest, Testing Library, CSS.
**Spec:** `docs/superpowers/specs/2026-09-12-complete-frontend-product-design.md`

## Global Constraints

- Preserve Home, Discover, Create, Tasks, and Inbox as primary tabs.
- Label local-only and preview behavior honestly; never simulate remote success.
- Reuse the current warm glass visual system and accessible interaction patterns.
- Exclude payments and checkout.

---

### Task 1: Versioned local repository

- [ ] Add failing repository tests in `src/redesign/domain/__tests__/repository.test.ts` for seeded reads, immutable updates, persistence, reset, and corrupt-data recovery.
- [ ] Add domain entities in `src/redesign/domain/types.ts`, seeds in `src/redesign/domain/seeds.ts`, and repository implementation in `src/redesign/domain/repository.ts`.
- [ ] Run `npm test -- repository.test.ts`; expect failure before implementation and pass afterward.
- [ ] Commit: `feat: add local product domain repository`.

### Task 2: Provider and secondary routing

- [ ] Add failing tests in `src/redesign/__tests__/secondary-routing.test.tsx` covering `/tools`, direct secondary URLs, back navigation, and unchanged primary navigation.
- [ ] Add `src/redesign/domain/DomainProvider.tsx`, `src/redesign/routing.ts`, and extend `src/redesign/types.ts` and `src/redesign/App.tsx`.
- [ ] Run `npm test -- secondary-routing.test.tsx`; expect pass after implementation.
- [ ] Commit: `feat: add secondary product routing`.

### Task 3: Tools hub

- [ ] Add failing UI tests in `src/redesign/__tests__/tools-hub.test.tsx` for every approved module card and keyboard navigation.
- [ ] Add `src/redesign/tools/ToolsHub.tsx` and `src/redesign/tools/tools.css`; link it from Discover, Profile, and Workspace.
- [ ] Include loading, empty, offline, and error presentations using existing async-state components.
- [ ] Run `npm test -- tools-hub.test.tsx` and `npm run typecheck`.
- [ ] Commit: `feat: add creative tools hub`.

