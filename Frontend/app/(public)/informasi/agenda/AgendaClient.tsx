'use client';

import React from 'react';
import type { AgendaKegiatan } from '@/types/statistik';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatTanggal } from '@/lib/utils/format';
import { Calendar, MapPin, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface AgendaClientProps {
  agendaList: AgendaKegiatan[];
}

export const AgendaClient: React.FC<AgendaClientProps> = ({ agendaList }) => {
  const { t } = useTranslation();

  const getKategoriVariant = (kat: string) => {
    switch (kat) {
      case 'perayaan':
        return 'warning';
      case 'musyawarah':
        return 'primary';
      case 'gotong-royong':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold">
            <span>{t('Agenda.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
            {t('Agenda.title')}
          </h1>
          <p className="text-sm text-neutral-500">
            {t('Agenda.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-none">
          {agendaList.map((agenda) => (
            <Card key={agenda.id} hoverable className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={getKategoriVariant(agenda.kategori)} size="md">
                  {agenda.kategori.toUpperCase()}
                </Badge>
                <span className="text-xs text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatTanggal(agenda.tanggalMulai)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                {agenda.judul}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {agenda.deskripsi}
              </p>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" />
                  <span>{t('Agenda.location')} {agenda.lokasi}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary-500" />
                  <span>{t('Agenda.organizer')} {agenda.penyelenggara}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
