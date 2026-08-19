'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { getGaleriAlbumList } from '@/lib/services/galeri.service';
import type { GaleriAlbum } from '@/types/galeri';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { formatTanggal } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { Calendar, ChevronLeft, ChevronRight, X, Camera } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

function GaleriPage() {
  const { t } = useTranslation();
  const [albums, setAlbums] = useState<GaleriAlbum[]>([]);
  const [kategori, setKategori] = useState('all');
  const [lightbox, setLightbox] = useState<{ album: GaleriAlbum; index: number } | null>(null);

  const KATEGORI_LABEL: Record<string, string> = {
    budaya: t('Galeri.kategoriBudaya'),
    pertanian: t('Galeri.kategoriPertanian'),
    'gotong-royong': t('Galeri.kategoriGotongRoyong'),
    umum: t('Galeri.kategoriUmum'),
  };

  useEffect(() => {
    void getGaleriAlbumList().then(setAlbums);
  }, []);

  const kategories = useMemo(
    () => ['all', ...Array.from(new Set(albums.map((a) => a.kategori).filter((k): k is string => Boolean(k))))],
    [albums]
  );

  const filtered = kategori === 'all' ? albums : albums.filter((a) => a.kategori === kategori);

  const next = () =>
    setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.album.fotos.length } : lb));

  const prev = () =>
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index - 1 + lb.album.fotos.length) % lb.album.fotos.length } : lb
    );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  const foto = lightbox?.album.fotos[lightbox.index];

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa space-y-10">
        <>
          <Breadcrumb items={[{ label: t('Galeri.breadcrumb') }]} />

          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold">
              <span>{t('Galeri.badge')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
              {t('Galeri.title')}
            </h1>
            <p className="text-sm text-neutral-500">
              {t('Galeri.subtitle')}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setKategori('all')}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-bold capitalize transition-colors',
                kategori === 'all'
                  ? 'bg-primary-700 text-white shadow-md'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-primary-500'
              )}
            >
              {t('Galeri.all')}
            </button>
            {kategories.filter((k) => k !== 'all').map((item) => (
              <button
                key={item}
                onClick={() => setKategori(item)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-bold capitalize transition-colors',
                  kategori === item
                    ? 'bg-primary-700 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-primary-500'
                )}
              >
                {KATEGORI_LABEL[item] ?? item}
              </button>
            ))}
          </div>

          {/* Albums Grid */}
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-neutral-500">{t('Galeri.empty')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((album) => (
                <Card key={album.id} hoverable className="group cursor-pointer" onClick={() => setLightbox({ album, index: 0 })}>
                  <div className="relative h-56 w-full overflow-hidden">
                    {album.fotos[0] ? (
                      <Image
                        src={album.coverFoto || album.fotos[0].url}
                        alt={album.judul}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-neutral-100 dark:bg-neutral-800">
                        <Camera className="h-10 w-10 text-neutral-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      {album.kategori && (
                        <span className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-900 dark:text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                          {KATEGORI_LABEL[album.kategori] ?? album.kategori}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <span className="block text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary-500" />
                      {formatTanggal(album.tanggal)}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2">
                      {album.judul}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {album.deskripsi}
                    </p>
                    <span className="block text-[11px] font-bold text-primary-600 dark:text-primary-400">
                      {album.fotos.length} {t('Galeri.photos')}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {lightbox && foto ? (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={lightbox.album.judul}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-950/95 p-4 sm:p-10"
              onClick={() => setLightbox(null)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
                aria-label={t('Galeri.closeGallery')}
                className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25"
              >
                <X className="h-5 w-5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label={t('Galeri.prevPhoto')}
                className="absolute left-3 sm:left-6 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <figure className="max-h-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element -- lightbox foto URL eksternal */}
                <img
                  src={foto.url}
                  alt={foto.caption || lightbox.album.judul}
                  className="max-h-[72vh] max-w-full rounded-2xl object-contain shadow-2xl"
                />
                <figcaption className="text-center">
                  <p className="font-bold text-white text-sm">{foto.caption}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {lightbox.album.judul} • {lightbox.index + 1}/{lightbox.album.fotos.length}
                  </p>
                </figcaption>
              </figure>

              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label={t('Galeri.nextPhoto')}
                className="absolute right-3 sm:right-6 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          ) : null}
        </>
      </div>
    </div>
  );
}

export default GaleriPage;
