'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
import { getSuratByResi } from '@/lib/services/persuratan.service';
import SuratTemplate from '@/components/surat/SuratTemplate';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import type { PengajuanSurat } from '@/types/persuratan';

export default function PreviewSuratPage() {
  const { resi } = useParams<{ resi: string }>();
  const [surat, setSurat] = useState<PengajuanSurat | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | '404'>('loading');

  useEffect(() => {
    let active = true;
    if (!resi) {
      setState('404');
      return;
    }
    getSuratByResi(String(resi))
      .then((s) => {
        if (!active) return;
        setSurat(s);
        setState(s ? 'ok' : '404');
      })
      .catch(() => {
        if (active) setState('404');
      });
    return () => {
      active = false;
    };
  }, [resi]);

    if (state === 'loading')
    return (
      <div className="min-h-[60vh] bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto space-y-6 p-6">
          <Skeleton variant="rectangular" className="h-10 w-40 rounded-xl" />
          <Skeleton variant="rectangular" className="h-5 w-full rounded" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton variant="rectangular" className="h-72 w-full rounded-2xl" />
            <Skeleton variant="rectangular" className="h-72 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  if (state === '404' || !surat)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-neutral-500">
        <p>Surat tidak ditemukan. Periksa kembali nomor resi Anda.</p>
        <Link href="/layanan/lacak" className="text-primary-600 font-semibold text-sm">
          ← Lacak permohonan
        </Link>
      </div>
    );

  return (
    <div className="bg-neutral-100 min-h-screen py-8 print:bg-white print:p-0">
      <div className="no-print container-desa mb-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Link href="/layanan/lacak" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-600 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali
            </Link>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">Pratinjau &amp; Unduh Surat</h1>
            <p className="text-xs text-neutral-500">
              {surat.jenisSuratNama} • Resi {surat.nomorResi}
            </p>
          </div>
          <Button variant="primary" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Unduh PDF (Cetak)
          </Button>
        </div>
      </div>

      <div id="surat-cetak">
        <SuratTemplate surat={surat} />
      </div>
    </div>
  );
}