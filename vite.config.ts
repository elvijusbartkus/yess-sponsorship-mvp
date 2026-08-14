import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Keeps the API same-origin in dev, so the frontend never needs a key or a
    // CORS config and `VITE_API_URL` stays unset until deploy.
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
