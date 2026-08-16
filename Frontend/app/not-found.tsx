import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Search, FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-24 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa max-w-2xl text-center space-y-6">
        <div className="text-[110px] sm:text-[140px] leading-none font-black text-primary-600/15 tracking-tight select-none">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-neutral-500">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau alamatnya salah.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4" />
              Ke Beranda
            </Button>
          </Link>
          <Link href="/cari">
            <Button variant="outline">
              <Search className="w-4 h-4" />
              Cari di Website
            </Button>
          </Link>
          <Link href="/layanan">
            <Button variant="ghost">
              <FileText className="w-4 h-4" />
              Layanan Surat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}