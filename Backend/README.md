# Backend Desa Borong

Backend Desa Borong adalah layanan API REST yang digunakan oleh frontend website desa untuk mengelola konten, data operasional desa, layanan warga, autentikasi, dan transparansi keuangan. Aplikasi ini dibangun dengan Go dan menggunakan MySQL sebagai database utama.

Dokumen ini menjelaskan tujuan proyek, arsitektur, struktur folder, setup local, konfigurasi environment, alur kerja, modul utama, dan panduan operasional untuk pengembangan backend.

## 1. Tujuan Backend

Backend ini bertanggung jawab untuk:

- menyediakan API untuk frontend dan client internal
- menangani autentikasi dan otorisasi pengguna
- menangani CRUD data desa seperti berita, agenda, UMKM, galeri, fasilitas, penduduk, dan profil
- mengelola proses layanan surat dan pengajuan warga
- menangani modul pengaduan dan penanganan laporan masyarakat
- mendukung transparansi pajak desa dan audit trail
- menyimpan file upload dan data transaksi yang relevan

## 2. Teknologi yang Digunakan

- Bahasa: Go 1.26
- Framework HTTP: net/http standard library
- Database: MySQL 8.4
- ORM/query layer: SQL dan repository pattern (terstruktur, tanpa ORM berat)
- Autentikasi: JWT access token dan refresh token
- Password hashing: bcrypt
- Migrasi database: golang-migrate
- File storage: path-based local storage untuk kebutuhan lokal/dev
- Container: Docker dan Docker Compose

## 3. Arsitektur Backend

Backend mengikuti pola clean architecture dengan pemisahan lapisan yang jelas:

- domain: model domain, enum, validasi domain, error domain
- usecase: logika bisnis, service, kontrak repository
- delivery/http: routing, middleware, handler, response formatting
- infrastructure: database repository, auth service, storage, konfigurasi

Prinsip dasar:

- domain tidak bergantung pada framework atau database
- usecase tidak bergantung pada detail teknis HTTP
- infrastruktur mengimplementasikan interface yang didefinisikan oleh usecase
- wiring aplikasi dilakukan di entrypoint utama

Struktur folder utama:

- cmd/api: entrypoint aplikasi
- internal/domain: model dan konstanta domain
- internal/usecase: modul business logic
- internal/delivery/http: HTTP handler dan middleware
- internal/infrastructure: implementasi database dan service eksternal
- migrations: file migrasi SQL
- pkg: helper utilitas umum

## 4. Struktur Folder

Berikut struktur utama backend:

- cmd/
  - api/main.go
- internal/
  - delivery/http/
  - domain/
  - infrastructure/
  - pkg/
  - usecase/
- migrations/
- pkg/
- Dockerfile
- go.mod
- README.md
- PRD.md
- SPEC.md

Berbagai modul yang tersedia mencakup:

- auth
- berita
- desa
- finance
- galeri
- pajak
- pengaduan
- persuratan
- umkm
- user

## 5. Modul Utama

### 5.1 Autentikasi dan User

Modul ini menangani:

- registrasi pengguna
- login
- logout
- refresh token
- otorisasi dan role
- akun admin dan pengguna umum

### 5.2 Desa dan Profil

Modul ini mencakup:

- data profil desa
- sejarah, wilayah, struktur organisasi
- data penduduk dan demografi
- statistik desa

### 5.3 Berita dan Konten Publik

Modul ini menangani data seperti:

- artikel berita
- kategori konten
- galeri foto
- agenda kegiatan
- fasilitas umum
- potensi desa

### 5.4 Layanan Warga dan Persuratan

Modul ini memproses:

- pengajuan layanan atau surat
- status pengajuan
- lampiran dokumen
- alur persetujuan
- riwayat perubahan status

### 5.5 Pengaduan

Modul ini menangani:

- pembuatan pengaduan warga
- kategori pengaduan
- status dan timeline
- respon admin atau petugas

### 5.6 Pajak dan Transparansi Keuangan

Modul pajak mencakup:

- jenis pajak dan retribusi
- data wajib pajak
- transaksi pembayaran
- verifikasi pembayaran
- penyetoran batch ke BPD atau bank mitra
- konfirmasi penerimaan
- audit log
- ringkasan pajak per tahun

## 6. Persyaratan Pengembangan

Sebelum menjalankan backend, pastikan lingkungan berikut tersedia:

- Go 1.26 atau versi yang sesuai
- MySQL 8.4
- Docker dan Docker Compose jika ingin menjalankan semua service sekaligus
- file environment .env yang sudah diisi

## 7. Konfigurasi Environment

Project root memiliki file .env.example yang berisi template environment. Jika ingin menjalankan backend secara lokal, pastikan variabel berikut tersedia:

- APP_ENV
- APP_PORT
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- JWT_ACCESS_SECRET
- JWT_ACCESS_TTL
- JWT_REFRESH_TTL
- CORS_ALLOWED_ORIGINS
- FILE_STORAGE_PATH
- LOG_LEVEL

Untuk environment lokal dengan Docker, variabel root dapat diisi di file .env di root project. Untuk pengembangan backend langsung di local tanpa Docker, biasanya DB_HOST diisi localhost dan backend menjalankan koneksi langsung ke MySQL lokal.

## 8. Menjalankan Backend

### 8.1 Menjalankan seluruh sistem via Docker Compose

Dari root project:

```bash
docker compose up --build -d
```

Ini akan menjalankan:

- MySQL
- migrasi database
- backend API
- frontend application

### 8.2 Menjalankan backend saja

Dari folder Backend:

```bash
go mod tidy
go run ./cmd/api
```

Pada mode lokal, aplikasi biasanya memanfaatkan environment variable yang sudah diset pada terminal atau file .env.

### 8.3 Build backend ke binary

```bash
go build ./cmd/api
```

## 9. Database dan Migrasi

Migrasi database berada di folder Backend/migrations. File migrasi bertanggung jawab atas pembuatan dan perubahan skema database agar struktur data tetap konsisten.

Beberapa hal penting:

- tiap perubahan skema dibuat dalam file migrasi versi
- migrasi dijalankan sebelum service backend siap menerima request
- migrasi harus menjaga kompatibilitas data lama
- perubahan pada skema ini harus diperhatikan ketika memodifikasi domain atau repository

Proyek ini juga menggunakan Docker service migrate untuk menjalankan migrasi otomatis saat container dibangun/dijalankan.

## 10. API Behavior

API backend mengikuti pola respons yang konsisten:

- response sukses biasanya berbentuk data object atau list
- response error mengikuti format standar dengan informasi error code dan message
- endpoint didesign sesuai kebutuhan frontend
- middleware menangani autentikasi, otorisasi, logging, recovery, dan validasi umum

Contoh pola umum:

```json
{
  "data": {
    "id": "..."
  }
}
```

atau

```json
{
  "error": {
    "code": "validation_error",
    "message": "Data tidak valid"
  }
}
```

## 11. Endpoint Utama

Modul backend memiliki banyak endpoint, namun beberapa kategori utama adalah:

- Auth
  - login
  - logout
  - refresh token
  - profile user
- Berita
  - list berita
  - create dan update berita
  - delete berita
- Profil dan Desa
  - profil desa
  - data statistik
  - struktur organisasi
- Persuratan
  - daftar surat
  - membuat pengajuan
  - update status
  - upload lampiran
- Pengaduan
  - list pengaduan
  - kirim pengaduan
  - update status
- Pajak
  - daftar jenis pajak
  - daftar wajib pajak
  - daftar transaksi
  - penyetoran batch
  - konfirmasi setoran
  - ringkasan pajak

Detail endpoint yang lengkap dapat dilihat pada file SPEC.md serta handler route yang terdapat di folder internal/delivery/http.

## 12. Testing

Untuk menjaga kualitas backend, project menggunakan Go testing secara rutin. Pastikan pengujian dilakukan sebelum merge atau deployment.

Perintah umum:

```bash
go test ./...
```

Untuk testing dengan race detection:

```bash
go test -race ./...
```

Kebijakan testing yang disarankan:

- unit test untuk usecase
- test handler API untuk happy path dan validation error
- test repository jika diperlukan untuk query yang kompleks
- test pada alur status untuk modul seperti persuratan dan pajak

## 13. Security Considerations

Backend ini memerlukan perhatian keamanan yang serius:

- jangan hardcode secret atau password ke source code
- selalu pakai environment variable untuk secret
- gunakan JWT dengan TTL yang wajar
- hindari mengembalikan data sensitif ke response publik
- validasi semua input body, query, dan path parameter
- gunakan transaksi database saat operasi multi-table penting
- lakukan logging dan audit untuk perubahan status critical

## 14. Deployment dan Operasional

Untuk deployment production, beberapa hal yang perlu dipersiapkan:

- environment variable produksi
- database yang aman dan terdeteksi backup
- storage file yang permanen dan aman
- CORS yang dibatasi
- log management yang siap dipantau
- monitoring endpoint penting seperti health atau readiness

## 15. Troubleshooting Umum

### Backend tidak bisa start

Periksa:

- apakah Go sudah terinstall
- apakah .env sudah benar
- apakah MySQL aktif
- apakah port backend sudah tidak dipakai

### Koneksi database gagal

Periksa:

- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
- apakah container MySQL sudah ready
- apakah migrasi database sudah berjalan

### Error JWT atau login

Periksa:

- JWT_ACCESS_SECRET
- format token
- refresh token validity dan rotation

### Error file upload

Periksa:

- FILE_STORAGE_PATH
- permission folder upload
- volume docker jika memakai Docker Compose

## 16. Dokumen Pendukung

Backend memiliki dokumen spesifikasi dan PRD yang menjelaskan kebutuhan produk dan desain teknis, yaitu:

- PRD.md
- SPEC.md
- AGENTS.md

Dokumen ini sangat penting untuk memahami prioritas fitur, kontrak API, serta peraturan bisnis yang perlu dipenuhi.

## 17. Ringkasan

Backend Desa Borong adalah API yang menjadi tulang punggung sistem informasi desa digital. Dengan kombinasi Go, MySQL, JWT, migrasi database, dan arsitektur modular, backend ini dirancang untuk mendukung kebutuhan operasional desa yang kompleks namun tetap terstruktur, aman, dan mudah dikembangkan.
