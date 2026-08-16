/**
 * Format tanggal dalam bahasa Indonesia.
 */
export function formatTanggal(
  dateStr: string,
  options?: { withTime?: boolean },
): string {
  const date = new Date(dateStr);
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const hari = date.getDate();
  const bln = bulan[date.getMonth()];
  const tahun = date.getFullYear();

  if (options?.withTime) {
    const jam = date.getHours().toString().padStart(2, "0");
    const menit = date.getMinutes().toString().padStart(2, "0");
    return `${hari} ${bln} ${tahun}, ${jam}:${menit}`;
  }

  return `${hari} ${bln} ${tahun}`;
}

export const formatDate = formatTanggal;

/**
 * Format tanggal relatif (misal "3 hari lalu").
 */
export function formatTanggalRelatif(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMenit = Math.floor(diffMs / (1000 * 60));
  const diffJam = Math.floor(diffMs / (1000 * 60 * 60));
  const diffHari = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMenit < 1) return "Baru saja";
  if (diffMenit < 60) return `${diffMenit} menit lalu`;
  if (diffJam < 24) return `${diffJam} jam lalu`;
  if (diffHari < 7) return `${diffHari} hari lalu`;
  if (diffHari < 30) return `${Math.floor(diffHari / 7)} minggu lalu`;
  return formatTanggal(dateStr);
}

/**
 * Format mata uang Rupiah.
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka dengan pemisah ribuan.
 */
export function formatAngka(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Generate nomor resi pengajuan.
 */
export function generateNomorResi(kode: string): string {
  const now = new Date();
  const tahun = now.getFullYear().toString().slice(-2);
  const bulan = (now.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${kode}-${tahun}${bulan}-${random}`;
}

/**
 * Generate nomor tiket pengaduan.
 */
export function generateNomorTiket(): string {
  const now = new Date();
  const tahun = now.getFullYear().toString().slice(-2);
  const bulan = (now.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ADU-${tahun}${bulan}-${random}`;
}

/**
 * Estimasi waktu baca berdasarkan jumlah kata.
 */
export function estimasiWaktuBaca(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} menit baca`;
}

/**
 * Truncate teks dengan ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Format ukuran file.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Slugify string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
