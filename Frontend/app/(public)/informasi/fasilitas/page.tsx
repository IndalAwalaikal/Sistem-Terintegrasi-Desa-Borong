'use client';

import React, { useEffect, useState } from 'react';
import { getFasilitasDesa } from '@/lib/services/fasilitas.service';
import type { FasilitasDesa } from '@/types/fasilitas';
import { Card } from '@/components/ui/Card';
import { MapPin, Building2, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function FasilitasPage() {
  const { t } = useTranslation();
  const [fasilitas, setFasilitas] = useState<FasilitasDesa[]>([]);
  const [filter, setFilter] = useState('semua');
  useEffect(() => { void getFasilitasDesa(filter).then(setFasilitas); }, [filter]);
  const categories = ['semua', 'pendidikan', 'kesehatan', 'ibadah', 'olahraga', 'pemerintahan', 'umum'] as const;
  const categoryLabel = (c: string) => (t(`Fasilitas.${c}`) as string) || c;
  return <div className="bg-slate-50 py-12 dark:bg-neutral-950"><div className="container-desa space-y-8"><div className="max-w-2xl"><p className="eyebrow">{t('Fasilitas.eyebrow')}</p><h1 className="section-heading mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{t('Fasilitas.title')}</h1><p className="mt-4 text-sm leading-relaxed text-slate-500">{t('Fasilitas.subtitle')}</p></div><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${filter === item ? 'bg-primary-700 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'}`}>{categoryLabel(item)}</button>)}</div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{fasilitas.map((item) => <Card key={item.id} hoverable className="p-5"><div className="flex items-start justify-between gap-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"><Building2 className="h-5 w-5" /></span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">{categoryLabel(item.kategori)}</span></div><h2 className="mt-5 font-bold text-slate-900 dark:text-white">{item.nama}</h2><p className="mt-2 text-xs leading-relaxed text-slate-500">{item.deskripsi}</p><div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-neutral-800"><p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary-600" />{item.dusun} · {item.alamat}</p>{item.jamLayanan && <p className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-primary-600" />{item.jamLayanan}</p>}</div></Card>)}</div></div></div>;
}
