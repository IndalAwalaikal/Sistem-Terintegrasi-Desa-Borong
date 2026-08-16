import React from 'react';
import { getProfilDesa } from '@/lib/services/desa.service';
import { ProfilClient } from './ProfilClient';

export const metadata = { title: 'Profil Desa Borong', description: 'Gambaran umum, visi, misi, dan pemerintahan Desa Borong, Kecamatan Herlang, Kabupaten Bulukumba.' };

export default async function ProfilPage() {
  const profil = await getProfilDesa();
  return <ProfilClient profil={profil} />;
}
