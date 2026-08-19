import { ApiError, apiRequest, query } from '@/lib/services/api';
import type { Berita, BeritaKomentar, BeritaListParams, KategoriBerita, PaginatedResult } from '@/types/berita';

type BeritaListResponse = { items: Berita[]; meta: { page: number; limit: number; total: number; totalPages: number } };

function asPaginated(response: BeritaListResponse): PaginatedResult<Berita> {
  return { data: response.items, page: response.meta.page, perPage: response.meta.limit, total: response.meta.total, totalPages: response.meta.totalPages };
}

export async function getBeritaList(params: BeritaListParams = {}): Promise<PaginatedResult<Berita>> {
  const response = await apiRequest<BeritaListResponse>(`/berita${query({ kategori: params.kategori, search: params.search, page: params.page, limit: params.perPage })}`, { revalidateSeconds: 30 });
  return asPaginated(response);
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  try { return await apiRequest<Berita>(`/berita/${encodeURIComponent(slug)}`, { revalidateSeconds: 60 }); }
  catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error; }
}

export async function getBeritaTerbaru(limit = 4): Promise<Berita[]> { return (await getBeritaList({ page: 1, perPage: limit })).data; }

export async function getBeritaTerkait(currentSlug: string, limit = 3): Promise<Berita[]> {
  const current = await getBeritaBySlug(currentSlug);
  if (!current) return (await getBeritaList({ page: 1, perPage: limit })).data;
  return (await getBeritaList({ kategori: current.kategori, page: 1, perPage: limit + 1 })).data.filter((item) => item.slug !== currentSlug).slice(0, limit);
}

export interface BeritaEditableInput { judul: string; ringkasan: string; konten: string; kategori: KategoriBerita; gambarSampul: string; gambarTengah?: string; tags?: string[]; }
export async function createBeritaAdmin(input: BeritaEditableInput): Promise<Berita> { return apiRequest<Berita>('/berita', { method: 'POST', auth: true, body: input }); }
export async function updateBeritaAdmin(id: string, input: Partial<BeritaEditableInput>): Promise<Berita> { return apiRequest<Berita>(`/berita/${encodeURIComponent(id)}`, { method: 'PUT', auth: true, body: input }); }
export async function deleteBeritaAdmin(id: string): Promise<void> { await apiRequest(`/berita/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }); }

// ---- Komentar Berita ----
export async function getBeritaKomentar(slug: string): Promise<BeritaKomentar[]> {
  return apiRequest<BeritaKomentar[]>(`/berita/${encodeURIComponent(slug)}/komentar`);
}
export async function createBeritaKomentar(slug: string, konten: string): Promise<BeritaKomentar> {
  return apiRequest<BeritaKomentar>(`/berita/${encodeURIComponent(slug)}/komentar`, { method: 'POST', auth: true, body: { konten } });
}
export async function deleteBeritaKomentar(slug: string, id: string): Promise<void> {
  await apiRequest(`/berita/${encodeURIComponent(slug)}/komentar/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });
}
