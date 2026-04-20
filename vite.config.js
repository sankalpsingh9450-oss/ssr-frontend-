import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react-router-dom')) return 'router'
          if (id.includes('@tanstack/react-query')) return 'query'
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) return 'forms'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react-icons')) return 'icons'
          if (id.includes('react') || id.includes('react-dom')) return 'react-core'
          return 'vendor'
        },
      },
    },
  },
})
