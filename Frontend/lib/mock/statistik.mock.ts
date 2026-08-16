import type { StatistikPenduduk, ApbdesRingkasan, AgendaKegiatan } from '@/types/statistik';

export const mockStatistikPenduduk: StatistikPenduduk = {
  tahun: 2026,
  totalPenduduk: 2420,
  lakiLaki: 1215,
  perempuan: 1205,
  jumlahKK: 640,
  perDusun: [
    { dusun: 'Borong Utara', jumlah: 687 },
    { dusun: 'Borong Selatan', jumlah: 723 },
    { dusun: 'Tondon', jumlah: 512 },
    { dusun: 'Lembang', jumlah: 498 },
  ],
  rincianDusun: [
    { dusun: 'Borong Utara', lakiLaki: 346, perempuan: 341, kepalaKeluarga: 181, kelahiran: 9, kematian: 3, pindahMasuk: 5, pindahKeluar: 4 },
    { dusun: 'Borong Selatan', lakiLaki: 362, perempuan: 361, kepalaKeluarga: 192, kelahiran: 12, kematian: 4, pindahMasuk: 7, pindahKeluar: 6 },
    { dusun: 'Tondon', lakiLaki: 258, perempuan: 254, kepalaKeluarga: 136, kelahiran: 6, kematian: 2, pindahMasuk: 3, pindahKeluar: 5 },
    { dusun: 'Lembang', lakiLaki: 249, perempuan: 249, kepalaKeluarga: 131, kelahiran: 5, kematian: 2, pindahMasuk: 2, pindahKeluar: 3 },
  ],
  perKelompokUsia: [
    { rentang: '0-4 Tahun', jumlah: 185 },
    { rentang: '5-14 Tahun', jumlah: 390 },
    { rentang: '15-24 Tahun', jumlah: 420 },
    { rentang: '25-54 Tahun', jumlah: 980 },
    { rentang: '55-64 Tahun', jumlah: 265 },
    { rentang: '65+ Tahun', jumlah: 180 },
  ],
  perPendidikan: [
    { jenjang: 'Belum/Tidak Sekolah', jumlah: 210 },
    { jenjang: 'SD / Sederajat', jumlah: 620 },
    { jenjang: 'SMP / Sederajat', jumlah: 540 },
    { jenjang: 'SMA / SMK', jumlah: 780 },
    { jenjang: 'Diploma (D1-D3)', jumlah: 95 },
    { jenjang: 'Sarjana (S1-S3)', jumlah: 175 },
  ],
  perPekerjaan: [
    { pekerjaan: 'Petani / Pekebun', jumlah: 1120 },
    { pekerjaan: 'Pengrajin', jumlah: 180 },
    { pekerjaan: 'Pedagang / UMKM', jumlah: 240 },
    { pekerjaan: 'PNS / TNI / Polri', jumlah: 65 },
    { pekerjaan: 'Karyawan Swasta', jumlah: 190 },
    { pekerjaan: 'Pelajar / Mahasiswa', jumlah: 480 },
    { pekerjaan: 'Lainnya', jumlah: 145 },
  ],
  perAgama: [
    { agama: 'Kristen Protestan', jumlah: 1750 },
    { agama: 'Katolik', jumlah: 590 },
    { agama: 'Islam', jumlah: 75 },
    { agama: 'Lainnya / Penghayat', jumlah: 5 },
  ],
};

export const mockApbdes: ApbdesRingkasan = {
  tahun: 2026,
  totalPendapatan: 2150000000,
  totalBelanja: 2125000000,
  items: [
    // Pendapatan
    { tahun: 2026, kategori: 'pendapatan', subKategori: 'Dana Desa (APBN)', jumlah: 1150000000, persentase: 53.5 },
    { tahun: 2026, kategori: 'pendapatan', subKategori: 'Alokasi Dana Desa (ADD)', jumlah: 720000000, persentase: 33.5 },
    { tahun: 2026, kategori: 'pendapatan', subKategori: 'Bagi Hasil Pajak & Retribusi', jumlah: 180000000, persentase: 8.4 },
    { tahun: 2026, kategori: 'pendapatan', subKategori: 'Pendapatan Asli Desa (PADes)', jumlah: 100000000, persentase: 4.6 },
    // Belanja
    { tahun: 2026, kategori: 'belanja', subKategori: 'Penyelenggaraan Pemerintahan Desa', jumlah: 650000000, persentase: 30.6 },
    { tahun: 2026, kategori: 'belanja', subKategori: 'Pelaksanaan Pembangunan Desa', jumlah: 920000000, persentase: 43.3 },
    { tahun: 2026, kategori: 'belanja', subKategori: 'Pembinaan Kemasyarakatan Desa', jumlah: 245000000, persentase: 11.5 },
    { tahun: 2026, kategori: 'belanja', subKategori: 'Pemberdayaan Masyarakat Desa', jumlah: 230000000, persentase: 10.8 },
    { tahun: 2026, kategori: 'belanja', subKategori: 'Penanggulangan Bencana & Darurat', jumlah: 80000000, persentase: 3.8 },
  ],
};

export const mockAgendaKegiatan: AgendaKegiatan[] = [
  {
    id: 'agd-001',
    judul: 'Lomba HUT RI ke-81 Desa Borong',
    deskripsi: 'Rangkaian pesta rakyat dan perlombaan memperingati HUT Kemerdekaan RI ke-81.',
    tanggalMulai: '2026-08-15T08:00:00+08:00',
    tanggalSelesai: '2026-08-17T18:00:00+08:00',
    lokasi: 'Lapangan Utama Desa Borong',
    penyelenggara: 'Panitia HUT RI Desa Borong',
    kategori: 'perayaan',
  },
  {
    id: 'agd-002',
    judul: 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes)',
    deskripsi: 'Musyawarah tahunan penetapan prioritas pembangunan RKPDesa tahun 2027.',
    tanggalMulai: '2026-08-25T09:00:00+08:00',
    lokasi: 'Aula Kantor Desa Borong',
    penyelenggara: 'BPD & Pemerintah Desa Borong',
    kategori: 'musyawarah',
  },
  {
    id: 'agd-003',
    judul: 'Gotong Royong Perbaikan Drainase Dusun Borong Utara',
    deskripsi: 'Kerja bakti pembersihan dan perbaikan saluran air persiapan antisipasi musim hujan.',
    tanggalMulai: '2026-08-30T07:30:00+08:00',
    lokasi: 'Dusun Borong Utara',
    penyelenggara: 'Kepala Dusun Borong Utara',
    kategori: 'gotong-royong',
  },
  {
    id: 'agd-004',
    judul: 'Pelatihan Pemasaran Digital bagi Pelaku UMKM Kopi',
    deskripsi: 'Pelatihan fotografi produk, packaging, dan jualan online via e-commerce.',
    tanggalMulai: '2026-09-05T09:00:00+08:00',
    tanggalSelesai: '2026-09-06T16:00:00+08:00',
    lokasi: 'Ruang Pertemuan Balai Desa',
    penyelenggara: 'Kaur Perencanaan & Karang Taruna',
    kategori: 'pelatihan',
  },
];
