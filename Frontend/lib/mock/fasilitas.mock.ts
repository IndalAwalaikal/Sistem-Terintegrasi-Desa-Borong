import type { FasilitasDesa } from '@/types/fasilitas';

export const mockFasilitas: FasilitasDesa[] = [
  { id: 'fas-01', nama: 'Kantor Desa Borong', kategori: 'pemerintahan', alamat: 'Jl. Poros Desa Borong', dusun: 'Borong Utara', deskripsi: 'Pusat pelayanan administrasi, informasi, dan musyawarah warga.', jamLayanan: 'Senin–Jumat, 08.00–16.00 WITA' },
  { id: 'fas-02', nama: 'UPT SD Negeri Borong', kategori: 'pendidikan', alamat: 'Jl. Pendidikan No. 1', dusun: 'Borong Utara', deskripsi: 'Layanan pendidikan dasar untuk anak usia sekolah dasar.' },
  { id: 'fas-03', nama: 'Posyandu Melati', kategori: 'kesehatan', alamat: 'Balai Dusun Borong Selatan', dusun: 'Borong Selatan', deskripsi: 'Layanan kesehatan ibu, bayi, balita, dan lansia setiap bulan.', jamLayanan: 'Minggu kedua setiap bulan, 08.00 WITA' },
  { id: 'fas-04', nama: 'Masjid Nurul Huda', kategori: 'ibadah', alamat: 'Jl. Poros Herlang', dusun: 'Borong Selatan', deskripsi: 'Fasilitas ibadah dan pembinaan keagamaan masyarakat.' },
  { id: 'fas-05', nama: 'Lapangan Desa Borong', kategori: 'olahraga', alamat: 'Kompleks Kantor Desa', dusun: 'Borong Utara', deskripsi: 'Lapangan olahraga, upacara, dan kegiatan masyarakat desa.' },
  { id: 'fas-06', nama: 'Poskesdes Borong', kategori: 'kesehatan', alamat: 'Jl. Poros Desa Borong', dusun: 'Tondon', deskripsi: 'Layanan kesehatan dasar dan rujukan warga.' },
];
