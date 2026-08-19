'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pengaduanSchema, type PengaduanSchemaType } from '@/lib/validations/pengaduan.schema';
import { submitPengaduan } from '@/lib/services/pengaduan.service';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MessageSquare, Send, CheckCircle2, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function PengaduanPage() {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToastStore();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [successTiket, setSuccessTiket] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PengaduanSchemaType>({
    resolver: zodResolver(pengaduanSchema),
  });

  const onSubmit = async (data: PengaduanSchemaType) => {
    setSubmitting(true);
    try {
      if (!user) {
        throw new Error('Silakan masuk terlebih dahulu untuk mengirim pengaduan.');
      }
      const res = await submitPengaduan(data, user);
      setSuccessTiket(res.nomorTiket);
      setModalOpen(true);
      showSuccess(`Pengaduan warga berhasil dikirim! Nomor Tiket: ${res.nomorTiket}`);
      reset();
    } catch (err) {
      showError(err instanceof Error ? err.message : t('Pengaduan.errorSend'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold">
            <MessageSquare className="w-4 h-4" />
            <span>{t('Pengaduan.badge')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            {t('Pengaduan.title')}
          </h1>
          <p className="text-sm text-neutral-500">
            {t('Pengaduan.subtitle')}
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Select
              label={t('Pengaduan.kategoriLabel')}
              options={[
                { value: 'infrastruktur', label: t('Pengaduan.kategoriInfrastruktur') },
                { value: 'layanan', label: t('Pengaduan.kategoriLayanan') },
                { value: 'lingkungan', label: t('Pengaduan.kategoriLingkungan') },
                { value: 'lainnya', label: t('Pengaduan.kategoriLainnya') },
              ]}
              {...register('kategori')}
              error={errors.kategori?.message}
            />

            <Input
              label={t('Pengaduan.judulLabel')}
              placeholder={t('Pengaduan.judulPlaceholder')}
              {...register('judul')}
              error={errors.judul?.message}
            />

            <Input
              label={t('Pengaduan.lokasiLabel')}
              placeholder={t('Pengaduan.lokasiPlaceholder')}
              leftIcon={<MapPin className="w-4 h-4" />}
              {...register('lokasi')}
              error={errors.lokasi?.message}
            />

            <Textarea
              label={t('Pengaduan.deskripsiLabel')}
              placeholder={t('Pengaduan.deskripsiPlaceholder')}
              rows={4}
              {...register('deskripsi')}
              error={errors.deskripsi?.message}
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
              <Send className="w-4 h-4" />
              {t('Pengaduan.submit')}
            </Button>
          </form>
        </Card>

        {/* Modal Success */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={t('Pengaduan.modalTitle')}>
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {t('Pengaduan.modalTicket')}
            </h3>
            <div className="p-3 bg-primary-50 dark:bg-primary-950 rounded-xl font-mono text-xl font-extrabold text-primary-600 dark:text-primary-400 border border-primary-200">
              {successTiket}
            </div>
            <p className="text-xs text-neutral-500">
              {t('Pengaduan.modalDesc')}
            </p>
            <Button variant="primary" onClick={() => setModalOpen(false)} className="w-full">
              {t('Pengaduan.done')}
            </Button>
            <Link
              href={`/pengaduan/lacak?tiket=${encodeURIComponent(successTiket)}`}
              className="inline-flex items-center justify-center w-full gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Lacak Status Pengaduan Ini
            </Link>
          </div>
        </Modal>
      </div>
    </div>
  );
}
