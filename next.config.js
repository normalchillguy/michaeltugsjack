/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/michaeltugsjack' : '',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for consistent paths
  trailingSlash: true,
  reactStrictMode: true,
}

module.exports = nextConfig 