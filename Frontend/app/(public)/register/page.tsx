'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { registerSchema, type RegisterSchemaType } from '@/lib/validations/auth.schema';
import { registerService, verifyOtpService, resendOtpService } from '@/lib/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { User, Mail, Lock, CreditCard, Phone, UserPlus, Eye, EyeOff, Clock } from 'lucide-react';

const OTP_DURATION_SECONDS = 600; // 10 menit masa berlaku OTP

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const { showSuccess, showError } = useToastStore();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [regEmail, setRegEmail] = useState('');
  const [code, setCode] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [otpTimer, setOtpTimer] = useState<number>(OTP_DURATION_SECONDS);

  useEffect(() => {
    if (step !== 'otp') return;
    setOtpTimer(OTP_DURATION_SECONDS);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await registerService(data);
      setRegEmail(data.email);
      setStep('otp');
      showSuccess(t('Register.otpSuccess', `Kode OTP berhasil dikirimkan ke email ${data.email}!`));
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('Register.otpError');
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    setLoading(true);
    setErrorMsg('');
    setResendMsg('');
    try {
      const session = await verifyOtpService(regEmail, code);
      setUser(session);
      showSuccess(t('Register.verifySuccess'));
      router.push('/akun');
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('Register.verifyError');
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    setErrorMsg('');
    setResendMsg('');
    try {
      await resendOtpService(regEmail);
      const msg = t('Register.resendMsg');
      setResendMsg(msg);
      setOtpTimer(OTP_DURATION_SECONDS);
      showSuccess(msg);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('Register.resendError');
      setErrorMsg(msg);
      showError(msg);
    }
  };

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
      <div className="container-desa max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {t('Register.title')}
          </h1>
          <p className="text-xs text-neutral-500">
            {t('Register.subtitle')}
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          {step === 'form' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('Register.namaLabel')}
              placeholder={t('Register.namaPlaceholder')}
              leftIcon={<User className="w-4 h-4" />}
              {...register('nama')}
              error={errors.nama?.message}
            />

            <Input
              label={t('Register.nikLabel')}
              placeholder={t('Register.nikPlaceholder')}
              leftIcon={<CreditCard className="w-4 h-4" />}
              {...register('nik')}
              error={errors.nik?.message}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('Register.emailLabel')}
                placeholder={t('Register.emailPlaceholder')}
                leftIcon={<Mail className="w-4 h-4" />}
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label={t('Register.teleponLabel')}
                placeholder={t('Register.teleponPlaceholder')}
                leftIcon={<Phone className="w-4 h-4" />}
                {...register('telepon')}
                error={errors.telepon?.message}
              />
            </div>

            <Textarea
              label={t('Register.alamatLabel')}
              placeholder={t('Register.alamatPlaceholder')}
              rows={2}
              {...register('alamat')}
              error={errors.alamat?.message}
            />

            <Input
              label={t('Register.passwordLabel')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('Register.passwordPlaceholder')}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="pointer-events-auto rounded p-1 text-neutral-400 hover:text-primary-600" aria-label={showPassword ? t('Register.hidePassword') : t('Register.showPassword')}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
              {...register('password')}
              error={errors.password?.message}
            />

            <Button type="submit" variant="primary" className="w-full mt-4" isLoading={loading}>
              <UserPlus className="w-4 h-4" />
              {t('Register.submit')}
            </Button>
          </form>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-neutral-500">
                Kode verifikasi telah dikirim ke <strong>{regEmail}</strong>. Masukkan kode untuk mengaktifkan akun Anda.
              </p>

              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
                otpTimer > 0 
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-800 dark:text-amber-300' 
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${otpTimer > 0 ? 'animate-pulse' : ''}`} />
                  <span>{otpTimer > 0 ? t('Register.otpValid') : t('Register.otpExpired')}</span>
                </div>
                <span className="font-mono text-sm font-bold">{formatTime(otpTimer)}</span>
              </div>

              {resendMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 text-xs">
                  {resendMsg}
                </div>
              )}
              <Input
                label={t('Register.otpCodeLabel')}
                placeholder={t('Register.otpCodePlaceholder')}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                disabled={otpTimer === 0}
              />
              <Button type="button" variant="primary" className="w-full" isLoading={loading} onClick={onVerifyOtp} disabled={otpTimer === 0 || loading || code.length < 6}>
                <Mail className="w-4 h-4" />
                {t('Register.verifySubmit')}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={onResendOtp} disabled={loading}>
                {t('Register.resendSubmit')}
              </Button>
            </div>
          )}

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500 mt-6">
            {t('Register.hasAccount')}{' '}
            <Link href="/login" className="font-bold text-primary-600 hover:underline">
              {t('Register.signIn')}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
