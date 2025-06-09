const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  fallbacks: {
    // Failed page requests fallback to this.
    document: "/~offline",
    // This is for /_next/.../.json files.
    data: "/fallback.json",
    // This is for images.
    image: "/fallback.webp",
    // This is for audio files.
    audio: "/fallback.mp3",
    // This is for video files.
    video: "/fallback.mp4",
    // This is for fonts.
    font: "/fallback-font.woff2",
  },
  experimental: {
    // turbo: {
    //   enabled: true,
    // },
    reactServerComponents: false,  // Disable React Server Components if you're not using them
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "img-src 'self' data:;",
              "script-src 'self';",
              "style-src 'self' 'unsafe-inline';",
            ].join(" "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
});

module.exports = withPWA({
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // disable default in-memory caching,
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_API_PIMS_BASE_URL: process.env.API_PIMS_BASE_URL,
    NEXT_SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
    NEXT_PUBLIC_DXCLOUD_KEY: process.env.NEXT_PUBLIC_DXCLOUD_KEY,
    NEXT_PUBLIC_DXCLOUD_URL: process.env.NEXT_PUBLIC_DXCLOUD_URL,
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
});

