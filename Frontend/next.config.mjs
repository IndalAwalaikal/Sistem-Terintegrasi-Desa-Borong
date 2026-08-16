// next.config.mjs — Website Desa Borong
// Rewrites semua request /api/* (dan /uploads/*) ke backend Go melalui internal Docker network.
// Variabel NEXT_PUBLIC_* dan API_INTERNAL_URL disuplai lewat Docker BUILD ARG → ENV (lihat Frontend/Dockerfile).
const API_INTERNAL_URL = process.env.API_INTERNAL_URL || 'http://backend:8080';

export default {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Website Desa Borong',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3300',
  },

  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_INTERNAL_URL}/api/:path*` },
      { source: '/uploads/:path*', destination: `${API_INTERNAL_URL}/uploads/:path*` },
    ];
  },
};
