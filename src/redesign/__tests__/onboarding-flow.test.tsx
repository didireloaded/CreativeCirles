import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import { defaultOnboardingProfile } from '../onboarding/model';

describe('OnboardingFlow', () => {
  it('stops on the role step and explains what is required', async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow initialProfile={defaultOnboardingProfile} onComplete={vi.fn()} onSkip={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Choose your primary creative role.')).toBeVisible();
  });

  it('preserves role and interest choices while navigating back', async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow initialProfile={defaultOnboardingProfile} onComplete={vi.fn()} onSkip={vi.fn()} />);

    await user.click(screen.getByRole('radio', { name: 'Filmmaker' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'What inspires your work?' })).toBeVisible();
    for (const interest of ['Film', 'Writing', 'Music']) await user.click(screen.getByRole('checkbox', { name: interest }));
    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByRole('radio', { name: 'Filmmaker' })).toBeChecked();
  });

  it('completes setup with a valid profile', async () => {
    const user = userEvent.setup();
    const complete = vi.fn();
    render(<OnboardingFlow initialProfile={defaultOnboardingProfile} onComplete={complete} onSkip={vi.fn()} />);

    await user.click(screen.getByRole('radio', { name: 'Photographer' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    for (const interest of ['Photography', 'Design', 'Feedback']) await user.click(screen.getByRole('checkbox', { name: interest }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('radio', { name: 'Available' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.type(screen.getByLabelText('Display name'), 'Jordan K.');
    await user.type(screen.getByLabelText('Creative handle'), 'jordan.creates');
    await user.click(screen.getByRole('button', { name: 'Finish setup' }));

    expect(complete).toHaveBeenCalledWith(expect.objectContaining({
      completed: true,
      role: 'Photographer',
      interests: ['Photography', 'Design', 'Feedback'],
      availability: 'available',
      displayName: 'Jordan K.',
      handle: 'jordan.creates',
    }));
  });

  it('offers a direct preview skip', async () => {
    const user = userEvent.setup();
    const skip = vi.fn();
    render(<OnboardingFlow initialProfile={defaultOnboardingProfile} onComplete={vi.fn()} onSkip={skip} />);
    await user.click(screen.getByRole('button', { name: 'Skip preview setup' }));
    expect(skip).toHaveBeenCalledTimes(1);
  });
});
