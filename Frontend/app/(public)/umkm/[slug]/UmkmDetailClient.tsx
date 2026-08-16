'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Umkm } from '@/types/umkm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Phone, MapPin, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface UmkmDetailClientProps {
  umkm: Umkm;
}

export const UmkmDetailClient: React.FC<UmkmDetailClientProps> = ({ umkm }) => {
  const { t } = useTranslation();

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa max-w-4xl space-y-8">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-primary-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('UmkmDetail.backToList')}
        </Link>

        <Breadcrumb
          items={[
            { label: t('UmkmDetail.breadcrumb'), href: '/umkm' },
            { label: umkm.namaUsaha },
          ]}
        />

        {/* Gallery Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl">
            <Image
              src={umkm.foto[0]}
              alt={umkm.namaUsaha}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {umkm.foto[1] && (
            <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hidden md:block">
              <Image
                src={umkm.foto[1]}
                alt={umkm.namaUsaha}
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <Card className="p-8 sm:p-10 space-y-6">
          <div>
            <span className="text-xs font-bold bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full uppercase">
              {umkm.kategori}
            </span>
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-3">
              {umkm.namaUsaha}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {t('UmkmDetail.pemilikLabel')}: {umkm.pemilik}
            </p>
          </div>

          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {umkm.deskripsi}
          </p>

          {/* Produk Unggulan */}
          <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              {t('UmkmDetail.produkUnggulan')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {umkm.produkUnggulan.map((prod, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200/60 dark:border-neutral-800 flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                  <span>{prod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kontak & Lokasi */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-xs text-neutral-500">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                {umkm.alamat}
              </p>
              {umkm.jamOperasional && (
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-500" />
                  {umkm.jamOperasional}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(umkm.alamat)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  <MapPin className="w-5 h-5" />
                  {t('UmkmDetail.openLocation')}
                </Button>
              </a>

              <a
                href={`https://wa.me/${umkm.kontak.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="accent"
                  size="lg"
                  className="font-extrabold shadow-lg text-neutral-950"
                >
                  <Phone className="w-5 h-5" />
                  {t('UmkmDetail.contactWhatsapp')} ({umkm.kontak})
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

