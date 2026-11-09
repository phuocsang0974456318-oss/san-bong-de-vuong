import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
};

type AuthContextValue = {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !session?.user) {
      setProfile(null);
      return;
    }

    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileError) {
      setError(`Không tải được hồ sơ tài khoản: ${profileError.message}`);
      setProfile(null);
      return;
    }

    setProfile(data as UserProfile | null);
  }, [session]);

  useEffect(() => {
    let active = true;

    if (!supabase) {
      setLoading(false);
      return () => {
        active = false;
      };
    }
    const client = supabase;

    const loadSession = async () => {
      const { data, error: sessionError } = await client.auth.getSession();
      if (!active) return;

      if (sessionError) {
        setError(`Không tải được phiên đăng nhập: ${sessionError.message}`);
      }

      setSession(data.session);
      if (data.session) {
        const { data: profileData, error: profileError } = await client
          .from('profiles')
          .select('id, email, full_name, role')
          .eq('id', data.session.user.id)
          .maybeSingle();

        if (!active) return;
        if (profileError) {
          setError(`Không tải được hồ sơ tài khoản: ${profileError.message}`);
        } else {
          setProfile(profileData as UserProfile | null);
        }
      }
      setLoading(false);
    };

    void loadSession();

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setProfile(null);
      setError(null);
      if (!nextSession) {
        setLoading(false);
        return;
      }

      setLoading(true);
      window.setTimeout(async () => {
        if (!active) return;
        const { data, error: profileError } = await client
          .from('profiles')
          .select('id, email, full_name, role')
          .eq('id', nextSession.user.id)
          .maybeSingle();

        if (!active) return;
        if (profileError) {
          setError(`Không tải được hồ sơ tài khoản: ${profileError.message}`);
        } else {
          setProfile(data as UserProfile | null);
        }
        setLoading(false);
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    profile,
    loading,
    error,
    refreshProfile,
    clearError: () => setError(null),
  }), [session, profile, loading, error, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider.');
  }
  return context;
}
