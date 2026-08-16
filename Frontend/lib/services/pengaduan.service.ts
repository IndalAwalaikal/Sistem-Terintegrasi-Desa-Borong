import { ApiError, apiRequest, query } from '@/lib/services/api';
import type { Pengaduan, StatusPengaduan, SubmitPengaduanInput } from '@/types/pengaduan';

export async function submitPengaduan(input: SubmitPengaduanInput, _user: { id: string; nama: string }): Promise<Pengaduan> {
  return apiRequest<Pengaduan>('/pengaduan', { method: 'POST', auth: true, body: input });
}
export async function getPengaduanByTiket(nomorTiket: string): Promise<Pengaduan | null> {
  try { return await apiRequest<Pengaduan>(`/pengaduan/${encodeURIComponent(nomorTiket)}`); }
  catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error; }
}
export async function getPengaduanByUser(_userId: string): Promise<Pengaduan[]> { return apiRequest<Pengaduan[]>('/pengaduan/saya', { auth: true }); }
export async function getAllPengaduanAdmin(status?: StatusPengaduan): Promise<Pengaduan[]> { return apiRequest<Pengaduan[]>(`/pengaduan${query({ status })}`, { auth: true }); }
export async function updateStatusPengaduanAdmin(id: string, status: StatusPengaduan, tanggapanAdmin?: string): Promise<Pengaduan> { return apiRequest<Pengaduan>(`/pengaduan/${encodeURIComponent(id)}/status`, { method: 'PATCH', auth: true, body: { status, tanggapanAdmin } }); }
