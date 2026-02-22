import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Vérifie cet import

export default defineConfig({
  plugins: [
    tailwindcss(), // Tailwind doit être AVANT ou APRES react, mais il doit y être !
    react(),
  ],
})