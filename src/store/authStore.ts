import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import type { IAuthStore, ILoginCredentials, IRegisterData, IUser } from '@/types';
import type { User, Session } from '@supabase/supabase-js';

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials: ILoginCredentials) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) throw error;

          if (data.user && data.session) {
            // Transform Supabase user to IUser format
            const user: IUser = {
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || data.user.email!,
              role: data.user.user_metadata?.role || 'user',
              department: data.user.user_metadata?.department,
              createdAt: data.user.created_at,
              updatedAt: data.user.updated_at,
            };

            set({
              user,
              token: data.session.access_token,
              isAuthenticated: true,
            });
          }
        } catch (error: any) {
          throw new Error(error.message || 'Login failed');
        }
      },

      register: async (userData: IRegisterData) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                name: userData.name,
                department: userData.department,
                role: 'user',
              }
            }
          });

          if (error) throw error;

          if (data.user && data.session) {
            // Transform Supabase user to IUser format
            const user: IUser = {
              id: data.user.id,
              email: data.user.email!,
              name: userData.name,
              role: 'user',
              department: userData.department,
              createdAt: data.user.created_at,
              updatedAt: data.user.updated_at,
            };

            set({
              user,
              token: data.session.access_token,
              isAuthenticated: true,
            });
          }
        } catch (error: any) {
          throw new Error(error.message || 'Registration failed');
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Logout error:', error);
        }
        
        // Reset store
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Transform Supabase user to IUser format
            const user: IUser = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email!,
              role: session.user.user_metadata?.role || 'user',
              department: session.user.user_metadata?.department,
              createdAt: session.user.created_at,
              updatedAt: session.user.updated_at,
            };

            set({
              user,
              token: session.access_token,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
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