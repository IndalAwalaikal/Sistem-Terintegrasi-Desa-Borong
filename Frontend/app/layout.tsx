import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppChrome } from '@/components/layout/AppChrome';
import { Footer } from '@/components/layout/Footer';

// Konten publik dibaca dari API saat request agar image build tidak membutuhkan backend aktif.
export const dynamic = 'force-dynamic';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Website Resmi Desa Borong | Kec. Herlang, Kab. Bulukumba',
    template: '%s | Desa Borong Digital',
  },
  description:
    'Portal informasi resmi, transparansi anggaran APBDes, layanan persuratan online, dan direktori UMKM Desa Borong, Kecamatan Herlang, Kabupaten Bulukumba, Sulawesi Selatan.',
  keywords: [
    'Desa Borong',
    'Bulukumba',
    'Herlang',
    'Desa Digital',
    'Surat Online Desa',
    'Desa Borong Herlang',
    'APBDes Borong',
    'Layanan Desa',
  ],
  authors: [{ name: 'Pemerintah Desa Borong' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://desaborong.bulukumbakab.go.id',
    title: 'Website Resmi Desa Borong - Bulukumba',
    description: 'Portal layanan publik dan informasi resmi Desa Borong',
    siteName: 'Desa Borong Digital',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Pemandangan Desa Borong Bulukumba',
      },
    ],
  },
};

import { ToastContainer } from '@/components/ui/ToastContainer';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${plusJakartaSans.variable}`}>
      <body className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased">
        <AppChrome footer={<Footer />}>{children}</AppChrome>
        <ToastContainer />
      </body>
    </html>
  );
}
