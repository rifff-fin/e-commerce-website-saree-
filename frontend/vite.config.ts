import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200, // 5173 / 5180 / 5190 are used by other studio projects
    strictPort: true,
    // The credits page imports ../content/images.json (the photo records at the repo root)
    fs: { allow: ['..'] },
    // Same-origin /api in development, like the Netlify proxy in production
    proxy: {
      '/api': 'http://localhost:5010',
    },
  },
  preview: {
    port: 5201,
    proxy: {
      '/api': 'http://localhost:5010',
    },
  },
});
