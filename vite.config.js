import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Deshabilitar la minificación (opcional)
    minify: false, 

    // Deshabilitar los source maps (opcional)
    sourcemap: false,

    // Configuración para esbuild (opcional, ajusta el target si necesitas optimizar más)
    esbuild: {
      target: 'esnext',  // Usar un objetivo más moderno puede reducir el tamaño
    },
  },
  server: {
    historyApiFallback: true, // Agregar esta línea para manejar rutas en el servidor de desarrollo
  },
});
