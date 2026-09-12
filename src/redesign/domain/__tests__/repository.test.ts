import { beforeEach, describe, expect, it } from 'vitest';
import { createProductRepository, productStorageKey } from '../repository';

describe('product repository', () => {
  beforeEach(() => localStorage.clear());

  it('starts with independent seeded data and persists updates', () => {
    const repository = createProductRepository();
    const first = repository.getSnapshot();
    expect(first.version).toBe(1);
    expect(first.savedItems.length).toBeGreaterThan(0);

    repository.toggleSaved({ id: 'job-editor', kind: 'job', title: 'Editorial film lead' });
    expect(repository.getSnapshot().savedItems.some(item => item.id === 'job-editor')).toBe(true);
    expect(JSON.parse(localStorage.getItem(productStorageKey) || '{}').savedItems).toHaveLength(first.savedItems.length + 1);
  });

  it('notifies subscribers and does not mutate earlier snapshots', () => {
    const repository = createProductRepository();
    const before = repository.getSnapshot();
    let notifications = 0;
    const unsubscribe = repository.subscribe(() => notifications += 1);
    repository.toggleSaved({ id: 'grant-1', kind: 'opportunity', title: 'Film fund' });
    unsubscribe();
    expect(notifications).toBe(1);
    expect(before.savedItems.some(item => item.id === 'grant-1')).toBe(false);
  });

  it('recovers from corrupt storage and can reset to seeds', () => {
    localStorage.setItem(productStorageKey, '{broken');
    const repository = createProductRepository();
    expect(repository.getSnapshot().projects.length).toBeGreaterThan(0);
    repository.toggleSaved({ id: 'temporary', kind: 'work', title: 'Temporary' });
    repository.reset();
    expect(repository.getSnapshot().savedItems.some(item => item.id === 'temporary')).toBe(false);
  });
});
