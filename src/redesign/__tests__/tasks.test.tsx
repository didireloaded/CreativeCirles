import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Tasks from '../tasks/Tasks';
import { defaultOnboardingProfile } from '../onboarding/model';
import { taskStorageKey, type TaskDraft } from '../tasks/model';

describe('Tasks experience', () => {
  beforeEach(() => localStorage.removeItem(taskStorageKey));

  it('filters and completes tasks while preserving Dashboard separation', async () => {
    const user = userEvent.setup();
    render(<Tasks notify={vi.fn()} profile={defaultOnboardingProfile} pendingDraft={null} onDraftConsumed={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'In progress' }));
    expect(screen.getByText('Review the first cut')).toBeVisible();
    await user.click(screen.getByRole('checkbox', { name: 'Complete Review the first cut' }));
    expect(screen.getByRole('status')).toHaveTextContent('Task completed');
    expect(screen.queryByText('Upcoming meetings')).not.toBeInTheDocument();
  });

  it('opens task detail and updates a checklist item', async () => {
    const user = userEvent.setup();
    render(<Tasks notify={vi.fn()} profile={defaultOnboardingProfile} pendingDraft={null} onDraftConsumed={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Open Review the first cut' }));
    expect(screen.getByRole('dialog', { name: 'Review the first cut' })).toBeVisible();
    await user.click(screen.getByRole('checkbox', { name: 'Add time-coded notes' }));
    expect(screen.getByText('2 of 2 steps complete')).toBeVisible();
  });

  it('preserves a one-time contextual draft until it is submitted', async () => {
    const user = userEvent.setup();
    function ContextualTasks() {
      const [draft, setDraft] = useState<TaskDraft | null>({ source: 'message', title: 'Reply with edit notes', relatedId: 'leo' });
      return <Tasks notify={vi.fn()} profile={defaultOnboardingProfile} pendingDraft={draft} onDraftConsumed={() => setDraft(null)} />;
    }
    render(<ContextualTasks />);

    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByText('message')).toBeVisible();
  });
});
