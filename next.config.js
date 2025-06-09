/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enables static HTML export
  basePath: '/michaeltugsjack', // Your repository name
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.0.0.111',
        port: '32400',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 31536000, // Cache images for 1 year
  },
  experimental: {
    optimizeServerReact: true,
  },
  // Disable Next.js devtools
  devIndicators: false,
}

module.exports = nextConfig 