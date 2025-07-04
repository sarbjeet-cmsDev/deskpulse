/** @type {import('next').NextConfig} */
const allowedDomains = process.env.IMAGE_DOMAINS
  ? process.env.IMAGE_DOMAINS.split(',').map(domain => domain.trim())
  : ['192.168.0.40', 'localhost'];

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: allowedDomains,
  },
};

module.exports = nextConfig;
