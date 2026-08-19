'use client';

import React from 'react';
import { Users, Home, MapPin, FileCheck2 } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
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
      numericValue: statistik.totalPenduduk,
      suffix: '',
      unit: t('Home.statsJiwa'),
      icon: Users,
      color: 'from-primary-400 to-primary-600',
      glow: 'shadow-primary-400/20',
      description: `${statistik.lakiLaki.toLocaleString('id-ID')} ${t('Home.statsLaki')} • ${statistik.perempuan.toLocaleString('id-ID')} ${t('Home.statsPerempuan')}`,
    },
    {
      label: t('Home.statsKepalaKeluarga'),
      numericValue: statistik.jumlahKK,
      suffix: '',
      unit: t('Home.statsKK'),
      icon: Home,
      color: 'from-blue-500 to-secondary-600',
      glow: 'shadow-blue-500/20',
      description: t('Home.statsDescDusun'),
    },
    {
      label: t('Home.statsWilayah'),
      numericValue: profil.jumlahDusun,
      suffix: '',
      unit: t('Home.statsDusun'),
      icon: MapPin,
      color: 'from-primary-500 to-primary-600',
      glow: 'shadow-primary-500/20',
      description: `${profil.jumlahRW} RW • ${profil.jumlahRT} RT • ${t('Home.statsLuas')} ${profil.luasWilayah}`,
    },
    {
      label: t('Home.statsLayanan'),
      numericValue: 50,
      suffix: '+',
      unit: t('Home.statsJenisSurat'),
      icon: FileCheck2,
      color: 'from-secondary-500 to-secondary-700',
      glow: 'shadow-secondary-500/20',
      description: t('Home.statsDescOnline'),
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-neutral-950 render-optimized">
      <div className="container-desa">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold dark:bg-primary-950 dark:text-primary-300 mb-3">
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
              className={`relative p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:shadow-2xl hover:shadow-neutral-900/10 hover:-translate-y-2 transition-all duration-500 group overflow-hidden ${stat.glow}`}
            >
              {/* Top gradient accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.color}`}
              />

              {/* Subtle radial glow behind icon */}
              <div
                className={`absolute -top-6 -right-6 w-28 h-28 rounded-full bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {stat.unit}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight flex items-end gap-0.5">
                  <AnimatedCounter
                    value={stat.numericValue}
                    duration={2000}
                    delay={idx * 100}
                  />
                  {stat.suffix && (
                    <span className="text-xl font-extrabold text-neutral-400 dark:text-neutral-500 mb-0.5">
                      {stat.suffix}
                    </span>
                  )}
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
