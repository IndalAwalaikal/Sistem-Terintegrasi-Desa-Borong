# Website Desa Borong

Sistem informasi desa digital yang terdiri dari frontend Next.js, backend Go API, dan database MySQL. Sistem ini mendukung layanan publik desa seperti profil desa, statistik, agenda, berita, pengaduan, layanan surat, transparansi pajak, serta dashboard admin operasional.

| Bagian | Teknologi Utama | Fungsi |
|---|---|---|
| Frontend | Next.js 16 (App Router) | Portal publik dan dashboard admin |
| Backend | Go 1.26 (REST API, arsitektur clean/hexagonal) | Logika bisnis, autentikasi, integrasi data |
| Database | MySQL 8.4 | Penyimpanan data transaksi, konten, dan operasional desa |

Sistem melayani dua sisi pengguna:

- **Pengunjung umum** — melihat profil desa, statistik, APBDes, agenda, fasilitas, berita, galeri, UMKM, pajak, dan layanan digital.
- **Admin/operator desa** — mengelola konten, pengajuan surat, pengaduan, data penduduk, data pajak, dan modul operasional lainnya.

## Daftar Isi

1. [Tujuan Sistem](#tujuan-sistem)
2. [Arsitektur](#arsitektur)
3. [Struktur Repository](#struktur-repository)
4. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
5. [Persyaratan Sistem](#persyaratan-sistem)
6. [Konfigurasi Environment](#konfigurasi-environment)
7. [Menjalankan Aplikasi Secara Lokal](#menjalankan-aplikasi-secara-lokal)
8. [Pengelolaan Database](#pengelolaan-database)
9. [API dan Integrasi](#api-dan-integrasi)
10. [Keamanan dan Best Practice](#keamanan-dan-best-practice)
11. [Troubleshooting](#troubleshooting)
12. [Dokumentasi Pendukung](#dokumentasi-pendukung)
13. [Kontribusi](#kontribusi)
14. [Lisensi](#lisensi)

## Tujuan Sistem

- Menyediakan portal informasi digital desa yang mudah diakses publik.
- Menyederhanakan pengelolaan data desa secara terstruktur.
- Memungkinkan pengajuan dan pelacakan layanan warga secara digital.
- Meningkatkan transparansi keuangan dan pajak desa.
- Memudahkan admin desa dalam mengelola konten, data, dan proses administrasi.

## Arsitektur

Proyek mengikuti tiga layer utama:

| Layer | Isi |
|---|---|
| Frontend | Next.js, React, Tailwind CSS, Zustand, komponen UI reusable |
| Application | Backend Go API, usecase/domain logic, routing HTTP |
| Data | MySQL, migrasi schema, repository, file storage |

Alur kerja singkat:

```
Browser -> Frontend (Next.js) -> API Backend (Go) -> MySQL / File Storage
```

## Struktur Repository

```
.
├── docker-compose.yml
├── README.md
├── .env.example
├── .env
├── Backend/
│   ├── cmd/
│   ├── internal/
│   ├── migrations/
│   ├── pkg/
│   ├── Dockerfile
│   ├── go.mod
│   ├── README.md
│   ├── SPEC.md
│   └── PRD.md
└── Frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── public/
    ├── store/
    ├── types/
    ├── package.json
    ├── Dockerfile
    ├── README.md
    ├── SPEC.md
    └── PRD.md
```

**Folder Frontend:**

| Folder | Isi |
|---|---|
| `app/` | Route aplikasi dan halaman utama |
| `components/` | Komponen reusable UI dan layout |
| `lib/services/` | Layer akses data dan integrasi API |
| `lib/mock/` | Data contoh untuk prototyping |
| `lib/validations/` | Schema validasi form |
| `store/` | Zustand store untuk state aplikasi |
| `types/` | Definisi tipe data TypeScript |

**Folder Backend:**

| Folder | Isi |
|---|---|
| `cmd/api` | Entrypoint aplikasi |
| `internal/domain` | Entity domain dan aturan bisnis dasar |
| `internal/usecase` | Logika bisnis per modul |
| `internal/delivery/http` | Routing HTTP, handler, middleware |
| `internal/infrastructure` | Database, auth, storage |
| `migrations/` | File migrasi MySQL |
| `pkg/` | Utilitas umum dan helper |

## Teknologi yang Digunakan

| Frontend | Backend |
|---|---|
| Next.js 16 | Go 1.26 |
| React 19 | MySQL 8.4 |
| TypeScript | net/http standard library |
| Tailwind CSS | JWT |
| Zustand | bcrypt |
| Zod | golang-migrate |
| Lucide React | Docker / Docker Compose |
| Recharts | |
| Leaflet | |

## Persyaratan Sistem

| Kebutuhan | Keterangan |
|---|---|
| Docker & Docker Compose | Untuk menjalankan seluruh sistem |
| Node.js 22 | Untuk pengembangan frontend lokal |
| Go 1.26 | Untuk pengembangan backend lokal |
| Port 3300 | Frontend |
| Port 8088 | Backend (host) |
| Port 3306 | MySQL (host) |

## Konfigurasi Environment

Project root menggunakan file `.env` (template tersedia di `.env.example`). Pastikan file ini **tidak** dipublikasikan ke repository karena berisi data sensitif.

| Variabel | Keterangan |
|---|---|
| `DB_NAME` | Nama database |
| `DB_USER` | Username database |
| `DB_PASSWORD` | Password database |
| `DB_ROOT_PASSWORD` | Password root MySQL |
| `JWT_ACCESS_SECRET` | Secret untuk token JWT |
| `BOOTSTRAP_SUPER_ADMIN_PASSWORD` | Password admin awal |
| `NEXT_PUBLIC_APP_NAME` | Nama aplikasi (frontend) |
| `NEXT_PUBLIC_SITE_URL` | URL situs publik |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL API dari sisi client |
| `API_INTERNAL_URL` | URL API untuk komunikasi internal |

## Menjalankan Aplikasi Secara Lokal

### Dengan Docker Compose (seluruh sistem)

```bash
docker compose up --build -d
```

| Layanan | URL |
|---|---|
| Frontend | http://localhost:3300 |
| Backend | http://localhost:8088 |
| MySQL | localhost:3306 |

Melihat log:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

Menghentikan layanan:

```bash
docker compose down
```

Menghentikan sekaligus menghapus data database:

```bash
docker compose down -v
```

### Backend secara lokal

```bash
cd Backend
go mod tidy
go run ./cmd/api
```

Pastikan MySQL sedang aktif dan environment sudah sesuai.

### Frontend secara lokal

```bash
cd Frontend
npm install
npm run dev
```

Frontend akan berjalan di http://localhost:3000.

## Pengelolaan Database

Migrasi database berada di `Backend/migrations`.

```bash
# menjalankan MySQL dan migrasi
docker compose up -d mysql
docker compose run --rm migrate

# restart database dari nol
docker compose down -v
docker compose up --build -d
```

## API dan Integrasi

Backend menyediakan REST API yang diakses frontend melalui service layer di `lib/services`.

- Frontend tidak mengakses data langsung dari komponen.
- Semua request diarahkan melalui service abstraction.
- Error API diproses konsisten melalui helper response/error handling.

## Keamanan dan Best Practice

- Rahasia disimpan di `.env`, bukan di source code.
- Password di-hash sebelum disimpan.
- JWT digunakan untuk autentikasi; refresh token disimpan dan dirotasi.
- File upload disimpan di storage terpisah dari source code.
- CORS dibatasi sesuai domain yang diizinkan.
- Audit trail diterapkan pada modul transaksi seperti pajak dan layanan.

## Troubleshooting

| Masalah | Yang Perlu Diperiksa |
|---|---|
| Port 3300/8088 sudah dipakai | Ubah konfigurasi di `docker-compose.yml` atau hentikan service lain yang memakai port tersebut |
| MySQL tidak bisa mulai | File `.env`, `DB_ROOT_PASSWORD`, volume `mysql_data`, status Docker |
| Backend gagal konek ke database | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, status migrasi |
| Frontend tidak bisa memanggil API | `NEXT_PUBLIC_API_BASE_URL`, `API_INTERNAL_URL`, `CORS_ALLOWED_ORIGINS` di backend, status service backend |

## Dokumentasi Pendukung

- **Backend README** — detail implementasi API dan arsitektur backend.
- **Frontend README** — detail implementasi interface dan fitur aplikasi web.
- **PRD & SPEC** di masing-masing folder — kebutuhan produk dan spesifikasi teknis.

## Kontribusi

Proyek ini dapat dikembangkan oleh developer frontend, developer backend, admin/operator desa, dan stakeholder atau product owner. Pastikan setiap perubahan disesuaikan dengan dokumen produk dan spesifikasi yang ada di masing-masing folder project.

## Lisensi

Hak Cipta (c) 2026 Indal Awalaikal

Lisensi ini diberikan berdasarkan ketentuan Lisensi MIT (MIT License).

Dengan ini diberikan izin, secara cuma-cuma, kepada setiap pihak yang memperoleh salinan perangkat lunak ini beserta berkas dokumentasi terkait ("Perangkat Lunak"), untuk menggunakan Perangkat Lunak tanpa batasan, termasuk namun tidak terbatas pada hak untuk menggunakan, menyalin, memodifikasi, menggabungkan, menerbitkan, mendistribusikan, memberi sublisensi, dan/atau menjual salinan Perangkat Lunak, serta mengizinkan pihak lain yang menerima Perangkat Lunak untuk melakukan hal yang sama, dengan tunduk pada ketentuan berikut:

Pemberitahuan hak cipta di atas dan pemberitahuan izin ini harus disertakan dalam seluruh salinan atau bagian penting dari Perangkat Lunak.

PERANGKAT LUNAK INI DISEDIAKAN "SEBAGAIMANA ADANYA", TANPA JAMINAN DALAM BENTUK APA PUN, BAIK TERSURAT MAUPUN TERSIRAT, TERMASUK NAMUN TIDAK TERBATAS PADA JAMINAN KELAYAKAN UNTUK DIPERJUALBELIKAN, KESESUAIAN UNTUK TUJUAN TERTENTU, DAN TIDAK ADANYA PELANGGARAN HAK. DALAM KEADAAN APA PUN, PENULIS ATAU PEMEGANG HAK CIPTA TIDAK BERTANGGUNG JAWAB ATAS KLAIM, KERUGIAN, ATAU TANGGUNG JAWAB LAIN, BAIK DALAM TINDAKAN KONTRAK, TINDAKAN MELANGGAR HUKUM, ATAU LAINNYA, YANG TIMBUL DARI, DILUAR, ATAU SEHUBUNGAN DENGAN PERANGKAT LUNAK ATAU PENGGUNAAN ATAU HAL LAIN DALAM PERANGKAT LUNAK TERSEBUT.