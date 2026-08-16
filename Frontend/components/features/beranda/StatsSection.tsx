'use client';

import React from 'react';
import { Users, Home, MapPin, FileCheck2 } from 'lucide-react';
import { formatAngka } from '@/lib/utils/format';
import type { StatistikPenduduk } from '@/types/statistik';
import type { ProfilDesa } from '@/types/desa';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface StatsSectionProps {
  statistik: StatistikPenduduk;
  profil: ProfilDesa;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ statistik, profil }) => {
  const { t } = useTranslation();

  const stats = [
    {
      label: t('Home.statsTotalPenduduk'),
      value: formatAngka(statistik.totalPenduduk),
      unit: t('Home.statsJiwa'),
      icon: Users,
      color: 'from-emerald-500 to-primary-600',
      description: `${formatAngka(statistik.lakiLaki)} ${t('Home.statsLaki')} • ${formatAngka(statistik.perempuan)} ${t('Home.statsPerempuan')}`,
    },
    {
      label: t('Home.statsKepalaKeluarga'),
      value: formatAngka(statistik.jumlahKK),
      unit: t('Home.statsKK'),
      icon: Home,
      color: 'from-blue-500 to-secondary-600',
      description: t('Home.statsDescDusun'),
    },
    {
      label: t('Home.statsWilayah'),
      value: String(profil.jumlahDusun),
      unit: t('Home.statsDusun'),
      icon: MapPin,
      color: 'from-amber-500 to-accent-600',
      description: `${profil.jumlahRW} RW • ${profil.jumlahRT} RT • ${t('Home.statsLuas')} ${profil.luasWilayah}`,
    },
    {
      label: t('Home.statsLayanan'),
      value: '12',
      unit: t('Home.statsJenisSurat'),
      icon: FileCheck2,
      color: 'from-indigo-500 to-purple-600',
      description: t('Home.statsDescOnline'),
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      <div className="container-desa">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold mb-3">
            <span>{t('Home.statsBadge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            {t('Home.statsTitle')}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            {t('Home.statsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.color}`}
              />

              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {stat.unit}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                  {stat.label}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
