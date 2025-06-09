/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',  // Enables static HTML export
  basePath: isProd ? '/michaeltugsjack' : '',
  assetPrefix: isProd ? '/michaeltugsjack/' : '',
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side features since we're doing static export
  trailingSlash: true,
  reactStrictMode: true,
  // Explicitly configure static file serving
  publicRuntimeConfig: {
    basePath: isProd ? '/michaeltugsjack' : '',
  },
}

module.exports = nextConfig 