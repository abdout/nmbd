/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'res.cloudinary.com', 
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com'
    ],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig 