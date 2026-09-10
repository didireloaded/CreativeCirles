# Story Engagement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add private replies, likes, and an accessible curved emoji reaction carousel exclusively to Story Viewer.

**Architecture:** Story Viewer owns transient interaction state while a small validated storage module persists likes, reactions, and private preview replies. Interaction controls stop story navigation and pause automatic progression.

**Tech Stack:** React 18, TypeScript, CSS transforms, Pointer Events, Vitest, Testing Library, Playwright

**Spec:** `docs/superpowers/specs/2026-09-10-connected-planning-and-social-ui-design.md`

## Global Constraints

- Story interactions never appear on regular posts.
- Replies are private and represented as locally saved Inbox replies.
- Touch, pointer, and keyboard input must work.
- Reduced motion disables burst and carousel transition effects.
- Controls must remain above mobile safe areas.

---

### Task 1: Story engagement persistence

**Files:**
- Create: `src/redesign/stories/engagement.ts`
- Test: `src/redesign/__tests__/story-engagement.test.ts`

**Interfaces:**
- Produces: `StoryEngagement`, `readStoryEngagement()`, `toggleStoryLike(storyId)`, `saveStoryReaction(storyId, emoji)`, and `saveStoryReply(storyId, creatorId, body)`.

- [ ] **Step 1: Write failing persistence tests**

```ts
it('stores one reaction and private replies per story', () => {
  saveStoryReaction('story-one', '🔥');
  saveStoryReply('story-one', 'amara', 'The color is beautiful.');
  expect(readStoryEngagement().reactions['story-one']).toBe('🔥');
  expect(readStoryEngagement().replies[0]).toEqual(expect.objectContaining({ creatorId:'amara', body:'The color is beautiful.' }));
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- src/redesign/__tests__/story-engagement.test.ts`

Expected: FAIL because the module is absent.

- [ ] **Step 3: Implement validated storage**

```ts
export interface StoryReply { id:string; storyId:string; creatorId:string; body:string; createdAt:string }
export interface StoryEngagement { likedIds:string[]; reactions:Record<string,string>; replies:StoryReply[] }
export const storyEngagementKey = 'creative-circle-story-engagement-v1';
```

Validate arrays, strings, and reaction maps before use. Fall back to empty engagement when parsing or storage fails.

- [ ] **Step 4: Run tests and commit**

Run: `npm test -- src/redesign/__tests__/story-engagement.test.ts`

Expected: PASS.

```bash
git add src/redesign/stories/engagement.ts src/redesign/__tests__/story-engagement.test.ts
git commit -m "feat: persist story engagement locally"
```

### Task 2: Curved reaction and private reply UI

**Files:**
- Modify: `src/redesign/details/StoryViewer.tsx`
- Modify: `src/redesign/details/details.css`
- Modify: `src/redesign/__tests__/details.test.tsx`
- Modify: `e2e/frontend-completion.spec.ts`

**Interfaces:**
- Consumes: story engagement functions from Task 1.
- Produces: reply form, like button, curved carousel, selected-reaction feedback, and paused story timing.

- [ ] **Step 1: Write failing interaction tests**

```tsx
await user.click(screen.getByRole('button', { name: 'Like story' }));
expect(screen.getByRole('button', { name: 'Unlike story' })).toBeVisible();
await user.click(screen.getByRole('button', { name: 'React with fire' }));
expect(screen.getByRole('status')).toHaveTextContent('Reacted with 🔥');
await user.type(screen.getByLabelText('Reply privately to Amara K.'), 'Wonderful frame');
await user.click(screen.getByRole('button', { name: 'Send private reply' }));
expect(screen.getByRole('status')).toHaveTextContent('Private reply saved');
```

- [ ] **Step 2: Run the details test and verify it fails**

Run: `npm test -- src/redesign/__tests__/details.test.tsx`

Expected: FAIL because the controls are absent.

- [ ] **Step 3: Implement interaction behavior**

Use the reaction order `['👏','✨','🔥','😍','❤️','🤯','😂','🙌']`. Arrow keys move the selected index; pointer dragging changes it based on horizontal delta; tapping sends the selected reaction. Stop propagation in the entire engagement tray and set paused state while it contains focus, hover, or an active pointer.

- [ ] **Step 4: Implement the curved presentation**

Position emojis along a shallow arc with transforms derived from distance to the selected index. The selected emoji is larger and raised; adjacent emojis remain visible. Keep the translucent reply bar and heart button above `env(safe-area-inset-bottom)`. Under reduced motion, remove transitions and burst animation.

- [ ] **Step 5: Verify and commit**

Run: `npm test && npm run typecheck && npm run lint && npm run build && npm run test:e2e`

Expected: all commands pass; reactions do not advance the story; the existing reduced-motion story test still passes.

```bash
git add src/redesign/details src/redesign/__tests__/details.test.tsx e2e/frontend-completion.spec.ts
git commit -m "feat: add immersive story engagement"
```
