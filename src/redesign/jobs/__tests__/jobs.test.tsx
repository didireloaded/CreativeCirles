import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainProvider } from '../../domain/DomainProvider';
import Jobs from '../Jobs';

describe('Jobs marketplace', () => {
  beforeEach(() => localStorage.clear());
  const renderJobs = () => render(<DomainProvider><Jobs notify={vi.fn()} navigate={vi.fn()} /></DomainProvider>);

  it('filters jobs and opens a detailed application flow', async () => {
    const user = userEvent.setup();
    renderJobs();
    await user.type(screen.getByRole('searchbox', { name: /search jobs/i }), 'editor');
    expect(screen.getByText('Documentary editor')).toBeVisible();
    expect(screen.queryByText('Brand photographer')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /open documentary editor/i }));
    expect(screen.getByRole('heading', { name: 'Documentary editor' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /start application/i }));
    await user.type(screen.getByLabelText(/why are you a strong fit/i), 'I edit human stories with a quiet documentary rhythm.');
    await user.click(screen.getByRole('button', { name: /save application draft/i }));
    expect(screen.getByText(/Draft saved on this device/i)).toBeVisible();
  });

  it('saves a job and filters to saved opportunities', async () => {
    const user = userEvent.setup();
    renderJobs();
    await user.click(screen.getByRole('button', { name: /save brand photographer/i }));
    await user.click(screen.getByRole('button', { name: /saved jobs/i }));
    expect(screen.getByText('Brand photographer')).toBeVisible();
  });
});
