import React from 'react';
import { getBeritaList } from '@/lib/services/berita.service';
import { BeritaClient } from './BeritaClient';

export const metadata = {
  title: 'Berita & Artikel Desa Borong',
  description: 'Daftar berita, kegiatan, pembangunan, dan pengumuman resmi Desa Borong, Kecamatan Herlang, Kabupaten Bulukumba.',
};

interface BeritaPageProps {
  searchParams: Promise<{ kategori?: string; search?: string; page?: string }>;
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const resolvedParams = await searchParams;
  const kategori = resolvedParams.kategori as any;
  const search = resolvedParams.search;
  const page = parseInt(resolvedParams.page || '1', 10);

  const result = await getBeritaList({ kategori, search, page, perPage: 6 });

  return <BeritaClient data={result.data} kategori={kategori} />;
}
