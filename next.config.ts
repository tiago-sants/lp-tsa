import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      { source: '/demo', destination: '/demo.html' },
    ];
  },
};

export default nextConfig;
