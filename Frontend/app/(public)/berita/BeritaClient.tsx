'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Berita } from '@/types/berita';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { formatTanggal, estimasiWaktuBaca } from '@/lib/utils/format';
import { Calendar } from 'lucide-react';
import { PublicMasthead } from '@/components/layout/PublicMasthead';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface BeritaClientProps {
  data: Berita[];
  kategori?: string;
}

export const BeritaClient: React.FC<BeritaClientProps> = ({ data, kategori }) => {
  const { t } = useTranslation();

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

  const categories = [
    { label: t('Berita.catAll'), value: '' },
    { label: t('Berita.catPengumuman'), value: 'pengumuman' },
    { label: t('Berita.catKegiatan'), value: 'kegiatan' },
    { label: t('Berita.catPembangunan'), value: 'pembangunan' },
    { label: t('Berita.catLainnya'), value: 'lainnya' },
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#f5f8fc] dark:bg-neutral-950">
      <div className="container-desa space-y-10">
        <Breadcrumb items={[{ label: t('Berita.breadcrumb') }]} />

        <PublicMasthead eyebrow={t('Berita.mastheadEyebrow')} title={t('Berita.mastheadTitle')} description={t('Berita.mastheadDesc')} image="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=85" />

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-[0_15px_34px_rgba(15,50,100,.06)]">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/berita${cat.value ? `?kategori=${cat.value}` : ''}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  (kategori || '') === cat.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* News Cards Grid */}
        {data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((article) => (
              <Card key={article.id} hoverable className="flex flex-col group h-full">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={article.gambarSampul || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'}
                    alt={article.judul}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={getKategoriVariant(article.kategori)} size="md">
                      {article.kategori.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary-500" />
                        {formatTanggal(article.tanggalTerbit)}
                      </span>
                      <span>•</span>
                      <span>{estimasiWaktuBaca(article.konten)}</span>
                    </div>

                    <Link href={`/berita/${article.slug}`}>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug mb-2">
                        {article.judul}
                      </h3>
                    </Link>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                      {article.ringkasan}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-neutral-400 font-medium">
                      {t('Berita.by')} {article.penulis}
                    </span>
                    <Link
                      href={`/berita/${article.slug}`}
                      className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      {t('Berita.read')} →
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-500">{t('Berita.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
