import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendTarget = process.env.VITE_BACKEND_TARGET || 'https://dev-backend.invotrx.com';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/auth': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/dropdown': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/Industry': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/by-country': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/roles': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/designations-dropdown': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/department-by-designation': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'build',
  },
  esbuild: {
    loader: 'jsx',
  },
});
