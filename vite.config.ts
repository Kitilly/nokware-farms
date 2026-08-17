import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Allows the dev server to respond when accessed through a localtunnel
    // URL (used for sharing the running app for client review). The
    // leading dot matches any random subdomain localtunnel/cloudflare assigns.
    allowedHosts: ['.loca.lt', '.trycloudflare.com'],
  },
  preview: {
    // Same allowance for `vite preview` (serves the production build),
    // which has its own separate host check.
    allowedHosts: ['.loca.lt', '.trycloudflare.com'],
  },
})
