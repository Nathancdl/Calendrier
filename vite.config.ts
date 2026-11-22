import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Chemins relatifs : le site fonctionne aussi dans un sous-dossier (GitHub Pages, etc.).
  base: './',
  plugins: [react()],
})
