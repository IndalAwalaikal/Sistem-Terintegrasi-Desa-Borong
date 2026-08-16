import { describe, it, expect } from 'vitest';
import {
  formatAngka,
  formatRupiah,
  formatTanggal,
  generateNomorResi,
  generateNomorTiket,
  estimasiWaktuBaca,
  truncateText,
  formatFileSize,
  slugify,
} from '@/lib/utils/format';

describe('format utils', () => {
  it('formatAngka memakai pemisah ribuan Indonesia', () => {
    expect(formatAngka(1500000)).toBe('1.500.000');
    expect(formatAngka(1234)).toBe('1.234');
  });

    it('formatRupiah memformat mata uang IDR', () => {
    const result = formatRupiah(50000);
    // Intl.NumberFormat('id-ID') memakai separator non-breaking space (U+00A0)
    // antara simbol Rupiah dan angka — jadilah tidak sensitif terhadap spasi.
    expect(result).toContain('Rp');
    expect(result).toContain('50.000');
  });

  it('formatTanggal memakai bahasa Indonesia', () => {
    // 15 Agustus 2026
    const out = formatTanggal('2026-08-15T08:30:00Z');
    expect(out).toContain('15 Agustus 2026');
  });

  it('formatTanggal dengan withTime menyertakan jam:menit', () => {
    const out = formatTanggal('2026-08-15T08:30:00Z', { withTime: true });
    expect(out).toMatch(/15 Agustus 2026, \d{2}:\d{2}/);
  });

  it('generateNomorResi mengikuti pola KODE-YYMM-####', () => {
    expect(generateNomorResi('SKU')).toMatch(/^SKU-\d{2}\d{2}-\d{4}$/);
  });

  it('generateNomorTiket menggunakan prefix ADU', () => {
    expect(generateNomorTiket()).toMatch(/^ADU-\d{2}\d{2}-\d{4}$/);
  });

  it('estimasiWaktuBaca memproyeksikan 200 kata/menit', () => {
    const text = Array.from({ length: 450 }, () => 'kata').join(' ');
    expect(estimasiWaktuBaca(text)).toBe('3 menit baca');
  });

  it('truncateText memotong dan menambahkan ellipsis', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
    expect(truncateText('Short', 10)).toBe('Short');
  });

  it('formatFileSize memformat byte', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(2048)).toBe('2 KB');
  });

  it('slugify mengubah spasi ke hyphen dan lowercase', () => {
    expect(slugify('Surat Keterangan Domisili!')).toBe('surat-keterangan-domisili');
    expect(slugify('  Banyak __ Spasi  ')).toBe('banyak-spasi');
  });
});
