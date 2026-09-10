import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import CallPreview from '../calls/CallPreview';
import type { Creator } from '../types';

const creator = { id:'amara', name:'Amara K.', handle:'amara.creates', role:'Photographer', image:'/amara.jpg', bio:'', availability:'', skills:[], equipment:[], services:[], portfolio:[], socialLinks:[] } satisfies Creator;

it('shows cosmetic controls without requesting media permission', async () => {
  const user = userEvent.setup();
  const getUserMedia = vi.fn();
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
  render(<CallPreview open mode="video" creator={creator} onClose={vi.fn()} />);
  expect(screen.getByText('Coming soon')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Mute microphone' }));
  expect(screen.getByRole('button', { name: 'Unmute microphone' })).toBeVisible();
  expect(getUserMedia).not.toHaveBeenCalled();
});
