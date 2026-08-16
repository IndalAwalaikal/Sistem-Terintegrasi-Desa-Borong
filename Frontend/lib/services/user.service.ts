import { apiRequest } from '@/lib/services/api';
import type { Role, User } from '@/types/user';

export async function getUsersAdmin(): Promise<User[]> { return apiRequest<User[]>('/users', { auth: true }); }
export async function updateUserAdmin(id: string, input: Partial<Pick<User, 'nama' | 'email' | 'telepon' | 'alamat' | 'role'>>): Promise<User> {
  if (!input.role) throw new Error('Backend hanya mendukung pembaruan peran pengguna oleh super admin.');
  return apiRequest<User>(`/users/${encodeURIComponent(id)}`, { method: 'PUT', auth: true, body: { role: input.role } });
}
export async function updateUserRoleAdmin(id: string, role: Role): Promise<User> { return updateUserAdmin(id, { role }); }
