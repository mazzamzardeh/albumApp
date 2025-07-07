import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/albums': 'http://localhost:3001',
      '/add': 'http://localhost:3001',
      '/update': 'http://localhost:3001',
      '/delete': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001'
    }
  }
})
