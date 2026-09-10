export interface StoryReply {
  id: string;
  storyId: string;
  creatorId: string;
  body: string;
  createdAt: string;
}

export interface StoryEngagement {
  likedIds: string[];
  reactions: Record<string, string>;
  replies: StoryReply[];
}

export const storyEngagementKey = 'creative-circle-story-engagement-v1';
const emptyEngagement = (): StoryEngagement => ({ likedIds: [], reactions: {}, replies: [] });

function isStringRecord(value: unknown): value is Record<string, string> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
    && Object.entries(value as Record<string, unknown>).every(([key, item]) => Boolean(key) && typeof item === 'string');
}

function isReply(value: unknown): value is StoryReply {
  if (!value || typeof value !== 'object') return false;
  const reply = value as Record<string, unknown>;
  return ['id', 'storyId', 'creatorId', 'body', 'createdAt'].every(key => typeof reply[key] === 'string');
}

function writeStoryEngagement(value: StoryEngagement) {
  try { localStorage.setItem(storyEngagementKey, JSON.stringify(value)); }
  catch { /* Keep story controls usable for this visit when storage is unavailable. */ }
  return value;
}

export function readStoryEngagement(): StoryEngagement {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storyEngagementKey) || 'null');
    if (!parsed || typeof parsed !== 'object') return emptyEngagement();
    const value = parsed as Record<string, unknown>;
    if (!Array.isArray(value.likedIds) || !value.likedIds.every(item => typeof item === 'string') || !isStringRecord(value.reactions) || !Array.isArray(value.replies) || !value.replies.every(isReply)) return emptyEngagement();
    return { likedIds: [...value.likedIds], reactions: { ...value.reactions }, replies: value.replies.map(reply => ({ ...reply })) };
  } catch { return emptyEngagement(); }
}

export function toggleStoryLike(storyId: string) {
  const current = readStoryEngagement();
  current.likedIds = current.likedIds.includes(storyId) ? current.likedIds.filter(id => id !== storyId) : [...current.likedIds, storyId];
  return writeStoryEngagement(current);
}

export function saveStoryReaction(storyId: string, emoji: string) {
  const current = readStoryEngagement();
  current.reactions[storyId] = emoji;
  return writeStoryEngagement(current);
}

export function saveStoryReply(storyId: string, creatorId: string, body: string) {
  const current = readStoryEngagement();
  current.replies.push({ id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, storyId, creatorId, body: body.trim(), createdAt: new Date().toISOString() });
  return writeStoryEngagement(current);
}
