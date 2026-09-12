export type SavedKind = 'work' | 'job' | 'creator' | 'project' | 'opportunity' | 'template' | 'product';

export interface SavedItem {
  id: string;
  kind: SavedKind;
  title: string;
  content?: string;
}

export interface ProductProject {
  id: string;
  title: string;
  phase: 'Development' | 'Pre-Production' | 'Production' | 'Post-Production' | 'Distribution';
  progress: number;
  dueLabel: string;
}

export interface ProductState {
  version: 1;
  savedItems: SavedItem[];
  projects: ProductProject[];
  blockedCreatorIds: string[];
  mutedCreatorIds: string[];
}
