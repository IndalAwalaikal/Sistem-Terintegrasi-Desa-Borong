# Frontend Desa Borong

Frontend Desa Borong adalah aplikasi web yang menampilkan informasi publik dan dashboard operasional desa. Aplikasi ini dibangun menggunakan Next.js App Router dengan TypeScript dan dikhususkan untuk memberikan pengalaman yang cepat, responsif, dan mudah digunakan baik untuk masyarakat umum maupun admin desa.

Dokumen ini menjelaskan tujuan frontend, arsitektur, struktur folder, proses pengembangan, setup lokal, konfigurasi environment, serta pola kerja yang digunakan di aplikasi.

## 1. Tujuan Frontend

Frontend ini bertanggung jawab untuk:

- menampilkan profil dan informasi publik desa
- menampilkan agenda, berita, galeri, fasilitas, UMKM, dan statistik
- menyediakan portal layanan warga seperti pengajuan surat dan pengaduan
- menampilkan informasi transparansi pajak desa
- menyediakan dashboard admin untuk manajemen data operasional
- menghubungkan user dengan API backend secara rapi melalui service layer

## 2. Teknologi yang Digunakan

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Zod
- Lucide React
- Recharts
- Leaflet
- Vitest

## 3. Prinsip Arsitektur Frontend

Frontend mengikuti pola yang terstruktur agar mudah dikelola dan siap diintegrasikan dengan backend nyata.

Prinsip utama:

- Server Components menjadi default, client component digunakan hanya saat diperlukan
- semua akses data lewat service layer di lib/services
- komponen UI dibuat reusable dan modular
- state client menggunakan Zustand
- validasi form menggunakan Zod
- penanganan loading dan error dilakukan secara konsisten

## 4. Struktur Folder

Berikut struktur utama frontend:

- app/
  - (public)/
  - (dashboard)/
  - globals.css
  - layout.tsx
- components/
  - ui/
  - layout/
  - features/
  - surat/
- lib/
  - services/
  - mock/
  - i18n/
  - utils/
  - validations/
- public/
- store/
- types/
- messages/
- package.json
- tsconfig.json
- next.config.mjs
- vitest.config.ts
- vitest.setup.ts

## 5. Area Aplikasi

### 5.1 Area Publik

Halaman publik berfungsi untuk menampilkan informasi yang bisa diakses masyarakat umum, seperti:

- beranda desa
- profil desa dan sejarah
- struktur organisasi
- wilayah desa
- berita dan galeri
- agenda dan kegiatan
- pengumuman dan dokumentasi
- menu layanan publik
- pengaduan warga
- transparansi pajak desa
- statistik dan APBDes

### 5.2 Area Dashboard Admin

Area dashboard digunakan oleh operator atau admin desa untuk mengelola:

- data berita
- data fasilitas
- galeri
- UMKM
- pengaduan
- agenda
- pengajuan surat
- statistik dan laporan
- data pajak
- data pengguna dan konfigurasi

## 6. Service Layer

Semua data API diakses melalui service abstraction di folder lib/services. Pola ini penting agar:

- komponen tidak langsung mengakses data mentah
- logika fetch lebih mudah diuji
- integrasi dengan backend nanti lebih mudah
- struktur app tetap konsisten

Contoh lokasi service:

- lib/services/auth.service.ts
- lib/services/pajak.service.ts
- lib/services/umkm.service.ts
- lib/services/berita.service.ts

## 7. State Management

Project ini menggunakan Zustand untuk state client seperti:

- authentikasi user
- UI state
- notification dan toast
- theme/dark mode
- status aplikasi umum

Tujuan utama penggunaan Zustand adalah menjaga state sederhana dan terkelola tanpa menambah kompleksitas yang tidak perlu.

## 8. Styling dan UI

Styling dilakukan dengan Tailwind CSS. UI proyek cenderung mengikuti pendekatan yang modern, minimal, dan konsisten dengan kebutuhan portal desa.

Beberapa prinsip desain yang dipakai:

- layout yang responsif untuk desktop dan mobile
- warna yang konsisten untuk branding desa
- komponen card, modal, tabel, dan form yang reusable
- fokus pada readability dan aksesibilitas
- dark mode support

## 9. Persyaratan Pengembangan

Sebelum menjalankan frontend, pastikan Anda sudah memiliki:

- Node.js 22
- npm
- dependensi project yang sudah di-install
- environment variable yang diperlukan untuk API dan app config

## 10. Setup Lokal

Dari folder Frontend, jalankan:

```bash
npm install
npm run dev
```

Aplikasi akan berjalan di:

- http://localhost:3000

## 11. Build dan Produksi

Untuk build production:

```bash
npm run build
```

Untuk menjalankan hasil build production:

```bash
npm run start
```

## 12. Environment Variables

Project ini memanfaatkan variabel environment untuk mengatur URL aplikasi dan API.

Variabel utama biasanya mencakup:

- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_API_BASE_URL
- API_INTERNAL_URL
- NEXT_PUBLIC_MOCK_DELAY_MS

Template environment dapat dibuat dari file .env.example di root project atau dari konfigurasi Docker build.

## 13. Perintah Umum

Berikut beberapa perintah yang umum dipakai selama pengembangan frontend:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
npm run test
npm run test:watch
```

## 14. Testing

Project frontend menggunakan Vitest dengan Testing Library untuk pengujian komponen dan alur dasar aplikasi.

Gunakan perintah:

```bash
npm run test
```

Tujuan testing di frontend terutama adalah:

- validasi form dan interaksi
- memastikan halaman penting bisa dimuat
- memvalidasi filter, search, dan state kondisi loading/error

## 15. Pola Pengembangan yang Disarankan

Saat menambahkan fitur baru, ikuti pola berikut:

- tentukan halaman route yang sesuai
- buat atau update type data
- buat service bila dibutuhkan di lib/services
- siapkan mock atau koneksi API sesuai kebutuhan
- implementasi UI dan komponen
- tambahkan loading dan error state
- validasi form jika ada interaksi user
- lakukan test singkat jika fitur membutuhkan logika kompleks

## 16. Troubleshooting Umum

### Error pada build Next.js

Periksa:

- apakah TypeScript terjaga
- apakah import alias @/ sudah benar
- apakah parameter async untuk Next.js 16 sudah ditangani dengan benar
- apakah ada bug dalam service atau type data

### Halaman tidak memuat data

Periksa:

- service layer
- URL API
- status backend
- loading dan error state

### Dark mode tidak konsisten

Periksa:

- className yang dipakai di komponen
- konfigurasi warna Tailwind
- apakah theme provider atau store dark mode sudah aktif

## 17. Dokumentasi Pendukung

Dokumen pendukung frontend yang relevan:

- PRD.md
- SPEC.md
- AGENTS.md

Dokumen-dokumen tersebut menjelaskan kebutuhan produk, spesifikasi page, dan aturan pengembangan yang harus diperhatikan saat menambah fitur.

## 18. Ringkasan

Frontend Desa Borong adalah layer user experience dari sistem informasi desa digital. Dengan Next.js, TypeScript, Tailwind, dan struktur service-driven, frontend ini dirancang agar mudah dikelola, cepat diakses, modern, dan siap terintegrasi dengan backend API yang sudah dibangun.
