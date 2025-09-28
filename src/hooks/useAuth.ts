import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const authStore = useAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    authStore.checkAuth();
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