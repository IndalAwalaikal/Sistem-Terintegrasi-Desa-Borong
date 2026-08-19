'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPengajuanByResi, type PengajuanTracking } from '@/lib/services/persuratan.service';
import type { StatusPengajuan } from '@/types/persuratan';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { formatTanggal } from '@/lib/utils/format';
import Link from 'next/link';
import { Search, AlertCircle, Printer, Download } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

function LacakLoading() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[60vh] bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa py-12 flex items-center justify-center">
        <span className="text-neutral-400">{t('Lacak.loading')}</span>
      </div>
    </div>
  );
}

function LacakContent() {
  const searchParams = useSearchParams();
  const initialResi = searchParams.get('resi') || '';

  const [resi, setResi] = useState(initialResi);
  const [result, setResult] = useState<PengajuanTracking | null | 'not_found'>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const statusLabel = (status: StatusPengajuan) => t(`Lacak.status.${status}`, status);

  useEffect(() => {
    if (!initialResi) return;

    void (async () => {
      setLoading(true);
      try {
        const data = await getPengajuanByResi(initialResi);
        setResult(data || 'not_found');
      } catch {
        setResult('not_found');
      } finally {
        setLoading(false);
      }
    })();
  }, [initialResi]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resi.trim()) return;

    setLoading(true);
    try {
      const data = await getPengajuanByResi(resi);
      setResult(data || 'not_found');
    } catch {
      setResult('not_found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: StatusPengajuan) => {
    const label = statusLabel(status).toUpperCase();
    switch (status) {
      case 'diajukan':
        return <Badge variant="info">{label}</Badge>;
      case 'diverifikasi':
        return <Badge variant="secondary">{label}</Badge>;
      case 'diproses':
        return <Badge variant="warning">{label}</Badge>;
      case 'selesai':
        return <Badge variant="success">{label}</Badge>;
      case 'ditolak':
        return <Badge variant="danger">{label}</Badge>;
      default:
        return <Badge variant="neutral">{label}</Badge>;
    }
  };

  const steps: StatusPengajuan[] = ['diajukan', 'diverifikasi', 'diproses', 'selesai'];

  const printResi = (p: PengajuanTracking) => {
    const win = window.open('', '_blank', 'width=560,height=800');
    if (!win) return;
    const rows = p.riwayatStatus
      .map(
        (rw) =>
          `<tr><td style="padding:6px 8px;border:1px solid #d4d4d4;text-transform:capitalize;">${statusLabel(rw.status)}</td>` +
          `<td style="padding:6px 8px;border:1px solid #d4d4d4;font-size:12px;">${formatTanggal(rw.waktu, { withTime: true })}</td></tr>`
      )
      .join('');
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${t('Lacak.printTitle')} ${p.nomorResi}</title>
      <style>
        body{font-family:Georgia,serif;color:#111;max-width:440px;margin:24px auto;padding:0 16px;}
        .head{text-align:center;border-bottom:3px double #111;padding-bottom:10px;margin-bottom:18px;}
        .head small{display:block;letter-spacing:2px;text-transform:uppercase;font-size:11px;}
        .head h1{font-size:20px;margin:4px 0 0;}
        .meta{width:100%;font-size:13px;border-collapse:collapse;margin-bottom:18px;}
        .meta td{padding:4px 0;vertical-align:top;}
        .meta td:first-child{color:#555;width:38%;}
        .status{text-align:center;font-size:15px;font-weight:bold;border:2px solid #111;padding:8px;margin-bottom:18px;text-transform:uppercase;letter-spacing:1px;}
        table.times{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;}
        table.times th{background:#111;color:#fff;font-size:11px;text-transform:uppercase;padding:6px 8px;}
        .foot{text-align:center;font-family:Arial,sans-serif;font-size:10px;color:#777;margin-top:20px;}
      </style></head><body>
      <div class="head"><small>${t('Lacak.printDesa')}</small><h1>${t('Lacak.printTitle')}</h1></div>
      <table class="meta">
        <tr><td>${t('Lacak.resiLabel')}</td><td><b>${p.nomorResi}</b></td></tr>
        <tr><td>${t('Lacak.jenisSurat')}</td><td>${p.jenisSuratNama} (${p.jenisSuratKode})</td></tr>
        <tr><td>${t('Lacak.diajukanPada')}</td><td>${formatTanggal(p.dibuatPada, { withTime: true })}</td></tr>
      </table>
      <div class="status">${t('Lacak.currentStatusLabel')}: ${statusLabel(p.status)}</div>
      <table class="times"><thead><tr><th>${t('Lacak.statusLabel')}</th><th>${t('Lacak.timeLabel')}</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="foot">${t('Lacak.printFooter')}</p>
      </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa max-w-3xl space-y-8">
        <Breadcrumb
          items={[
            { label: t('Lacak.breadcrumbServices'), href: '/layanan' },
            { label: t('Lacak.breadcrumbTrack') },
          ]}
        />

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            {t('Lacak.title')}
          </h1>
          <p className="text-sm text-neutral-500">
            {t('Lacak.description')}
          </p>
        </div>

        {/* Search Input Card */}
        <Card className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder={t('Lacak.resiPlaceholder')}
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              aria-label={t('Lacak.resiPlaceholder')}
              className="flex-1"
            />
            <Button type="submit" variant="primary" isLoading={loading}>
              {t('Lacak.searchButton')}
            </Button>
          </form>
        </Card>

        {/* Loading state (pencarian resi bersifat asinkron) */}
        {loading && (
          <div className="space-y-4" aria-hidden="true">
            <Skeleton className="h-32 w-full rounded-3xl" />
            <Skeleton className="h-72 w-full rounded-3xl" />
          </div>
        )}

        {/* Results */}
        {!loading && result === 'not_found' && (
          <Card className="p-8 text-center space-y-3 border-danger/30 bg-rose-50/50 dark:bg-rose-950/20">
            <AlertCircle className="w-12 h-12 text-danger mx-auto" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{t('Lacak.notFoundTitle')}</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              {t('Lacak.notFoundDesc').replace('{resi}', resi)}
            </p>
          </Card>
        )}

        {!loading && typeof result === 'object' && result !== null && (
          <Card className="p-6 sm:p-8 space-y-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase">{t('Lacak.resiLabel')}</p>
                <h2 className="text-2xl font-black text-primary-600 dark:text-primary-400">
                  {result.nomorResi}
                </h2>
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-1">
                  {result.jenisSuratNama} ({result.jenisSuratKode})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-neutral-400 mb-1">{t('Lacak.currentStatus')}</p>
                {getStatusBadge(result.status)}
                <div className="mt-3 flex flex-wrap gap-2 justify-start sm:justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={() => printResi(result)}>
                    <Printer className="w-3.5 h-3.5" />
                    {t('Lacak.printReceipt')}
                  </Button>
                  {result.status === 'selesai' && (
                    <Link href={`/surat/${result.nomorResi}`}>
                      <Button variant="primary" size="sm">
                        <Download className="w-3.5 h-3.5" />
                        Unduh Surat (PDF)
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* State Machine Progress Bar */}
            {result.status !== 'ditolak' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{t('Lacak.progressTitle')}</h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {steps.map((st) => {
                    const stepOrder = steps.indexOf(result.status);
                    const isDone = steps.indexOf(st) <= stepOrder;
                    const isCurrent = st === result.status;

                    return (
                      <div key={st} className="space-y-2">
                        <div
                          className={`h-2 rounded-full transition-colors ${
                            isDone ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-800'
                          }`}
                        />
                        <span
                          className={`block text-[11px] font-bold capitalize ${
                            isCurrent
                              ? 'text-primary-600 dark:text-primary-400'
                              : isDone
                              ? 'text-neutral-800 dark:text-neutral-200'
                              : 'text-neutral-400'
                          }`}
                        >
                          {statusLabel(st)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rejection Banner — shown prominently when rejected */}
            {result.status === 'ditolak' && result.catatanAdmin && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-rose-800 dark:text-rose-200">Permohonan Surat Ditolak</p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                    <span className="font-semibold">Alasan: </span>
                    {result.catatanAdmin}
                  </p>
                </div>
              </div>
            )}

            {/* Timeline history */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{t('Lacak.historyTitle')}</h3>
              <div className="space-y-4 relative pl-6 border-l-2 border-primary-500/30">
                {result.riwayatStatus.map((rw, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${
                      rw.status === 'ditolak' ? 'bg-rose-500' : 'bg-primary-600'
                    }`} />
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold capitalize ${
                        rw.status === 'ditolak' ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-800 dark:text-neutral-200'
                      }`}>
                        {statusLabel(rw.status)}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {formatTanggal(rw.waktu, { withTime: true })}
                      </span>
                    </div>
                    {/* Catatan / alasan dari admin */}
                    {rw.catatan && (
                      <p className={`text-[11px] leading-relaxed mt-0.5 ${
                        rw.status === 'ditolak' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-neutral-500'
                      }`}>
                        💬 {rw.catatan}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function LacakPage() {
  return (
    <Suspense fallback={<LacakLoading />}>
      <LacakContent />
    </Suspense>
  );
}
