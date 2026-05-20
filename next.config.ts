import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/cart',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/shop-sarees',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
