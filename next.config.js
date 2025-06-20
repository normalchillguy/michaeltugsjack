/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  // distDir: 'dist',
  basePath: isProd ? '/michaeltugsjack' : '',
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  // Ensure trailing slashes for consistent paths
  trailingSlash: true,
  reactStrictMode: true,
  // Properly handle static assets
  assetPrefix: isProd ? '/michaeltugsjack/' : '',
  // Ensure static files are copied
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(json|svg)$/,
      type: 'asset/resource',
    });
    return config;
  },
}

module.exports = nextConfig 