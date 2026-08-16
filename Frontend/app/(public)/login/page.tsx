'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchemaType } from '@/lib/validations/auth.schema';
import { loginService } from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const { showSuccess, showError } = useToastStore();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const session = await loginService(data);
      setSession(session);
      showSuccess(`Selamat datang kembali, ${session.user.nama}!`);
      router.push(session.user.role === 'admin' || session.user.role === 'super_admin' ? '/dashboard' : '/akun');
    } catch (err: any) {
      const msg = err.message || 'Login gagal. Periksa email dan password Anda.';
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
      <div className="container-desa max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold">
            <span>PORTAL AKUN WARGA</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            Masuk Akun Desa Digital
          </h1>
          <p className="text-xs text-neutral-500">
            Masuk untuk mengajukan surat, mengelola akun, atau mengakses dashboard perangkat desa.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Alamat Email"
              placeholder="maria@gmail.com"
              leftIcon={<Mail className="w-4 h-4" />}
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="pointer-events-auto rounded p-1 text-neutral-400 hover:text-primary-600" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
              {...register('password')}
              error={errors.password?.message}
            />

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
              <LogIn className="w-4 h-4" />
              Masuk Akun
            </Button>
          </form>


          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500 space-y-2">
            <div>
              <Link href="/forgot-password" className="font-semibold text-primary-600 hover:underline">
                Lupa Password?
              </Link>
            </div>
            <div>
              Belum punya akun?{' '}
              <Link href="/register" className="font-bold text-primary-600 hover:underline">
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
