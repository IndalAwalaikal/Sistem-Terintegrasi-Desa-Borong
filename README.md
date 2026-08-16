# Website Desa Borong

Website Desa Borong adalah sistem informasi desa digital yang terdiri dari frontend Next.js, backend Go API, dan database MySQL. Sistem ini dirancang untuk mendukung kebutuhan layanan publik desa seperti profil desa, informasi statistik, agenda, berita, pengaduan, layanan surat, transparansi pajak, dan dashboard admin operasional.

Dokumen ini menjelaskan keseluruhan sistem secara terstruktur mulai dari tujuan, arsitektur, alur kerja, komponen, persiapan lingkungan, cara menjalankan secara lokal, hingga panduan operasional dasar.

## 1. Ringkasan Proyek

Proyek ini dibagi menjadi tiga bagian utama:

- Frontend: aplikasi web public dan dashboard admin berbasis Next.js App Router
- Backend: REST API berbasis Go dengan arsitektur clean/hexagonal
- Database: MySQL 8.4 untuk penyimpanan data transaksi, konten, otorisasi, dan data operasional desa

Secara umum, sistem ini mendukung dua sisi pengguna:

- Pengunjung umum: melihat profil desa, statistik, APBDes, agenda, fasilitas, berita, galeri, UMKM, pajak, dan layanan digital
- Admin / operator desa: mengelola konten, pengajuan surat, pengaduan, data penduduk, data pajak, dan modul operasional lainnya

## 2. Tujuan Sistem

Sistem ini dikembangkan untuk:

- Menyediakan portal informasi digital desa yang mudah diakses publik
- Menyederhanakan pengelolaan data desa secara terstruktur
- Memungkinkan pengajuan dan pelacakan layanan warga secara digital
- Meningkatkan transparansi keuangan dan pajak desa
- Memudahkan admin desa dalam mengelola konten, data, dan proses administrasi

## 3. Arsitektur Sistem

Proyek ini mengikuti arsitektur tiga layer utama:

- Frontend layer: Next.js, React, Tailwind CSS, Zustand, komponen UI reusable
- Application layer: backend Go API, usecase/domain logic, routing HTTP
- Data layer: MySQL, migrasi schema, repository, file storage

Alur kerja umum:

- Browser mengakses frontend di localhost:3300
- Frontend memanggil backend API melalui route proxied atau URL internal
- Backend membaca dan menulis data ke MySQL
- File upload disimpan di volume yang dikelola Docker
- Admin dan publik mengakses halaman yang sesuai dengan otorisasi dan kebijakan aplikasi

Diagram singkat:

Browser
-> Frontend (Next.js)
-> API Backend (Go)
-> MySQL
-> File Storage

## 4. Struktur Repository

Berikut struktur utama repository:

- Root folder
  - docker-compose.yml
  - README.md
  - .env.example
  - .env
- Backend/
  - cmd/
  - internal/
  - migrations/
  - pkg/
  - Dockerfile
  - go.mod
  - README.md
  - SPEC.md
  - PRD.md
- Frontend/
  - app/
  - components/
  - lib/
  - public/
  - store/
  - types/
  - package.json
  - Dockerfile
  - README.md
  - SPEC.md
  - PRD.md

## 5. Komponen Utama

### 5.1 Frontend

Frontend dibuat dengan Next.js 16 App Router dan fokus pada pengalaman pengguna publik serta sisi admin.

Fitur utama yang biasanya tersedia di frontend:

- Beranda desa
- Profil desa
- Statistik dan APBDes
- Agenda kegiatan
- Berita dan galeri
- UMKM
- Layanan publik dan pengajuan surat
- Pengaduan masyarakat
- Transparansi pajak desa
- Dashboard admin/operator

Folder utama:

- app/: route aplikasi dan halaman utama
- components/: komponen reusable UI dan layout
- lib/services/: layer akses data dan integrasi API
- lib/mock/: data contoh untuk proses prototyping
- lib/validations/: schema validasi form
- store/: Zustand store untuk state aplikasi
- types/: definisi tipe data TypeScript

### 5.2 Backend

Backend dibuat dengan Go dan dirancang untuk menangani operasi data, autentikasi, validasi, logika bisnis, serta integrasi database.

Fitur utama backend:

- REST API untuk autentikasi dan otorisasi
- CRUD konten seperti berita, agenda, UMKM, fasilitas, galeri
- Pengelolaan persuratan dan pengajuan layanan
- Integrasi data pajak dan transparansi keuangan
- Keamanan JWT dan refresh token
- Pencatatan audit dan log kegiatan
- Upload dan penyimpanan file

Folder utama:

- cmd/api: entrypoint aplikasi
- internal/domain: entity domain dan aturan bisnis dasar
- internal/usecase: logika bisnis per modul
- internal/delivery/http: routing HTTP, handler, middleware
- internal/infrastructure: database, auth, storage,
- migrations: file migrasi MySQL
- pkg/: utilitas umum dan helper

### 5.3 Database

Database yang dipakai adalah MySQL 8.4.

Fungsinya meliputi:

- menyimpan data master desa
- data pengguna dan autentikasi
- data berita, agenda, fasilitas, galeri, UMKM
- data layanan surat dan status pengajuan
- data pajak dan setoran
- data audit dan log kegiatan

## 6. Teknologi yang Digunakan

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Zod
- Lucide React
- Recharts
- Leaflet

### Backend

- Go 1.26
- MySQL 8.4
- net/http standard library
- JWT
- bcrypt
- golang-migrate
- Docker / Docker Compose

## 7. Persyaratan Sistem

Sebelum menjalankan aplikasi, pastikan perangkat Anda sudah memiliki:

- Docker dan Docker Compose
- Node.js 22 untuk pengembangan frontend lokal
- Go 1.26 untuk pengembangan backend lokal
- Akses ke port lokal yang dibutuhkan:
  - 3300 untuk frontend
  - 8088 untuk backend host
  - 3306 untuk MySQL host

## 8. Konfigurasi Environment

Project root menggunakan file .env. Template dapat dilihat di .env.example.

Variabel umum yang perlu diisi:

- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_ROOT_PASSWORD
- JWT_ACCESS_SECRET
- BOOTSTRAP_SUPER_ADMIN_PASSWORD
- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_API_BASE_URL
- API_INTERNAL_URL

Pastikan file .env tidak dipublikasikan ke repository karena berisi data sensitif.

## 9. Cara Menjalankan Aplikasi Secara Lokal

### 9.1 Menjalankan seluruh sistem dengan Docker Compose

Dari root project:

```bash
docker compose up --build -d
```

Setelah proses selesai, akses:

- Frontend: http://localhost:3300
- Backend: http://localhost:8088
- MySQL: localhost:3306

Untuk melihat log:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

Untuk menghentikan layanan:

```bash
docker compose down
```

Untuk menghentikan sekaligus menghapus data database:

```bash
docker compose down -v
```

### 9.2 Menjalankan backend secara lokal

Dari folder Backend:

```bash
go mod tidy
go run ./cmd/api
```

Pastikan MySQL sedang aktif dan environment sudah sesuai.

### 9.3 Menjalankan frontend secara lokal

Dari folder Frontend:

```bash
npm install
npm run dev
```

Frontend akan berjalan di:

- http://localhost:3000

## 10. Struktur Alur Produksi

### Sistem public

Pengguna umum dapat mengakses:

- halaman profil desa
- agenda kegiatan
- data statistik dan APBDes
- berita, galeri, UMKM
- transparansi pajak
- pencarian layanan dan status pengajuan

### Sistem admin

Admin/desa operator dapat mengelola:

- data konten
- berita dan galeri
- pengaduan
- layanan surat
- transaksi pajak
- setoran pajak
- user dan otorisasi
- konfigurasi umum

## 11. Pengelolaan Database

Database migrasi berada di folder Backend/migrations.

Beberapa operasi yang umum digunakan:

- melihat status migrasi
- menjalankan migrasi manual
- mengulang setup database dari awal

Contoh:

```bash
docker compose up -d mysql
docker compose run --rm migrate
```

Atau bila ingin restart database dari nol:

```bash
docker compose down -v
docker compose up --build -d
```

## 12. API dan Integrasi

Backend menyediakan API REST yang digunakan oleh frontend. Frontend biasanya mengakses API melalui service layer di lib/services.

Prinsip integrasi yang dipakai:

- frontend tidak mengakses data langsung dari komponen
- semua request diarahkan melalui service abstraction
- error API diproses konsisten melalui helper response/error handling

## 13. Keamanan dan Best Practice

Beberapa praktik penting di proyek ini:

- rahasia disimpan di .env, bukan di source code
- password di-hash sebelum disimpan
- JWT digunakan untuk autentikasi
- refresh token disimpan dan dilakukan rotasi
- file upload disimpan di storage yang terpisah dari source code
- CORS dibatasi sesuai domain yang diizinkan
- audit trail penting untuk modul transaksi seperti pajak dan layanan

## 14. Troubleshooting Umum

### Port sudah dipakai

Jika port 3300 atau 8088 sudah terpakai, ubah konfigurasinya pada docker-compose.yml atau berhentikan service lain yang memakai port tersebut.

### MySQL tidak bisa mulai

Periksa:

- file .env
- password DB_ROOT_PASSWORD
- volume mysql_data
- status docker

### Backend gagal konek ke database

Periksa:

- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- apakah migrasi sudah selesai

### Frontend tidak bisa memanggil API

Periksa:

- NEXT_PUBLIC_API_BASE_URL
- API_INTERNAL_URL
- CORS_ALLOWED_ORIGINS di backend
- status service backend

## 15. Tim dan Kontribusi

Proyek ini dapat dikembangkan oleh beberapa pihak seperti:

- developer frontend
- developer backend
- admin / operator desa
- stakeholder atau product owner

Untuk kontribusi, pastikan perubahan disesuaikan dengan dokumen produk dan spesifikasi yang ada di masing-masing folder project.

## 16. Dokumentasi Pendukung

- Backend README: menjelaskan detail implementasi API dan arsitektur backend
- Frontend README: menjelaskan detail implementasi interface dan fitur aplikasi web
- PRD dan SPEC di masing-masing folder: menjelaskan kebutuhan produk dan spesifikasi teknis

## 17. Ringkasan Keseluruhan

Website Desa Borong adalah platform digital desa yang menggabungkan portal publik, dashboard admin, data operasional, layanan warga, transparansi keuangan, serta sistem informasi desa yang mudah dikelola. Dengan struktur monorepo yang terpisah namun terhubung, project ini memisahkan tanggung jawab antara frontend, backend, dan database, sehingga lebih mudah dikembangkan, dikelola, dan di-extend ke fase berikutnya.
