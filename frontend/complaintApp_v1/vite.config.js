import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Asegurarse de que las variables de entorno estén disponibles
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
  },
  build: {
    outDir: 'dist'  // Carpeta de salida para producción
  },
  server: {
    // Configuración del servidor de desarrollo
    port: 5173,
    open: true,
    cors: true,
  },
});