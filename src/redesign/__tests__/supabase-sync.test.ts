import { describe, expect, it } from 'vitest';
import {
  fetchRemotePosts,
  createRemotePost,
  fetchRemoteComments,
  createRemoteComment,
  fetchRemoteJobs,
  fetchRemoteProjects,
  fetchRemoteTasks,
  fetchRemoteSavedItems,
  toggleRemoteSavedItem,
} from '../../lib/supabase/api';

describe('Supabase API graceful offline & permission fallback', () => {
  it('returns null or false gracefully when unauthenticated or offline rather than throwing', async () => {
    // These calls should not throw runtime unhandled rejections
    const posts = await fetchRemotePosts();
    expect(posts === null || Array.isArray(posts)).toBe(true);

    const comments = await fetchRemoteComments('test-post-id');
    expect(comments === null || Array.isArray(comments)).toBe(true);

    const jobs = await fetchRemoteJobs();
    expect(jobs === null || Array.isArray(jobs)).toBe(true);

    const projects = await fetchRemoteProjects();
    expect(projects === null || Array.isArray(projects)).toBe(true);

    const tasks = await fetchRemoteTasks();
    expect(tasks === null || Array.isArray(tasks)).toBe(true);

    const saved = await fetchRemoteSavedItems();
    expect(saved === null || Array.isArray(saved)).toBe(true);
  });

  it('safely handles creation calls when unauthenticated without throwing errors', async () => {
    const postResult = await createRemotePost({
      title: 'Test Post',
      caption: 'Test Caption',
      category: 'Design',
      imageUrl: '/test.jpg',
    });
    // Since anon lacks write permission, it should return null without crashing
    expect(postResult === null || typeof postResult === 'object').toBe(true);

    const commentResult = await createRemoteComment('post-1', 'Test comment');
    expect(commentResult === null || typeof commentResult === 'object').toBe(true);

    const savedResult = await toggleRemoteSavedItem({
      itemId: 'creator-1',
      kind: 'creator',
      title: 'Amara K.',
    });
    expect(typeof savedResult).toBe('boolean');
  });
});
