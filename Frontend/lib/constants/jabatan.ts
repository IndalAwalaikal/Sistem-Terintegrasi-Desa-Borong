/**
 * Daftar baku jabatan perangkat desa dan urutan prioritasnya.
 *
 * Satu sumber yang sama dipakai oleh:
 *  - Form admin (dropdown pilihan jabatan) di dashboard/perangkat
 *  - Bagan Struktur Organisasi publik (penyusunan tier sesuai urutan ini)
 *
 * Urutan di sini menentukan "jabatan paling penting" → terakhir,
 * menyesuaikan struktur pemerintahan desa (UU Desa / PP Penataan):
 *  Pimpinan → Sekretariat (Sekdes & Kaur) → Kasi → Kewilayahan → Pendukung.
 */

export interface JabatanGroup {
  group: string;
  items: string[];
}

export const JABATAN_OPTIONS: JabatanGroup[] = [
  {
    group: "Pimpinan Desa",
    items: ["Kepala Desa"],
  },
  {
    group: "Sekretariat (Kaur)",
    items: [
      "Sekretaris Desa",
      "Kepala Urusan Tata Usaha dan Umum",
      "Kaur Tata Usaha dan Umum",
      "Kepala Urusan Keuangan",
      "Kaur Keuangan",
      "Kepala Urusan Perencanaan",
      "Kaur Perencanaan",
      "Staf Sekretariat",
      "Operator Sistem Informasi Desa",
    ],
  },
  {
    group: "Kepala Seksi / Kasi",
    items: [
      "Kepala Seksi Pemerintahan",
      "Kasi Pemerintahan",
      "Kepala Seksi Kesejahteraan",
      "Kasi Kesejahteraan",
      "Kepala Seksi Pelayanan",
      "Kasi Pelayanan",
      "Kepala Seksi Ekonomi dan Pembangunan",
      "Kasi Ekonomi dan Pembangunan",
    ],
  },
  {
    group: "Kewilayahan (Kepala Dusun)",
    items: [
      "Kepala Dusun",
      "Kepala Dusun I",
      "Kepala Dusun II",
      "Kepala Dusun III",
      "Kepala Dusun IV",
    ],
  },
  {
    group: "Unsur Pendukung Lainnya",
    items: ["Bendahara Desa", "Staf", "Pengelola Keuangan", "Pegawai Kantor Desa"],
  },
];

/** Semua nilai jabatan yang valid, terurut sesuai prioritas kepentingan. */
export const JABATAN_VALUES: string[] = JABATAN_OPTIONS.flatMap((group) => group.items);

/**
 * Ranking prioritas jabatan — semakin kecil angkanya, semakin penting.
 * Jabatan yang tidak dikenal diberi nilai maksimal (paling belakang).
 */
export function jabatanRank(jabatan: string): number {
  const idx = JABATAN_VALUES.indexOf(jabatan.trim());
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

/** Pembanding dua jabatan untuk pengurutan (prioritas dulu, lalu alfabet). */
export function compareJabatan(a: string, b: string): number {
  return jabatanRank(a) - jabatanRank(b) || a.localeCompare(b);
}