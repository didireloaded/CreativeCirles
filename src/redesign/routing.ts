import type { Page, PrimaryPage } from './types';

export const primaryPages: PrimaryPage[] = ['home', 'discover', 'tasks', 'inbox'];

export function pathPage(pathname: string): Page {
  const clean = pathname.split('?')[0];
  const segment = clean.split('/').filter(Boolean)[0] as Page | undefined;
  const supported: Page[] = ['home', 'discover', 'tasks', 'inbox', 'profile', 'workspace', 'tools', 'jobs', 'talent', 'projects', 'buzz', 'skill-swap', 'ai-studio', 'business', 'saved'];
  return segment && supported.includes(segment) ? segment : 'home';
}

export function buildPath(page: Page, query?: Record<string, string | number | boolean | undefined>): string {
  if (!query) return `/${page}`;
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(query)) {
    if (val !== undefined && val !== null && val !== '') {
      params.set(key, String(val));
    }
  }
  const qs = params.toString();
  return qs ? `/${page}?${qs}` : `/${page}`;
}

export function isSecondaryPage(page: Page) {
  return !['home', 'discover', 'tasks', 'inbox', 'profile', 'workspace'].includes(page);
}
