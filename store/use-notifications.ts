import { create } from 'zustand';
import api from '@/lib/api';

interface NotificationState {
    notifications: any[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotifications = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/notifications');
            const data = res.data?.data || res.data || [];
            set({
                notifications: data,
                unreadCount: data.filter((n: any) => !n.isRead).length
            });
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            set({ loading: false });
        }
    },
    markAllAsRead: async () => {
        try {
            await api.patch('/notifications/read-all');
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    }
}));
