/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enables static HTML export
  basePath: process.env.NODE_ENV === 'production' ? '/michaeltugsjack' : '',
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side features since we're doing static export
  trailingSlash: true,
  reactStrictMode: true,
}

module.exports = nextConfig 