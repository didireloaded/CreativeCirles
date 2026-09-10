export type Page = 'home' | 'discover' | 'inbox' | 'profile' | 'workspace';
export interface ScreenProps {
  notify: (message: string) => void;
  navigate: (page: Page) => void;
  openCreate: () => void;
  openDrafts: () => void;
}
export interface Post {
  id: string;
  author: string;
  handle: string;
  discipline: string;
  avatar: string;
  image: string;
  title: string;
  caption: string;
  category: string;
  location: string;
  likes: number;
  comments: number;
  project?: boolean;
}
