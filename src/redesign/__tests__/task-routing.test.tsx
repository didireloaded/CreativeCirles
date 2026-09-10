import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { onboardingStorageKey } from '../onboarding/model';

const profile = { completed: true, role: 'Photographer', interests: ['Photography'], availability: 'selective', location: 'Windhoek', displayName: 'Jordan K.', handle: 'jordan.creates', bio: 'Visual storyteller.' };

describe('Tasks routing', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(onboardingStorageKey, JSON.stringify(profile));
    sessionStorage.setItem('circle:entered', '1');
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('opens Tasks as its own top-level destination', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/home']}><App /></MemoryRouter>);

    expect(screen.getAllByRole('button', { name: 'Tasks' }).length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole('button', { name: 'Tasks' }).at(-1)!);
    expect(screen.getByRole('heading', { name: 'Your tasks' })).toBeVisible();
    expect(screen.queryByText('Upcoming meetings')).not.toBeInTheDocument();
  });

  it('keeps Profile reachable from the mobile identity control', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/tasks']}><App /></MemoryRouter>);

    await user.click(screen.getAllByRole('button', { name: 'Open your profile' }).at(-1)!);
    expect(screen.getByRole('heading', { name: /Jordan K\./ })).toBeVisible();
  });
});
