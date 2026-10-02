import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    // three.js lives in the lazily-imported 3D chunk; it is expected to be large.
    chunkSizeWarningLimit: 1000,
  },
})
