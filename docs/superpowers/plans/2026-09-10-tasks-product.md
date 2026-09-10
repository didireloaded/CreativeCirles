# Tasks Product Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Tasks as a standalone, app-wide operational destination with local preview persistence and contextual creation entry points.

**Architecture:** A typed task model and storage module form the data boundary. A dedicated Tasks screen owns Today, All Tasks, and Progress; other screens only create a typed task draft and navigate to Tasks.

**Tech Stack:** React 18, TypeScript, CSS, lucide-react, Vitest, Testing Library, Playwright

**Spec:** `docs/superpowers/specs/2026-09-10-connected-planning-and-social-ui-design.md`

## Global Constraints

- Tasks and Dashboard remain separate top-level experiences.
- Mobile primary navigation is Home, Discover, Create, Tasks, Inbox.
- Profile remains reachable through the signed-in avatar.
- Use a compact task date strip; do not duplicate Dashboard's full calendar.
- Task writes are local preview actions until Supabase is connected.

---

### Task 1: Typed task domain and safe persistence

**Files:**
- Create: `src/redesign/tasks/model.ts`
- Test: `src/redesign/__tests__/task-model.test.ts`

**Interfaces:**
- Produces: `TaskStatus`, `TaskPriority`, `TaskSource`, `CreativeTask`, `TaskDraft`, `readTasks()`, `writeTasks(tasks)`, and `createTask(draft)`.

- [ ] **Step 1: Write failing model tests**

```ts
it('rejects malformed stored tasks and builds a contextual task', () => {
  localStorage.setItem(taskStorageKey, JSON.stringify([{ id: 4 }]));
  expect(readTasks()).toEqual(taskSeed);
  expect(createTask({ source:'message', title:'Review Leo’s first cut', relatedId:'leo' }))
    .toEqual(expect.objectContaining({ source:'message', status:'open', priority:'medium' }));
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- src/redesign/__tests__/task-model.test.ts`

Expected: FAIL because the task model is absent.

- [ ] **Step 3: Implement exact domain types**

```ts
export type TaskStatus = 'open' | 'in-progress' | 'awaiting-feedback' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSource = 'manual' | 'project' | 'collaboration' | 'job' | 'message' | 'event' | 'creator';
export interface TaskDraft { source: TaskSource; title: string; relatedId?: string; dueAt?: string; assigneeIds?: string[] }
export interface CreativeTask extends TaskDraft { id: string; description: string; status: TaskStatus; priority: TaskPriority; durationMinutes: number; subtasks: { id:string; label:string; done:boolean }[]; attachments: string[] }
```

Validate every stored field before returning it, otherwise return the deterministic `taskSeed`. Catch unavailable storage and keep state in memory.

- [ ] **Step 4: Run tests and commit**

Run: `npm test -- src/redesign/__tests__/task-model.test.ts`

Expected: PASS.

```bash
git add src/redesign/tasks/model.ts src/redesign/__tests__/task-model.test.ts
git commit -m "feat: define local task domain"
```

### Task 2: Tasks screen and task detail

**Files:**
- Create: `src/redesign/tasks/Tasks.tsx`
- Create: `src/redesign/tasks/TaskDetail.tsx`
- Create: `src/redesign/tasks/tasks.css`
- Test: `src/redesign/__tests__/tasks.test.tsx`

**Interfaces:**
- Consumes: task-domain exports from Task 1 and `ScreenProps`.
- Produces: `Tasks`, task filters, completion toggles, local creation, details, subtasks, and accessible progress summaries.

- [ ] **Step 1: Write failing UI tests**

```tsx
it('filters and completes tasks while preserving Dashboard separation', async () => {
  const user = userEvent.setup();
  render(<Tasks {...screenProps} />);
  await user.click(screen.getByRole('button', { name: 'In progress' }));
  expect(screen.getByText('Review the first cut')).toBeVisible();
  await user.click(screen.getByRole('checkbox', { name: 'Complete Review the first cut' }));
  expect(screen.getByText('Task completed')).toBeVisible();
  expect(screen.queryByText('Upcoming meetings')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- src/redesign/__tests__/tasks.test.tsx`

Expected: FAIL because `Tasks` does not exist.

- [ ] **Step 3: Implement Today, All Tasks, and Progress**

Build separate render sections for summary cards, compact date strip, filters, task cards, create form, details, checklist, attachments, comments/activity, and a text-equivalent progress chart. Use real buttons and checkboxes, not clickable generic containers.

- [ ] **Step 4: Implement the visual language**

Use warm cream surfaces and burgundy text, with gold active states. Match the reference's card hierarchy, avatar groups, status pills, and generous rounded shapes without adopting its lavender palette. Add responsive single-column layouts below 768px and reduced-motion fallbacks.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/redesign/__tests__/tasks.test.tsx`

Expected: PASS.

```bash
git add src/redesign/tasks src/redesign/__tests__/tasks.test.tsx
git commit -m "feat: build creative tasks experience"
```

### Task 3: Route, navigation, profile access, and contextual drafts

**Files:**
- Modify: `src/redesign/types.ts`
- Modify: `src/redesign/App.tsx`
- Modify: `src/redesign/Home.tsx`
- Modify: `src/redesign/Inbox.tsx`
- Modify: `src/redesign/Profile.tsx`
- Modify: `src/redesign/Discover.tsx`
- Modify: `src/redesign/reference.css`
- Modify: `e2e/frontend-completion.spec.ts`
- Test: `src/redesign/__tests__/task-routing.test.tsx`

**Interfaces:**
- Produces: `Page` including `'tasks'`; `openTaskDraft(draft: TaskDraft): void` on `ScreenProps`; `/tasks` routing; five-item primary navigation.

- [ ] **Step 1: Write failing navigation and draft tests**

```tsx
expect(screen.getAllByRole('button', { name: 'Tasks' }).length).toBeGreaterThan(0);
await user.click(screen.getAllByRole('button', { name: 'Tasks' }).at(-1)!);
expect(screen.getByRole('heading', { name: 'Your tasks' })).toBeVisible();
```

```ts
await page.goto('/inbox');
await page.getByRole('button', { name: 'Turn latest message into a task' }).click();
await expect(page).toHaveURL(/\/tasks/);
await expect(page.getByDisplayValue(/editorial in the dunes/i)).toBeVisible();
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm test -- src/redesign/__tests__/task-routing.test.tsx`

Expected: FAIL because Tasks routing and `openTaskDraft` are absent.

- [ ] **Step 3: Add routing and navigation**

Set the shared mobile navigation items to Home, Discover, Create, Tasks, Inbox. Add an avatar button in the mobile brand/header that navigates to Profile. Keep Dashboard's dedicated sparkle entry and desktop sidebar item.

- [ ] **Step 4: Add contextual task entry points**

Wire message conversion in Inbox, project and event actions in Discover, collaboration actions, and a profile collaboration task action through `openTaskDraft`. Store the pending draft in App state, navigate to `/tasks`, and pass it into `Tasks` exactly once.

- [ ] **Step 5: Verify the complete Tasks flow and commit**

Run: `npm test && npm run typecheck && npm run lint && npm run build && npm run test:e2e`

Expected: all commands pass; `/tasks` is responsive across four Playwright projects; Dashboard and Tasks never appear as nested tabs.

```bash
git add src/redesign e2e/frontend-completion.spec.ts
git commit -m "feat: connect tasks across the app"
```
