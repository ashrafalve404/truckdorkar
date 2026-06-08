import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'USER' | 'DRIVER' | 'EMPLOYEE' | 'ADMIN';
    isActive: boolean;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    setHydrated: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isHydrated: false,
            setAuth: (user, accessToken, refreshToken) => {
                localStorage.setItem('truckdorkar-access-token', accessToken);
                localStorage.setItem('truckdorkar-refresh-token', refreshToken);
                set({ user, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('truckdorkar-access-token');
                localStorage.removeItem('truckdorkar-refresh-token');
                set({ user: null, isAuthenticated: false });
            },
            updateUser: (updatedUser) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...updatedUser } : null,
                }));
            },
            setHydrated: () => set({ isHydrated: true }),
        }),
        {
            name: 'truckdorkar-auth-storage',
            onRehydrateStorage: (state) => {
                return (rehydratedState, error) => {
                    if (rehydratedState) {
                        rehydratedState.setHydrated();
                    }
                };
            },
        }
    )
);
