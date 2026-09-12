# AI Studio and Contracts Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build useful deterministic previews for creative planning tools, templates, and legal documents.
**Architecture:** A local prompt engine maps structured inputs to deterministic outputs; saved outputs enter the shared domain repository and can link to projects/tasks.
**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS.
**Spec:** `docs/superpowers/specs/2026-09-12-complete-frontend-product-design.md`

## Global Constraints
- Label all generated content as a local preview, not AI service output.
- Contracts carry a visible legal-review disclaimer.
- Never claim a document was signed, sent, or downloaded if it was not.

---

### Task 1: AI Studio shell and generator
- [ ] Add failing tests for tool selection, validation, deterministic generation, history, copy, and save.
- [ ] Implement `src/redesign/ai/AiStudio.tsx`, `generators.ts`, and `ai-studio.css` for contract, shot list, storyboard, bio, pitch, and pricing tools.
- [ ] Verify tests and commit `feat: add local creative assistant studio`.

### Task 2: Templates and contracts
- [ ] Add failing tests for categories, ratings presentation, saved templates, contract variants, and disclaimer.
- [ ] Implement `TemplateLibrary.tsx` and `Contracts.tsx`.
- [ ] Verify tests and commit `feat: add template and contract previews`.

### Task 3: Cross-feature output actions
- [ ] Add failing tests for output-to-project, task, contract, and idea flows.
- [ ] Implement repository actions and route intents.
- [ ] Verify tests and commit `feat: connect creative assistant outputs`.

