import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import type { IAuthStore, ILoginCredentials, IRegisterData, IUser } from '@/types';

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials: ILoginCredentials) => {
        try {
          const response = await authAPI.login(credentials);
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token in localStorage
            localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
            
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error: any) {
          throw new Error(error.response?.data?.message || error.message || 'Login failed');
        }
      },

      register: async (userData: IRegisterData) => {
        try {
          const response = await authAPI.register(userData);
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token in localStorage
            localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
            
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error: any) {
          throw new Error(error.response?.data?.message || error.message || 'Registration failed');
        }
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        
        // Reset store
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Optional: Call logout API
        authAPI.logout().catch(console.error);
      },

      checkAuth: async () => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        
        if (!token) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return;
        }

        try {
          const response = await authAPI.verifyToken();
          if (response.success && response.data) {
            set({
              user: response.data,
              token,
              isAuthenticated: true,
            });
          } else {
            throw new Error('Token verification failed');
          }
        } catch (error) {
          // Token is invalid, clear everything
          localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'powersupport-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);