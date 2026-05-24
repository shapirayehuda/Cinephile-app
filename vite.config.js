import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves from /Cinephile-app/; dev uses /
  base: command === 'build' ? '/Cinephile-app/' : '/',
}))
