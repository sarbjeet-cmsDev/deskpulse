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
  },
};

module.exports = nextConfig;
