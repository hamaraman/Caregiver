import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8081',
      '/oauth2': 'http://localhost:8081',
      '/login/oauth2': 'http://localhost:8081'
    }
  }
})
