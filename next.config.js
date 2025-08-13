/** @type {import('next').NextConfig} */
const allowedDomains = process.env.DOMAINS
  ? process.env.DOMAINS.split(',').map(domain => domain.trim())
  : [];

const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: allowedDomains,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'deskpulse-be.bronzebyte.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'deskpulse-be.bronzebyte.com',
        pathname: '/uploads/**',
      }
    ],
  },
};

module.exports = nextConfig;
