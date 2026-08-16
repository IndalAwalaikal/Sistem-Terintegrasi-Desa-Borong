'use client';

import React from 'react';
import { Megaphone, Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

export const InfoTicker: React.FC = () => {
  const { t } = useTranslation();

  const announcements = [
    t('Home.ticker1'),
    t('Home.ticker2'),
    t('Home.ticker3'),
    t('Home.ticker4'),
  ];

  return (
    <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-secondary-800 text-white py-3 px-4 shadow-md">
      <div className="container-desa flex items-center gap-4">
        <div className="flex items-center gap-2 bg-accent-500 text-neutral-950 px-3 py-1 rounded-lg text-xs font-extrabold uppercase shrink-0 shadow">
          <Megaphone className="w-4 h-4 animate-bounce" />
          <span>{t('Home.tickerBadge')}</span>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden font-medium text-xs sm:text-sm" aria-label={t('Home.tickerBadge')}>
          <div className="ticker-track">
            {[0, 1].map((group) => (
              <div className="ticker-group" key={group} aria-hidden={group === 1}>
                {announcements.map((text, index) => (
                  <span key={`${group}-${index}`} className="ticker-item">
                    <Bell className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/berita"
          className="hidden md:flex items-center gap-1 border-l border-white/15 pl-4 text-xs font-bold text-accent-400 hover:text-white transition-colors shrink-0"
        >
          {t('Home.tickerSeeAll')}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
