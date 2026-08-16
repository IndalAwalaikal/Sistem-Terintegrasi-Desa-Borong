'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BackToTop } from '@/components/layout/BackToTop';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { PageTransition } from '@/components/ui/PageTransition';

export function AppChrome({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return <>{children}</>;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Langsung ke konten utama
      </a>
      <div className="print:hidden">
        <Navbar />
      </div>
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <div className="print:hidden">{footer}</div>
      <BackToTop />
      <FloatingWhatsApp />
    </>
  );
}
