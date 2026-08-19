export type StatusTransaksiPajak =
  | 'tercatat'
  | 'diverifikasi'
  | 'disetor'
  | 'dikonfirmasi_bpd'
  | 'dibatalkan';

export type StatusSetoranPajak = 'disetor' | 'dikonfirmasi';

export interface JenisPajak {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  satuan?: string;
  periode: string;
  aktif: boolean;
}

export interface WajibPajak {
  id: string;
  userId?: string;
  noObjek: string;
  nama: string;
  nik?: string;
  alamat: string;
  rt: string;
  rw: string;
  dusun: string;
}

export interface TransaksiPajak {
  id: string;
  nomorBukti: string;
  jenisPajakId: string;
  jenisPajakKode: string;
  jenisPajakNama: string;
  wajibPajakId: string;
  noObjek: string;
  wajibPajakNama: string;
  nik?: string;
  dusun: string;
  tahun: number;
  periode: string;
  nominal: number;
  tanggalBayar: string;
  status: StatusTransaksiPajak;
  catatan?: string;
  catatanBatal?: string;
  pencatatId?: string;
  verifikatorId?: string;
  tglVerifikasi?: string;
  setoranId?: string;
  setoranNomor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SetoranPajak {
  id: string;
  nomorSetoran: string;
  tujuan: string;
  tanggalSetor: string;
  totalSetor: number;
  status: StatusSetoranPajak;
  disetorOleh: string;
  diterimaOleh?: string;
  nomorBuktiPenerimaan?: string;
  tglKonfirmasi?: string;
  urlBukti?: string;
  catatan?: string;
  jumlahTransaksi: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogPajak {
  id: string;
  refTipe: 'TRANSAKSI' | 'SETORAN';
  refId: string;
  perubahan: 'BUAT' | 'VERIFIKASI' | 'SETOR' | 'KONFIRMASI' | 'BATAL';
  statusLama: string;
  statusBaru: string;
  catatan?: string;
  userId?: string;
  createdAt: string;
}

export interface RingkasanPerJenis {
  jenisPajakId: string;
  kode: string;
  nama: string;
  jumlahTransaksi: number;
  total: number;
  disetorkan: number;
  sisa: number;
}

export interface RingkasanPerBulan {
  bulan: number;
  total: number;
  jumlahTransaksi: number;
}

export interface RingkasanPajak {
  tahun: number;
  jumlahWajib: number;
  totalTercatat: number;
  totalDiverifikasi: number;
  totalDisetor: number;
  totalDikonfirmasiBpd: number;
  totalDibatalkan: number;
  sisaBelumDisetor: number;
  totalSetoran: number;
  perJenis: RingkasanPerJenis[];
  perBulan: RingkasanPerBulan[];
}

export interface TransaksiPajakFilter {
  tahun?: number;
  jenisPajakId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  includeBatal?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
