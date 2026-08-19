'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Terjadi Kesalahan</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-md">
          Halaman ini mengalami masalah saat memuat data. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.
        </p>
      </div>
      <Button variant="outline" onClick={reset} className="gap-2">
        <RefreshCcw className="w-4 h-4" /> Coba Lagi
      </Button>
    </div>
  );
}
