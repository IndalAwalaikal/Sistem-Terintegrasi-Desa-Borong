'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, Search, HelpCircle, FileText, MessagesSquare, CircleUserRound, Info } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

function FaqPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = useMemo(
    () => [
      { kategori: t('Faq.catSurat'), Icon: FileText, q: t('Faq.faq1q'), a: t('Faq.faq1a') },
      { kategori: t('Faq.catSurat'), Icon: FileText, q: t('Faq.faq2q'), a: t('Faq.faq2a') },
      { kategori: t('Faq.catSurat'), Icon: FileText, q: t('Faq.faq3q'), a: t('Faq.faq3a') },
      { kategori: t('Faq.catSurat'), Icon: FileText, q: t('Faq.faq4q'), a: t('Faq.faq4a') },
      { kategori: t('Faq.catPengaduan'), Icon: MessagesSquare, q: t('Faq.faq5q'), a: t('Faq.faq5a') },
      { kategori: t('Faq.catPengaduan'), Icon: MessagesSquare, q: t('Faq.faq6q'), a: t('Faq.faq6a') },
      { kategori: t('Faq.catAkun'), Icon: CircleUserRound, q: t('Faq.faq7q'), a: t('Faq.faq7a') },
      { kategori: t('Faq.catAkun'), Icon: CircleUserRound, q: t('Faq.faq8q'), a: t('Faq.faq8a') },
      { kategori: t('Faq.catUmum'), Icon: Info, q: t('Faq.faq9q'), a: t('Faq.faq9a') },
      { kategori: t('Faq.catUmum'), Icon: Info, q: t('Faq.faq10q'), a: t('Faq.faq10a') },
    ],
    [t]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((f) => (f.q + ' ' + f.a + ' ' + f.kategori).toLowerCase().includes(q));
  }, [faqs, query]);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? -1 : i));

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa max-w-3xl space-y-8">
        <Breadcrumb items={[{ label: t('Faq.breadcrumb') }]} />

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>{t('Faq.badge')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            {t('Faq.title')}
          </h1>
          <p className="text-sm text-neutral-500">
            {t('Faq.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <Search className="h-5 w-5 text-primary-600 shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('Faq.searchPlaceholder')}
            aria-label={t('Faq.searchAria')}
            className="border-none bg-transparent p-0 shadow-none focus:ring-0"
          />
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center text-sm text-neutral-500">
            {t('Faq.empty')}
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((f, i) => {
              const isOpen = openIndex === i;
              return (
                <Card key={`${f.q}-${i}`} className={cn('overflow-hidden transition-shadow', isOpen && 'ring-1 ring-primary-500/30')}>
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                        <f.Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {f.kategori}
                        </span>
                        <span className="mt-0.5 block text-sm font-bold text-neutral-900 dark:text-white">
                          {f.q}
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      className={cn('h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300', isOpen && 'rotate-180 text-primary-600')}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-[3.75rem] text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-neutral-500">
            {t('Faq.moreQuestion')}{' '}
            <Link href="/pengaduan" className="font-bold text-primary-600 hover:underline">
              {t('Faq.viaComplaint')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FaqPage;
