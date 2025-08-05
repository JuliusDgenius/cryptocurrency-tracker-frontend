import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  // Development server
  server: {
    port: 5173,
    host: true, // Better than allowedHosts: true
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Preview server (for production builds)
  preview: {
    port: 4173,
    host: true,
    strictPort: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for better caching
          vendor: ['react', 'react-dom'],
          // UI library chunk
          ui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          // Utilities chunk
          utils: ['axios', 'date-fns', 'lodash.merge', 'zod']
        }
      }
    },
    // Warn about large chunks
    chunkSizeWarningLimit: 1000
  },
  
  // Environment variables
  envPrefix: 'VITE_',
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled'
    ]
  }
})