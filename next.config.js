/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enables static HTML export
  basePath: process.env.NODE_ENV === 'production' ? '/michaeltugsjack' : '',
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'normalchillguy.github.io',
        pathname: '/michaeltugsjack/**',
      },
    ],
  },
  // Disable server-side features since we're doing static export
  trailingSlash: true,
  reactStrictMode: true,
  experimental: {
    optimizeServerReact: true,
  },
  // Disable Next.js devtools
  devIndicators: {
    position: "bottom-right",
  },
  // Suppress deprecation warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 