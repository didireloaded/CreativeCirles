# Opportunities Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Creative Buzz, nearby discovery, skill swaps, and a unified saved/search experience.
**Architecture:** Opportunity types share save/reminder/task actions while their feature screens retain domain-specific filters.
**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS.
**Spec:** `docs/superpowers/specs/2026-09-12-complete-frontend-product-design.md`

## Global Constraints
- Nearby uses user-entered/manual preview location only.
- External links are labeled and never imply an application was submitted.
- Saved state must be visible from a single collection.

---

### Task 1: Creative Buzz
- [ ] Add failing tests for news/grants/workshops/competitions filters, detail, save, share, reminder, and task creation.
- [ ] Implement `src/redesign/opportunities/CreativeBuzz.tsx`, `OpportunityDetail.tsx`, and `opportunities.css`.
- [ ] Verify tests and commit `feat: add creative opportunities hub`.

### Task 2: Nearby and skill swap
- [ ] Add failing tests for manual location, radius/filter state, swap offer/request, and conversation handoff.
- [ ] Implement `NearbyTalent.tsx` and `SkillSwap.tsx` within the opportunities module.
- [ ] Verify tests and commit `feat: add nearby and skill swap previews`.

### Task 3: Global saved and search
- [ ] Add failing tests for cross-type search, saved filters, remove/undo, and route restoration.
- [ ] Implement `src/redesign/search/GlobalSearch.tsx` and `SavedItems.tsx`.
- [ ] Verify tests and commit `feat: add global search and saved items`.

