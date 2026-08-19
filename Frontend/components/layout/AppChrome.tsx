'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BackToTop } from '@/components/layout/BackToTop';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { PageTransition } from '@/components/ui/PageTransition';

/**
 * Seed cookie CSRF saat aplikasi pertama kali dimuat di browser.
 * Dipanggil sekali — jika cookie sudah ada, endpoint tetap me-refresh-nya
 * (umur cookie 24 jam). Ini memastikan X-CSRF-Token selalu tersedia untuk
 * semua request mutasi (POST/PUT/DELETE) tanpa perlu retry 403.
 */
async function seedCsrfCookie(): Promise<void> {
  try {
    await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });
  } catch {
    // Abaikan error jaringan — retry otomatis akan terjadi di api.ts saat 403
  }
}

export function AppChrome({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    // Seed CSRF cookie sekali saat aplikasi mount di browser
    seedCsrfCookie();
  }, []);

  if (isDashboard) return <>{children}</>;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Langsung ke konten utama
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <div className="print:hidden">{footer}</div>
      <BackToTop />
      <FloatingWhatsApp />
    </>
  );
}
