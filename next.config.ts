import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Permitir cualquier dominio de imagen usando remotePatterns
    // Idealmente se debería usar un dominio de imagen que sea accesible públicamente
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Habilitar standalone output para Docker
  output: 'standalone',
};

export default nextConfig;
