import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { onboardingStorageKey } from '../onboarding/model';

describe('Tools hub', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(onboardingStorageKey, JSON.stringify({ completed: true, role: 'Designer', interests: ['Design'], displayName: 'Jordan K.', handle: 'jordan.creates' }));
    sessionStorage.setItem('circle:entered', '1');
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('presents every approved product area as a real destination', () => {
    render(<MemoryRouter initialEntries={['/tools']}><App /></MemoryRouter>);
    for (const name of ['Jobs board', 'Talent finder', 'Projects', 'Creative Buzz', 'Skill swap', 'AI studio', 'Creator business', 'Saved']) {
      expect(screen.getByRole('button', { name: new RegExp(name, 'i') })).toBeVisible();
    }
    expect(screen.getByText(/Local preview data/i)).toBeVisible();
  });
});
