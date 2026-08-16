'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { getJenisSuratByKode, submitPengajuan } from '@/lib/services/persuratan.service';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import type { JenisSurat } from '@/types/persuratan';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ArrowLeft, Send, CheckCircle2, ShieldAlert, UploadCloud, FileText, X, Check } from 'lucide-react';
import Link from 'next/link';

export default function AjukanSuratPage() {
  const params = useParams();
  const router = useRouter();
  const kode = (params.kode as string)?.toUpperCase();

  const { user, isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToastStore();
  const [jenisSurat, setJenisSurat] = useState<JenisSurat | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdResi, setCreatedResi] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; requirementLabel?: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function load() {
      if (kode) {
        try {
          const data = await getJenisSuratByKode(kode);
          setJenisSurat(data);
        } catch {
          setJenisSurat(null);
        }
      }
      setLoading(false);
    }
    void load();
  }, [kode]);

  // Pre-fill user profile data if authenticated and jenisSurat is loaded
  useEffect(() => {
    if (user && jenisSurat) {
      if (user.nama) {
        setValue('namaLengkap', user.nama);
        setValue('nama', user.nama);
        setValue('namaPemohon', user.nama);
      }
      if (user.nik) {
        setValue('nik', user.nik);
        setValue('nikPemohon', user.nik);
      }
      if (user.noKk) {
        setValue('noKk', user.noKk);
        setValue('nomorKk', user.noKk);
      }
      if (user.tempatLahir) {
        setValue('tempatLahir', user.tempatLahir);
      }
      if (user.tanggalLahir) {
        setValue('tanggalLahir', user.tanggalLahir);
      }
      if (user.jenisKelamin) {
        setValue('jenisKelamin', user.jenisKelamin);
      }
      if (user.agama) {
        setValue('agama', user.agama);
      }
      if (user.pekerjaan) {
        setValue('pekerjaan', user.pekerjaan);
      }
      if (user.statusPerkawinan) {
        setValue('statusPerkawinan', user.statusPerkawinan);
      }
      if (user.telepon) {
        setValue('telepon', user.telepon);
        setValue('noHp', user.telepon);
      }
      if (user.alamat) {
        setValue('alamatLengkap', user.alamat);
        setValue('alamat', user.alamat);
      }
      if (user.dusun) {
        setValue('dusun', user.dusun);
      }
      if (user.rt) {
        setValue('rt', user.rt);
      }
      if (user.rw) {
        setValue('rw', user.rw);
      }
      if (user.email) {
        setValue('email', user.email);
      }
    }
  }, [user, jenisSurat, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, reqLabel?: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        file: f,
        requirementLabel: reqLabel,
      }));

      setSelectedFiles((prev) => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 8); // Maksimal 8 file
      });

      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitForm = async (formData: Record<string, unknown>) => {
    if (!jenisSurat) return;
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    const persyaratanList = jenisSurat.persyaratan || [];
    const formFieldsList = jenisSurat.formFields || [];

    const hasPersyaratan = persyaratanList.length > 0;
    if (hasPersyaratan && selectedFiles.length === 0) {
      showError('Mohon unggah minimal 1 berkas dokumen persyaratan (misal: Fotokopi KTP/KK/Surat Pengantar).');
      return;
    }

    setSubmitting(true);

    try {
      const data: Record<string, string> = {};
       for (const [key, value] of Object.entries(formData)) {
        if (value instanceof FileList || value instanceof File) continue;
        if (formFieldsList.some((f) => f.name === key && f.type === 'file')) continue;
        if (!formFieldsList.some((f) => f.name === key)) continue;

        const strVal = String(value ?? '').trim();
        const lowerKey = key.toLowerCase();

        // Preserved / Lowercase Exceptions (Do NOT convert to CAPSLOCK)
        if (lowerKey === 'email' || lowerKey.endsWith('email')) {
          data[key] = strVal.toLowerCase();
        } else if (lowerKey.includes('url') || lowerKey.includes('tanggal') || lowerKey.includes('tgl')) {
          data[key] = strVal;
        } else {
          data[key] = strVal.toUpperCase(); // Automatic CAPSLOCK for administrative data
        }
      }

      const filesToSubmit = selectedFiles.map((item) => item.file);

      const result = await submitPengajuan(
        {
          jenisSuratKode: jenisSurat.kode,
          data,
          lampiran: filesToSubmit,
        },
        user
      );

      setCreatedResi(result.nomorResi);
      setSuccessModalOpen(true);
      showSuccess(`Permohonan surat berhasil dikirim! Nomor Resi: ${result.nomorResi}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal mengajukan surat.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-neutral-500 text-xs">Memuat formulir persuratan digital...</p>
      </div>
    );
  }

  if (!jenisSurat) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-danger font-bold text-sm">Jenis surat tidak ditemukan.</p>
        <Link href="/layanan">
          <Button variant="outline">← Kembali ke Layanan</Button>
        </Link>
      </div>
    );
  }

  const persyaratanList = jenisSurat.persyaratan || [];
  const formFieldsList = jenisSurat.formFields || [];

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa max-w-3xl space-y-8">
        <Link
          href="/layanan"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Layanan
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900 text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
          <span className="bg-accent-500 text-neutral-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            FORMULIR ONLINE • {jenisSurat.kode}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{jenisSurat.nama}</h1>
          <p className="text-xs sm:text-sm text-primary-100">{jenisSurat.deskripsi}</p>
        </div>

        {/* Requirement Alert Checklist */}
        {persyaratanList.length > 0 && (
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs space-y-3">
            <p className="font-bold flex items-center gap-2 text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Dokumen Persyaratan yang Diperlukan:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {persyaratanList.map((p, i) => {
                const isUploaded = selectedFiles.some(
                  (f) => f.requirementLabel === p || (p && f.file.name.toLowerCase().includes(p.toLowerCase().split(' ')[0]))
                );
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                      isUploaded
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : 'bg-white dark:bg-neutral-900 border-amber-200 dark:border-amber-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isUploaded ? 'bg-emerald-500 text-white' : 'bg-amber-200 text-amber-800 font-bold text-[10px]'
                      }`}
                    >
                      {isUploaded ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className="truncate">{p}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Form */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
            {/* Auto-fill indicator */}
            {user && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    <b>Terisi Otomatis (CAPSLOCK):</b> Data diri Anda telah diisikan dari profil akun ({user.nama} • NIK: {user.nik || '-'}).
                  </span>
                </div>
                <Link href="/akun" className="underline font-semibold hover:text-emerald-900 shrink-0 ml-2">
                  Ubah Profil
                </Link>
              </div>
            )}

            {/* Section 1: Data Fields */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
                1. Isian Data Permohonan
              </h3>

              {formFieldsList
                .filter((f) => f.type !== 'file')
                .map((field) => {
                  if (field.type === 'textarea') {
                    return (
                      <Textarea
                        key={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="uppercase placeholder:normal-case"
                        {...register(field.name, { required: field.required ? `${field.label} wajib diisi` : false })}
                        error={errors[field.name]?.message as string}
                      />
                    );
                  }

                  if (field.type === 'select' && field.options) {
                    return (
                      <Select
                        key={field.name}
                        label={field.label}
                        options={field.options}
                        required={field.required}
                        {...register(field.name, { required: field.required ? `Pilih ${field.label}` : false })}
                        error={errors[field.name]?.message as string}
                      />
                    );
                  }

                  const isEmail = field.name.toLowerCase().includes('email') || (field.type as string) === 'email';
                  const isDate = field.type === 'date' || field.name.toLowerCase().includes('tanggal');

                  return (
                    <Input
                      key={field.name}
                      label={field.label}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      className={!isEmail && !isDate ? 'uppercase placeholder:normal-case' : ''}
                      {...register(field.name, { required: field.required ? `${field.label} wajib diisi` : false })}
                      error={errors[field.name]?.message as string}
                    />
                  );
                })}
            </div>

            {/* Section 2: Upload Documents Form (ALWAYS EXPLICITLY SHOWN) */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-primary-600" />
                  2. Upload Berkas Dokumen Persyaratan
                </h3>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-950 px-2.5 py-1 rounded-full border border-primary-200 dark:border-primary-800">
                  {selectedFiles.length} Berkas Dipilih
                </span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Unggah foto/scan dokumen pendukung seperti KTP, KK, atau Surat Pengantar RT/RW (Format JPG, PNG, WEBP, PDF • Maks 5MB per file).
              </p>

              {/* Slot Upload Per Persyaratan */}
              {persyaratanList.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {persyaratanList.map((req, idx) => {
                    const attached = selectedFiles.filter((f) => f.requirementLabel === req);
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                            {idx + 1}. {req}
                          </span>
                          {attached.length > 0 ? (
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Terunggah ({attached.length} file)
                            </span>
                          ) : (
                            <span className="text-[11px] text-neutral-400 block mt-0.5">Wajib diunggah</span>
                          )}
                        </div>

                        <label className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:border-primary-500 cursor-pointer transition-colors text-center">
                          <UploadCloud className="w-4 h-4 text-primary-600" />
                          <span>Pilih File {req.split(' ')[0]}</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf,.webp"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, req)}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Box Multi-file Upload Umun */}
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-6 text-center hover:border-primary-500 transition-colors bg-neutral-50/50 dark:bg-neutral-900/50">
                <UploadCloud className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Unggah Dokumen Tambahan Lainnya (Opsional)
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Format JPG, PNG, WEBP, atau PDF (Maksimal 8 berkas)
                </p>
                <label className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold cursor-pointer transition-colors">
                  <UploadCloud className="w-4 h-4" />
                  Pilih Dokumen Tambahan
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.webp"
                    className="hidden"
                    onChange={(e) => handleFileChange(e)}
                  />
                </label>
              </div>

              {/* List Berkas Terpilih */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2 mt-4 text-left">
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Daftar Berkas Terunggah ({selectedFiles.length} file):
                  </p>
                  <div className="space-y-2">
                    {selectedFiles.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <FileText className="w-4 h-4 text-primary-600 shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-neutral-900 dark:text-white truncate">
                              {item.file.name}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              {(item.file.size / 1024 / 1024).toFixed(2)} MB{' '}
                              {item.requirementLabel && `• untuk ${item.requirementLabel}`}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Hapus berkas ini"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-3">
              <Link href="/layanan">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={submitting}>
                <Send className="w-4 h-4" />
                Kirim Pengajuan Surat
              </Button>
            </div>
          </form>
        </Card>

        {/* Success Modal */}
        <Modal isOpen={successModalOpen} onClose={() => {}} title="Pengajuan Berhasil Disimpan!">
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Nomor Resi Anda:
            </h3>
            <div className="p-3 bg-primary-50 dark:bg-primary-950 rounded-xl border border-primary-200 dark:border-primary-800 font-mono text-xl font-extrabold text-primary-600 dark:text-primary-400">
              {createdResi}
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Simpan nomor resi di atas untuk mengecek perkembangan status verifikasi dokumen Anda di menu Lacak Surat.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={() => router.push(`/layanan/lacak?resi=${createdResi}`)}
              >
                Lacak Status Resi Ini
              </Button>
              <Button variant="outline" onClick={() => router.push('/layanan')}>
                Kembali ke Layanan
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
