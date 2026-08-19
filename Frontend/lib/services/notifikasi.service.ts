import { apiRequest } from './api';

export interface NotifikasiItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export async function getNotifikasiList(): Promise<NotifikasiItem[]> {
  return apiRequest<NotifikasiItem[]>('/notifikasi', { auth: true });
}

export async function getNotifikasiUnreadCount(): Promise<{ unread: number }> {
  return apiRequest<{ unread: number }>('/notifikasi/unread-count', { auth: true });
}

export async function markNotifikasiRead(id: string): Promise<void> {
  await apiRequest(`/notifikasi/${encodeURIComponent(id)}/read`, { method: 'POST', auth: true });
}

export async function markAllNotifikasiRead(): Promise<void> {
  await apiRequest('/notifikasi/mark-all-read', { method: 'POST', auth: true });
}
