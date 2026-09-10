import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import MeetingsView from '../dashboard/MeetingsView';
import { defaultOnboardingProfile } from '../onboarding/model';

describe('Dashboard meetings', () => {
  it('filters meetings by collaborator without leaking unrelated results', async () => {
    const user = userEvent.setup();
    render(<MeetingsView notify={vi.fn()} profile={defaultOnboardingProfile} />);

    await user.type(screen.getByLabelText('Find a collaborator or meeting'), 'Leo');

    expect(screen.getAllByText('First cut review')[0]).toBeVisible();
    expect(screen.queryByText('Campaign planning')).not.toBeInTheDocument();
  });

  it('labels joining as a preview and never implies a live meeting', async () => {
    const user = userEvent.setup();
    render(<MeetingsView notify={vi.fn()} profile={defaultOnboardingProfile} />);

    await user.click(screen.getByRole('button', { name: 'Join First cut review' }));

    expect(screen.getByRole('status')).toHaveTextContent('Preview only');
    expect(screen.getByRole('status')).toHaveTextContent('No meeting was entered');
  });
});
