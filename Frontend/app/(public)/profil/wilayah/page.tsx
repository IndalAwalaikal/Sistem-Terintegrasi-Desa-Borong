import React from 'react';
import Image from 'next/image';
import { mockDusun, mockProfilDesa } from '@/lib/mock/desa.mock';
import { Card, CardBody } from '@/components/ui/Card';
import { MapPin, Users, Home, Compass, Globe, ExternalLink, Navigation, Building2 } from 'lucide-react';

export const metadata = {
  title: 'Wilayah Administratif & Geografis Desa Borong',
};

export default function WilayahPage() {
  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold">
            <Compass className="w-4 h-4" />
            <span>WILAYAH ADMINISTRATIF &amp; GEOGRAFIS</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">
            Wilayah &amp; Pembagian Dusun
          </h1>
          <p className="text-sm text-neutral-500">
            Desa Borong berada di Kecamatan Herlang,{' '}
            <a
              href="https://bulukumbakab.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
            >
              Kabupaten Bulukumba
            </a>
            . Memiliki luas wilayah 12,5 km² yang terbagi menjadi 4 Dusun, 8 RW, dan 16 RT.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <a
              href="https://maps.app.goo.gl/nSJcjAg82dk2tuLm7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-md shadow-primary-600/20"
            >
              <Navigation className="w-4 h-4" />
              Buka Google Maps Desa Borong ↗
            </a>
          </div>
        </div>

        {/* Kantor Desa Photo Card */}
        <Card className="overflow-hidden border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 bg-white dark:bg-neutral-900 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <Image
                src="/kantor_desa.png"
                alt="Kantor Desa Borong"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                <Building2 className="w-4 h-4" />
                <span>KANTOR PEMERINTAHAN DESA</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Kantor Desa Borong
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Pusat kegiatan administrasi pemerintahan, pelayanan surat warga, dan pertemuan musyawarah desa berlokasi di Dusun Borong Utama, Herlang, Bulukumba.
              </p>
              <a
                href="https://maps.app.goo.gl/nSJcjAg82dk2tuLm7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all"
              >
                <MapPin className="w-4 h-4" />
                Petunjuk Arah Google Maps
              </a>
            </div>
          </div>
        </Card>

        {/* Batas-Batas Wilayah */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white text-center">
            Batas-Batas Wilayah Desa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-t-4 border-t-primary-500 bg-white dark:bg-neutral-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">SEBELAH UTARA</span>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mt-1">Desa Singa</h3>
              <p className="text-xs text-neutral-500">Kecamatan Herlang</p>
            </Card>
            <Card className="p-5 border-t-4 border-t-emerald-500 bg-white dark:bg-neutral-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">SEBELAH SELATAN</span>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mt-1">Desa Tugondeng</h3>
              <p className="text-xs text-neutral-500">Kecamatan Herlang</p>
            </Card>
            <Card className="p-5 border-t-4 border-t-blue-500 bg-white dark:bg-neutral-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">SEBELAH TIMUR</span>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mt-1">Teluk Bone / Laut Flores</h3>
              <p className="text-xs text-neutral-500">Pesisir Pantai Herlang</p>
            </Card>
            <Card className="p-5 border-t-4 border-t-amber-500 bg-white dark:bg-neutral-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">SEBELAH BARAT</span>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white mt-1">Desa Gunturu</h3>
              <p className="text-xs text-neutral-500">Kecamatan Herlang</p>
            </Card>
          </div>
        </div>

        {/* Parameter Geografis, Topografi, & Orbitasi */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white text-center">
            Parameter Geografis, Topografi &amp; Orbitasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white dark:bg-neutral-900 space-y-2 border border-slate-200 dark:border-neutral-800 shadow-md">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-600">LUAS WILAYAH</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">12,5 km²</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seluas 1.250 Hektar yang mencakup lahan pemukiman, perkebunan rakyat, dan kawasan pertanian produktif di 4 Dusun.
              </p>
            </Card>

            <Card className="p-6 bg-white dark:bg-neutral-900 space-y-2 border border-slate-200 dark:border-neutral-800 shadow-md">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">KETINGGIAN TEMPAT</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">50 – 250 mdpl</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kawasan dataran tinggi dan perbukitan dengan kondisi tanah subur serta iklim tropis bercurah hujan sedang hingga tinggi.
              </p>
            </Card>

            <Card className="p-6 bg-white dark:bg-neutral-900 space-y-2 border border-slate-200 dark:border-neutral-800 shadow-md">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600">ORBITASI &amp; JARAK</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">35 km ke Bulukumba</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Jarak ke Ibu Kota Kecamatan Herlang ±7 km, serta ±170 km ke Ibu Kota Provinsi (Makassar).
              </p>
            </Card>
          </div>
        </div>

        {/* Dusun Cards Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white text-center">
            Pembagian 4 Dusun di Desa Borong
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockDusun.map((dusun) => (
              <Card key={dusun.id} hoverable className="p-6">
                <div className="w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                  {dusun.nama}
                </h3>
                <p className="text-xs text-neutral-500 mb-4">Kepala Dusun: <span className="font-bold text-neutral-800 dark:text-neutral-200">{dusun.ketua}</span></p>

                <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Jumlah Penduduk:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{dusun.jumlahPenduduk} Jiwa</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Luas Wilayah:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{dusun.luasWilayah}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Jumlah RT / RW:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{dusun.jumlahRT} RT / {dusun.jumlahRW} RW</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
