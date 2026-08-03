import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/katex/')) return 'katex';

          const questionBank = id.match(/\/src\/data\/questions\/([^/]+)\.json$/);
          return questionBank ? `questions-${questionBank[1]}` : undefined;
        }
      }
    }
  }
});
