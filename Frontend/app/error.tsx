'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-neutral-50 px-6 dark:bg-neutral-950">
      <div className="w-full max-w-md text-center space-y-4">
        <div className="text-6xl" aria-hidden>
          🧐
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            Ups, ada yang tidak beres
          </h1>
          <p className="text-sm text-neutral-500">
            Terjadi kendala saat memuat halaman. Silakan coba kembali.
          </p>
        </div>
        <Button onClick={() => reset()}>Coba Lagi</Button>
      </div>
    </div>
  );
}