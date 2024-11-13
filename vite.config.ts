import { v4wp } from 'vite-for-wp';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig( {
  root: 'client',
  plugins: [
    v4wp( {
      input: {
        settings: '/Page/Admin/Settings/Index.tsx',
        dashboardWidget: '/Page/Admin/DashboardWidget/Index.tsx',
        adminChat: '/Page/Admin/Chat/Index.tsx',
        frontendChat: '/Page/Frontend/Chat/Index.tsx',
        testBlocksStreaming: '/Tests/test-blocks-streaming.ts',
      },
      outDir: '../build',
    } ),
    react(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': path.resolve( __dirname, 'client' ),
    },
  },
} );
