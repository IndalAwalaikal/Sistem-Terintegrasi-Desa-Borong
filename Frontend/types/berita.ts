export type KategoriBerita = 'pengumuman' | 'kegiatan' | 'pembangunan' | 'lainnya';

export interface Berita {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: KategoriBerita;
  gambarSampul: string;
  gambarTengah?: string;
  penulis: string;
  tanggalTerbit: string;
  tags: string[];
  dibaca: number;
}

export interface BeritaKomentar {
  id: string;
  beritaId: string;
  userId?: string | null;
  nama: string;
  konten: string;
  createdAt: string;
}

export interface BeritaListParams {
  kategori?: KategoriBerita;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
