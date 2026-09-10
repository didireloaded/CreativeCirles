import { supabase } from './client';

export const phoneOtpEnabled = import.meta.env.VITE_PHONE_OTP_ENABLED === 'true';

export function normalizeNamibianPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('264')) return `+${digits}`;
  if (digits.startsWith('0')) return `+264${digits.slice(1)}`;
  return `+264${digits}`;
}

export async function requestPhoneOtp(value: string) {
  if (!phoneOtpEnabled) throw new Error('Phone sign-in is coming soon while secure SMS delivery is being configured.');
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase.auth.signInWithOtp({ phone: normalizeNamibianPhone(value) });
}
