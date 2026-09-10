import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { onboardingStorageKey } from '../onboarding/model';

describe('App onboarding entry', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('moves from welcome into setup before showing the app', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /Get started/i }));

    expect(screen.getByRole('heading', { name: 'What do you create?' })).toBeVisible();
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument();
  });

  it('stores neutral preferences when preview setup is skipped', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /Get started/i }));
    await user.click(screen.getByRole('button', { name: 'Skip preview setup' }));

    expect(screen.getAllByRole('navigation', { name: 'Primary navigation' }).length).toBeGreaterThan(0);
    expect(JSON.parse(localStorage.getItem(onboardingStorageKey) || '{}')).toEqual(expect.objectContaining({
      completed: true,
      role: 'Multidisciplinary',
    }));
  });
});
