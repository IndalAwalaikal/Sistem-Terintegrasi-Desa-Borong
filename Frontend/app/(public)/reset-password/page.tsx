'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordService } from '@/lib/services/auth.service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || code.trim().length < 4 || passwordBaru.length < 8) {
      setErrorMsg('Lengkapi email, kode verifikasi (min. 4 digit), dan password baru (min. 8 karakter).');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await resetPasswordService(email.trim(), code.trim(), passwordBaru);
      setSuccessMsg('Password berhasil diubah. Silakan masuk dengan password baru Anda.');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengatur ulang password. Periksa kembali kode verifikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
      <div className="container-desa max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase">
            Buat Password Baru
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Atur Ulang Kata Sandi</h1>
          <p className="text-xs text-neutral-500">
            Masukkan kode verifikasi dari email Anda beserta password baru untuk akun Anda.
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
            <Input
              label="Kode Verifikasi"
              placeholder="123456"
              maxLength={10}
              leftIcon={<KeyRound className="w-4 h-4" />}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            <Input
              label="Password Baru"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="pointer-events-auto rounded p-1 text-neutral-400 hover:text-primary-600" aria-label="Tampilkan kata sandi">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              <ShieldCheck className="w-4 h-4" /> Atur Ulang Password
            </Button>
          </form>

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500 mt-6">
            Belum menerima kode?{' '}
            <Link href="/forgot-password" className="font-bold text-primary-600 hover:underline">
              Kirim ulang
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}