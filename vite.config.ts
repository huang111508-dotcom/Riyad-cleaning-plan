import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Increase warning limit to 1000kb (1MB) to prevent deployment warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manually split large libraries into separate chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('@google/genai')) {
              return 'genai';
            }
            // Put other dependencies in a generic vendor chunk
            return 'vendor';
          }
        }
      }
    }
  }
});