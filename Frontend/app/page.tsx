import React from 'react';
import { HeroSection } from '@/components/features/beranda/HeroSection';
import { InfoTicker } from '@/components/features/beranda/InfoTicker';
import { StatsSection } from '@/components/features/beranda/StatsSection';
import { QuickServices } from '@/components/features/beranda/QuickServices';
import { LatestNewsSection } from '@/components/features/beranda/LatestNewsSection';
import { UmkmShowcase } from '@/components/features/beranda/UmkmShowcase';
import { HomeCTA } from '@/components/features/beranda/HomeCTA';
import { Reveal } from '@/components/ui/Reveal';
import { getProfilDesa } from '@/lib/services/desa.service';
import { getStatistikPenduduk } from '@/lib/services/statistik.service';
import { getJenisSuratList } from '@/lib/services/persuratan.service';
import { getBeritaList } from '@/lib/services/berita.service';
import { getUmkmList } from '@/lib/services/umkm.service';

export default async function HomePage() {
  const [profil, statistik, services, newsResult, businesses] = await Promise.all([
    getProfilDesa(),
    getStatistikPenduduk(),
    getJenisSuratList(),
    getBeritaList({ page: 1, perPage: 4 }),
    getUmkmList(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Fullwidth Carousel */}
      <HeroSection profil={profil} />

      {/* 2. Running Announcement Ticker */}
      <InfoTicker />

      {/* 3. Demographic & Village Stats Counter */}
      <Reveal>
        <StatsSection statistik={statistik} profil={profil} />
      </Reveal>

      {/* 4. Popular Online Services */}
      <Reveal delay={80}>
        <QuickServices services={services} />
      </Reveal>

      {/* 5. Latest News Highlight & Articles Grid */}
      <Reveal delay={120}>
        <LatestNewsSection news={newsResult.data} />
      </Reveal>

      {/* 6. Local UMKM Showcase */}
      <Reveal delay={80}>
        <UmkmShowcase businesses={businesses} />
      </Reveal>

      {/* 7. Call To Action Banner — Pengaduan & Bantuan */}
      <HomeCTA />
    </div>
  );
}
