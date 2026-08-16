import React from 'react';
import { getJenisSuratList } from '@/lib/services/persuratan.service';
import { LayananClient } from './LayananClient';

export const metadata = {
  title: 'Layanan Persuratan Online Desa Borong',
  description: 'Daftar 12 jenis surat keterangan & pengantar resmi desa yang dapat diajukan secara daring.',
};

export default async function LayananPage() {
  const jenisSuratList = await getJenisSuratList();
  return <LayananClient jenisSuratList={jenisSuratList} />;
}
