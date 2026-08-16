# Product Requirements Document (PRD)
## Website Desa Digital

| | |
|---|---|
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 13 Agustus 2026 |
| **Fase** | Fase 1 — Frontend (mock data), backend menyusul |
| **Status** | Draft untuk dieksekusi oleh AI coding agent |

---

## 1. Ringkasan Eksekutif

Website Desa Digital adalah platform informasi dan layanan publik berbasis web untuk pemerintahan desa. Website ini menjadi kanal utama warga untuk mengakses informasi desa (profil, berita, statistik, transparansi anggaran), mengajukan permohonan surat/dokumen administratif secara daring, serta menjadi alat bagi perangkat desa untuk mengelola konten dan memproses permohonan warga melalui dashboard admin.

Fase 1 (dokumen ini) berfokus pada **pengembangan frontend saja**. Seluruh data menggunakan **mock data/dummy** yang disusun dengan lapisan abstraksi service, sehingga pada fase berikutnya cukup mengganti implementasi service tanpa mengubah komponen UI. Autentikasi dibangun dengan pola custom (bukan NextAuth) agar mudah disambungkan ke backend nyata nanti.

## 2. Latar Belakang & Tujuan

Banyak desa masih mengelola layanan administrasi secara manual (datang langsung ke kantor desa, antre, mengisi formulir kertas). Hal ini menyebabkan proses lambat, minim transparansi, dan sulit dipantau baik oleh warga maupun perangkat desa.

**Tujuan produk:**
1. Menyediakan kanal informasi desa yang terpusat, akurat, dan mudah diakses.
2. Memungkinkan warga mengajukan permohonan surat/dokumen desa secara daring dan melacak statusnya.
3. Memberikan perangkat desa alat (dashboard admin) untuk mengelola konten, memverifikasi/memproses permohonan, dan memantau statistik desa.
4. Meningkatkan transparansi (APBDes, statistik penduduk, agenda kegiatan).
5. Menjadi fondasi digital desa yang siap diperluas (notifikasi WA/email, pembayaran retribusi, integrasi Dukcapil, dll pada fase mendatang).

## 3. Target Pengguna & Peran

| Peran | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Warga (Publik)** | Pengunjung umum, belum tentu login | Membaca info desa, berita, statistik, mencari layanan |
| **Warga Terdaftar** | Warga yang membuat akun | Mengajukan surat, melacak status, riwayat pengajuan, profil pribadi |
| **Admin/Operator Desa** | Staf kantor desa (Kaur/Kasi) | Memverifikasi & memproses pengajuan surat, mengelola berita/galeri |
| **Kepala Desa/Sekdes (Super Admin)** | Pimpinan desa | Semua akses admin + manajemen pengguna admin, laporan, pengaturan situs |

> Catatan: pada fase frontend ini, manajemen role & permission dibangun sebagai struktur UI dan guard route saja (belum terhubung ke backend otorisasi sungguhan).

## 4. Ruang Lingkup

**Termasuk (Fase 1 — Frontend):**
- Seluruh halaman publik & dashboard admin sebagai aplikasi Next.js App Router.
- Data mock/dummy realistis untuk semua modul, dilayani lewat lapisan service (`/lib/services`) yang meniru pola async seperti API sungguhan (delay, error state, pagination).
- State management client dengan Zustand (auth session lokal, UI state, filter/pencarian).
- Validasi form penuh di sisi client (Zod).
- Struktur autentikasi custom (session token disimpan mock, siap diganti dengan pemanggilan API asli).

**Tidak termasuk (fase ini, direncanakan untuk fase berikutnya):**
- Backend/API nyata & database.
- Integrasi pembayaran, WhatsApp Gateway, email transaksional sungguhan.
- Integrasi dengan sistem Dukcapil/Kependudukan nasional.
- Autentikasi produksi (hashing password sungguhan, refresh token, dsb.) — hanya kerangka & kontrak API disiapkan.

## 5. Daftar Modul & Fitur

### 5.1 Beranda (Landing Page)
- Hero section profil desa singkat + foto/banner.
- Ringkasan statistik desa (jumlah penduduk, KK, dusun/RW/RT).
- Berita terbaru (3–4 highlight).
- Agenda kegiatan terdekat.
- Akses cepat ke layanan persuratan populer.
- Pengumuman/banner darurat (opsional, dikelola admin).

### 5.2 Profil Desa
- Sejarah desa.
- Visi & misi.
- Struktur organisasi pemerintahan desa (bagan + daftar perangkat).
- Wilayah administratif (dusun/RW/RT, peta batas wilayah).
- Potensi & produk unggulan desa.

### 5.3 Sistem Informasi Desa
- **Statistik Kependudukan**: jumlah penduduk per dusun, berdasarkan jenis kelamin, usia, pekerjaan, pendidikan (grafik interaktif).
- **Transparansi Anggaran (APBDes)**: ringkasan pendapatan & belanja per tahun, per kategori, grafik perbandingan tahun berjalan vs tahun lalu.
- **Peta Desa Interaktif**: titik lokasi fasilitas umum (kantor desa, sekolah, puskesmas, dll).
- **Agenda & Kalender Kegiatan**: daftar kegiatan desa, filter per bulan.

### 5.4 Berita & Artikel
- Daftar berita dengan kategori & pencarian.
- Halaman detail berita (SSG/ISR-ready).
- Tag/kategori (Pengumuman, Kegiatan, Pembangunan, dll).
- Estimasi waktu baca, artikel terkait.
- Berbagi ke media sosial (share link).

### 5.5 Layanan Persuratan & Pengajuan Dokumen
Daftar jenis surat yang direkomendasikan sebagai baseline (dapat dikelola/ditambah admin di fase backend):

| Kode | Jenis Surat |
|---|---|
| SKD | Surat Keterangan Domisili |
| SKU | Surat Keterangan Usaha |
| SKTM | Surat Keterangan Tidak Mampu |
| SPK | Surat Pengantar KTP |
| SPKK | Surat Pengantar Kartu Keluarga |
| SPN | Surat Pengantar Nikah (N1/N2/N4) |
| SKL | Surat Keterangan Kelahiran |
| SKM | Surat Keterangan Kematian |
| SKBM | Surat Keterangan Belum Menikah |
| SKP | Surat Keterangan Pindah Domisili |
| SKH | Surat Keterangan Kehilangan (pengantar kepolisian) |
| LAIN | Surat Keterangan Lain-lain (custom, dikelola admin) |

**Alur fungsional:**
1. Warga memilih jenis surat → form dinamis sesuai kebutuhan data & lampiran jenis surat tersebut.
2. Upload dokumen pendukung (KTP, KK, foto, dll — mock upload).
3. Submit → sistem menghasilkan **nomor resi/tracking**.
4. Warga dapat melacak status di halaman "Lacak Permohonan" dengan nomor resi atau dari riwayat akun.
5. Status: `Diajukan → Diverifikasi → Diproses → Selesai/Ditolak` (lihat detail state machine di SPEC).
6. Admin memproses lewat dashboard: ubah status, tambahkan catatan, unggah dokumen hasil (PDF surat jadi — mock).

### 5.6 Pengaduan & Aspirasi Masyarakat *(fitur tambahan yang disarankan)*
- Formulir pengaduan (kategori: infrastruktur, layanan, lingkungan, lainnya).
- Lacak status pengaduan mirip alur persuratan.
- Admin dapat menanggapi & mengubah status.

### 5.7 Galeri Kegiatan
- Galeri foto/video kegiatan desa, dikelompokkan per album/kegiatan.
- Lightbox viewer.

### 5.8 Direktori UMKM & Potensi Ekonomi Desa *(fitur tambahan yang disarankan)*
- Daftar UMKM/produk unggulan warga dengan foto, kontak, kategori.
- Mendukung promosi ekonomi lokal — nilai tambah dibanding website desa pada umumnya.

### 5.9 Dashboard Admin
- Ringkasan/analitik (jumlah pengajuan per status, tren bulanan, berita terbaru, statistik kunjungan mock).
- Manajemen berita & artikel (CRUD).
- Manajemen pengajuan surat (verifikasi, ubah status, catatan, riwayat).
- Manajemen pengaduan.
- Manajemen galeri.
- Manajemen data statistik & APBDes.
- Manajemen UMKM.
- Manajemen pengguna admin & peran (khusus Super Admin).
- Pengaturan situs (profil desa, kontak, jam layanan, jenis surat aktif).

### 5.10 Autentikasi & Akun
- Login & registrasi warga.
- Login admin (halaman terpisah `/admin/login`).
- Lupa password (alur UI, tanpa email sungguhan pada fase ini).
- Halaman profil warga (data diri, riwayat pengajuan).
- Route guard berbasis role (middleware/proxy).

### 5.11 Fitur Pendukung Lintas Modul
- **Pencarian global** (berita, layanan, halaman info).
- **Notifikasi in-app** (status pengajuan berubah, pengumuman baru) — disiapkan untuk nanti terhubung WA/email.
- **Multi-bahasa**: Bahasa Indonesia (default) + Inggris, struktur i18n disiapkan sejak awal.
- **Dark mode** (class-based, mengikuti preferensi sistem + toggle manual).
- **Aksesibilitas (WCAG 2.1 AA)**: kontras warna, navigasi keyboard, atribut ARIA, alt text.
- **SEO**: metadata dinamis, Open Graph, sitemap.xml, robots.txt, structured data (JSON-LD) untuk berita.
- **Responsif mobile-first** — mayoritas warga desa mengakses lewat ponsel.
- **PWA ringan** *(opsional, nice-to-have)*: halaman info penting & kontak darurat dapat diakses offline.

## 6. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| Performa | Lighthouse Performance ≥ 90 (mobile), FCP < 1.8s |
| Aksesibilitas | WCAG 2.1 AA, Lighthouse Accessibility ≥ 95 |
| SEO | Lighthouse SEO ≥ 95, metadata dinamis per halaman |
| Kompatibilitas | 2 versi terbaru Chrome, Firefox, Safari, Edge; Android/iOS terbaru |
| Responsif | Mobile-first, breakpoint minimal: 360px, 768px, 1024px, 1440px |
| Keamanan (client-side) | Validasi input ketat (Zod), sanitasi output, proteksi route berbasis role |
| Skalabilitas kode | Lapisan service terpisah dari UI agar mock → API asli tanpa refactor besar |

## 7. Asumsi & Batasan

- Fase ini murni frontend; seluruh data adalah mock/dummy yang realistis dan konsisten.
- Backend/API akan dibangun terpisah pada fase berikutnya; kontrak API didokumentasikan di `SPEC.md` agar integrasi mulus.
- Autentikasi memakai pola custom (context/store + service layer), bukan NextAuth, agar bebas menyesuaikan dengan backend nanti.
- Cakupan jenis surat mengikuti daftar rekomendasi pada §5.5; admin di fase backend dapat menambah/mengubah jenis surat secara dinamis.
- Tidak ada pembayaran/retribusi pada fase ini.

## 8. Roadmap Fase

1. **Fase 1 (dokumen ini)** — Frontend lengkap dengan mock data, siap didemokan end-to-end.
2. **Fase 2** — Integrasi backend/API nyata (REST), autentikasi produksi.
3. **Fase 3** — Notifikasi WhatsApp/email, upload dokumen ke storage nyata, generate PDF surat otomatis.
4. **Fase 4** — Integrasi lanjutan (Dukcapil, pembayaran retribusi, analitik lanjutan).

## 9. Metrik Keberhasilan (indikatif)

- Waktu pengajuan surat oleh warga < 5 menit.
- Skor Lighthouse (Performance/Accessibility/SEO) ≥ 90 di semua kategori.
- Semua modul pada §5 terimplementasi dan dapat didemokan dengan data mock yang koheren.
- Kode siap diintegrasikan ke backend tanpa mengubah struktur komponen (hanya lapisan service).

---
*Dokumen ini menjadi acuan bagi `AGENTS.md` (cara AI agent bekerja di proyek ini) dan `SPEC.md` (spesifikasi teknis implementasi).*