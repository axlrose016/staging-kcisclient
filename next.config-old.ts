import type { NextConfig } from "next";
require("dotenv").config();

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
})

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL,
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
        ],
      },
    ];
  },
};

module.exports = withPWA({
	reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  // next.js config
    env: {
      NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL,
      NEXT_PUBLIC_API_PIMS_BASE_URL: process.env.API_PIMS_BASE_URL
    },
  }
})