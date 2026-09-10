export type OnboardingStep = 'role' | 'interests' | 'availability' | 'profile';
export type Availability = 'available' | 'selective' | 'unavailable';

export type OnboardingProfile = {
  completed: boolean;
  role: string;
  interests: string[];
  availability: Availability;
  location: string;
  displayName: string;
  handle: string;
  bio: string;
  avatarDataUrl?: string;
};

export type OnboardingErrors = Partial<Record<keyof OnboardingProfile, string>>;

export const onboardingStorageKey = 'circle:onboarding:v1';

export const defaultOnboardingProfile: OnboardingProfile = {
  completed: false,
  role: '',
  interests: [],
  availability: 'selective',
  location: '',
  displayName: '',
  handle: '',
  bio: '',
};

const availabilityValues: Availability[] = ['available', 'selective', 'unavailable'];

export function validateOnboardingStep(step: OnboardingStep, profile: OnboardingProfile): OnboardingErrors {
  if (step === 'role' && !profile.role.trim()) {
    return { role: 'Choose your primary creative role.' };
  }
  if (step === 'interests' && profile.interests.length < 3) {
    return { interests: 'Choose at least three interests.' };
  }
  if (step === 'profile') {
    if (!profile.displayName.trim()) return { displayName: 'Enter your display name.' };
    if (!/^[a-z0-9._]{3,30}$/.test(profile.handle)) {
      return { handle: 'Use 3–30 lowercase letters, numbers, dots, or underscores.' };
    }
  }
  return {};
}

export function persistOnboarding(profile: OnboardingProfile): boolean {
  try {
    localStorage.setItem(onboardingStorageKey, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

export function readOnboarding(): OnboardingProfile {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(onboardingStorageKey) || 'null');
    if (!value || typeof value !== 'object') return defaultOnboardingProfile;
    const stored = value as Partial<OnboardingProfile>;
    return {
      ...defaultOnboardingProfile,
      completed: stored.completed === true,
      role: typeof stored.role === 'string' ? stored.role : '',
      interests: Array.isArray(stored.interests) ? stored.interests.filter((item): item is string => typeof item === 'string') : [],
      availability: availabilityValues.includes(stored.availability as Availability) ? stored.availability as Availability : 'selective',
      location: typeof stored.location === 'string' ? stored.location : '',
      displayName: typeof stored.displayName === 'string' ? stored.displayName : '',
      handle: typeof stored.handle === 'string' ? stored.handle : '',
      bio: typeof stored.bio === 'string' ? stored.bio : '',
      ...(typeof stored.avatarDataUrl === 'string' ? { avatarDataUrl: stored.avatarDataUrl } : {}),
    };
  } catch {
    return defaultOnboardingProfile;
  }
}
