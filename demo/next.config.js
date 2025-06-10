/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // Generate source maps for better error messages
  productionBrowserSourceMaps: true
};

module.exports = nextConfig;
