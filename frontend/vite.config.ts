import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Proxy API calls during dev to the backend to avoid CORS and host issues
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        // Do not rewrite: backend expects /api prefix
        // rewrite: (path) => path,
      },
    },
  },
})
