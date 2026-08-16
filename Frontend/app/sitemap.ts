import { MetadataRoute } from 'next';
import { mockBerita } from '@/lib/mock/berita.mock';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://desaborong.bulukumbakab.go.id';

  const newsUrls = mockBerita.map((item) => ({
    url: `${baseUrl}/berita/${item.slug}`,
    lastModified: new Date(item.tanggalTerbit),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const routes = [
    '',
    '/profil',
    '/profil/sejarah',
    '/profil/struktur-organisasi',
    '/profil/wilayah',
    '/informasi/statistik',
    '/informasi/apbdes',
    '/informasi/peta',
    '/informasi/agenda',
    '/berita',
    '/layanan',
    '/layanan/lacak',
    '/pengaduan',
    '/galeri',
    '/umkm',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes, ...newsUrls];
}
