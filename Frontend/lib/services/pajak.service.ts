import { apiRequest, query } from './api';
import type {
  JenisPajak,
  WajibPajak,
  TransaksiPajak,
  SetoranPajak,
  AuditLogPajak,
  RingkasanPajak,
  TransaksiPajakFilter,
  PaginatedResult,
} from '@/types/pajak';

export interface DetailTransaksiBukti {
  transaksi: TransaksiPajak;
  setoran: SetoranPajak | null;
  audits: AuditLogPajak[];
}

export interface DetailSetoranBatch {
  setoran: SetoranPajak;
  transaksi: TransaksiPajak[];
  auditTrail: AuditLogPajak[];
}

export const pajakService = {
  // ---- Public Endpoints ----

  getRingkasan(tahun?: number): Promise<RingkasanPajak> {
    return apiRequest<RingkasanPajak>(`/pajak/ringkasan${query({ tahun })}`);
  },

  getJenisPajakPublic(): Promise<JenisPajak[]> {
    return apiRequest<JenisPajak[]>('/pajak/jenis');
  },

  getTransaksiPublic(filter: TransaksiPajakFilter): Promise<PaginatedResult<TransaksiPajak>> {
    return apiRequest<PaginatedResult<TransaksiPajak>>(`/pajak/transaksi${query(filter as Record<string, string | number | undefined>)}`);
  },

  getTransaksiByNomor(nomorBukti: string): Promise<DetailTransaksiBukti> {
    return apiRequest<DetailTransaksiBukti>(`/pajak/transaksi/${encodeURIComponent(nomorBukti)}`);
  },

  getSetoranListPublic(tahun?: number): Promise<SetoranPajak[]> {
    return apiRequest<SetoranPajak[]>(`/pajak/setoran${query({ tahun })}`);
  },

  getSetoranDetail(id: string): Promise<DetailSetoranBatch> {
    return apiRequest<DetailSetoranBatch>(`/pajak/setoran/${id}`);
  },

  getPajakSaya(page = 1, limit = 20): Promise<PaginatedResult<TransaksiPajak>> {
    return apiRequest<PaginatedResult<TransaksiPajak>>(`/pajak/saya${query({ page, limit })}`, {
      auth: true,
    });
  },

  // ---- Admin Endpoints ----

  getJenisPajakAdmin(): Promise<JenisPajak[]> {
    return apiRequest<JenisPajak[]>('/admin/pajak/jenis', { auth: true });
  },

  saveJenisPajak(data: Partial<JenisPajak>, id?: string): Promise<JenisPajak> {
    const path = id ? `/admin/pajak/jenis/${id}` : '/admin/pajak/jenis';
    const method = id ? 'PUT' : 'POST';
    return apiRequest<JenisPajak>(path, {
      method,
      auth: true,
      body: data,
    });
  },

  deleteJenisPajak(id: string): Promise<{ ok: boolean }> {
    return apiRequest<{ ok: boolean }>(`/admin/pajak/jenis/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  getWajibPajakAdmin(search?: string, page = 1, limit = 20): Promise<PaginatedResult<WajibPajak>> {
    return apiRequest<PaginatedResult<WajibPajak>>(`/admin/pajak/wajib-pajak${query({ search, page, limit })}`, {
      auth: true,
    });
  },

  getWajibPajakGet(id: string): Promise<WajibPajak> {
    return apiRequest<WajibPajak>(`/admin/pajak/wajib-pajak/${id}`, { auth: true });
  },

  saveWajibPajak(data: Partial<WajibPajak>, id?: string): Promise<WajibPajak> {
    const path = id ? `/admin/pajak/wajib-pajak/${id}` : '/admin/pajak/wajib-pajak';
    const method = id ? 'PUT' : 'POST';
    return apiRequest<WajibPajak>(path, {
      method,
      auth: true,
      body: data,
    });
  },

  deleteWajibPajak(id: string): Promise<{ ok: boolean }> {
    return apiRequest<{ ok: boolean }>(`/admin/pajak/wajib-pajak/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  getTransaksiAdmin(filter: TransaksiPajakFilter): Promise<PaginatedResult<TransaksiPajak>> {
    return apiRequest<PaginatedResult<TransaksiPajak>>(`/admin/pajak/transaksi${query(filter as Record<string, string | number | undefined>)}`, {
      auth: true,
    });
  },

  createTransaksi(input: {
    jenisPajakId: string;
    wajibPajakId: string;
    tahun: number;
    periode: string;
    nominal: number;
    tanggalBayar: string;
    catatan?: string;
  }): Promise<TransaksiPajak> {
    return apiRequest<TransaksiPajak>('/admin/pajak/transaksi', {
      method: 'POST',
      auth: true,
      body: input,
    });
  },

  updateStatusTransaksi(id: string, status: string, catatan?: string): Promise<TransaksiPajak> {
    return apiRequest<TransaksiPajak>(`/admin/pajak/transaksi/${id}/status`, {
      method: 'PATCH',
      auth: true,
      body: { status, catatan },
    });
  },

  getSetoranListAdmin(tahun?: number): Promise<SetoranPajak[]> {
    return apiRequest<SetoranPajak[]>(`/admin/pajak/setoran${query({ tahun })}`, { auth: true });
  },

  createSetoran(input: {
    tujuan: string;
    tanggalSetor: string;
    transaksiIds: string[];
    catatan?: string;
  }): Promise<SetoranPajak> {
    return apiRequest<SetoranPajak>('/admin/pajak/setoran', {
      method: 'POST',
      auth: true,
      body: input,
    });
  },

  konfirmasiSetoran(
    id: string,
    input: {
      nomorBuktiPenerimaan: string;
      diterimaOleh: string;
      catatan?: string;
      urlBukti?: string;
    },
  ): Promise<SetoranPajak> {
    return apiRequest<SetoranPajak>(`/admin/pajak/setoran/${id}/konfirmasi`, {
      method: 'POST',
      auth: true,
      body: input,
    });
  },

  getAuditLogs(refTipe?: string, refId?: string): Promise<AuditLogPajak[]> {
    return apiRequest<AuditLogPajak[]>(`/admin/pajak/audit${query({ refTipe, refId })}`, { auth: true });
  },
};
