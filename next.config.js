/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    ignoreDuringBuilds: true, 
  },
   images: {
    domains: ['192.168.0.40'], 
  },
};

module.exports = nextConfig;
