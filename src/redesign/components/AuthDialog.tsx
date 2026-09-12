import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import Modal from '../Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  notify: (msg: string) => void;
}

export default function AuthDialog({ open, onClose, notify }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        setCurrentUserEmail(data.user?.email || null);
      });
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      notify('Supabase authentication client is not configured.');
      onClose();
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        notify(`Signed in as ${data.user.email}`);
        setCurrentUserEmail(data.user.email || null);
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        notify(data.session ? 'Account created and signed in!' : 'Verification link sent to your email.');
        setCurrentUserEmail(data.user?.email || null);
        onClose();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setCurrentUserEmail(null);
      notify('Signed out successfully.');
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={currentUserEmail ? 'Your Account' : mode === 'signin' ? 'Sign In' : 'Create Account'} onClose={onClose}>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {currentUserEmail ? (
          <div>
            <p style={{ margin: '0 0 1rem 0' }}>
              You are currently signed in as <strong>{currentUserEmail}</strong>.
            </p>
            <button
              type="button"
              className="button secondary"
              onClick={handleSignOut}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <button
                type="button"
                className={`button ${mode === 'signin' ? 'primary' : 'secondary'}`}
                onClick={() => { setMode('signin'); setErrorMsg(null); }}
                style={{ flex: 1 }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`button ${mode === 'signup' ? 'primary' : 'secondary'}`}
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                style={{ flex: 1 }}
              >
                Sign Up
              </button>
            </div>

            {errorMsg && (
              <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: '#fee2e2', color: '#991b1b', fontSize: '0.875rem' }}>
                {errorMsg}
              </div>
            )}

            <div>
              <label htmlFor="auth-email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9375rem' }}
              />
            </div>

            <div>
              <label htmlFor="auth-password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9375rem' }}
              />
            </div>

            <button
              type="submit"
              className="button primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In to Creative Circle' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
