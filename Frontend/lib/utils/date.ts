/**
 * Shared, single source of truth for "current year" + the selectable tahun list.
 *
 * Keeping this here (instead of hardcoding `2026` in every page) keeps the
 * public & admin surfaces in sync with the backend, which resolves the
 * "current year" via `time.Now().Year()` when no explicit `tahun` is given.
 *
 * All consumers are `'use client'` components, so `new Date()` reflects the
 * browser clock — which is exactly what the year filter dropdown should offer.
 */

/** Tahun saat ini (mirror backend `time.Now().Year()`). */
export const getCurrentYear = (): number => new Date().getFullYear();

/**
 * Daftar tahun yang bisa dipilih, terbaru dulu (current year → N tahun sebelumnya).
 * Panjang default (5) mencerminkan kedalaman riwayat yang ditampilkan di toolbar
 * filter publik: [currentYear, currentYear-1, ..., currentYear-4].
 */
export const getTahunOptions = (count: number = 5): number[] =>
  Array.from({ length: count }, (_, i) => getCurrentYear() - i);
