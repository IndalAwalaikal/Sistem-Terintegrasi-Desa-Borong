export interface Umkm {
  id: string;
  slug: string;
  namaUsaha: string;
  pemilik: string;
  kategori: string;
  deskripsi: string;
  foto: string[];
  kontak: string;
  alamat: string;
  produkUnggulan: string[];
  jamOperasional?: string;
}
