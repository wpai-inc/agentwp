import { v4wp } from 'vite-for-wp';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'client',
  plugins: [
    v4wp({
      input: {
        styles: '/assets/styles/app.css',
        settings: '/Page/Admin/Settings.tsx',
        chat: '/Page/Admin/Chat.tsx',
      },
      outDir: '../build',
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client'),
    },
  },
});
