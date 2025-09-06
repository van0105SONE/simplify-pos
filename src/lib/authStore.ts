// lib/authStore.ts
import { create } from 'zustand';
import { toast } from 'sonner';
import { UserEntity} from '@/types/pos';


interface AuthState {
    user: UserEntity | null;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const result = await window.electronAPI.logIn({ username, password });
            if (result.success) {
                set({ user: result.user, isLoading: false });
            } else {
                throw new Error(result.error || 'Login failed');
            }
        } catch (error:any) {
            const errorMessage = error.message || 'Login failed';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await window.electronAPI.logout();
            set({ user: null, isLoading: false });
        } catch (error) {
            const errorMessage = 'Logout failed';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
        }
    },
    fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
            const userData = await window.electronAPI.getUser();
            set({ user: userData, isLoading: false });
        } catch (error) {
            const errorMessage = 'Failed to fetch user';
            set({ user: null, error: errorMessage, isLoading: false });
            toast.error(errorMessage);
        }
    },
}));