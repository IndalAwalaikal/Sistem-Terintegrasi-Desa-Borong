'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forgotPasswordService } from '@/lib/services/auth.service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Masukkan alamat email Anda.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await forgotPasswordService(email.trim());
      setSuccessMsg('Kode verifikasi telah dikirim ke email Anda. Silakan cek inbox/SPAM.');
      router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengirim kode reset. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
      <div className="container-desa max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase">
            Lupa Password
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Atur Ulang Kata Sandi</h1>
          <p className="text-xs text-neutral-500">
            Masukkan email terdaftar, kami akan mengirimkan kode verifikasi untuk mengatur ulang kata sandi Anda.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              <KeyRound className="w-4 h-4" /> Kirim Kode Verifikasi
            </Button>
          </form>

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500 mt-6">
            <Link href="/login" className="inline-flex items-center gap-1 font-bold text-primary-600 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Masuk
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}