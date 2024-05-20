import { v4wp } from 'vite-for-wp';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  root: 'client',
  plugins: [
    v4wp({
      input: {
        styles: '/assets/styles/app.css',
        settings: '/Page/Admin/Settings/Index.tsx',
        chat: '/Page/Admin/Chat/Index.tsx',
      },
      outDir: '../build',
    }),
    react(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client'),
    },
  },
});
