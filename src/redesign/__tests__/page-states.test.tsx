import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home from '../Home';
import Discover from '../Discover';
import { defaultOnboardingProfile } from '../onboarding/model';

const props = {
  notify: vi.fn(),
  navigate: vi.fn(),
  openCreate: vi.fn(),
  openDrafts: vi.fn(),
  editPreferences: vi.fn(),
  profile: { ...defaultOnboardingProfile, completed: true },
};

describe('representative page states', () => {
  it('announces a loading feed without exposing post cards', () => {
    window.history.pushState({}, '', '/home?state=loading');
    render(<Home {...props} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading creative work');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('explains how to recover when the feed fails', () => {
    window.history.pushState({}, '', '/home?state=error');
    render(<Home {...props} />);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible();
    expect(screen.getByText('Check your connection and try again.')).toBeVisible();
  });

  it('shows a purposeful empty discovery state', () => {
    window.history.pushState({}, '', '/discover?state=empty');
    render(<Discover {...props} />);
    expect(screen.getByText('Your next creative connection starts here.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Explore all work' })).toBeVisible();
    expect(screen.queryByLabelText('Illustrative creative work')).not.toBeInTheDocument();
  });
});
