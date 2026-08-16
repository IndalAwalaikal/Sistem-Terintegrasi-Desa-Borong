export type KategoriPengaduan = 'infrastruktur' | 'layanan' | 'lingkungan' | 'lainnya';
export type StatusPengaduan = 'diterima' | 'ditindaklanjuti' | 'selesai';

export interface Pengaduan {
  id: string;
  nomorTiket: string;
  kategori: KategoriPengaduan;
  judul: string;
  deskripsi: string;
  lokasi?: string;
  lampiran?: string[];
  status: StatusPengaduan;
  tanggapanAdmin?: string;
  pelaporId: string;
  pelaporNama: string;
  dibuatPada: string;
  diperbaruiPada: string;
}

export interface SubmitPengaduanInput {
  kategori: KategoriPengaduan;
  judul: string;
  deskripsi: string;
  lokasi?: string;
}
