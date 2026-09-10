import { describe, expect, it } from 'vitest';
import { normalizeNamibianPhone, phoneOtpEnabled, requestPhoneOtp } from '../../lib/supabase/auth';

describe('Namibia phone authentication guard', () => {
  it('normalizes local numbers to +264 E.164 format', () => {
    expect(normalizeNamibianPhone('081 234 5678')).toBe('+264812345678');
    expect(normalizeNamibianPhone('+264 81 234 5678')).toBe('+264812345678');
  });
  it('does not send OTP while the SMS provider is disabled', async () => {
    expect(phoneOtpEnabled).toBe(false);
    await expect(requestPhoneOtp('0812345678')).rejects.toThrow('coming soon');
  });
});
