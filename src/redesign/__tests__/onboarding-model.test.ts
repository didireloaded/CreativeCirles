import { beforeEach, describe, expect, it } from 'vitest';
import {
  defaultOnboardingProfile,
  persistOnboarding,
  readOnboarding,
  validateOnboardingStep,
} from '../onboarding/model';

describe('onboarding model', () => {
  beforeEach(() => localStorage.clear());

  it('rejects moving forward without a creative role', () => {
    expect(validateOnboardingStep('role', defaultOnboardingProfile)).toEqual({
      role: 'Choose your primary creative role.',
    });
  });

  it('requires at least three interests', () => {
    expect(validateOnboardingStep('interests', {
      ...defaultOnboardingProfile,
      interests: ['Film'],
    })).toEqual({ interests: 'Choose at least three interests.' });
  });

  it('rejects an invalid profile handle', () => {
    expect(validateOnboardingStep('profile', {
      ...defaultOnboardingProfile,
      displayName: 'Jordan K.',
      handle: 'Jordan spaces',
    })).toEqual({ handle: 'Use 3–30 lowercase letters, numbers, dots, or underscores.' });
  });

  it('round-trips a completed profile', () => {
    const profile = {
      ...defaultOnboardingProfile,
      completed: true,
      role: 'Filmmaker',
      interests: ['Film', 'Writing', 'Music'],
      displayName: 'Jordan K.',
      handle: 'jordan.creates',
    };
    expect(persistOnboarding(profile)).toBe(true);
    expect(readOnboarding()).toEqual(profile);
  });

  it('falls back safely when stored data is malformed', () => {
    localStorage.setItem('circle:onboarding:v1', '{bad json');
    expect(readOnboarding()).toEqual(defaultOnboardingProfile);
  });
});
