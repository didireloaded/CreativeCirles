# Communication Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Inbox into credible direct/group communication while keeping calling preview-only.
**Architecture:** Conversation entities store messages, attachments, reactions, replies, read state, and activity locally; call controls remain non-networked previews.
**Tech Stack:** React, TypeScript, Vitest, Testing Library, CSS.
**Spec:** `docs/superpowers/specs/2026-09-12-complete-frontend-product-design.md`

## Global Constraints
- Do not request microphone/camera permissions.
- Mark presence, typing, delivery, and calls as preview behavior.
- Attachments use local metadata/object previews only.

---

### Task 1: Direct and group messaging
- [ ] Add failing tests for compose, groups, unread/read, history, search, and conversation actions.
- [ ] Extend `src/redesign/Inbox.tsx` and domain conversation actions.
- [ ] Verify tests and commit `feat: expand conversation management`.

### Task 2: Rich message interactions
- [ ] Add failing tests for image/video/audio/file attachments, replies, reactions, edit, delete, and task conversion.
- [ ] Implement `src/redesign/messages/MessageComposer.tsx` and `MessageActions.tsx`.
- [ ] Verify tests and commit `feat: add rich message interactions`.

### Task 3: Calls and preferences
- [ ] Add failing tests for call history, coming-soon states, and notification preferences.
- [ ] Extend `src/redesign/calls/CallPreview.tsx` and add `src/redesign/messages/CommunicationSettings.tsx`.
- [ ] Verify tests and commit `feat: complete communication previews`.

