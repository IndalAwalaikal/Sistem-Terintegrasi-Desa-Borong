import { apiRequest, query } from '@/lib/services/api';
import type { FasilitasDesa } from '@/types/fasilitas';

export async function getFasilitasDesa(kategori?: string): Promise<FasilitasDesa[]> { return apiRequest<FasilitasDesa[]>(`/fasilitas${query({ kategori })}`); }
export async function createFasilitasDesa(input: Omit<FasilitasDesa, 'id'>): Promise<FasilitasDesa> { return apiRequest<FasilitasDesa>('/fasilitas', { method: 'POST', auth: true, body: input }); }
export async function deleteFasilitasDesa(id: string): Promise<void> { await apiRequest(`/fasilitas/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }); }
export async function updateFasilitasDesa(id: string, input: Omit<FasilitasDesa, 'id'>): Promise<FasilitasDesa> { return apiRequest<FasilitasDesa>(`/fasilitas/${encodeURIComponent(id)}`, { method: 'PUT', auth: true, body: input }); }
