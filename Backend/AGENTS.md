# AGENTS-BACKEND.md
## Panduan Kerja untuk AI Coding Agent — Backend Website Desa Digital

Baca bersama `PRD-BACKEND.md` (kebutuhan produk) dan `SPEC-BACKEND.md` (spesifikasi teknis) sebelum mulai bekerja. Dokumen ini juga menjadi acuan bersama dengan `AGENTS.md` (frontend) — kontrak endpoint harus konsisten dengan yang didokumentasikan di `SPEC.md` (frontend) §9.

---

## 1. Ringkasan Proyek

REST API backend untuk Website Desa Digital. Dibangun dengan Go, menyimpan data di MySQL, mengikuti **Clean/Hexagonal Architecture**: logika bisnis (usecase/domain) tidak boleh bergantung pada detail teknis (HTTP framework, driver database, sistem file). Semua ketergantungan mengarah ke dalam (dependency inversion) — detail teknis diimplementasikan sebagai adapter yang memenuhi interface yang didefinisikan oleh lapisan dalam.

## 2. Tech Stack Wajib & Justifikasi

| Layer | Pilihan | Catatan |
|---|---|---|
| Bahasa | **Go 1.26.6** | Green Tea GC aktif default (throughput lebih baik), overhead cgo berkurang, goroutine leak detector tersedia untuk testing |
| Database | **MySQL 8.4 LTS** (mis. 8.4.11) | Jalur LTS dipilih (bukan Innovation/26.x) karena proyek pemerintahan desa mengutamakan stabilitas jangka panjang — didukung hingga 2032 |
| Driver DB | `go-sql-driver/mysql` | Driver MySQL standar de facto untuk Go |
| Query layer | **sqlc** (generate kode Go type-safe dari SQL mentah) | Dipilih agar query eksplisit & auditable (selaras prinsip Clean Architecture: repository = adapter tipis, bukan ORM ajaib). Alternatif `sqlx` boleh dipakai untuk query ad-hoc yang tidak cocok digenerate sqlc |
| Migrasi skema | **golang-migrate** | Migrasi versi terkendali, dijalankan otomatis saat startup atau lewat CLI terpisah |
| Router HTTP | **`net/http` standard library** (enhanced `ServeMux`, routing berbasis method + wildcard `{id}`) | *Direkomendasikan agent* — tanpa framework eksternal. Stdlib sejak Go 1.22 sudah cukup untuk REST API biasa; ini juga selaras prinsip Clean Architecture (lapisan delivery adalah detail, tidak perlu framework berat) dan mengurangi ketergantungan jangka panjang. Bila kompleksitas routing bertambah signifikan, boleh evaluasi ulang (lihat §8) |
| Autentikasi | **JWT access token (stateless, ~15 menit) + refresh token (tersimpan di-hash di DB, rotasi tiap pemakaian, dapat dicabut)** | *Direkomendasikan agent* — kombinasi ini memberi performa (access token tidak perlu query DB tiap request) sekaligus kontrol keamanan (refresh token bisa dicabut, mendeteksi reuse sebagai indikasi pencurian token) |
| Library JWT | `golang-jwt/jwt/v5` (atau versi terbaru saat implementasi) | — |
| Hash password | `golang.org/x/crypto/bcrypt` (cost 12) | Standar industri, cukup untuk skala proyek ini |
| Validasi input | `go-playground/validator/v10` atau validasi manual per DTO | Konsisten satu pendekatan di seluruh proyek |
| Logging | `log/slog` (standard library, structured logging) | Tidak perlu library eksternal (zap/zerolog) — `slog` sudah cukup dan mengurangi dependensi |
| Testing | `testing` standard library + `testify` (assertions) + `httptest` | Gunakan `go test -race` secara rutin; manfaatkan goroutine leak detector Go 1.26 |
| Container | Docker + `docker-compose` (service: `api`, `mysql`, opsional `minio` untuk fase depan) | — |
| Live reload dev | `air` (opsional, untuk kenyamanan development) | — |

> Kedua keputusan yang ditandai "*Direkomendasikan agent*" di atas boleh ditinjau ulang bila muncul kebutuhan konkret yang tidak terpenuhi stdlib/pola ini — tapi perubahan besar pada stack inti harus dikonfirmasi ke pengguna dulu (lihat §8).

## 3. Prinsip Arsitektur (Clean/Hexagonal)

```
┌───────────────────────────────────────────────────────────┐
│                      Domain (entity)                       │  ← Struct inti + aturan bisnis paling dasar, TANPA dependensi luar
├───────────────────────────────────────────────────────────┤
│                      Usecase (application)                 │  ← Logika bisnis, mendefinisikan PORT (interface repository,
│                                                              │     interface storage, interface notifier, dst.)
├──────────────────────────┬────────────────────────────────┤
│   Delivery (adapter in)   │   Infrastructure (adapter out)  │  ← Implementasi teknis: HTTP handler & DTO mapping di satu sisi;
│   HTTP handler, routing,  │   MySQL repository, JWT service,│     MySQL/JWT/filesystem di sisi lain — keduanya mengimplementasikan
│   middleware, DTO         │   file storage, dsb.            │     interface yang didefinisikan usecase
└──────────────────────────┴────────────────────────────────┘
```

**Aturan arah dependensi (wajib dipatuhi):**
- `domain` tidak boleh import apa pun dari `usecase`, `delivery`, atau `infrastructure`.
- `usecase` hanya boleh bergantung pada `domain` dan interface yang ia definisikan sendiri (mis. `UserRepository`, `FileStorage`) — **tidak pernah** import package `infrastructure` atau `net/http` secara langsung.
- `delivery` dan `infrastructure` boleh bergantung pada `usecase` dan `domain`, tapi tidak boleh saling bergantung satu sama lain.
- Wiring (menyusun implementasi konkret ke dalam usecase) hanya terjadi di `cmd/api/main.go` — inilah satu-satunya tempat "dunia luar" dan "dunia dalam" bertemu.

## 4. Struktur Direktori (acuan)

```
cmd/
  api/
    main.go                    # entrypoint: load config, wiring, start server
migrations/
  000001_create_users.up.sql
  000001_create_users.down.sql
  ...
internal/
  domain/
    user.go
    berita.go
    persuratan.go
    pengaduan.go
    statistik.go
    umkm.go
    errors.go                  # domain error sentinel (ErrNotFound, ErrConflict, dst.)
  usecase/
    auth/
      service.go                # interface + implementasi usecase
      port.go                   # interface UserRepository, TokenRepository, dst.
    berita/
    persuratan/
    pengaduan/
    statistik/
    umkm/
  delivery/
    http/
      handler/
        auth_handler.go
        berita_handler.go
        persuratan_handler.go
        ...
      middleware/
        auth.go                 # verifikasi JWT, inject user ke context
        rbac.go                 # RequireRole(...)
        logging.go
        recover.go
        cors.go
        request_id.go
      dto/
        auth_dto.go              # request/response struct + validasi
        ...
      router.go                  # daftar semua route
      response.go                 # helper envelope sukses/error
  infrastructure/
    mysql/
      db.go                      # koneksi & pool
      user_repository.go
      berita_repository.go
      persuratan_repository.go
      ...
      sqlc/                      # kode hasil generate sqlc
        queries/                 # file .sql sumber
    storage/
      local_storage.go            # implementasi FileStorage lokal
      s3_storage.go                # (fase depan, boleh siapkan interface saja dulu)
    auth/
      jwt_service.go               # implementasi TokenService
      password_hasher.go
    notification/
      noop_sender.go                # implementasi NotificationSender kosong (fase ini)
    config/
      config.go                    # load environment variable
pkg/
  pagination/
  validator/
  apierror/
docker-compose.yml
Dockerfile
.env.example
```

## 5. Konvensi Kode

- Ikuti `gofmt`/`goimports` dan `golangci-lint` (jalankan sebelum commit).
- Nama package pendek, huruf kecil, tanpa underscore (`persuratan`, bukan `persuratan_service`).
- Setiap fungsi publik usecase menerima `context.Context` sebagai parameter pertama.
- Error domain memakai sentinel error (`errors.Is`/`errors.As`) yang dipetakan ke HTTP status code **di lapisan delivery saja** — usecase tidak pernah tahu soal HTTP status.
- DTO request wajib divalidasi sebelum masuk ke usecase; usecase tidak pernah menerima struct HTTP mentah.
- Semua query SQL eksplisit (lewat sqlc) — hindari query string dirakit manual dengan concatenation (rawan SQL injection).
- Operasi yang menyentuh lebih dari satu tabel (misal ubah status pengajuan + insert riwayat) wajib dibungkus transaksi lewat interface `TxManager` yang disuntikkan ke usecase.
- Commit message: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`).
- Tidak ada `panic` untuk alur error biasa — `panic` hanya untuk bug fatal yang tidak boleh terjadi, dan wajib ditangkap middleware `recover`.

## 6. Checklist "Definition of Done" per Modul/Endpoint

- [ ] Domain entity & error sentinel didefinisikan.
- [ ] Interface repository/port didefinisikan di lapisan usecase.
- [ ] Implementasi repository MySQL (via sqlc) sesuai interface.
- [ ] Usecase berisi logika bisnis & validasi aturan domain (bukan validasi format input — itu tugas DTO).
- [ ] Handler HTTP + DTO request/response + mapping error ke status code.
- [ ] Middleware auth/RBAC diterapkan sesuai kebutuhan endpoint (lihat matriks otorisasi di `SPEC-BACKEND.md`).
- [ ] Migrasi database dibuat (file `up`/`down`).
- [ ] Unit test usecase (dengan mock repository).
- [ ] Test handler dasar (`httptest`) untuk happy path + 1–2 skenario error.
- [ ] Response mengikuti envelope standar (lihat `SPEC-BACKEND.md` §6).
- [ ] Tidak ada data sensitif (password hash, token) ikut ter-serialize ke response JSON.

## 7. Yang Boleh Diasumsikan Agent

- Boleh menambah util kecil di `pkg/` selama tidak melanggar arah dependensi.
- Boleh menambah middleware baru (rate limiter, dsb.) bila relevan dengan kebutuhan keamanan.
- Boleh menambah index database yang masuk akal untuk kolom yang sering difilter/dicari (mis. `nomor_resi`, `slug`, `email`).

## 8. Yang TIDAK Boleh Dilakukan Agent Tanpa Konfirmasi

- Mengganti bahasa/database inti (Go, MySQL).
- Mengganti pendekatan arsitektur dari Clean/Hexagonal ke pola lain.
- Mengganti keputusan router (stdlib) atau strategi auth (JWT + refresh) dengan pendekatan yang jauh berbeda — boleh diusulkan dengan alasan teknis, tapi tunggu konfirmasi sebelum mengeksekusi perubahan besar.
- Menyimpan rahasia (secret key JWT, kredensial DB) hardcoded di kode — wajib lewat environment variable.
- Mengekspos endpoint tanpa middleware auth/RBAC yang sesuai untuk data yang seharusnya terproteksi.

## 9. Pengujian

| Level | Tools | Cakupan prioritas |
|---|---|---|
| Unit (usecase) | `testing` + `testify` + mock repository | Logika bisnis inti: alur status pengajuan, validasi aturan domain, generate nomor resi/tiket |
| Integrasi (repository) | `testing` + MySQL nyata (Docker service khusus test / testcontainers-go) | Query sqlc benar-benar bekerja sesuai skema |
| Handler/API | `httptest` | Request/response, status code, auth middleware |
| Race detector | `go test -race ./...` | Wajib dijalankan sebelum merge |

## 10. Environment Variables (`.env.example`)

```
APP_ENV=development
APP_PORT=8080

DB_HOST=localhost
DB_PORT=3306
DB_NAME=desa_digital
DB_USER=desa_app
DB_PASSWORD=

JWT_ACCESS_SECRET=
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=720h

FILE_STORAGE_DRIVER=local        # local | s3 (fase depan)
FILE_STORAGE_PATH=./uploads

CORS_ALLOWED_ORIGINS=http://localhost:3000

LOG_LEVEL=info
```

## 11. Referensi Silang

- Kebutuhan fitur & prioritas → `PRD-BACKEND.md`
- Skema database, kontrak API detail, matriks otorisasi, alur autentikasi → `SPEC-BACKEND.md`
- Kontrak endpoint yang dikonsumsi frontend → `SPEC.md` (frontend) §9
