import type { ProfilDesa, PerangkatDesa, Dusun, PotensiDesa } from '@/types/desa';

export const mockProfilDesa: ProfilDesa = {
  nama: 'Desa Borong',
  kecamatan: 'Herlang',
  kabupaten: 'Bulukumba',
  provinsi: 'Sulawesi Selatan',
  kodePos: '92571',
  sejarah: `Desa Borong merupakan salah satu desa yang berada di Kecamatan Herlang, Kabupaten Bulukumba, Provinsi Sulawesi Selatan. Desa ini dikenal sebagai salah satu wilayah yang memiliki perjalanan sejarah dan kebudayaan yang panjang. Kehidupan masyarakat Desa Borong hingga saat ini masih dipengaruhi oleh nilai-nilai adat, tradisi leluhur, serta kearifan lokal yang diwariskan secara turun-temurun.

Nama Borong dalam pemahaman masyarakat setempat berkaitan dengan istilah dalam bahasa lokal yang merujuk pada hutan atau kawasan yang ditumbuhi vegetasi yang lebat. Keberadaan berbagai peninggalan budaya, termasuk rumah adat atau Saoraja Borong, menjadi salah satu gambaran bahwa wilayah ini memiliki hubungan yang erat dengan sejarah kehidupan bangsawan dan sistem adat masyarakat pada masa lalu.

Salah satu kekayaan sejarah dan budaya yang masih melekat adalah tradisi Adat Sampulo Rua dan gelar pimpinan adat I Luluang Daeng Mabbiring sebagai Karaeng Borong. Prosesi adat Doang Karaeng, Pakkaraengan Ri Borong, serta musyawarah bersama dewan adat Adat Tallua terus dilestarikan sebagai wujud menjaga identitas dan kebersamaan antargenerasi.`,
  visi: 'Mewujudkan Desa Borong yang mandiri, sejahtera, dan berdaya saing melalui pelayanan publik yang terbuka, gotong royong, serta pengembangan potensi lokal.',
  misi: [
    'Meningkatkan kualitas pelayanan publik desa melalui digitalisasi dan transparansi pemerintahan.',
    'Mengembangkan potensi ekonomi lokal berbasis pertanian, perikanan, UMKM, dan kewirausahaan warga.',
    'Melestarikan nilai budaya, kearifan lokal, dan semangat kebersamaan masyarakat Bulukumba.',
    'Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan keterampilan.',
    'Membangun infrastruktur desa yang berkelanjutan dan ramah lingkungan.',
    'Memperkuat ketahanan pangan dan kesejahteraan keluarga di seluruh wilayah dusun.',
  ],
  luasWilayah: '12,5 km²',
  jumlahDusun: 4,
  jumlahRW: 8,
  jumlahRT: 16,
  alamatKantor: 'Jl. Poros Desa Borong, Kecamatan Herlang, Kabupaten Bulukumba',
  telepon: '(0413) 810123',
  email: 'desaborong@bulukumbakab.go.id',
  website: 'https://desaborong.bulukumbakab.go.id',
  jamLayanan: 'Senin - Jumat, 08:00 - 16:00 WITA',
  koordinat: { lat: -5.548, lng: 120.399 },
  fotoKantor: 'https://images.unsplash.com/photo-1555521893-f50a5a5e4172?w=800&q=80',
  fotoBanner: [
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80',
  ],
};

export const mockPerangkatDesa: PerangkatDesa[] = [
  {
    id: 'pd-001',
    nama: 'Drs. Paulus Tandilino',
    jabatan: 'Kepala Desa',
    nip: '196512151990031005',
    foto: 'https://ui-avatars.com/api/?name=Paulus+Tandilino&size=200&background=16a34a&color=fff',
    periode: '2023 - 2029',
  },
  {
    id: 'pd-002',
    nama: 'Martha Rantebua, S.Sos',
    jabatan: 'Sekretaris Desa',
    nip: '197803222005012004',
    foto: 'https://ui-avatars.com/api/?name=Martha+Rantebua&size=200&background=2563eb&color=fff',
    periode: '2023 - 2029',
  },
  {
    id: 'pd-003',
    nama: 'Yohanis Pasang',
    jabatan: 'Kaur Tata Usaha & Umum',
    foto: 'https://ui-avatars.com/api/?name=Yohanis+Pasang&size=200&background=16a34a&color=fff',
    periode: '2023 - 2029',
  },
  {
    id: 'pd-004',
    nama: 'Simon Palimbong, SE',
    jabatan: 'Kaur Keuangan',
    foto: 'https://ui-avatars.com/api/?name=Simon+Palimbong&size=200&background=2563eb&color=fff',
    periode: '2023 - 2029',
  },
  {
    id: 'pd-005',
    nama: 'Ribka Sampe',
    jabatan: 'Kaur Perencanaan',
    foto: 'https://ui-avatars.com/api/?name=Ribka+Sampe&size=200&background=16a34a&color=fff',
    periode: '2023 - 2029',
  },
  {
    id: 'pd-006',
    nama: 'Markus Toding',
    jabatan: 'Kasi Pemerintahan',
    foto: 'https://ui-avatars.com/api/?name=Markus+Toding&size=200&background=2563eb&color=fff',
    periode: '2023 - 2029',
  },
  {
    id: 'pd-007',
    nama: 'Dorkas Limbong',
    jabatan: 'Kasi Kesejahteraan',
    foto: 'https://ui-avatars.com/api/?name=Dorkas+Limbong&size=200&background=16a34a&color=fff',
    periode: '2023 - 2029',
  },
  {
    id: 'pd-008',
    nama: 'Petrus Banne',
    jabatan: 'Kasi Pelayanan',
    foto: 'https://ui-avatars.com/api/?name=Petrus+Banne&size=200&background=2563eb&color=fff',
    periode: '2023 - 2029',
  },
];

export const mockDusun: Dusun[] = [
  {
    id: 'dsn-001',
    nama: 'Dusun Borong Utara',
    ketua: 'Agustinus Allo',
    jumlahRT: 4,
    jumlahRW: 2,
    jumlahPenduduk: 687,
    luasWilayah: '3,2 km²',
  },
  {
    id: 'dsn-002',
    nama: 'Dusun Borong Selatan',
    ketua: 'Daniel Rante',
    jumlahRT: 4,
    jumlahRW: 2,
    jumlahPenduduk: 723,
    luasWilayah: '3,5 km²',
  },
  {
    id: 'dsn-003',
    nama: 'Dusun Tondon',
    ketua: 'Yakobus Mangera',
    jumlahRT: 4,
    jumlahRW: 2,
    jumlahPenduduk: 512,
    luasWilayah: '2,8 km²',
  },
  {
    id: 'dsn-004',
    nama: 'Dusun Lembang',
    ketua: 'Matius Parinding',
    jumlahRT: 4,
    jumlahRW: 2,
    jumlahPenduduk: 498,
    luasWilayah: '3,0 km²',
  },
];

export const mockPotensiDesa: PotensiDesa[] = [
  {
    id: 'pot-001',
    nama: 'Kopi Toraja Arabika',
    kategori: 'Pertanian',
    deskripsi: 'Kopi arabika khas Toraja yang ditanam di ketinggian 1.200-1.500 mdpl dengan cita rasa unik yang telah dikenal dunia internasional.',
    foto: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
  },
  {
    id: 'pot-002',
    nama: 'Tenun Toraja (Sa\'dan)',
    kategori: 'Kerajinan',
    deskripsi: 'Kain tenun tradisional Toraja dengan motif geometris khas yang menjadi warisan budaya tak benda.',
    foto: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
  },
  {
    id: 'pot-003',
    nama: 'Wisata Budaya Tongkonan',
    kategori: 'Pariwisata',
    deskripsi: 'Rumah adat Tongkonan dengan arsitektur atap melengkung khas Toraja yang menjadi daya tarik wisata budaya.',
    foto: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&q=80',
  },
  {
    id: 'pot-004',
    nama: 'Ukiran Kayu Toraja',
    kategori: 'Kerajinan',
    deskripsi: 'Seni ukir kayu Toraja (Pa\'ssura) dengan motif tradisional yang diaplikasikan pada berbagai produk kerajinan.',
    foto: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
  },
];
