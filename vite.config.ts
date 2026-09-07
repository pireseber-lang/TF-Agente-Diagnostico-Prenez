import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const basePath = '/TF-Agente-Diagnostico-Prenez/'

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        id: basePath,
        name: 'Diagnóstico de preñez',
        short_name: 'Diag. preñez',
        description: 'Carga móvil de jornadas de diagnóstico de preñez bovina.',
        theme_color: '#234a36',
        background_color: '#f4f1e8',
        display: 'standalone',
        orientation: 'portrait',
        scope: basePath,
        start_url: basePath,
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{html,js,css,svg}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    environment: 'node',
  },
})
