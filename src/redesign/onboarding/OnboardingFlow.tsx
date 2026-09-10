import { useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, MapPin } from 'lucide-react';
import { photos } from '../data';
import {
  type OnboardingErrors,
  type OnboardingProfile,
  type OnboardingStep,
  validateOnboardingStep,
} from './model';
import './onboarding.css';

const steps: OnboardingStep[] = ['role', 'interests', 'availability', 'profile'];
const roles = ['Photographer', 'Filmmaker', 'Designer', 'Musician', 'Writer', 'Fashion creative', 'Multidisciplinary'];
const interests = ['Film', 'Photography', 'Design', 'Music', 'Writing', 'Fashion', 'Feedback'];
const availability = [
  { value: 'available' as const, label: 'Available', detail: 'Open to new work and collaborations' },
  { value: 'selective' as const, label: 'Selective', detail: 'Considering the right opportunities' },
  { value: 'unavailable' as const, label: 'Unavailable', detail: 'Focused on current work for now' },
];

type Props = {
  initialProfile: OnboardingProfile;
  onComplete: (profile: OnboardingProfile) => void;
  onSkip: () => void;
  onCancel?: () => void;
};

export default function OnboardingFlow({ initialProfile, onComplete, onSkip, onCancel }: Props) {
  const [index, setIndex] = useState(0);
  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState<OnboardingErrors>({});
  const step = steps[index];

  const update = <K extends keyof OnboardingProfile>(key: K, value: OnboardingProfile[K]) => {
    setProfile(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
  };
  const continueFlow = () => {
    const nextErrors = validateOnboardingStep(step, profile);
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    if (index < steps.length - 1) return setIndex(index + 1);
    onComplete({ ...profile, completed: true });
  };
  const toggleInterest = (value: string) => update('interests', profile.interests.includes(value)
    ? profile.interests.filter(item => item !== value)
    : [...profile.interests, value]);
  const chooseAvatar = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => update('avatarDataUrl', String(reader.result));
    reader.readAsDataURL(file);
  };

  return <main className="ob-page">
    <header className="ob-top">
      <button className="ob-back" onClick={() => index ? setIndex(index - 1) : onCancel?.()} disabled={!index && !onCancel} aria-label={index ? 'Back' : 'Close onboarding'}><ArrowLeft /></button>
      <div className="ob-progress" aria-label={`Step ${index + 1} of ${steps.length}`}>{steps.map((item, itemIndex) => <i key={item} className={itemIndex <= index ? 'is-active' : ''} />)}</div>
      <span>Step {index + 1} of {steps.length}</span>
    </header>

    <section className="ob-card">
      {step === 'role' && <fieldset aria-describedby={errors.role ? 'ob-role-error' : undefined}>
        <legend role="heading" aria-level={1} aria-label="What do you create?"><small aria-hidden="true">YOUR CREATIVE PRACTICE</small>What do you create?</legend>
        <p>Choose the role that best describes your work today. You can change this later.</p>
        <div className="ob-choice-grid">{roles.map(role => <label key={role} className={profile.role === role ? 'is-selected' : ''}><input type="radio" name="role" checked={profile.role === role} onChange={() => update('role', role)} /><span>{role}</span>{profile.role === role && <Check />}</label>)}</div>
        {errors.role && <p className="ob-error" id="ob-role-error" role="alert">{errors.role}</p>}
      </fieldset>}

      {step === 'interests' && <fieldset aria-describedby={errors.interests ? 'ob-interest-error' : undefined}>
        <legend role="heading" aria-level={1} aria-label="What inspires your work?"><small aria-hidden="true">SHAPE YOUR CIRCLE</small>What inspires your work?</legend>
        <p>Choose at least three. We’ll use them to shape your discovery feed.</p>
        <div className="ob-interest-grid">{interests.map(interest => <label key={interest} className={profile.interests.includes(interest) ? 'is-selected' : ''}><input type="checkbox" checked={profile.interests.includes(interest)} onChange={() => toggleInterest(interest)} /><span>{interest}</span>{profile.interests.includes(interest) && <Check />}</label>)}</div>
        <p className="ob-count">{profile.interests.length} selected</p>
        {errors.interests && <p className="ob-error" id="ob-interest-error" role="alert">{errors.interests}</p>}
      </fieldset>}

      {step === 'availability' && <fieldset>
        <legend role="heading" aria-level={1} aria-label="Are you open to opportunities?"><small aria-hidden="true">LET PEOPLE KNOW</small>Are you open to opportunities?</legend>
        <p>This helps the right collaborators know when to reach out.</p>
        <div className="ob-availability">{availability.map(option => <label key={option.value} className={profile.availability === option.value ? 'is-selected' : ''}><input type="radio" name="availability" aria-label={option.label} checked={profile.availability === option.value} onChange={() => update('availability', option.value)} /><span><b>{option.label}</b><small>{option.detail}</small></span><i /></label>)}</div>
        <label className="ob-field"><span><MapPin /> Location <small>Optional</small></span><input value={profile.location} onChange={event => update('location', event.target.value)} maxLength={80} placeholder="City or region" /></label>
      </fieldset>}

      {step === 'profile' && <fieldset>
        <legend role="heading" aria-level={1} aria-label="Introduce yourself."><small aria-hidden="true">MAKE IT YOURS</small>Introduce yourself.</legend>
        <p>A few details are enough to make your circle feel personal.</p>
        <label className="ob-avatar"><input type="file" accept="image/*" onChange={event => chooseAvatar(event.target.files?.[0])} /><img src={profile.avatarDataUrl || photos.portrait} alt="Your profile preview" /><span><Camera /> Choose photo</span></label>
        <label className="ob-field">Display name<input value={profile.displayName} onChange={event => update('displayName', event.target.value)} maxLength={40} aria-invalid={Boolean(errors.displayName)} aria-describedby={errors.displayName ? 'ob-name-error' : undefined} placeholder="How people will know you" /></label>
        {errors.displayName && <p className="ob-error" id="ob-name-error" role="alert">{errors.displayName}</p>}
        <label className="ob-field">Creative handle<div className="ob-handle"><span>@</span><input aria-label="Creative handle" value={profile.handle} onChange={event => update('handle', event.target.value.toLowerCase().replace(/\s+/g, ''))} maxLength={30} aria-invalid={Boolean(errors.handle)} aria-describedby={errors.handle ? 'ob-handle-error' : undefined} placeholder="your.name" /></div></label>
        {errors.handle && <p className="ob-error" id="ob-handle-error" role="alert">{errors.handle}</p>}
        <label className="ob-field">Short bio <small>Optional</small><textarea value={profile.bio} onChange={event => update('bio', event.target.value)} maxLength={160} placeholder="What do you make, and what are you looking for?" /></label>
      </fieldset>}
    </section>

    <footer className="ob-actions">
      <button className="ob-skip" onClick={onSkip}>Skip preview setup</button>
      <button className="ob-continue" onClick={continueFlow}>{index === steps.length - 1 ? 'Finish setup' : 'Continue'}<ArrowRight /></button>
    </footer>
  </main>;
}
