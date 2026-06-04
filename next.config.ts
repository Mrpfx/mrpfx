import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mrpfx.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mrpfx-backend.onrender.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BACKEND_URL || 'https://mrpfx-backend.onrender.com'}/api/v1/:path*`,
      },
      {
        source: '/wp-content/:path*',
        destination: `${process.env.BACKEND_URL || 'https://mrpfx-backend.onrender.com'}/wp-content/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${process.env.BACKEND_URL || 'https://mrpfx-backend.onrender.com'}/media/:path*`,
      },
      {
        source: '/assets/:path*',
        destination: `${process.env.BACKEND_URL || 'https://mrpfx-backend.onrender.com'}/assets/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            // Basic CSP to prevent obvious XSS but allow necessary scripts/styles
            // Adjust 'self' and domains as needed based on actual usage (e.g. Google Fonts, Analytics)
            key: 'Content-Security-Policy',
            value: "default-src 'self' http: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com https://embed.tawk.to https://*.tawk.to https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://embed.tawk.to https://*.tawk.to; font-src 'self' data: https://fonts.gstatic.com https://embed.tawk.to; img-src 'self' data: http: https:; connect-src 'self' http: https: wss://*.tawk.to; frame-src 'self' https: https://*.tawk.to;"
          }
        ]
      }
    ];
  },
};

export default nextConfig;
