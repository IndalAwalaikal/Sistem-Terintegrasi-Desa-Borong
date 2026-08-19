# SPEC.md
## Spesifikasi Teknis — Website Desa Digital (Frontend)

Versi 1.0 · 13 Agustus 2026 · Pelengkap dari `PRD.md` dan `AGENTS.md`

---

## 1. Tech Stack & Versi Acuan

| Layer | Pilihan | Detail relevan (per Agustus 2026) |
|---|---|---|
| Framework | **Next.js 16.x** (mis. 16.3) | Turbopack default untuk `next dev`; production build tetap Webpack (Turbopack prod menyusul); `params` & `searchParams` adalah `Promise` (wajib `await`); Cache Components & Partial Prerendering (PPR) sudah stabil; middleware berganti nama menjadi `proxy.ts`; ada API `after()` |
| UI Library | **React 19.x** | Server Components default |
| Bahasa | **TypeScript 5.x** | `strict: true` |
| Styling | **Tailwind CSS v4.x** | Konfigurasi CSS-first (`@theme` di `globals.css`), engine Oxide, tanpa `tailwind.config.js` wajib |
| State (client) | **Zustand v5.x** | Store per domain, memakai `persist` middleware untuk sesi auth mock |
| Form & Validasi | React Hook Form + Zod | Schema per jenis surat |
| Ikon | lucide-react | — |
| Grafik/statistik | Recharts | Untuk statistik penduduk & APBDes |
| Peta | Leaflet/MapLibre (client-only component) | Peta desa interaktif |
| Testing | Vitest, React Testing Library, Playwright (opsional) | — |
| Deployment target | Vercel (disarankan) atau Node 20+ self-host | — |

## 2. Arsitektur Aplikasi

```
┌────────────────────────────┐
│        UI Components       │  ← Server & Client Components (app/, components/)
├────────────────────────────┤
│     State Management       │  ← Zustand stores (store/) — hanya state client
├────────────────────────────┤
│     Service Layer (API)     │  ← lib/services/* — SATU-SATUNYA pintu akses data
├────────────────────────────┤
│   Mock Data Provider (kini) │  ← lib/mock/* — akan diganti fetch ke backend nyata
│   Backend API (nanti)       │
└────────────────────────────┘
```

**Aturan emas:** komponen UI tidak pernah tahu apakah data berasal dari mock atau API asli. Semua service mengembalikan `Promise<T>` dengan bentuk return yang identik dengan kontrak API di §9.

## 3. Struktur Route (App Router)

### 3.1 Halaman Publik
| Route | Deskripsi | Rendering |
|---|---|---|
| `/` | Beranda | ISR |
| `/profil` | Profil desa (overview) | SSG |
| `/profil/sejarah` | Sejarah desa | SSG |
| `/profil/struktur-organisasi` | Struktur pemerintahan | SSG |
| `/profil/wilayah` | Wilayah administratif + peta | SSG |
| `/informasi/statistik` | Statistik kependudukan | ISR |
| `/informasi/apbdes` | Transparansi anggaran | ISR |
| `/informasi/peta` | Peta desa interaktif | CSR (client component untuk peta) |
| `/informasi/agenda` | Kalender kegiatan | ISR |
| `/berita` | Daftar berita (filter, search, pagination) | ISR |
| `/berita/[slug]` | Detail berita | SSG + ISR revalidate |
| `/layanan` | Daftar jenis surat/layanan | SSG |
| `/layanan/[kode]` | Detail jenis surat + tombol ajukan | SSG |
| `/layanan/[kode]/ajukan` | Form pengajuan (butuh login) | CSR |
| `/layanan/lacak` | Lacak permohonan via nomor resi | CSR |
| `/pengaduan` | Form pengaduan warga | CSR |
| `/pengaduan/lacak` | Lacak status pengaduan | CSR |
| `/galeri` | Galeri kegiatan | ISR |
| `/umkm` | Direktori UMKM | ISR |
| `/umkm/[slug]` | Detail UMKM | SSG |
| `/login`, `/register`, `/lupa-password` | Autentikasi warga | CSR |
| `/akun` | Profil warga (butuh login) | CSR |
| `/akun/riwayat` | Riwayat pengajuan warga | CSR |

### 3.2 Dashboard Admin (`/dashboard/*`, dilindungi role `admin`/`super_admin`)
| Route | Deskripsi |
|---|---|
| `/dashboard` | Ringkasan/analitik |
| `/dashboard/berita` | CRUD berita |
| `/dashboard/pengajuan` | Kelola permohonan surat (list, detail, ubah status) |
| `/dashboard/pengaduan` | Kelola pengaduan warga |
| `/dashboard/galeri` | Kelola galeri |
| `/dashboard/statistik` | Kelola data statistik penduduk & APBDes |
| `/dashboard/umkm` | Kelola direktori UMKM |
| `/dashboard/pengguna` | Kelola pengguna admin (khusus `super_admin`) |
| `/dashboard/pengaturan` | Pengaturan situs, jenis surat aktif |
| `/dashboard/login` | Login khusus admin |

### 3.3 Proteksi Route
Gunakan `middleware.ts` di Next 15 di root proyek untuk:
- Redirect ke `/login` bila mengakses `/akun/*` tanpa sesi.
- Redirect ke `/dashboard/login` bila mengakses `/dashboard/*` tanpa sesi admin.
- Guard tambahan `/dashboard/pengguna` khusus role `super_admin` (bisa dicek ulang di layout server component).

## 4. Model Data (TypeScript)

```typescript
// types/desa.ts
export interface ProfilDesa {
  nama: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  sejarah: string;
  visi: string;
  misi: string[];
  luasWilayah: string;
  jumlahDusun: number;
}

// types/berita.ts
export type KategoriBerita = 'pengumuman' | 'kegiatan' | 'pembangunan' | 'lainnya';

export interface Berita {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  konten: string;              // markdown/HTML
  kategori: KategoriBerita;
  gambarSampul: string;
  penulis: string;
  tanggalTerbit: string;       // ISO date
  tags: string[];
}

// types/persuratan.ts
export type StatusPengajuan =
  | 'diajukan'
  | 'diverifikasi'
  | 'diproses'
  | 'selesai'
  | 'ditolak';

export interface JenisSurat {
  kode: string;                // "SKD", "SKU", dst.
  nama: string;
  deskripsi: string;
  persyaratan: string[];
  estimasiHari: number;
  formFields: FormFieldConfig[]; // konfigurasi form dinamis
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'file' | 'number';
  required: boolean;
  options?: string[];          // untuk type "select"
}

export interface PengajuanSurat {
  id: string;
  nomorResi: string;
  jenisSuratKode: string;
  pemohonId: string;
  data: Record<string, string>;   // hasil isian formFields
  lampiran: LampiranFile[];
  status: StatusPengajuan;
  catatanAdmin?: string;
  riwayatStatus: RiwayatStatus[];
  dibuatPada: string;
  diperbaruiPada: string;
}

export interface RiwayatStatus {
  status: StatusPengajuan;
  catatan?: string;
  waktu: string;
}

export interface LampiranFile {
  nama: string;
  url: string;                 // mock: object URL / placeholder
  ukuran: number;
}

// types/pengaduan.ts
export type KategoriPengaduan = 'infrastruktur' | 'layanan' | 'lingkungan' | 'lainnya';
export type StatusPengaduan = 'diterima' | 'ditindaklanjuti' | 'selesai';

export interface Pengaduan {
  id: string;
  nomorTiket: string;
  kategori: KategoriPengaduan;
  judul: string;
  deskripsi: string;
  lokasi?: string;
  status: StatusPengaduan;
  tanggapanAdmin?: string;
  pelaporId: string;
  dibuatPada: string;
}

// types/user.ts
export type Role = 'warga' | 'admin' | 'super_admin';

export interface User {
  id: string;
  nama: string;
  email: string;
  nik?: string;
  role: Role;
  avatarUrl?: string;
}

// types/statistik.ts
export interface StatistikPenduduk {
  tahun: number;
  totalPenduduk: number;
  lakiLaki: number;
  perempuan: number;
  perDusun: { dusun: string; jumlah: number }[];
  perKelompokUsia: { rentang: string; jumlah: number }[];
  perPendidikan: { jenjang: string; jumlah: number }[];
}

export interface ApbdesItem {
  tahun: number;
  kategori: 'pendapatan' | 'belanja';
  subKategori: string;
  jumlah: number;
}

// types/umkm.ts
export interface Umkm {
  id: string;
  slug: string;
  namaUsaha: string;
  pemilik: string;
  kategori: string;
  deskripsi: string;
  foto: string[];
  kontak: string;
  alamat: string;
}
```

## 5. Lapisan Data & Mock Service

Setiap domain punya satu file service dengan bentuk fungsi async yang **identik** dengan yang akan dipakai saat backend nyata tersedia.

```typescript
// lib/services/persuratan.service.ts
import { mockJenisSurat, mockPengajuan } from '@/lib/mock/persuratan.mock';
import { delay } from '@/lib/utils/delay';

export async function getJenisSuratList(): Promise<JenisSurat[]> {
  await delay();
  return mockJenisSurat;
}

export async function getJenisSuratByKode(kode: string): Promise<JenisSurat | null> {
  await delay();
  return mockJenisSurat.find((j) => j.kode === kode) ?? null;
}

export async function submitPengajuan(
  payload: SubmitPengajuanInput
): Promise<PengajuanSurat> {
  await delay();
  // generate nomor resi, simpan ke "penyimpanan" mock (in-memory/localStorage)
  return createMockPengajuan(payload);
}

export async function getPengajuanByResi(
  nomorResi: string
): Promise<PengajuanSurat | null> {
  await delay();
  return mockPengajuan.find((p) => p.nomorResi === nomorResi) ?? null;
}

export async function getPengajuanByUser(userId: string): Promise<PengajuanSurat[]> {
  await delay();
  return mockPengajuan.filter((p) => p.pemohonId === userId);
}

// khusus admin
export async function updateStatusPengajuan(
  id: string,
  status: StatusPengajuan,
  catatan?: string
): Promise<PengajuanSurat> { /* ... */ }
```

**Ketentuan:**
- `delay()` mensimulasikan latency (default 400–800ms, dapat dikonfigurasi lewat `NEXT_PUBLIC_MOCK_DELAY_MS`).
- Mutasi (submit, update status) disimpan di memory + `localStorage` (lewat store Zustand dengan `persist`) agar terasa "hidup" antar reload selama development/demo.
- Setiap fungsi service harus punya kemungkinan mengembalikan error tersimulasi (mis. 5% kemungkinan gagal) agar komponen UI terlatih menangani error state — bisa diaktifkan lewat flag config, default off untuk demo yang mulus.

## 6. State Management (Zustand)

| Store | Isi | Persist? |
|---|---|---|
| `useAuthStore` | `user`, `isAuthenticated`, `login()`, `logout()`, `register()` | Ya (localStorage) |
| `useUiStore` | `theme` (light/dark), `sidebarOpen`, `locale` | Ya |
| `useNotificationStore` | daftar notifikasi in-app, `markAsRead()` | Ya |
| `usePengajuanDraftStore` *(opsional)* | draft form multi-step sebelum submit | Tidak wajib (bisa cukup RHF state) |

> Data hasil fetch (berita, statistik, dsb.) **tidak** disimpan permanen di Zustand — cukup di-cache lewat mekanisme Next.js (fetch cache/`use cache`) atau state lokal komponen. Zustand hanya untuk state UI/sesi lintas halaman.

## 7. Alur Status Pengajuan Surat (State Machine)

```
diajukan ──► diverifikasi ──► diproses ──► selesai
    │              │
    └──────────────┴───────────► ditolak
```

| Status | Makna | Aksi admin yang tersedia |
|---|---|---|
| `diajukan` | Baru masuk, belum dicek | Verifikasi → `diverifikasi`, atau Tolak → `ditolak` |
| `diverifikasi` | Data & lampiran sudah dicek valid | Proses → `diproses`, atau Tolak → `ditolak` |
| `diproses` | Surat sedang dibuat/ditandatangani | Selesaikan → `selesai` |
| `selesai` | Surat siap diunduh/diambil | — (final) |
| `ditolak` | Permohonan ditolak dengan catatan | — (final, warga bisa ajukan ulang) |

Setiap perubahan status wajib menambah entri baru ke `riwayatStatus` pada `PengajuanSurat`.

## 8. Desain & Design Token

### 8.1 Palet Warna (usulan tema "pemerintahan-hijau")
```css
@theme {
  --color-primary-50: #f0fdf4;
  --color-primary-500: #16a34a;   /* hijau — identitas desa/alam */
  --color-primary-700: #15803d;
  --color-secondary-500: #2563eb; /* biru — aksen resmi/pemerintahan */
  --color-accent-500: #f59e0b;    /* kuning/oranye — CTA & status "diproses" */
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;
  --font-sans: "Plus Jakarta Sans", "Inter", system-ui, sans-serif;
}
```
- Gunakan skala warna status: `diajukan` = abu/biru muda, `diverifikasi` = biru, `diproses` = kuning, `selesai` = hijau, `ditolak` = merah.
- Dark mode: strategi `class` (`darkMode: 'class'` setara di Tailwind v4 lewat `@custom-variant dark`), toggle disimpan di `useUiStore`.

### 8.2 Tipografi & Spacing
- Skala tipografi Tailwind default (`text-sm` s.d. `text-4xl`) cukup; heading halaman publik pakai `text-3xl md:text-4xl font-bold`.
- Spacing konsisten kelipatan 4px (default Tailwind).

### 8.3 Komponen UI Dasar (`components/ui/`)
`Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `FileUpload`, `Card`, `Badge` (untuk status), `Table`, `Pagination`, `Modal/Dialog`, `Tabs`, `Breadcrumb`, `Toast/Notification`, `Skeleton`, `EmptyState`.

## 9. Kontrak API Masa Depan (acuan integrasi Fase 2)

Didokumentasikan sekarang agar service layer mock mudah diganti tanpa mengubah tanda tangan fungsi.

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/auth/login` | POST | Login warga/admin |
| `/api/auth/register` | POST | Registrasi warga |
| `/api/auth/me` | GET | Data sesi aktif |
| `/api/berita` | GET | List berita (query: kategori, search, page) |
| `/api/berita/:slug` | GET | Detail berita |
| `/api/layanan` | GET | List jenis surat |
| `/api/layanan/:kode` | GET | Detail jenis surat |
| `/api/pengajuan` | POST | Submit pengajuan surat |
| `/api/pengajuan/:nomorResi` | GET | Lacak pengajuan |
| `/api/pengajuan?userId=` | GET | Riwayat pengajuan warga |
| `/api/pengajuan/:id/status` | PATCH | (admin) ubah status |
| `/api/pengaduan` | POST/GET | Kirim & lacak pengaduan |
| `/api/statistik/penduduk` | GET | Data statistik kependudukan |
| `/api/apbdes` | GET | Data transparansi anggaran |
| `/api/galeri` | GET | Album & foto kegiatan |
| `/api/umkm` | GET | Direktori UMKM |

Setiap fungsi di `lib/services/*.ts` disusun agar tinggal mengganti isi (dari membaca mock menjadi `fetch(...)`) tanpa mengubah signature yang dipakai komponen.

## 10. SEO & Metadata

- Gunakan Next.js Metadata API (`generateMetadata`) di setiap route publik.
- `sitemap.ts` & `robots.ts` dinamis mencakup halaman berita & layanan.
- Open Graph image per berita (fallback ke gambar default desa).
- JSON-LD `NewsArticle` untuk halaman detail berita, `GovernmentOrganization` untuk beranda.

## 11. Aksesibilitas

- Semua elemen interaktif dapat dicapai via `Tab`, urutan fokus logis.
- Form wajib punya `<label htmlFor>` yang terhubung ke input.
- Kontras warna minimal rasio 4.5:1 untuk teks normal.
- Gambar informatif wajib `alt`; gambar dekoratif `alt=""`.
- Status pengajuan tidak hanya diwakili warna, tapi juga label teks & ikon (agar tidak bergantung warna saja — penting untuk pengguna buta warna).

## 12. Internasionalisasi (i18n)

- Struktur folder `messages/id.json` & `messages/en.json` sejak awal (default `id`).
- Gunakan library ringan (`next-intl` atau setara) — pastikan kompatibel dengan App Router terbaru.
- Semua string UI melalui fungsi terjemahan, tidak hardcode teks di komponen.

## 13. Struktur Direktori Lengkap (detail dari AGENTS.md §4)

```
app/
  (public)/...
  (dashboard)/...
  sitemap.ts
  robots.ts
  layout.tsx
  globals.css
components/
  ui/
  layout/
  features/
    beranda/
    profil/
    informasi/
    berita/
    layanan/
    pengaduan/
    galeri/
    umkm/
    dashboard/
lib/
  services/
    auth.service.ts
    berita.service.ts
    persuratan.service.ts
    pengaduan.service.ts
    statistik.service.ts
    galeri.service.ts
    umkm.service.ts
  mock/
  validations/
  utils/
store/
  authStore.ts
  uiStore.ts
  notificationStore.ts
types/
messages/
  id.json
  en.json
middleware.ts
```

## 14. Testing Plan

| Jenis | Cakupan prioritas |
|---|---|
| Unit | Schema Zod, util (format tanggal, generator nomor resi), reducer/state store |
| Komponen | Form pengajuan surat, komponen status Badge, filter berita |
| E2E (opsional) | Alur: registrasi → login → ajukan surat → lacak status; alur admin: login → ubah status pengajuan |

## 15. Deployment

- Rekomendasi: Vercel (mendukung penuh fitur Next.js 16 termasuk PPR & Cache Components).
- Environment variables mengikuti `.env.example` di `AGENTS.md §10`.
- Build check wajib lulus sebelum deploy: `next build`, `tsc --noEmit`, lint.