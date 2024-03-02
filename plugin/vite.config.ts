import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default ({ mode }: { mode: any }) => {
  console.log('mode', mode);
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    root: 'client',
    build: {
      outDir: '../build',
      emptyOutDir: true,
      sourcemap: true,
      manifest: true,
      rollupOptions: {
        input: {
          settings: '/Page/Admin/Settings.tsx',
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'client'),
      },
    },
    // Use a conditional base URL
    base: isDevelopment ? '/' : '/wp-content/plugins/agent-wp/build/',
    server: {
      // Specify development server options here
      // For example, to enable CORS:
      cors: true,
      // If your WordPress site is not running on the same origin as Vite's dev server,
      // you might need to proxy API requests:
      proxy: {
        // Proxy API requests to WordPress during development
        '/wp-json': {
          // Adjust to your local WordPress development URL
          target: 'http://localhost:8080/',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
