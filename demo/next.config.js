/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server-side rendering
  target: 'serverless',
  // Generate source maps for better error messages
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
