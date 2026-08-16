'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Eye } from 'lucide-react';
import { formatTanggal, estimasiWaktuBaca } from '@/lib/utils/format';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Berita } from '@/types/berita';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface LatestNewsSectionProps {
  news: Berita[];
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ news }) => {
  const { t } = useTranslation();
  const featured = news[0];
  const recent = news.slice(1, 4);

  if (!featured) return null;

  const getKategoriVariant = (kat: string) => {
    switch (kat) {
      case 'pengumuman':
        return 'warning';
      case 'kegiatan':
        return 'primary';
      case 'pembangunan':
        return 'secondary';
      default:
        return 'neutral';
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <div className="container-desa">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold mb-3">
              <span>{t('Home.newsBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              {t('Home.newsTitle')}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {t('Home.newsSubtitle')}
            </p>
          </div>

          <Link href="/berita">
            <button className="flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:gap-3 transition-all">
              {t('Home.newsSeeAll')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured Main News Card */}
          <div className="lg:col-span-7">
            <Card hoverable className="h-full flex flex-col group">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <Image
                  src={featured.gambarSampul || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'}
                  alt={featured.judul}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant={getKategoriVariant(featured.kategori)} size="md">
                    {featured.kategori.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary-500" />
                      {formatTanggal(featured.tanggalTerbit)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-primary-500" />
                      {featured.penulis}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-primary-500" />
                      {featured.dibaca} {t('Home.newsReadBy')}
                    </span>
                  </div>

                  <Link href={`/berita/${featured.slug}`}>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors leading-snug mb-3">
                      {featured.judul}
                    </h3>
                  </Link>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-6">
                    {featured.ringkasan}
                  </p>
                </div>

                <Link
                  href={`/berita/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:gap-3 transition-all"
                >
                  {t('Home.newsReadMore')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </div>

          {/* Recent News Grid */}
          <div className="lg:col-span-5 space-y-6">
            {recent.map((item) => (
              <Card key={item.id} hoverable className="group">
                <div className="p-4 sm:p-5 flex gap-4">
                  <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={item.gambarSampul || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'}
                      alt={item.judul}
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getKategoriVariant(item.kategori)} size="sm">
                          {item.kategori}
                        </Badge>
                        <span className="text-[11px] text-neutral-400">
                          {formatTanggal(item.tanggalTerbit)}
                        </span>
                      </div>

                      <Link href={`/berita/${item.slug}`}>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                          {item.judul}
                        </h4>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2">
                      <span>{estimasiWaktuBaca(item.konten)}</span>
                      <span className="text-primary-600 dark:text-primary-400 font-bold group-hover:underline">
                        {t('Home.newsRead')} →
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
