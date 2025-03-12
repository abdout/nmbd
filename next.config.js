/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
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