export interface ProfilDesa {
  nama: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  sejarah: string;
  visi: string;
  misi: string[];
  luasWilayah: string;
  jumlahDusun: number;
  jumlahRW: number;
  jumlahRT: number;
  alamatKantor: string;
  telepon: string;
  email: string;
  website: string;
  jamLayanan: string;
  koordinat: {
    lat: number;
    lng: number;
  };
  fotoKantor: string;
  fotoBanner: string[];
}

export interface PerangkatDesa {
  id: string;
  nama: string;
  jabatan: string;
  nip?: string;
  foto: string;
  periode: string;
}

export interface Dusun {
  id: string;
  nama: string;
  ketua: string;
  jumlahRT: number;
  jumlahRW: number;
  jumlahPenduduk: number;
  luasWilayah: string;
}

export interface PotensiDesa {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  foto: string;
}
