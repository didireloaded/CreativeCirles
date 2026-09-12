import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { onboardingStorageKey } from '../onboarding/model';

const profile = { completed: true, role: 'Designer', interests: ['Design'], availability: 'open', location: 'Windhoek', displayName: 'Jordan K.', handle: 'jordan.creates', bio: 'Visual storyteller.' };

describe('secondary product routing', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(onboardingStorageKey, JSON.stringify(profile));
    sessionStorage.setItem('circle:entered', '1');
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('opens the tools hub directly without changing primary tabs', () => {
    render(<MemoryRouter initialEntries={['/tools']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Make more room for the work.' })).toBeVisible();
    expect(screen.getAllByRole('button', { name: 'Home' }).length).toBeGreaterThan(0);
  });

  it('opens the hub from the workspace and returns to the workspace', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/workspace']}><App /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /Open creative tools/i }));
    expect(screen.getByRole('heading', { name: 'Make more room for the work.' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /Back to workspace/i }));
    expect(screen.getByRole('heading', { name: /Good morning/i })).toBeVisible();
  });
});
