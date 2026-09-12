# Community and Trust Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete feed creation, community participation, feedback, and safety controls.
**Architecture:** Extend existing posts/stories and community detail with shared moderation and relationship state applied across selectors.
**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS.
**Spec:** `docs/superpowers/specs/2026-09-12-complete-frontend-product-design.md`

## Global Constraints
- Preserve current immersive feed and story styling.
- Anonymous critique hides identity in presentation only and is labeled preview.
- Blocked/muted users disappear consistently from feed, discovery, and messaging.

---

### Task 1: Rich community composer and filters
- [ ] Add failing tests for category filters, media types, feedback aspects, edit/delete, pagination, and refresh.
- [ ] Extend `src/redesign/CreateFlow.tsx`, `Home.tsx`, and domain actions.
- [ ] Verify targeted tests and commit `feat: complete community publishing preview`.

### Task 2: Communities and feedback
- [ ] Add failing tests for join/leave, create community, discussion, critique request, and anonymous response.
- [ ] Extend `src/redesign/details/CommunityDetail.tsx` and add `src/redesign/community/CommunityComposer.tsx`.
- [ ] Verify targeted tests and commit `feat: add community feedback workflows`.

### Task 3: Trust and safety
- [ ] Add failing tests for verification presentation, report, block, mute, undo, and cross-app filtering.
- [ ] Implement `src/redesign/safety/SafetySheet.tsx` and shared moderation selectors.
- [ ] Verify tests and commit `feat: add trust and safety controls`.

