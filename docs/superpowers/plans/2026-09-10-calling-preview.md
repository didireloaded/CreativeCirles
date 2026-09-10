# Calling Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add polished voice and video call-preview interfaces to Inbox without requesting permissions or initiating communication.

**Architecture:** Inbox opens a dedicated accessible dialog for the active creator and selected preview mode. The dialog owns cosmetic control state and exposes no browser media or networking integration.

**Tech Stack:** React 18, TypeScript, native dialog, CSS, lucide-react, Vitest, Testing Library, Playwright

**Spec:** `docs/superpowers/specs/2026-09-10-connected-planning-and-social-ui-design.md`

## Global Constraints

- Calling is Inbox-only and always marked Coming Soon.
- Never call `getUserMedia`, RTCPeerConnection, WebSocket, or a calling API.
- No user is rung and no call is represented as connected.
- Closing or ending restores focus and conversation context.
- Support mobile safe areas and reduced motion.

---

### Task 1: Safe immersive call dialog

**Files:**
- Create: `src/redesign/calls/CallPreview.tsx`
- Create: `src/redesign/calls/call-preview.css`
- Test: `src/redesign/__tests__/call-preview.test.tsx`

**Interfaces:**
- Produces: `CallPreview({ open, mode, creator, onClose }): JSX.Element`, where `mode` is `'voice' | 'video'`.

- [ ] **Step 1: Write failing safety and control tests**

```tsx
it('shows cosmetic controls without requesting media permission', async () => {
  const user = userEvent.setup();
  const getUserMedia = vi.fn();
  Object.defineProperty(navigator, 'mediaDevices', { configurable:true, value:{ getUserMedia } });
  render(<CallPreview open mode="video" creator={creator} onClose={vi.fn()} />);
  expect(screen.getByText('Coming soon')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Mute microphone' }));
  expect(screen.getByRole('button', { name: 'Unmute microphone' })).toBeVisible();
  expect(getUserMedia).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- src/redesign/__tests__/call-preview.test.tsx`

Expected: FAIL because `CallPreview` does not exist.

- [ ] **Step 3: Implement the dialog and cosmetic state**

Render the creator image as a full-bleed background, a gradient readability layer, identity and mode labels, persistent `Coming soon`, and a glass control panel. Microphone, camera, speaker, and camera-switch controls only change local pressed state. End call invokes `onClose`.

- [ ] **Step 4: Add accessible responsive styling**

Use burgundy/coral lighting derived from Creative Circle's palette, gold focus accents, a red end button, 44px minimum controls, safe-area padding, and a centered phone-scale presentation on desktop. Remove nonessential transitions under reduced motion.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/redesign/__tests__/call-preview.test.tsx`

Expected: PASS.

```bash
git add src/redesign/calls src/redesign/__tests__/call-preview.test.tsx
git commit -m "feat: add safe calling preview"
```

### Task 2: Inbox entry points and end-to-end safety

**Files:**
- Modify: `src/redesign/Inbox.tsx`
- Modify: `src/redesign/inbox.css`
- Modify: `e2e/frontend-completion.spec.ts`

**Interfaces:**
- Consumes: `CallPreview` from Task 1.
- Produces: Voice call and Video call buttons in the active conversation header.

- [ ] **Step 1: Write the failing Inbox browser flow**

```ts
await page.goto('/inbox');
await page.getByRole('button', { name: 'Preview video call with Amara K.' }).click();
await expect(page.getByRole('dialog', { name: 'Video call preview with Amara K.' })).toBeVisible();
await expect(page.getByText('Coming soon')).toBeVisible();
await page.getByRole('button', { name: 'End call preview' }).click();
await expect(page.getByRole('heading', { name: 'Amara K.' })).toBeVisible();
```

- [ ] **Step 2: Run the browser test and verify it fails**

Run: `npx playwright test e2e/frontend-completion.spec.ts --project=mobile-390 -g "calling preview"`

Expected: FAIL because Inbox has no call buttons.

- [ ] **Step 3: Integrate voice and video buttons**

Add compact phone and video buttons to `in-detail-head`, store `callMode: 'voice' | 'video' | null`, and render the preview for the active conversation. Keep the buttons visible without crowding name and role at 320px.

- [ ] **Step 4: Run the complete verification gate and commit**

Run: `npm test && npm run typecheck && npm run lint && npm run build && npm run test:e2e`

Expected: all commands pass, focus returns to the selected call button, and no permission prompt appears.

```bash
git add src/redesign/Inbox.tsx src/redesign/inbox.css e2e/frontend-completion.spec.ts
git commit -m "feat: connect calling preview to inbox"
```
