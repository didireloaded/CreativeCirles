import type { ProductState } from './types';

export function createSeedProductState(): ProductState {
  return {
    version: 1,
    savedItems: [{ id: 'between-sand-sky', kind: 'work', title: 'Between sand & sky' }],
    projects: [
      { id: 'desert-light', title: 'Desert, in a different light', phase: 'Pre-Production', progress: 36, dueLabel: '18 Oct' },
      { id: 'quiet-blue', title: 'A quieter kind of blue', phase: 'Post-Production', progress: 78, dueLabel: '24 Oct' },
    ],
    blockedCreatorIds: [],
    mutedCreatorIds: [],
  };
}
