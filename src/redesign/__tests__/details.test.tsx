import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PostDetail from '../details/PostDetail';
import CreatorDetail from '../details/CreatorDetail';
import CommunityDetail from '../details/CommunityDetail';
import type { Community, CreativePost, Creator } from '../types';

const creator: Creator = {
  id: 'amara', name: 'Amara K.', handle: 'amara.creates', role: 'Photographer', image: '/avatar.jpg',
  bio: 'Documentary photographer drawn to warm light and honest stories.', availability: 'Available for selected projects',
  skills: ['Editorial photography', 'Art direction'], equipment: ['Sony A7 IV', '35mm prime'],
  services: [{ name: 'Editorial session', rate: 'From N$2,800' }], portfolio: ['/one.jpg', '/two.jpg'], socialLinks: ['Instagram', 'Behance'],
};
const post: CreativePost = {
  id: 'dunes', authorId: 'amara', author: creator.name, handle: creator.handle, discipline: creator.role,
  avatar: creator.image, image: '/dunes.jpg', title: 'Between sand & sky', caption: 'A study in warm light.',
  category: 'Photography', location: 'Namibia', likes: 284, comments: 18,
};
const community: Community = {
  id: 'frame-circle', name: 'The Frame Circle', category: 'Photography', image: '/circle.jpg', members: 128,
  description: 'A place to share frames and exchange feedback.', purpose: 'Practice together and make stronger work.',
  disciplines: ['Photography', 'Art direction'], memberPreviews: [creator], recentWork: ['/one.jpg'],
};

describe('creative detail flows', () => {
  beforeEach(() => localStorage.clear());

  it('adds a local comment and keeps an empty submission disabled', async () => {
    const user = userEvent.setup();
    render(<PostDetail open post={post} creator={creator} onClose={vi.fn()} notify={vi.fn()} />);
    const submit = screen.getByRole('button', { name: 'Post comment' });
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText('Add a comment'), 'The framing feels intentional.');
    await user.click(submit);
    expect(screen.getByText('The framing feels intentional.')).toBeVisible();
  });

  it('shows useful creator information and a collaboration action', () => {
    render(<CreatorDetail open creator={creator} onClose={vi.fn()} onCollaborate={vi.fn()} />);
    expect(screen.getByText('Editorial photography')).toBeVisible();
    expect(screen.getByText('Sony A7 IV')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Send collaboration request' })).toBeVisible();
  });

  it('persists community membership on this device', async () => {
    const user = userEvent.setup();
    render(<CommunityDetail open community={community} onClose={vi.fn()} notify={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Join community' }));
    expect(screen.getByRole('button', { name: 'Leave community' })).toBeVisible();
    expect(JSON.parse(localStorage.getItem('circle:joined-communities') || '[]')).toContain('frame-circle');
  });
});
