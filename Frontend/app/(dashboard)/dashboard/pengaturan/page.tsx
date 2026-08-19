'use client';

import React, { useEffect, useState } from 'react';
import { getProfilDesa, updateProfilDesa } from '@/lib/services/desa.service';
import type { ProfilDesa } from '@/types/desa';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Skeleton } from '@/components/ui/Skeleton';
import { CheckCircle2, Save, RefreshCw, Eye, EyeOff, Key } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { changePasswordService } from '@/lib/services/auth.service';

export default function DashboardPengaturanPage() {
  const [form, setForm] = useState<Partial<ProfilDesa> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void getProfilDesa().then((profil) => setForm({ ...profil }));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateProfilDesa(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const set = <K extends keyof ProfilDesa>(key: K, value: ProfilDesa[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
        <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Pengaturan Situs & Kontak Desa</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Data ini dipakai di beranda, footer, dan halaman profil publik.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-base">Identitas Desa</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Nama Desa" value={form.nama} onChange={(e) => set('nama', e.target.value)} required />
            <Input label="Kecamatan" value={form.kecamatan} onChange={(e) => set('kecamatan', e.target.value)} required />
            <Input label="Kabupaten" value={form.kabupaten} onChange={(e) => set('kabupaten', e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Provinsi" value={form.provinsi} onChange={(e) => set('provinsi', e.target.value)} />
            <Input label="Kode Pos" value={form.kodePos} onChange={(e) => set('kodePos', e.target.value)} />
            <Input label="Website" value={form.website} onChange={(e) => set('website', e.target.value)} />
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-base">Kontak & Layanan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Telepon Kantor" value={form.telepon} onChange={(e) => set('telepon', e.target.value)} />
            <Input label="Email Resmi" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <Input label="Jam Layanan" value={form.jamLayanan} onChange={(e) => set('jamLayanan', e.target.value)} />
          <Textarea label="Alamat Kantor" value={form.alamatKantor} onChange={(e) => set('alamatKantor', e.target.value)} rows={2} />
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" isLoading={saving}>
            <Save className="h-4 w-4" /> Simpan Pengaturan
          </Button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Berhasil disimpan
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => void getProfilDesa().then((profil) => setForm({ ...profil }))}
          >
            <RefreshCw className="h-4 w-4" /> Muat Ulang
          </Button>
        </div>
            </form>

      {/* Akun & Keamanan */ }
      <AkunKeamananSection />
    </div>
  );
}

function AkunKeamananSection() {
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showLama, setShowLama] = useState(false);
  const [showBaru, setShowBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const pwForm = useState({ passwordLama: '', passwordBaru: '', konfirmasi: '' });
  const [pw, setPw] = pwForm;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!pw.passwordLama || !pw.passwordBaru || !pw.konfirmasi) {
      setError('Semua kolom harus diisi.');
      return;
    }
    if (pw.passwordBaru.length < 8) {
      setError('Password baru minimal 8 karakter.');
      return;
    }
    if (pw.passwordBaru !== pw.konfirmasi) {
      setError('Password baru dan konfirmasi tidak cocok.');
      return;
    }
    if (!user?.id) {
      setError('Sesi admin tidak ditemukan. Silakan login kembali.');
      return;
    }
    setSaving(true);
    try {
      await changePasswordService(user.id, { passwordLama: pw.passwordLama, passwordBaru: pw.passwordBaru });
      setSaved(true);
      setPw({ passwordLama: '', passwordBaru: '', konfirmasi: '' });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengganti password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <h3 className="font-bold text-neutral-900 dark:text-white text-base flex items-center gap-2 mb-4">
        <Key className="w-4 h-4 text-primary-600 dark:text-primary-400" /> Akun Admin &amp; Keamanan
      </h3>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
        Admin: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{user?.nama || 'Admin Desa'}</span>
        <span className="mx-1.5 text-neutral-400 dark:text-neutral-500">•</span>
        {user?.email}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="relative">
          <Input
            label="Password Lama"
            type={showLama ? 'text' : 'password'}
            value={pw.passwordLama}
            onChange={(e) => setPw({ ...pw, passwordLama: e.target.value })}
            required
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowLama(!showLama)}
            className="absolute right-3 top-7 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label={showLama ? 'Sembunyikan password lama' : 'Lihat password lama'}
          >
            {showLama ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Password Baru"
            type={showBaru ? 'text' : 'password'}
            value={pw.passwordBaru}
            onChange={(e) => setPw({ ...pw, passwordBaru: e.target.value })}
            placeholder="Minimal 8 karakter"
            required
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowBaru(!showBaru)}
            className="absolute right-3 top-7 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label={showBaru ? 'Sembunyikan password baru' : 'Lihat password baru'}
          >
            {showBaru ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Konfirmasi Password Baru"
            type={showKonfirmasi ? 'text' : 'password'}
            value={pw.konfirmasi}
            onChange={(e) => setPw({ ...pw, konfirmasi: e.target.value })}
            required
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowKonfirmasi(!showKonfirmasi)}
            className="absolute right-3 top-7 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label={showKonfirmasi ? 'Sembunyikan konfirmasi' : 'Lihat konfirmasi'}
          >
            {showKonfirmasi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
        {saved && (
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Password berhasil diperbarui.
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={saving}
            disabled={!pw.passwordLama || !pw.passwordBaru || !pw.konfirmasi}
          >
            <Save className="h-4 w-4" /> Simpan Password Baru
          </Button>
        </div>
      </form>
    </Card>
  );
}