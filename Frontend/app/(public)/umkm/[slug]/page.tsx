import React from 'react';
import { notFound } from 'next/navigation';
import { getUmkmBySlug } from '@/lib/services/umkm.service';
import { UmkmDetailClient } from './UmkmDetailClient';

interface UmkmDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: UmkmDetailPageProps) {
  const { slug } = await params;
  const umkm = await getUmkmBySlug(slug);
  if (!umkm) return { title: 'UMKM Tidak Ditemukan' };

  return {
    title: umkm.namaUsaha,
    description: umkm.deskripsi,
  };
}

export default async function UmkmDetailPage({ params }: UmkmDetailPageProps) {
  const { slug } = await params;
  const umkm = await getUmkmBySlug(slug);

  if (!umkm) {
    notFound();
  }

  return <UmkmDetailClient umkm={umkm} />;
}
