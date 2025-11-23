import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sugarcane Disease Detector',
        short_name: 'SC Detector',
        description: 'AI-powered sugarcane leaf disease classification',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,onnx}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'onnx-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ],
  assetsInclude: ['**/*.onnx'], // Only include .onnx model files as assets
  build: {
    target: 'esnext',
    assetsInlineLimit: 0, // Don't inline any assets
    rollupOptions: {
      output: {
        manualChunks: {
          'onnx': ['onnxruntime-web']
        }
      },
      external: [
        // Exclude WASM files - they'll be loaded from CDN
        /\.wasm$/
      ]
    }
  }
})
