export interface GaleriAlbum {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  coverFoto: string;
  fotos: GaleriFoto[];
  kategori?: string;
}

export interface GaleriFoto {
  id: string;
  url: string;
  caption: string;
  tanggal: string;
}
