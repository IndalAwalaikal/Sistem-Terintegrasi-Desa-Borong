/** @type {import('next').NextConfig} */
const apiInternalUrl = process.env.API_INTERNAL_URL?.replace(/\/$/, '');

const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'iconlogovector.com',
      },
    ],
  },
  async rewrites() {
    if (!apiInternalUrl) return [];
    return [
      { source: '/api/:path*', destination: `${apiInternalUrl}/api/:path*` },
      { source: '/uploads/:path*', destination: `${apiInternalUrl}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
