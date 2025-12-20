import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuração para forçar cache longo em imagens estáticas
  async headers() {
    return [
      {
        // Aplica a regra para todos os arquivos de imagem na pasta public
        source: '/:all*(svg|jpg|png|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
