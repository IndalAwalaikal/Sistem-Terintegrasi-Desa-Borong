# Product Requirements Document (PRD)
## Backend — Website Desa Digital

| | |
|---|---|
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 14 Agustus 2026 |
| **Fase** | Fase 2 — Backend REST API (menggantikan mock service di frontend) |
| **Status** | Draft untuk dieksekusi oleh AI coding agent |
| **Terkait** | Melanjutkan `PRD.md` (frontend), memenuhi kontrak API di `SPEC.md` (frontend) §9 |

---

## 1. Ringkasan Eksekutif

Backend ini adalah REST API yang melayani seluruh kebutuhan data Website Desa Digital: autentikasi, profil desa, berita, layanan persuratan (pengajuan & tracking), pengaduan warga, statistik kependudukan, transparansi anggaran (APBDes), galeri, dan direktori UMKM. Backend dibangun dengan **Go 1.26.6** dan **MySQL 8.4 LTS**, mengikuti **Clean/Hexagonal Architecture** agar logika bisnis (usecase) sepenuhnya terpisah dari detail teknis (HTTP, database, storage) — memudahkan pengujian dan perubahan infrastruktur di masa depan tanpa menyentuh logika inti.

Backend ini menggantikan lapisan `lib/services/*` mock di frontend. Kontrak endpoint mengikuti daftar yang sudah didokumentasikan di `SPEC.md` (frontend) §9, diperluas dengan detail request/response penuh di `SPEC.md` (backend) dokumen ini.

## 2. Latar Belakang & Tujuan

Frontend (Fase 1) dibangun dengan mock data agar pengembangan UI tidak terhambat menunggu backend. Fase 2 ini menghadirkan backend nyata sehingga:
1. Data persisten (tersimpan di MySQL, bukan lagi di memory/localStorage).
2. Autentikasi produksi (password ter-hash, token JWT, refresh token yang bisa dicabut).
3. Alur kerja persuratan benar-benar diproses oleh perangkat desa dan tercatat sebagai audit trail.
4. Sistem siap menerima beban banyak pengguna secara bersamaan (stateless, horizontal-scalable).

## 3. Target Pengguna & Peran (selaras dengan frontend)

| Peran | Deskripsi | Otorisasi |
|---|---|---|
| **Warga (publik)** | Bisa akses endpoint publik tanpa token | Tidak perlu login |
| **Warga terdaftar** | Punya akun, mengajukan surat/pengaduan | Role `warga` |
| **Admin/Operator Desa** | Memproses pengajuan, kelola konten | Role `admin` |
| **Kepala Desa/Sekdes** | Semua akses admin + kelola pengguna admin | Role `super_admin` |

## 4. Ruang Lingkup

**Termasuk (Fase 2 — Backend):**
- REST API untuk seluruh modul yang terdaftar di §5.
- Autentikasi & otorisasi produksi (hash password, JWT access token, refresh token tersimpan di database, role-based access control).
- Migrasi skema database & seed data awal.
- Upload file (lampiran persuratan, foto galeri/UMKM) ke penyimpanan lokal dengan lapisan abstraksi siap diganti object storage (S3-compatible/MinIO).
- Validasi input penuh di sisi server (jangan pernah percaya validasi client saja).
- Logging terstruktur & health check endpoint.

**Tidak termasuk (direncanakan fase berikutnya):**
- Notifikasi WhatsApp/email sungguhan (disiapkan sebagai interface/port, implementasi nyata menyusul).
- Generate PDF surat otomatis (endpoint disiapkan mengembalikan status "selesai", isi dokumen jadi masih placeholder).
- Integrasi Dukcapil/sistem kependudukan nasional.
- Pembayaran/retribusi daring.
- Multi-tenant (backend ini diasumsikan melayani **satu** desa per deployment).

## 5. Daftar Modul & Kemampuan Backend

### 5.1 Autentikasi & Manajemen Akun
- Registrasi warga (email + password + data diri dasar).
- Login warga & admin (endpoint terpisah secara konsep, boleh satu endpoint dengan pembedaan role di response).
- Refresh token (rotasi token, deteksi reuse token lama sebagai indikasi pencurian token).
- Logout (mencabut refresh token aktif).
- Ubah password. Reset password hanya ditambahkan bersama adapter pengiriman email/SMS yang aman; token reset tidak pernah dikembalikan oleh API publik.
- Manajemen pengguna admin (CRUD, khusus `super_admin`).

### 5.2 Profil & Informasi Desa
- CRUD profil desa (sejarah, visi-misi, struktur organisasi) — dikelola admin.
- CRUD statistik kependudukan per tahun.
- CRUD data APBDes per tahun/kategori.
- CRUD agenda kegiatan.

### 5.3 Berita & Artikel
- CRUD berita (dengan slug unik, kategori, tag, status draft/terbit).
- List berita publik dengan filter kategori, pencarian judul, pagination.

### 5.4 Layanan Persuratan
- CRUD jenis surat (termasuk konfigurasi form dinamis) — dikelola admin.
- Warga mengajukan permohonan surat (submit data + upload lampiran) → sistem generate nomor resi unik.
- Lacak status via nomor resi (publik, tanpa login) atau lewat riwayat akun (perlu login).
- Admin memproses: verifikasi → proses → selesai/tolak, dengan catatan wajib untuk penolakan.
- Riwayat perubahan status tersimpan lengkap (audit trail) sesuai state machine di `SPEC.md` (frontend) §7.

### 5.5 Pengaduan Warga
- Warga mengirim pengaduan (kategori, judul, deskripsi, lokasi opsional).
- Nomor tiket unik, lacak status.
- Admin menanggapi & mengubah status.

### 5.6 Galeri & UMKM
- CRUD album & item galeri (dengan upload foto).
- CRUD direktori UMKM.

### 5.7 Dashboard Admin (data agregat)
- Dashboard frontend menyusun kartu, hitungan status, dan tren dari endpoint data yang sudah ada; backend tidak menyediakan agregator dashboard khusus.

## 6. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| Performa | p95 response time < 300ms untuk endpoint CRUD sederhana (di luar upload file) |
| Keamanan | Password di-hash (bcrypt), token JWT dengan masa berlaku pendek, refresh token dapat dicabut, seluruh query terparameterisasi (anti SQL injection), validasi & sanitasi input di server |
| Skalabilitas | Backend **stateless** (session tidak disimpan di memory proses) agar bisa dijalankan multi-instance di belakang load balancer |
| Observability | Logging terstruktur (JSON) tiap request, request ID untuk tracing, endpoint `/healthz` dan `/readyz` |
| Konsistensi data | Operasi multi-tabel (misal ubah status pengajuan + catat riwayat) wajib dalam satu transaksi database |
| Portabilitas | Konfigurasi lewat environment variable, dapat dijalankan via Docker |
| Dokumentasi API | Kontrak endpoint terdokumentasi lengkap di `SPEC.md` (backend), idealnya juga diekspos sebagai OpenAPI/Swagger |

## 7. Asumsi & Batasan

- Satu deployment backend melayani satu desa (bukan arsitektur multi-tenant).
- MySQL berjalan sebagai instance tunggal (belum ada sharding/replikasi pada fase ini, tapi skema dirancang agar siap direplikasi).
- File upload disimpan di disk lokal server pada fase ini, di belakang interface `FileStorage` yang siap diganti implementasi S3-compatible (MinIO) tanpa mengubah usecase.
- Notifikasi (WA/email) hanya berupa interface/port kosong (`NotificationSender`) yang saat ini diimplementasikan sebagai no-op/log saja.
- Tidak ada requirement kepatuhan (compliance) khusus di luar praktik keamanan umum (OWASP Top 10) pada fase ini.

## 8. Roadmap Fase

1. **Fase 2 (dokumen ini)** — Backend REST API inti + autentikasi produksi + migrasi database, terintegrasi penuh dengan frontend Fase 1.
2. **Fase 3** — Notifikasi WhatsApp/email sungguhan, generate PDF surat otomatis, migrasi file storage ke object storage (S3-compatible).
3. **Fase 4** — Integrasi Dukcapil, retribusi/pembayaran daring, observability lanjutan (metrics/tracing dengan OpenTelemetry), multi-instance deployment dengan cache (Redis).

## 9. Metrik Keberhasilan (indikatif)

- Seluruh endpoint di `SPEC.md` (backend) §7 terimplementasi dan lulus pengujian integrasi.
- Frontend Fase 1 dapat mengganti seluruh `lib/services/*` mock menjadi pemanggilan API asli tanpa mengubah struktur komponen UI.
- Tidak ada kredensial atau data sensitif tersimpan dalam bentuk plain text.
- Backend dapat di-deploy via Docker dengan satu perintah (`docker compose up`) termasuk migrasi otomatis.

---
*Dokumen ini menjadi acuan bagi `AGENTS-BACKEND.md` (cara AI agent bekerja di proyek backend) dan `SPEC-BACKEND.md` (spesifikasi teknis implementasi: skema database, kontrak API detail, arsitektur kode).*
