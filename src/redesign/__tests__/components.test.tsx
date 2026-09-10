import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState, ErrorState, Skeleton } from '../components/AsyncState';
import ImageWithFallback from '../components/ImageWithFallback';
import BottomSheet from '../components/BottomSheet';
import ConfirmDialog from '../components/ConfirmDialog';

describe('shared UI states', () => {
  it('gives an error a real retry action', async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    render(<ErrorState title="Couldn’t load work" description="Check your connection and try again." onRetry={retry} />);
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('renders an empty-state action and hides skeleton decoration', () => {
    render(<><EmptyState title="Nothing saved yet" description="Saved work will appear here." action={{ label: 'Explore work', onClick: vi.fn() }} /><Skeleton variant="card" count={2} /></>);
    expect(screen.getByRole('button', { name: 'Explore work' })).toBeVisible();
    expect(document.querySelectorAll('[aria-hidden="true"] .ui-skeleton')).toHaveLength(2);
  });

  it('keeps image geometry and exposes a useful fallback after failure', () => {
    render(<ImageWithFallback src="/missing.jpg" alt="A desert portrait" ratio="4 / 5" />);
    fireEvent.error(screen.getByRole('img', { name: 'A desert portrait' }));
    const fallback = screen.getByRole('img', { name: 'A desert portrait unavailable' });
    expect(fallback).toBeVisible();
    expect(fallback.parentElement).toHaveStyle({ aspectRatio: '4 / 5' });
  });
});

describe('shared dialogs', () => {
  it('restores focus to the opener after a bottom sheet closes', () => {
    const opener = document.createElement('button');
    opener.textContent = 'Open comments';
    document.body.append(opener);
    opener.focus();
    const { rerender } = render(<BottomSheet open title="Comments" onClose={vi.fn()}>Comment content</BottomSheet>);
    rerender(<BottomSheet open={false} title="Comments" onClose={vi.fn()}>Comment content</BottomSheet>);
    expect(opener).toHaveFocus();
  });

  it('names both confirmation choices explicitly', () => {
    render(<ConfirmDialog open title="Reset preview setup?" description="Your local preferences will be removed." actionLabel="Reset setup" onConfirm={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Reset setup' })).toBeVisible();
  });
});
