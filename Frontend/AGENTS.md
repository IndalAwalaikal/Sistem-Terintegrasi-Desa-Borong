# AGENTS.md
## Panduan Kerja untuk AI Coding Agent — Website Desa Digital

Dokumen ini adalah instruksi operasional bagi AI agent (Claude Code, Cursor, dsb.) yang mengerjakan implementasi proyek ini. Baca bersama `PRD.md` (kebutuhan produk) dan `SPEC.md` (spesifikasi teknis) sebelum mulai bekerja.

---

## 1. Ringkasan Proyek

Frontend website desa berbasis **Next.js App Router**, dengan mock data (belum ada backend). Tujuan agent: menghasilkan kode production-grade, terstruktur, dan **mudah diintegrasikan ke backend nyata nanti** tanpa refactor besar.

## 2. Tech Stack Wajib

| Layer | Teknologi | Catatan |
|---|---|---|
| Framework | Next.js 16.x (App Router) | Turbopack sebagai dev bundler default; `params`/`searchParams` bertipe `Promise` (wajib `await`) |
| Bahasa | TypeScript 5.x (strict mode) | `strict: true`, no implicit any |
| UI Runtime | React 19.x | Server Components sebagai default, gunakan `"use client"` hanya bila perlu interaktivitas |
| Styling | Tailwind CSS v4.x | Konfigurasi CSS-first via `@theme` di `globals.css`, hindari `tailwind.config.js` kecuali benar-benar perlu plugin JS |
| State Management | Zustand v5.x | Hanya untuk state client (auth session, UI, filter) — bukan pengganti data fetching |
| Validasi Form | Zod + React Hook Form | Setiap form wajib punya schema Zod |
| Ikon | lucide-react | Konsisten satu library ikon |
| Package Manager | pnpm (disarankan) | Boleh npm/yarn bila proyek sudah menetapkannya |

Jangan menambahkan library besar (state manager lain, UI kit berat) tanpa alasan kuat — proyek ini mengutamakan bundle kecil dan performa.

## 3. Prinsip Kerja Agent

1. **Mock data harus terlihat nyata.** Gunakan data Indonesia yang masuk akal (nama, alamat, NIK format valid tapi fiktif, tanggal realistis). Hindari `"Lorem Ipsum"` atau `"Test 123"`.
2. **Isolasi lapisan data.** Semua akses data HARUS lewat `/lib/services/*`, tidak pernah import file mock langsung dari komponen UI. Ini adalah aturan paling penting di proyek ini — lihat `SPEC.md §Lapisan Data & Mock Service`.
3. **Server Component by default.** Gunakan `"use client"` hanya pada komponen yang benar-benar butuh interaktivitas (form, state lokal, event handler, hooks browser).
4. **Async params/searchParams.** Next.js 16 mewajibkan `params` dan `searchParams` di-`await` sebelum dipakai — jangan menulis kode dengan asumsi versi lama (objek biasa).
5. **Aksesibilitas bukan opsional.** Setiap komponen interaktif wajib label/aria yang benar, kontras warna cukup, dan dapat dioperasikan lewat keyboard.
6. **Konsistensi desain.** Ikuti design token di `SPEC.md` (warna, spacing, tipografi). Jangan menambah warna/ukuran ad-hoc di luar token.
7. **Selesaikan satu modul secara utuh** sebelum pindah ke modul lain (halaman + komponen + service mock + state terkait), sesuai gaya kerja "deliverable lengkap dan mandiri".
8. **Jangan berasumsi ada backend.** Semua "pemanggilan API" tetap lewat fungsi service yang mensimulasikan `Promise` + delay + kemungkinan error, agar transisi ke backend asli semulus mungkin.

## 4. Struktur Direktori (acuan)

```
app/
  (public)/
    page.tsx                     # Beranda
    profil/...
    informasi/...
    berita/...
    layanan/...
    pengaduan/...
    galeri/...
    umkm/...
    login/page.tsx
    register/page.tsx
  (dashboard)/
    dashboard/
      page.tsx
      berita/...
      pengajuan/...
      pengaduan/...
      galeri/...
      statistik/...
      umkm/...
      pengguna/...
      pengaturan/...
  api/                            # (opsional) route handler khusus kebutuhan client-only, bukan backend asli
  layout.tsx
  globals.css
components/
  ui/                             # komponen dasar (Button, Card, Input, Badge, Table, Modal, dst.)
  layout/                         # Navbar, Footer, SidebarAdmin, Breadcrumb
  features/                       # komponen spesifik per modul (berita/, layanan/, dashboard/, dst.)
lib/
  services/                       # lapisan abstraksi data (satu file per domain)
  mock/                           # data mock mentah (JSON/TS)
  validations/                    # schema Zod
  utils/
store/                            # Zustand stores
types/                            # TypeScript types/interfaces domain
proxy.ts                          # guard route berbasis role (pengganti middleware.ts di Next 16)
```

## 5. Konvensi Kode

- **Penamaan file**: `kebab-case` untuk file/folder, `PascalCase` untuk komponen React, `camelCase` untuk fungsi/variable.
- **Komponen**: satu komponen per file, default export untuk komponen halaman, named export untuk komponen reusable.
- **Import absolut**: gunakan alias `@/*` (bukan relative path panjang `../../../`).
- **Commit message**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- **Tidak ada `any`** kecuali dengan komentar justifikasi.
- **Error & loading state wajib** di setiap halaman yang memuat data async (`loading.tsx`, `error.tsx`, atau state lokal setara).

## 6. Checklist "Definition of Done" per Modul/Halaman

- [ ] Data diakses lewat service layer, bukan import mock langsung.
- [ ] Loading state & error state tertangani.
- [ ] Responsif di breakpoint mobile, tablet, desktop.
- [ ] Dark mode berfungsi.
- [ ] Aksesibilitas dasar (label, alt text, fokus keyboard) terpenuhi.
- [ ] Metadata SEO (title, description) diisi untuk halaman publik.
- [ ] Validasi form (jika ada) memakai Zod + pesan error berbahasa Indonesia yang jelas.
- [ ] Tidak ada console error/warning di dev mode.

## 7. Yang Boleh Diasumsikan Agent

- Boleh menambah fitur kecil yang menambah nilai (empty state yang baik, skeleton loading, micro-interaction) tanpa perlu konfirmasi ulang.
- Boleh menambah util/helper baru sesuai kebutuhan, selama konsisten dengan struktur di §4.

## 8. Yang TIDAK Boleh Dilakukan Agent Tanpa Konfirmasi

- Mengganti stack inti (Next.js, TypeScript, Tailwind, Zustand) dengan alternatif lain.
- Menghapus/mengubah struktur lapisan service (`/lib/services`) menjadi akses data langsung dari komponen.
- Menambahkan dependensi besar (>50KB gzipped) tanpa menjelaskan alasannya.
- Membuat autentikasi yang menyimpan password mock dalam bentuk plain text yang terlihat "nyata" (gunakan penanda jelas bahwa ini mock, misal komentar `// MOCK AUTH — ganti dengan API asli di fase 2`).

## 9. Pengujian

- Unit test komponen kritikal (form persuratan, state machine status) dengan Vitest + React Testing Library.
- Tidak wajib coverage 100%, prioritaskan alur inti: pengajuan surat, login/register, filter/pencarian.
- E2E (Playwright) opsional untuk happy path utama jika waktu memungkinkan.

## 10. Environment Variables (placeholder untuk fase backend)

Buat `.env.example` sejak awal walau belum dipakai, agar fase integrasi backend tinggal isi nilai:

```
NEXT_PUBLIC_APP_NAME="Website Desa Digital"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=            # diisi saat backend siap
NEXT_PUBLIC_MOCK_DELAY_MS=500        # simulasi latency service mock
```

## 11. Referensi Silang

- Kebutuhan fitur & prioritas → `PRD.md`
- Struktur route lengkap, model data, kontrak API masa depan, state machine, design token → `SPEC.md`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
