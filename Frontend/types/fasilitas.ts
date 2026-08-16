export type KategoriFasilitas = 'pendidikan' | 'kesehatan' | 'ibadah' | 'olahraga' | 'pemerintahan' | 'umum';

export interface FasilitasDesa {
  id: string;
  nama: string;
  kategori: KategoriFasilitas;
  alamat: string;
  dusun: string;
  deskripsi: string;
  kontak?: string;
  jamLayanan?: string;
}
