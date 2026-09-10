import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PwaStatus from '../pwa/PwaStatus';

describe('PWA status surfaces', () => {
  it('responds to offline and online browser events', () => {
    render(<PwaStatus />);
    act(() => window.dispatchEvent(new Event('offline')));
    expect(screen.getByText('You’re offline')).toBeVisible();
    act(() => window.dispatchEvent(new Event('online')));
    expect(screen.queryByText('You’re offline')).not.toBeInTheDocument();
  });

  it('offers installation only after a captured prompt and supports dismissal', async () => {
    const user = userEvent.setup(); const prompt = vi.fn().mockResolvedValue(undefined);
    render(<PwaStatus />);
    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), { prompt, userChoice: Promise.resolve({ outcome: 'dismissed' }) });
    fireEvent(window, event);
    expect(screen.getByText('Install Creative Circle')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Not now' }));
    expect(localStorage.getItem('circle:install-dismissed-at')).toBeTruthy();
    expect(screen.queryByText('Install Creative Circle')).not.toBeInTheDocument();
  });

  it('shows an available app update', () => {
    render(<PwaStatus />);
    act(() => window.dispatchEvent(new CustomEvent('creative-circle:update-ready')));
    expect(screen.getByText('A new version is ready')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Update now' })).toBeVisible();
  });
});
