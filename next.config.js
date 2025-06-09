/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/michaeltugsjack' : '';

const nextConfig = {
  output: 'export',  // Enables static HTML export
  basePath,
  assetPrefix: isProd ? '/michaeltugsjack/' : '',
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side features since we're doing static export
  trailingSlash: true,
  reactStrictMode: true,
  // Configure both runtime and build-time config
  publicRuntimeConfig: {
    basePath,
  },
  // Ensure static assets are handled correctly
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig 