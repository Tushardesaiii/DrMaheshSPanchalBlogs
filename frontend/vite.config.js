import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    proxy: {
      // Optional: Proxy API requests during development
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    },
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        }
      }
    }
  },
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
  }
})
