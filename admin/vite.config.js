import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      closeBundle() {
        const src = path.resolve(__dirname, 'redirects')
        const dest = path.resolve(__dirname, 'dist/redirects')
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest)
          console.log('Copied redirects to dist/redirects')
        }
      }
    }
  ],
})
