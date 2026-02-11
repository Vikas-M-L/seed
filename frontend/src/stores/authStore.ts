import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, UserRole } from '@/types';
import { authApi } from '@/services/api';

interface ExtendedAuthState extends AuthState {
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<ExtendedAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email?: string, password?: string, role?: UserRole) => {
        if (!email || !password) throw new Error('Email and password are required');
        try {
          set({ isLoading: true });

          // Call real backend API
          const response = await authApi.login({ email, password });

          // Store token
          localStorage.setItem('token', response.access_token);

          // Map backend user to frontend user type
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            role: (response.user.role as string) === 'EMPLOYEE' ? 'LAB_MEMBER' : response.user.role as UserRole,
            employeeId: response.user.employeeId,
            designation: response.user.designation,
            status: 'ACTIVE',
          };

          set({
            user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false, isAuthenticated: false });
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },

      logout: async () => {
        try {
          // Call backend logout
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear local state regardless of API call result
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');

        if (!token) {
          set({ isLoading: false, isAuthenticated: false, user: null });
          return;
        }

        try {
          // Verify token with backend
          const response = await authApi.getCurrentUser();

          // Map backend user to frontend user type
          const user: User = {
            id: response.id,
            email: response.email,
            name: response.name,
            role: (response.role as string) === 'EMPLOYEE' ? 'LAB_MEMBER' : response.role as UserRole,
            employeeId: response.employeeId,
            designation: response.designation,
            status: 'ACTIVE',
          };

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token is invalid, clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
