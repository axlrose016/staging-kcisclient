import { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

// Initialize PWA plugin
const withPWA = withPWAInit({
  dest: 'public',
  fallbacks: {
    document: '/~offline',
    data: '/fallback.json',
    image: '/fallback.webp',
    audio: '/fallback.mp3',
    video: '/fallback.mp4',
    font: '/fallback-font.woff2',
  },
});

// Collect domains from env vars (if any)
const connectSrcDomains = [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  process.env.NEXT_PUBLIC_API_PIMS_BASE_URL,
  process.env.NEXT_PUBLIC_DXCLOUD_URL,
  process.env.NEXT_PUBLIC_API_BASE_URL_KCIS,
]
  .filter(Boolean)
  .map((url) => {
    try {
      return new URL(url!).origin;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

// Construct connect-src directive
const connectSrc = [
  "'self'",
  'https://www.google.com',
  'https://www.gstatic.com',
  ...new Set(connectSrcDomains),
].join(' ');

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://staging-kcisclient.vercel.app/' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              `connect-src ${connectSrc};`,
              "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "font-src 'self' https://fonts.gstatic.com;",
              "img-src 'self' data: blob: https://api.qrserver.com http://www.w3.org/2000/svg;",
              "frame-src 'self' https://www.google.com/;",
              "object-src 'none';",
              "frame-ancestors 'self' https://www.google.com/;"
            ].join(' '),
          }
        ],
      },
    ];
  },
  experimental: {
    // turbo: { enabled: true },
  },
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_API_PIMS_BASE_URL: process.env.API_PIMS_BASE_URL,
    NEXT_SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
    NEXT_PUBLIC_DXCLOUD_KEY: process.env.NEXT_PUBLIC_DXCLOUD_KEY,
    NEXT_PUBLIC_DXCLOUD_URL: process.env.NEXT_PUBLIC_DXCLOUD_URL,
    JSON_SECRET_KEY: process.env.JSON_SECRET_KEY,
    NEXT_PUBLIC_API_BASE_URL_KCIS: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS,
  },
  async rewrites() {
    return [
      {
        source: '/api-libs/:path*',
        destination: 'https://dxcloud.dswd.gov.ph/api/:path*',
      },
      {
        source: '/api-kcis/:path*',
        destination: 'https://kcnfms.dswd.gov.ph/kcis/api/:path*',
      },
    ];
  },
};

export default withPWA(nextConfig);
