import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Natursur',
        short_name: 'Natursur',
        start_url: '/',
        display: 'standalone',
        background_color: '#f2f2f2',
        theme_color: '#e6e6e6',
        icons: [
          {
            src: '/icons/logo_natursur-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/logo_natursur-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
