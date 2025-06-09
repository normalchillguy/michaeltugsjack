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
    enabled: false,
  },
}

module.exports = nextConfig 