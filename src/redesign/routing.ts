import type { Page, PrimaryPage } from './types';

export const primaryPages: PrimaryPage[] = ['home', 'discover', 'tasks', 'inbox'];

export function pathPage(pathname: string): Page {
  const segment = pathname.split('/').filter(Boolean)[0] as Page | undefined;
  const supported: Page[] = ['home', 'discover', 'tasks', 'inbox', 'profile', 'workspace', 'tools', 'jobs', 'talent', 'projects', 'buzz', 'skill-swap', 'ai-studio', 'business', 'saved'];
  return segment && supported.includes(segment) ? segment : 'home';
}

export function isSecondaryPage(page: Page) {
  return !['home', 'discover', 'tasks', 'inbox', 'profile', 'workspace'].includes(page);
}
