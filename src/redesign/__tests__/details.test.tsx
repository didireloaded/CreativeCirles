import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PostDetail from '../details/PostDetail';
import CreatorDetail from '../details/CreatorDetail';
import CommunityDetail from '../details/CommunityDetail';
import StoryViewer from '../details/StoryViewer';
import NotificationPanel from '../details/NotificationPanel';
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

  it('opens creator profile when clicking author row in post detail', async () => {
    const user = userEvent.setup();
    const onSelectCreator = vi.fn();
    render(<PostDetail open post={post} creator={creator} onClose={vi.fn()} notify={vi.fn()} onSelectCreator={onSelectCreator} />);
    await user.click(screen.getByRole('button', { name: `View ${creator.name} profile` }));
    expect(onSelectCreator).toHaveBeenCalledWith(creator);
  });

  it('shows useful creator information and a collaboration action', () => {
    render(<CreatorDetail open creator={creator} onClose={vi.fn()} onCollaborate={vi.fn()} />);
    expect(screen.getByText('Editorial photography')).toBeVisible();
    expect(screen.getByText('Sony A7 IV')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Send collaboration request' })).toBeVisible();
  });

  it('navigates to conversation when clicking Message in creator detail', async () => {
    const user = userEvent.setup();
    const onMessage = vi.fn();
    render(<CreatorDetail open creator={creator} onClose={vi.fn()} onCollaborate={vi.fn()} onMessage={onMessage} />);
    await user.click(screen.getByRole('button', { name: /Direct message/i }));
    expect(onMessage).toHaveBeenCalledWith(creator);
  });

  it('persists community membership on this device', async () => {
    const user = userEvent.setup();
    render(<CommunityDetail open community={community} onClose={vi.fn()} notify={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Join community' }));
    expect(screen.getByRole('button', { name: 'Leave community' })).toBeVisible();
    expect(JSON.parse(localStorage.getItem('circle:joined-communities') || '[]')).toContain('frame-circle');
  });
});

describe('stories and notifications', () => {
  it('moves through stories and closes after the final item', async () => {
    const user = userEvent.setup(); const close = vi.fn();
    render(<StoryViewer open stories={[{ id:'one', creator, image:'/one.jpg', label:'First frame' }, { id:'two', creator, image:'/two.jpg', label:'Second frame' }]} initialIndex={0} onClose={close} />);
    expect(screen.getByText('First frame')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Next story' }));
    expect(screen.getByText('Second frame')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Next story' }));
    expect(close).toHaveBeenCalled();
  });

  it('likes, reacts, and saves a private story reply', async () => {
    const user = userEvent.setup();
    render(<StoryViewer open stories={[{ id:'one', creator, image:'/one.jpg', label:'First frame' }]} initialIndex={0} onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Like story' }));
    expect(screen.getByRole('button', { name: 'Unlike story' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'React with fire' }));
    expect(screen.getByRole('status')).toHaveTextContent('Reacted with 🔥');
    await user.type(screen.getByLabelText('Reply privately to Amara K.'), 'Wonderful frame');
    await user.click(screen.getByRole('button', { name: 'Send private reply' }));
    expect(screen.getByRole('status')).toHaveTextContent('Private reply saved');
  });

  it('marks notifications read and explains an empty inbox', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<NotificationPanel open items={[{ id:'comment', type:'comment', group:'Today', title:'Amara commented on your project', detail:'The framing feels intentional.', time:'12 min' }]} onClose={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Mark all as read' }));
    expect(localStorage.getItem('circle:read-notifications')).toContain('comment');
    rerender(<NotificationPanel open items={[]} onClose={vi.fn()} />);
    expect(screen.getByText('You’re all caught up. Collaboration, comment, and project updates will appear here.')).toBeVisible();
  });

  it('navigates directly to linked content when clicking notification item', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    const onClose = vi.fn();
    render(<NotificationPanel open items={[{ id:'comment-1', type:'comment', group:'Today', title:'Amara commented on your project', detail:'The framing feels intentional.', time:'12 min' }]} onClose={onClose} navigate={navigate} />);
    await user.click(screen.getByRole('button', { name: /Amara commented on your project/i }));
    expect(navigate).toHaveBeenCalledWith('home?post=dunes');
    expect(onClose).toHaveBeenCalled();
  });
});
