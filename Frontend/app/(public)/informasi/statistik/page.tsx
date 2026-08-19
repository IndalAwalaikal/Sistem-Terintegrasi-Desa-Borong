'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getStatistikPenduduk, getTrenPenduduk } from '@/lib/services/statistik.service';
import type { StatistikPenduduk, TrenPenduduk } from '@/types/statistik';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Select } from '@/components/ui/Select';
import { Reveal, CountUp } from '@/components/ui';
import { Filter, RotateCcw, CheckCircle2 } from 'lucide-react';
import { formatAngka } from '@/lib/utils/format';
import { getCurrentYear, getTahunOptions } from '@/lib/utils/date';
import { PublicMasthead } from '@/components/layout/PublicMasthead';
import { useTranslation } from '@/lib/i18n/useTranslation';

const TAHUN_OPTIONS = getTahunOptions();

// Lazy-load recharts charts
const StatistikCharts = dynamic(
  () =>
    import('@/components/features/informasi/StatistikCharts').then(
      (mod) => mod.StatistikCharts,
    ),
  {
    ssr: false,
    loading: () => (
      <Skeleton variant="rectangular" className="h-72 w-full rounded-2xl" />
    ),
  },
);

export default function StatistikPage() {
  const [baseData, setBaseData] = useState<StatistikPenduduk | null>(null);
  const [tren, setTren] = useState<TrenPenduduk | null>(null);
  const [selectedTahun, setSelectedTahun] = useState<number>(getCurrentYear());
  const [dusun, setDusun] = useState('semua');
  const [, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    getStatistikPenduduk(selectedTahun)
      .then((res) => {
        setBaseData(res);
      })
      .finally(() => setLoading(false));
    getTrenPenduduk(selectedTahun)
      .then(setTren)
      .catch(() => setTren(null));
  }, [selectedTahun]);

  const resetFilters = () => {
    setSelectedTahun(getCurrentYear());
    setDusun('semua');
  };

    if (!baseData) {
    return (
      <div className="py-16 sm:py-20">
        <div className="container-desa space-y-8">
          <Skeleton variant="rectangular" className="h-12 w-48 rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton variant="rectangular" className="h-28 w-full rounded-2xl" />
            <Skeleton variant="rectangular" className="h-28 w-full rounded-2xl" />
            <Skeleton variant="rectangular" className="h-28 w-full rounded-2xl" />
            <Skeleton variant="rectangular" className="h-28 w-full rounded-2xl" />
          </div>
          <Skeleton variant="rectangular" className="h-72 w-full rounded-2xl" />
          <Skeleton variant="rectangular" className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // Determine summary numbers dynamically from baseData (and filtered Dusun if selected)
  let totalPenduduk = baseData.totalPenduduk || 0;
  let lakiLaki = baseData.lakiLaki || 0;
  let perempuan = baseData.perempuan || 0;
  let jumlahKK = baseData.jumlahKK || 0;
  let perDusunList = baseData.perDusun || [];

  if (dusun !== 'semua' && baseData.rincianDusun) {
    const selectedDusun = baseData.rincianDusun.find((item) => item.dusun === dusun);
    if (selectedDusun) {
      lakiLaki = selectedDusun.lakiLaki;
      perempuan = selectedDusun.perempuan;
      totalPenduduk = selectedDusun.lakiLaki + selectedDusun.perempuan;
      jumlahKK = selectedDusun.kepalaKeluarga;
      perDusunList = [{ dusun: selectedDusun.dusun, jumlah: totalPenduduk }];
    }
  }

  const displayData: StatistikPenduduk = {
    ...baseData,
    tahun: selectedTahun,
    totalPenduduk,
    lakiLaki,
    perempuan,
    jumlahKK,
    perDusun: perDusunList,
  };

  const rincian =
    displayData.rincianDusun?.filter(
      (item) => dusun === 'semua' || item.dusun === dusun,
    ) ?? [];

  const pctLaki = totalPenduduk > 0 ? ((lakiLaki / totalPenduduk) * 100).toFixed(1) : '0';
  const pctPerempuan = totalPenduduk > 0 ? ((perempuan / totalPenduduk) * 100).toFixed(1) : '0';

  const activeFiltersCount =
    (selectedTahun !== getCurrentYear() ? 1 : 0) +
    (dusun !== 'semua' ? 1 : 0);

  return (
    <div className="py-8 sm:py-12 bg-[#f5f8fc] dark:bg-neutral-950">
      <div className="container-desa space-y-8 sm:space-y-10">
        <PublicMasthead
          eyebrow={t('Statistik.mastheadEyebrow')}
          title={t('Statistik.mastheadTitle')}
          description={`${t('Statistik.mastheadDesc1')} ${selectedTahun}${t('Statistik.mastheadDesc2')}`}
          image="https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1800&q=85"
        />

        {/* Filter Toolbar Section */}
        <Card className="p-5 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 flex items-center justify-center font-bold">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                  Filter Data Statistik Demografi
                </h3>
                                                <p className="text-[11px] text-neutral-500">Pilih Tahun dan Wilayah Dusun.</p>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline bg-rose-50 dark:bg-rose-950/50 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filter ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            {/* Filter Tahun */}
            <Select
              label="Pilih Tahun:"
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(Number(e.target.value))}
              options={TAHUN_OPTIONS.map((th) => ({ value: String(th), label: `Tahun ${th}` }))}
              className="px-3 py-2 text-xs font-bold"
            />

            {/* Filter Dusun */}
            <Select
              label="Pilih Wilayah Dusun:"
              value={dusun}
              onChange={(e) => setDusun(e.target.value)}
              options={[
                { value: 'semua', label: 'Semua Dusun' },
                ...(displayData.rincianDusun?.map((item) => ({ value: item.dusun, label: item.dusun })) ?? []),
              ]}
              className="px-3 py-2 text-xs font-bold"
            />
          </div>

          {/* Active Filter Summary Pill */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400">
            <span className="font-bold flex items-center gap-1 text-primary-600 dark:text-primary-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Periode Dilihat:
            </span>
            <span className="bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full font-semibold">
              Tahun: {selectedTahun}
            </span>
            <span className="bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full font-semibold">
              Dusun: {dusun}
            </span>
          </div>
        </Card>

                {/* Counter Summary — animasi berjenjang via Reveal + CountUp angka */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('Statistik.totalPenduduk'), color: 'text-primary-600 dark:text-primary-400', num: displayData.totalPenduduk, suffix: <>{t('Statistik.jiwa')}</> },
            { label: t('Statistik.kepalaKeluarga'), color: 'text-secondary-600 dark:text-secondary-400', num: displayData.jumlahKK, suffix: <>{t('Statistik.kk')}</> },
            { label: t('Statistik.lakiLaki'), color: 'text-emerald-600 dark:text-emerald-400', num: displayData.lakiLaki, suffix: <>{t('Statistik.jiwa')} ({pctLaki}%)</> },
            { label: t('Statistik.perempuan'), color: 'text-rose-600 dark:text-rose-400', num: displayData.perempuan, suffix: <>{t('Statistik.jiwa')} ({pctPerempuan}%)</> },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 120}>
              <Card className="p-5 text-center">
                <p className="text-xs text-neutral-400 font-bold uppercase">{c.label}</p>
                <h3 className={`text-2xl font-black mt-1 ${c.color}`}>
                  <CountUp to={c.num} formatter={(n) => formatAngka(Math.round(n))} />
                </h3>
                <p className="text-[11px] text-neutral-500">{c.suffix}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Charts (recharts — lazy-loaded via dynamic()) */}
        <StatistikCharts data={displayData} tren={tren ?? undefined} />

        {/* Rincian per Dusun — tabel */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white">
                {t('Statistik.rincianPerDusun')}
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                {t('Statistik.rincianDesc').replace('{tahun}', String(displayData.tahun))}
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-300">
              <Filter className="h-4 w-4 text-primary-600" />
              <select
                value={dusun}
                onChange={(event) => setDusun(event.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <option value="semua">{t('Statistik.semuaDusun')}</option>
                {displayData.rincianDusun?.map((item) => (
                  <option key={item.dusun} value={item.dusun}>
                    {item.dusun}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="border-y border-neutral-100 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                <tr>
                  <th className="p-3">{t('Statistik.thDusun')}</th>
                  <th className="p-3">{t('Statistik.thLaki')}</th>
                  <th className="p-3">{t('Statistik.thPerempuan')}</th>
                  <th className="p-3">{t('Statistik.thKK')}</th>
                  <th className="p-3">{t('Statistik.thLahir')}</th>
                  <th className="p-3">{t('Statistik.thMeninggal')}</th>
                  <th className="p-3">{t('Statistik.thMasukKeluar')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {rincian.map((item) => (
                  <tr key={item.dusun}>
                    <td className="p-3 font-bold text-neutral-800 dark:text-white">{item.dusun}</td>
                    <td className="p-3">{formatAngka(item.lakiLaki)}</td>
                    <td className="p-3">{formatAngka(item.perempuan)}</td>
                    <td className="p-3">{formatAngka(item.kepalaKeluarga)}</td>
                    <td className="p-3 text-emerald-600">{item.kelahiran}</td>
                    <td className="p-3 text-rose-600">{item.kematian}</td>
                    <td className="p-3">{item.pindahMasuk} / {item.pindahKeluar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
