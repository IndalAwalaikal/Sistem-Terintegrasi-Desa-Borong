'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUmkmList } from '@/lib/services/umkm.service';
import type { Umkm } from '@/types/umkm';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';
import { Phone, Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

function UmkmPage() {
  const { t } = useTranslation();
  const [umkms, setUmkms] = useState<Umkm[]>([]);
  const [kategori, setKategori] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    void getUmkmList().then(setUmkms);
  }, []);

  const kategories = useMemo(
    () => ['all', ...Array.from(new Set(umkms.map((u) => u.kategori)))],
    [umkms]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return umkms.filter((u) => {
      const matchKat = kategori === 'all' || u.kategori === kategori;
      const matchQ =
        !q ||
        [u.namaUsaha, u.pemilik, u.deskripsi, u.alamat, u.kategori]
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchKat && matchQ;
    });
  }, [umkms, kategori, query]);

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa space-y-10">
        <Breadcrumb items={[{ label: t('Umkm.breadcrumb') }]} />

        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-100 dark:bg-amber-950 text-amber-800 dark:text-accent-300 text-xs font-bold">
            <span>{t('Umkm.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
            {t('Umkm.title')}
          </h1>
          <p className="text-sm text-neutral-500">
            {t('Umkm.subtitle')}
          </p>
        </div>

        {/* Search + Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm max-w-lg mx-auto">
            <Search className="h-5 w-5 text-primary-600 shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('Umkm.searchPlaceholder')}
              aria-label={t('Umkm.searchAria')}
              className="border-none bg-transparent p-0 shadow-none focus:ring-0"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {kategories.map((item) => (
              <button
                key={item}
                onClick={() => setKategori(item)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-bold transition-colors',
                  kategori === item
                    ? 'bg-accent-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-accent-400 hover:text-accent-700'
                )}
              >
                {item === 'all' ? t('Umkm.allKategori') : item}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-neutral-500">{t('Umkm.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <Card key={item.id} hoverable className="group">
                <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={item.foto[0]}
                    alt={item.namaUsaha}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-900 dark:text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      {item.kategori}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-accent-600 transition-colors line-clamp-1">
                    {item.namaUsaha}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {t('Umkm.owner')} <span className="font-semibold text-neutral-700 dark:text-neutral-300">{item.pemilik}</span>
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.deskripsi}
                  </p>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {item.kontak}
                    </span>
                    <Link href={`/umkm/${item.slug}`}>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white hover:underline">
                        {t('Umkm.viewProduct')} →
                      </span>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UmkmPage;
