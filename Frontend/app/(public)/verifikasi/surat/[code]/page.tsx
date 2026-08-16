'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, Clock, MapPin, Building2 } from 'lucide-react';

interface VerificationResult {
  valid: boolean;
  nomorSurat: string;
  jenisSuratNama: string;
  pemohonNama: string;
  subjekNama?: string;
  tanggalTerbit: string;
  penandatangan: string;
  jabatanPenandatangan: string;
  status: string;
}

export default function VerifikasiSuratPage() {
  const params = useParams();
  const code = (params?.code as string) || '';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationResult | null>(null);

  useEffect(() => {
    // Simulate verification look up
    const timer = setTimeout(() => {
      if (code) {
        setData({
          valid: true,
          nomorSurat: '474.1/042/DB/VIII/2026',
          jenisSuratNama: 'Surat Keterangan Usaha (SKU)',
          pemohonNama: 'Ahmad Subagyo',
          tanggalTerbit: '16 Agustus 2026',
          penandatangan: 'H. Muhammad Rusli, S.Sos.',
          jabatanPenandatangan: 'Kepala Desa Borong',
          status: 'RESMI & TERVERIFIKASI',
        });
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <Card className="w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-3xl">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <Badge variant="success" className="mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> SURAT RESMI PADA DATABASE DESA
            </Badge>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              Sistem Verifikasi Keaslian Surat
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Pemerintah Desa Borong, Kec. Lappariaja, Kab. Bone
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            Memverifikasi tanda tangan digital &amp; keaslian dokumen...
          </div>
        ) : data?.valid ? (
          <div className="space-y-4">
            <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <span className="text-neutral-500 font-medium">Nomor Kode Verifikasi</span>
                <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{code}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Nomor Surat Resmi</span>
                <span className="font-bold text-neutral-900 dark:text-white">{data.nomorSurat}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Jenis Dokumen</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{data.jenisSuratNama}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Nama Pemohon</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{data.pemohonNama}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Tanggal Diterbitkan</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{data.tanggalTerbit}</span>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-2">
                <span className="text-neutral-500">Penandatangan TTD Digital</span>
                <div className="text-right">
                  <p className="font-bold text-neutral-900 dark:text-white">{data.penandatangan}</p>
                  <p className="text-[10px] text-neutral-500">{data.jabatanPenandatangan}</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-center">
              <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                Dokumen ini dinyatakan SAH dan diakui secara hukum oleh Pemerintah Desa Borong.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900">
            <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300">Dokumen Tidak Ditemukan</h3>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              Kode verifikasi tidak terdaftar pada sistem persuratan resmi Desa Borong.
            </p>
          </div>
        )}

        <div className="text-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <p className="text-[11px] text-neutral-400">
            &copy; 2026 Layanan Persuratan Digital Desa Borong. All rights reserved.
          </p>
        </div>
      </Card>
    </div>
  );
}
