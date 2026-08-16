'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { MapPin, Navigation, School, Building2, Hospital, Trees } from 'lucide-react';
import { mockProfilDesa } from '@/lib/mock/desa.mock';

export default function PetaPage() {
  const [kategori, setKategori] = useState('semua');
  const fasilitas = [
    { nama: 'Kantor Desa Borong', kategori: 'Pemerintahan', lat: -2.9584, lng: 119.8561, icon: Building2 },
    { nama: 'SD Negeri 1 Borong', kategori: 'Pendidikan', lat: -2.959, lng: 119.857, icon: School },
    { name: 'Puskesmas Pembantu (Pustu)', kategori: 'Kesehatan', lat: -2.9575, lng: 119.8555, icon: Hospital },
    { nama: 'Ekowisata Kopi Tondon', kategori: 'Pariwisata', lat: -2.961, lng: 119.859, icon: Trees },
  ];
  const kategoriList = ['semua', ...Array.from(new Set(fasilitas.map((f) => f.kategori)))];
  const filtered = kategori === 'semua' ? fasilitas : fasilitas.filter((f) => f.kategori === kategori);

  return (
    <div className="py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="container-desa space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>PETA DESA &amp; WILAYAH</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">
            Peta Lokasi &amp; Fasilitas Desa Borong
          </h1>
          <p className="text-sm text-neutral-500">
            Lokasi kantor desa, sekolah, pustu, dan titik fasilitas penting di Kecamatan Herlang,{' '}
            <a
              href="https://bulukumbakab.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
            >
              Kabupaten Bulukumba
            </a>
            .
          </p>
          <div className="pt-1 flex flex-wrap justify-center gap-3">
            <a
              href="https://maps.app.goo.gl/nSJcjAg82dk2tuLm7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-md shadow-primary-600/20"
            >
              <Navigation className="w-4 h-4" />
              Buka Peta Desa Borong di Google Maps (App / Web) ↗
            </a>
          </div>
        </div>

        {/* Map Container */}
        <Card className="overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl">
          <div className="relative w-full h-[450px] bg-neutral-900 flex items-center justify-center text-white">
            <iframe
              title="Peta Desa Borong"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://maps.google.com/maps?q=-5.25,120.30&z=14&output=embed"
            />
            <div className="absolute bottom-4 right-4 bg-neutral-950/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-white flex items-center gap-2 border border-white/10 shadow-lg">
              <MapPin className="w-4 h-4 text-primary-400" />
              <span>Desa Borong, Herlang, Bulukumba</span>
              <a
                href="https://maps.app.goo.gl/nSJcjAg82dk2tuLm7"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 font-bold text-primary-400 hover:underline"
              >
                Petunjuk Arah ↗
              </a>
            </div>
          </div>
        </Card>

        {/* Kategori Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {kategoriList.map((item) => (
            <button
              key={item}
              onClick={() => setKategori(item)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-colors ${
                kategori === item
                  ? 'bg-primary-700 text-white shadow-md'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-primary-400 hover:text-primary-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Fasilitas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((f, i) => (
            <Card key={i} className="p-5 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 flex items-center justify-center shrink-0">
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{f.nama}</h4>
                  <p className="text-xs text-neutral-500">{f.kategori}</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${f.lat},${f.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                Buka di Google Maps
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
