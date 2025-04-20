/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Disable TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'images.unsplash.com', 
      'res.cloudinary.com', 
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com'
    ],
    // Enable optimization in all environments
    unoptimized: false,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png|webp)',
        headers: [
          {
            key: 'Cache-Control',
            // Improve caching - 30 days for static images
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          }
        ],
      },
    ]
  },
  eslint: {
    // Completely disable ESLint in Next.js
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 