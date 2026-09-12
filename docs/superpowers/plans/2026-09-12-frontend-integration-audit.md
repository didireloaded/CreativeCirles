# Frontend Integration Audit Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the complete frontend behaves as one coherent, accessible, responsive PWA.
**Architecture:** Add integration coverage around shared route intents and audit every screen against the established visual tokens and state contract.
**Tech Stack:** React, TypeScript, Vitest, Testing Library, Playwright, CSS.
**Spec:** `docs/superpowers/specs/2026-09-12-complete-frontend-product-design.md`

## Global Constraints
- Test 320px, 390px, tablet, and desktop layouts.
- Preserve reduced-motion, focus-visible, safe-area, and keyboard support.
- Do not hide incomplete behavior behind success toasts.

---

### Task 1: Cross-feature journeys
- [ ] Add Playwright journeys for job-to-project, talent-to-collaboration, buzz-to-task, skill-swap-to-project, message-to-task, AI-to-project, and service-inquiry-to-booking.
- [ ] Fix only observed integration defects and rerun each journey.
- [ ] Commit `test: cover connected product journeys`.

### Task 2: Responsive and accessibility audit
- [ ] Add viewport and keyboard checks in `tests/frontend-audit.spec.ts`.
- [ ] Audit semantic names, contrast, focus order, dialogs, touch targets, overflow, and motion; fix defects in affected component CSS.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e`.
- [ ] Commit `fix: complete frontend quality audit`.

### Task 3: Handoff and release evidence
- [ ] Inspect `git diff`, confirm no payment implementation or unrelated changes, and update `AGENT_HANDOFF.md` with verified commands and remaining backend boundaries.
- [ ] Capture representative route screenshots for review without altering source assets.
- [ ] Commit `docs: record complete frontend verification`.
