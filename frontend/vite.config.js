import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:8081',
      '/oauth2': 'http://localhost:8081',
      '/login': 'http://localhost:8081'
    }
  }
})
