/** @type {import('next').NextConfig} */
const allowedDomains = process.env.IMAGE_DOMAINS
  ? process.env.IMAGE_DOMAINS.split(',').map(domain => domain.trim())
  : ['192.168.0.40', 'localhost', '145.223.19.178'];

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
