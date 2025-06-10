/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '',
  assetPrefix: '',
  images: {
    unoptimized: true,
  },
  // Ensure static export
  output: 'export',
  // Optional: Enable static HTML export
  distDir: 'out',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
};

module.exports = nextConfig;
