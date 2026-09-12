import type { OnboardingProfile } from './onboarding/model';
import type { TaskDraft } from './tasks/model';

export type PrimaryPage = 'home' | 'discover' | 'tasks' | 'inbox';
export type Page = PrimaryPage | 'profile' | 'workspace' | 'tools' | 'jobs' | 'talent' | 'projects' | 'buzz' | 'skill-swap' | 'ai-studio' | 'business' | 'saved';
export interface ScreenProps {
  notify: (message: string) => void;
  navigate: (page: Page) => void;
  openCreate: () => void;
  openDrafts: () => void;
  profile: OnboardingProfile;
  updateProfile?: (profile: OnboardingProfile) => boolean;
  editPreferences: () => void;
  openNotifications: () => void;
  openTaskDraft: (draft: TaskDraft) => void;
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
export interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}
export interface ServiceRate {
  name: string;
  rate: string;
}
export interface Creator {
  id: string;
  name: string;
  handle: string;
  role: string;
  image: string;
  bio: string;
  availability: string;
  skills: string[];
  equipment: string[];
  services: ServiceRate[];
  portfolio: string[];
  socialLinks: string[];
}
export interface CreativePost extends Post { authorId: string }
export interface Community {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  purpose: string;
  members: number;
  disciplines: string[];
  memberPreviews: Creator[];
  recentWork: string[];
}
