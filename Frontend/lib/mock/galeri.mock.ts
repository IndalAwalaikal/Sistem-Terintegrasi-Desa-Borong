import type { GaleriAlbum } from '@/types/galeri';

export const mockGaleri: GaleriAlbum[] = [
  {
    id: 'alb-001',
    judul: 'Festival Budaya Toraja ke-8 Desa Borong',
    deskripsi: 'Dokumentasi pergelaran tarian tradisional, pameran tenun, dan pesta rakyat di Desa Borong.',
    tanggal: '2026-07-22',
    kategori: 'budaya',
    coverFoto: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=800&q=80',
    fotos: [
      { id: 'f-1', url: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=1200&q=80', caption: 'Penampilan Tari Pa\'gellu', tanggal: '2026-07-22' },
      { id: 'f-2', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80', caption: 'Pameran Kain Tenun Sa\'dan', tanggal: '2026-07-22' },
      { id: 'f-3', url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80', caption: 'Miniatur Tongkonan Hias', tanggal: '2026-07-21' },
    ],
  },
  {
    id: 'alb-002',
    judul: 'Panen Kopi Organik Bersama Petani Dusun Tondon',
    deskripsi: 'Suasana kegembiraan musim panen raya kopi arabika Toraja bersama kelompok tani.',
    tanggal: '2026-06-15',
    kategori: 'pertanian',
    coverFoto: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
    fotos: [
      { id: 'f-4', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80', caption: 'Buah Kopi Arabika Siap Petik', tanggal: '2026-06-15' },
      { id: 'f-5', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80', caption: 'Proses Sortir dan Sangrai Kopi', tanggal: '2026-06-16' },
    ],
  },
  {
    id: 'alb-003',
    judul: 'Gotong Royong Kebersihan Desa',
    deskripsi: 'Aksi bersama pembersihan saluran air dan lingkungan permukiman dusun.',
    tanggal: '2026-05-10',
    kategori: 'gotong-royong',
    coverFoto: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
    fotos: [
      { id: 'f-6', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80', caption: 'Pembersihan Irigasi Sawah', tanggal: '2026-05-10' },
    ],
  },
];
