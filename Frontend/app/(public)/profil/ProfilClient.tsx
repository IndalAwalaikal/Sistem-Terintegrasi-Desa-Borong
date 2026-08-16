'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ProfilDesa } from '@/types/desa';
import { Card } from '@/components/ui/Card';
import { PublicMasthead } from '@/components/layout/PublicMasthead';
import { ArrowUpRight, History, Landmark, Map, Users, MapPin, Compass, ExternalLink, Globe, Building2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ProfilClientProps {
  profil: ProfilDesa;
}

export const ProfilClient: React.FC<ProfilClientProps> = ({ profil }) => {
  const { t } = useTranslation();
  const routes = [
    { href: '/profil/sejarah', title: t('Profil.route1Title'), text: t('Profil.route1Text'), icon: History, number: '01' },
    { href: '/profil/struktur-organisasi', title: t('Profil.route2Title'), text: t('Profil.route2Text'), icon: Users, number: '02' },
    { href: '/profil/wilayah', title: t('Profil.route3Title'), text: t('Profil.route3Text'), icon: Map, number: '03' },
  ];

  return (
    <div className="bg-[#f5f8fc] py-8 sm:py-12 dark:bg-neutral-950">
      <div className="container-desa space-y-8 sm:space-y-12">
        <PublicMasthead
          eyebrow={t('Profil.mastheadEyebrow')}
          title={t('Profil.mastheadTitle')}
          description={t('Profil.mastheadDesc')}
          image="/kantor_desa.png"
        />

        {/* Quick Navigation Cards */}
        <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_18px_40px_rgba(15,50,100,.06)] md:grid-cols-3 dark:border-neutral-800 dark:bg-neutral-800">
          {routes.map((item) => (
            <Link key={item.href} href={item.href} className="group bg-white p-6 transition duration-500 hover:bg-blue-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold tracking-widest text-primary-600">{item.number}</span>
                <item.icon className="h-5 w-5 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary-600" />
              </div>
              <h2 className="mt-9 text-lg font-bold text-slate-900 dark:text-white">{item.title}</h2>
              <p className="mt-1 text-xs text-slate-500">{item.text}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-primary-700">
                {t('Profil.explore')} <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>

        {/* Kantor Desa Photo & Overview Section */}
        <Card className="overflow-hidden border border-slate-200 bg-white p-6 sm:p-8 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md border border-neutral-200 dark:border-neutral-800">
              <Image
                src="/kantor_desa.png"
                alt="Kantor Desa Borong"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/80 backdrop-blur-md p-3 rounded-xl text-white text-xs flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary-400" />
                  <span className="font-bold">Kantor Desa Borong</span>
                </div>
                <a
                  href="https://maps.app.goo.gl/nSJcjAg82dk2tuLm7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <MapPin className="w-3 h-3" /> Maps ↗
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>PUSAT PEMERINTAHAN DESA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Pemerintah Desa Borong, Kecamatan Herlang
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
                Desa Borong adalah desa administratif di Kecamatan Herlang,{' '}
                <a
                  href="https://bulukumbakab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  Kabupaten Bulukumba <Globe className="w-3 h-3" />
                </a>
                , Provinsi Sulawesi Selatan. Pusat pemerintahan dan pelayanan masyarakat berada di Kantor Desa Borong yang melayani keperluan administrasi, persuratan, dan pemberdayaan warga.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://maps.app.goo.gl/nSJcjAg82dk2tuLm7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-md"
                >
                  <MapPin className="w-4 h-4" />
                  Buka Peta Kantor Desa di Google Maps
                </a>
                <a
                  href="https://bulukumbakab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-all border border-neutral-200 dark:border-neutral-700"
                >
                  <Globe className="w-4 h-4 text-primary-500" />
                  Portal Pemkab Bulukumba
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </div>
            </div>
          </div>
        </Card>



        {/* Visi & Misi */}
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.4fr]">
          <section className="relative overflow-hidden rounded-[1.75rem] bg-[#0b4b9c] p-8 text-white shadow-[0_18px_45px_rgba(11,75,156,.22)] sm:p-10">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/15" />
            <p className="relative text-[11px] font-bold uppercase tracking-[.2em] text-blue-200">{t('Profil.arahPembangunan')}</p>
            <blockquote className="relative mt-6 font-serif text-2xl font-bold leading-snug sm:text-3xl">“{profil.visi}”</blockquote>
            <div className="relative mt-12 border-t border-white/20 pt-5 text-xs text-blue-100">{t('Profil.periode')}</div>
          </section>
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_15px_38px_rgba(15,50,100,.05)] sm:p-9 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-neutral-800">
              <div>
                <p className="eyebrow">{t('Profil.komitmen')}</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{t('Profil.misiTitle')}</h2>
              </div>
              <Landmark className="h-7 w-7 text-primary-600" />
            </div>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {profil.misi.map((item, idx) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-neutral-300">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-bold text-primary-700 dark:bg-primary-950">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};
