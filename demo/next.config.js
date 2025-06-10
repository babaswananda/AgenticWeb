/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  // Generate source maps for better error messages
  productionBrowserSourceMaps: true
};

module.exports = nextConfig;
