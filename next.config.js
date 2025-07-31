/** @type {import('next').NextConfig} */
const allowedDomains = process.env.DOMAINS
  ? process.env.DOMAINS.split(',').map(domain => domain.trim())
  : ['192.168.1.26', 'localhost', '145.223.19.178'];

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
