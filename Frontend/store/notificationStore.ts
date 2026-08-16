import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [
    {
      id: 'notif-1',
      title: 'Status Pengajuan Berubah',
      message: 'Pengajuan SKD-2607-0012 telah diselesaikan. Silakan ambil di kantor desa.',
      type: 'success',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: false,
      link: '/layanan/lacak?resi=SKD-2607-0012',
    },
    {
      id: 'notif-2',
      title: 'Pengumuman Posyandu',
      message: 'Jadwal Posyandu bulan Agustus 2026 telah diterbitkan.',
      type: 'info',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: false,
      link: '/berita/pengumuman-jadwal-posyandu-agustus-2026',
    },
  ],
  addNotification: (item) =>
    set((state) => ({
      notifications: [
        {
          ...item,
          id: `notif-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearAll: () => set({ notifications: [] }),
}));
