import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development practices
  reactStrictMode: true,
  
  // Image optimization settings
  images: {
    domains: ['ik.imagekit.io', 'imagekit.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.imagekit.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // i18n configuration for Arabic support - commented out due to type constraints
  // Update: Next.js App Router has built-in i18n support that works differently
  // Please use the internationalization features of App Router instead
  /* i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: true,
  }, */
  
  // Improve SEO with more control over HTTP headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Improve performance with compression
  compress: true,
  
  // Configure redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Configure rewrites for clean URLs
  async rewrites() {
    return [
      {
        source: '/about-us',
        destination: '/about',
      },
    ];
  },
  
  // Keep existing ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
