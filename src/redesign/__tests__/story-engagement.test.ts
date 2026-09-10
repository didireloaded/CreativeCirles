import { beforeEach, describe, expect, it } from 'vitest';
import { readStoryEngagement, saveStoryReaction, saveStoryReply, storyEngagementKey, toggleStoryLike } from '../stories/engagement';

describe('story engagement persistence', () => {
  beforeEach(() => localStorage.removeItem(storyEngagementKey));

  it('stores one reaction and private replies per story', () => {
    saveStoryReaction('story-one', '🔥');
    saveStoryReply('story-one', 'amara', 'The color is beautiful.');
    expect(readStoryEngagement().reactions['story-one']).toBe('🔥');
    expect(readStoryEngagement().replies[0]).toEqual(expect.objectContaining({ creatorId: 'amara', body: 'The color is beautiful.' }));
  });

  it('toggles story likes without duplicating identifiers', () => {
    toggleStoryLike('story-one');
    toggleStoryLike('story-one');
    expect(readStoryEngagement().likedIds).toEqual([]);
  });
});
