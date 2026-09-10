# Dashboard Meetings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polished Meetings view to Dashboard without mixing Dashboard responsibilities with Tasks.

**Architecture:** Extend the existing Workspace view union and tab system with a focused Meetings component. Keep meeting preview state local and expose no real calling behavior.

**Tech Stack:** React 18, TypeScript, CSS, lucide-react, Vitest, Testing Library, Playwright

**Spec:** `docs/superpowers/specs/2026-09-10-connected-planning-and-social-ui-design.md`

## Global Constraints

- Frontend-only preview with validated local persistence where useful.
- Meetings and the full calendar belong to Dashboard.
- Use Creative Circle burgundy, warm cream, gold, glass, spacing, and typography.
- Join must disclose that no meeting is entered.
- Support mobile, tablet, desktop, keyboard focus, reduced motion, and safe areas.

---

### Task 1: Meeting model and view behavior

**Files:**
- Create: `src/redesign/dashboard/MeetingsView.tsx`
- Create: `src/redesign/dashboard/meetings.css`
- Test: `src/redesign/__tests__/meetings.test.tsx`

**Interfaces:**
- Consumes: `Creator[]`, `notify(message: string): void`, and the signed-in profile.
- Produces: `MeetingsView({ notify, profile }): JSX.Element` with search, status, reminder, details, and join-preview behavior.

- [ ] **Step 1: Write the failing interaction test**

```tsx
it('filters meetings and clearly labels join as a preview', async () => {
  const user = userEvent.setup();
  render(<MeetingsView notify={vi.fn()} profile={defaultOnboardingProfile} />);
  await user.type(screen.getByLabelText('Find a collaborator or meeting'), 'Leo');
  expect(screen.getByText('First cut review')).toBeVisible();
  expect(screen.queryByText('Campaign planning')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Join First cut review' }));
  expect(screen.getByRole('status')).toHaveTextContent('Preview only');
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- src/redesign/__tests__/meetings.test.tsx`

Expected: FAIL because `MeetingsView` does not exist.

- [ ] **Step 3: Implement the focused component**

```tsx
export type MeetingStatus = 'upcoming' | 'completed' | 'cancelled';
export interface MeetingPreview {
  id: string; title: string; collaborator: string; time: string;
  duration: string; type: 'voice' | 'video' | 'studio'; status: MeetingStatus;
}
export default function MeetingsView({ notify, profile }: Pick<ScreenProps, 'notify' | 'profile'>) {
  // Render identity, search, collaborator rail, meeting cards, featured next meeting,
  // status filters, reminder toggles, expandable details, and preview-only Join feedback.
}
```

- [ ] **Step 4: Build the reference-led responsive styling**

Use `meetings.css` for cream editorial surfaces, burgundy copy, gold selection, rounded meeting cards, overlapping avatars, restrained gradient feature card, and horizontal mobile rails. Include `:focus-visible` and `prefers-reduced-motion` rules.

- [ ] **Step 5: Run the focused test and commit**

Run: `npm test -- src/redesign/__tests__/meetings.test.tsx`

Expected: PASS.

```bash
git add src/redesign/dashboard src/redesign/__tests__/meetings.test.tsx
git commit -m "feat: add dashboard meetings view"
```

### Task 2: Dashboard integration and responsive evidence

**Files:**
- Modify: `src/redesign/Workspace.tsx`
- Modify: `src/redesign/workspace.css`
- Modify: `e2e/frontend-completion.spec.ts`

**Interfaces:**
- Consumes: `MeetingsView` from Task 1.
- Produces: `WorkspaceView = 'Overview' | 'Meetings' | 'Calendar' | 'Insights'` with four accessible tabs.

- [ ] **Step 1: Write the failing routing test**

```ts
await page.goto('/workspace');
await page.getByRole('tab', { name: 'Meetings' }).click();
await expect(page.getByRole('heading', { name: 'Upcoming meetings' })).toBeVisible();
await expect(page.locator('body')).not.toContainText('Your tasks');
```

- [ ] **Step 2: Run the representative browser test and verify it fails**

Run: `npx playwright test e2e/frontend-completion.spec.ts --project=mobile-390 -g "dashboard meetings"`

Expected: FAIL because the Meetings tab is absent.

- [ ] **Step 3: Integrate the tab and keyboard navigation**

Update the view array to `['Overview', 'Meetings', 'Calendar', 'Insights']`, calculate arrow-key wraparound from the array length, and render `<MeetingsView notify={notify} profile={profile} />`. Update `Workspace` to consume `profile` from `ScreenProps` rather than hard-coded identity copy.

- [ ] **Step 4: Verify all viewports and commit**

Run: `npm test && npm run typecheck && npm run lint && npm run build && npm run test:e2e`

Expected: all commands pass and `/workspace` has no horizontal overflow at 320, 390, 768, and 1280 pixels.

```bash
git add src/redesign/Workspace.tsx src/redesign/workspace.css e2e/frontend-completion.spec.ts
git commit -m "feat: connect meetings to dashboard"
```
