import { apiRequest } from '@/lib/services/api';
import type { SekilasInfo, SekilasInfoEditableInput } from '@/types/sekilas_info';

export async function getSekilasInfo(): Promise<SekilasInfo[]> {
  return apiRequest<SekilasInfo[]>('/sekilas-info');
}

export async function getSekilasInfoAdmin(): Promise<SekilasInfo[]> {
  return apiRequest<SekilasInfo[]>('/admin/sekilas-info', { auth: true });
}

export async function createSekilasInfoAdmin(input: SekilasInfoEditableInput): Promise<SekilasInfo> {
  return apiRequest<SekilasInfo>('/sekilas-info', { method: 'POST', auth: true, body: input });
}

export async function updateSekilasInfoAdmin(id: string, input: Partial<SekilasInfoEditableInput>): Promise<SekilasInfo> {
  return apiRequest<SekilasInfo>(`/sekilas-info/${encodeURIComponent(id)}`, { method: 'PUT', auth: true, body: input });
}

export async function deleteSekilasInfoAdmin(id: string): Promise<void> {
  await apiRequest(`/sekilas-info/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });
}