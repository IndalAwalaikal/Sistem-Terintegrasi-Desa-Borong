import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ChevronRight,
  Shield,
  Heart,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';
import { getProfilDesa } from '@/lib/services/desa.service';

export const Footer = async () => {
  const profil = await getProfilDesa();
    const logoBulukumba = '/logo-bulukumba.webp';

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800 on-dark">
      <div className="container-desa">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Col 1: Profil Desa */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white p-1.5 flex items-center justify-center shadow-sm">
                <Image
                  src={logoBulukumba}
                  alt="Lambang Kabupaten Bulukumba"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-tight">DESA BORONG</h3>
                <p className="text-xs text-primary-400 font-semibold">Website Resmi Pemerintahan</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Platform layanan publik dan pusat informasi terpadu Desa Borong, Kecamatan Herlang,{' '}
              <a
                href="https://bulukumbakab.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:underline font-bold inline-flex items-center gap-1"
              >
                Kabupaten Bulukumba <Globe className="w-3 h-3 inline" />
              </a>
              , Sulawesi Selatan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://bulukumbakab.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-primary-600 hover:text-white text-neutral-300 text-[11px] font-bold transition-colors inline-flex items-center gap-1.5 border border-neutral-800"
                title="Website Resmi Kabupaten Bulukumba"
              >
                <Globe className="w-3.5 h-3.5 text-primary-400" />
                bulukumbakab.go.id
              </a>
              <a href="https://www.facebook.com/search/top?q=Desa%20Borong" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-neutral-900 hover:bg-primary-600 hover:text-white text-neutral-400 transition-colors" title="Facebook" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/explore/tags/desaborong/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-neutral-900 hover:bg-primary-600 hover:text-white text-neutral-400 transition-colors" title="Instagram" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/results?search_query=desa+borong" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-neutral-900 hover:bg-primary-600 hover:text-white text-neutral-400 transition-colors" title="YouTube" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-4 border-primary-500 pl-3">
              Navigasi Utama
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { href: '/profil', label: 'Profil & Sejarah Desa' },
                { href: '/profil/struktur-organisasi', label: 'Struktur Perangkat Desa' },
                { href: '/informasi/statistik', label: 'Statistik Penduduk' },
                { href: '/informasi/apbdes', label: 'Transparansi Anggaran (APBDes)' },
                { href: '/informasi/pajak', label: 'Transparansi Pajak Desa' },
                { href: '/informasi/peta', label: 'Peta Lokasi Desa' },
                { href: '/galeri', label: 'Galeri Kegiatan' },
                { href: '/umkm', label: 'Direktori UMKM Desa' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 hover:text-primary-400 transition-colors text-neutral-400 hover:translate-x-1 duration-200"
                  >
                    <ChevronRight className="w-3 h-3 text-primary-500" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://bulukumbakab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors hover:translate-x-1 duration-200"
                >
                  <ChevronRight className="w-3 h-3 text-primary-500" />
                  Portal Pemkab Bulukumba ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan Persuratan */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-4 border-primary-500 pl-3">
              Layanan Warga
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { href: '/layanan/SKD', label: 'Surat Keterangan Domisili (SKD)' },
                { href: '/layanan/SKU', label: 'Surat Keterangan Usaha (SKU)' },
                { href: '/layanan/SKTM', label: 'Surat Keterangan Tidak Mampu' },
                { href: '/layanan/SPK', label: 'Surat Pengantar KTP' },
                { href: '/layanan/lacak', label: 'Lacak Status Resi Surat' },
                { href: '/faq', label: 'FAQ & Panduan Layanan' },
                { href: '/pengaduan', label: 'Form Pengaduan Warga' },
                { href: '/login', label: 'Login Sesi Warga' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 hover:text-primary-400 transition-colors text-neutral-400 hover:translate-x-1 duration-200"
                  >
                    <ChevronRight className="w-3 h-3 text-primary-500" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Info Kontak Kantor */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-4 border-primary-500 pl-3">
              Kontak Kantor Desa
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/nSJcjAg82dk2tuLm7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors underline decoration-dotted"
                  title="Buka lokasi Desa Borong di Google Maps"
                >
                  {profil.alamatKantor} (Petunjuk Arah ↗)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>{profil.telepon}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>{profil.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <span>{profil.jamLayanan}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © 2026 Pemerintah Desa Borong. Bagian dari{' '}
            <a
              href="https://bulukumbakab.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-primary-400 font-semibold underline"
            >
              Kabupaten Bulukumba
            </a>
            . Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/dashboard/login" className="hover:text-primary-400 transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-accent-500" />
              Akses Admin Desa
            </Link>
            <span className="flex items-center gap-1">
              Bersama Membangun Desa Borong yang Lebih Maju dan Terhubung
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
