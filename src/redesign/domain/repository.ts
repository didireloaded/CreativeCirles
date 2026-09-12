import { createSeedProductState } from './seeds';
import type { ProductState, SavedItem, ProductProject } from './types';

export const productStorageKey = 'circle:product-domain-v1';
type Listener = () => void;

function cloneState(state: ProductState): ProductState {
  return structuredClone(state);
}

function isState(value: unknown): value is ProductState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<ProductState>;
  return state.version === 1 && Array.isArray(state.savedItems) && Array.isArray(state.projects) && Array.isArray(state.blockedCreatorIds) && Array.isArray(state.mutedCreatorIds);
}

function readState(): ProductState {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(productStorageKey) || 'null');
    return isState(value) ? cloneState(value) : createSeedProductState();
  } catch {
    return createSeedProductState();
  }
}

export function createProductRepository() {
  let state = readState();
  const listeners = new Set<Listener>();
  const persist = () => {
    try { localStorage.setItem(productStorageKey, JSON.stringify(state)); }
    catch { /* The local preview stays usable when persistence is unavailable. */ }
    listeners.forEach(listener => listener());
  };
  return {
    getSnapshot: () => state,
    subscribe(listener: Listener) { listeners.add(listener); return () => listeners.delete(listener); },
    toggleSaved(item: SavedItem) {
      const exists = state.savedItems.some(saved => saved.id === item.id && saved.kind === item.kind);
      state = { ...state, savedItems: exists ? state.savedItems.filter(saved => saved.id !== item.id || saved.kind !== item.kind) : [...state.savedItems, { ...item }] };
      persist();
    },
    updateProject(project: ProductProject) {
      state = { ...state, projects: state.projects.some(item => item.id === project.id) ? state.projects.map(item => item.id === project.id ? {...project} : item) : [...state.projects, {...project}] };
      persist();
    },
    reset() { state = createSeedProductState(); persist(); },
  };
}

export type ProductRepository = ReturnType<typeof createProductRepository>;
