import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const authStore = useAuthStore();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          authStore.logout();
        } else if (session) {
          authStore.checkAuth();
        }
      }
    );

    // Check authentication status on mount
    authStore.checkAuth();

    return () => subscription.unsubscribe();
  }, []);

  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth,
  };
};

export const useRequireAuth = () => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      window.location.href = '/auth/login';
    }
  }, [auth.isAuthenticated]);

  return auth;
};

export const useRequireAdmin = () => {
  const auth = useRequireAuth();

  useEffect(() => {
    if (auth.user && auth.user.role !== 'admin') {
      window.location.href = '/';
    }
  }, [auth.user]);

  return auth;
};