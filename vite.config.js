import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Three.js is only reached through a lazy import, so it ships as its own chunk.
  build: { chunkSizeWarningLimit: 1200 },
})
