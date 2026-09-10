import { beforeEach, describe, expect, it } from 'vitest';
import { createTask, readTasks, taskSeed, taskStorageKey, writeTasks } from '../tasks/model';

describe('creative task model', () => {
  beforeEach(() => localStorage.clear());

  it('rejects malformed stored tasks and builds a contextual task', () => {
    localStorage.setItem(taskStorageKey, JSON.stringify([{ id: 4 }]));
    expect(readTasks()).toEqual(taskSeed);
    expect(createTask({ source: 'message', title: 'Review Leo’s first cut', relatedId: 'leo' }))
      .toEqual(expect.objectContaining({ source: 'message', status: 'open', priority: 'medium' }));
  });

  it('round-trips valid tasks without sharing mutable seed state', () => {
    const task = createTask({ source: 'project', title: 'Prepare selects', dueAt: '2026-09-12T14:00:00.000Z' });
    writeTasks([task]);
    expect(readTasks()).toEqual([task]);
    expect(readTasks()).not.toBe(readTasks());
  });
});
