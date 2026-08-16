export interface StatistikPenduduk {
  tahun: number;
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  jumlahKK: number;
  perDusun: { dusun: string; jumlah: number }[];
  rincianDusun?: { dusun: string; lakiLaki: number; perempuan: number; kepalaKeluarga: number; kelahiran: number; kematian: number; pindahMasuk: number; pindahKeluar: number }[];
  perKelompokUsia: { rentang: string; jumlah: number }[];
  perPendidikan: { jenjang: string; jumlah: number }[];
  perPekerjaan: { pekerjaan: string; jumlah: number }[];
  perAgama: { agama: string; jumlah: number }[];
}

export interface ApbdesItem {
  tahun: number;
  bulan?: number;
  triwulan?: number;
  kategori: 'pendapatan' | 'belanja';
  subKategori: string;
  jumlah: number;
  persentase?: number;
}

export interface ApbdesRingkasan {
  tahun: number;
  bulan?: number;
  triwulan?: number;
  totalPendapatan: number;
  totalBelanja: number;
  items: ApbdesItem[];
}

export interface AgendaKegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai?: string;
  lokasi: string;
  penyelenggara: string;
  kategori: 'musyawarah' | 'gotong-royong' | 'pelatihan' | 'perayaan' | 'lainnya';
}
