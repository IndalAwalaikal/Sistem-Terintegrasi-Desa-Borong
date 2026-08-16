import { apiRequest, query } from '@/lib/services/api';
import type { AgendaKegiatan, ApbdesRingkasan, StatistikPenduduk } from '@/types/statistik';

export async function getStatistikPenduduk(tahun?: number): Promise<StatistikPenduduk> { return apiRequest<StatistikPenduduk>(`/statistik/penduduk${query({ tahun })}`); }
export type ApbdesPeriode = { bulan?: number; triwulan?: number };
export async function getApbdes(tahun?: number, periode: ApbdesPeriode = {}): Promise<ApbdesRingkasan> { return apiRequest<ApbdesRingkasan>(`/apbdes${query({ tahun, bulan: periode.bulan, triwulan: periode.triwulan })}`); }
export async function getAgendaKegiatan(tahun?: number): Promise<AgendaKegiatan[]> { return apiRequest<AgendaKegiatan[]>(`/agenda${query({ tahun })}`); }
export interface ApbdesItemEditable { kategori: 'pendapatan' | 'belanja'; subKategori: string; jumlah: number; }
export async function updateApbdesAdmin(input: { tahun?: number; bulan?: number; triwulan?: number; totalPendapatan?: number; totalBelanja?: number; items?: ApbdesItemEditable[] }): Promise<ApbdesRingkasan> {
  const current = await getApbdes(input.tahun, { bulan: input.bulan, triwulan: input.triwulan });
  return apiRequest<ApbdesRingkasan>('/apbdes', {
    method: 'PUT',
    auth: true,
    body: {
      tahun: input.tahun ?? current.tahun,
      ...(input.bulan !== undefined && input.bulan > 0 ? { bulan: input.bulan } : {}),
      ...(input.triwulan !== undefined && input.triwulan > 0 ? { triwulan: input.triwulan } : {}),
      items: input.items ?? current.items.map(({ kategori, subKategori, jumlah }) => ({ kategori, subKategori, jumlah })),
    },
  });
}
export async function updateStatistikPendudukAdmin(input: Partial<StatistikPenduduk>): Promise<StatistikPenduduk> { return apiRequest<StatistikPenduduk>('/statistik/penduduk', { method: 'PUT', auth: true, body: input }); }
export interface AgendaEditableInput { judul: string; deskripsi: string; tanggalMulai: string; tanggalSelesai?: string; lokasi: string; penyelenggara: string; kategori: AgendaKegiatan['kategori']; }
export async function createAgendaAdmin(input: AgendaEditableInput): Promise<AgendaKegiatan> { return apiRequest<AgendaKegiatan>('/agenda', { method: 'POST', auth: true, body: input }); }
export async function updateAgendaAdmin(id: string, input: Partial<AgendaEditableInput>): Promise<AgendaKegiatan> { return apiRequest<AgendaKegiatan>(`/agenda/${encodeURIComponent(id)}`, { method: 'PUT', auth: true, body: input }); }
export async function deleteAgendaAdmin(id: string): Promise<void> { await apiRequest(`/agenda/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }); }
