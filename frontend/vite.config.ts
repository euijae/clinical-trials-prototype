import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/sse': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        ws: false,
        // Ensure proper SSE headers are preserved
        headers: {
          Connection: 'keep-alive',
        },
      },
    },
  },
});
