/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Performance ──────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false, // Remove "X-Powered-By: Next.js" fingerprint
  swcMinify: true,

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
      'clsx',
      'tailwind-merge',
    ],
  },

  images: {
    domains: [
      'images.unsplash.com',
      'illustrations.popsy.co',
      'mkaqspqmdspoisdjduza.supabase.co', // Supabase storage images
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24h image cache
  },

  // ── Security & Cache HTTP Headers ────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Next.js dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://images.unsplash.com https://illustrations.popsy.co https://mkaqspqmdspoisdjduza.supabase.co",
              "connect-src 'self' ws: wss: https://mkaqspqmdspoisdjduza.supabase.co wss://mkaqspqmdspoisdjduza.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/(_next/static|favicon.ico|icons|images)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // HTML pages / SSR routes — revalidate to ensure new deployment asset hashes are picked up immediately
        source: '/((?!_next/static|_next/image|favicon.ico|icons|images|api).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        // API routes — no cache by default
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache' },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

